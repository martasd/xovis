#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver connected to the Internet.
#
# Usage: install_xovis.sh [-d REPO_DEST] DEPLOYMENT
# Parameters:
#   DEPLOYMENT, the name of the deployment site
#   REPO_DEST, path to where app repositories are cloned (default: /opt)

DEPS="python-pip git couchdb nodejs npm"
USER=admin
PASS=admin
DB_NAME=xovis
DB_HOST=http://$USER:$PASS@localhost:5984
DB_URL=$DB_HOST/$DB_NAME

#defaults
REPO_DEST=/opt

# Parse cmdline arguments using getopts
USAGE="Usage: install_xovis.sh [-d REPO_DEST] DEPLOYMENT"

while getopts "s:d:" opt; do
	case $opt in
		h)
			echo $USAGE
			exit 0
			;;
		d)
			REPO_DEST=$OPTARG
			XOVIS_REPO_DEST=$REPO_DEST/xovis
			XOSTATS_REPO_DEST=$REPO_DEST/xostats
			mkdir -p $REPO_DEST
			;;
		\?)
			echo "Invalid option: -$OPTARG"
			echo $USAGE >&2
			exit 1
			;;
	esac
done

# Remove parsed options
shift `expr $OPTIND - 1`

# Require at least one non-options arg
if [ $# -eq 0 ]
then 
	echo $USAGE >&2
	exit 1
fi

# The only required arg is deployment name
for PARAM in "$@"; do
	DEPLOYMENT=$PARAM
done


echo "Installing project dependencies."
yum install -y $DEPS

npm install -g kanso

echo "Cloning xovis repository."
git clone https://github.com/martasd/xovis.git $XOVIS_REPO_DEST

echo "Creating empty database for the app."
kanso createdb $DB_URL

echo "Loading the application into new database $DB_NAME."
kanso push $XOVIS_REPO_DEST $DB_URL

echo "Cloning xo-stats repository and installing Python dependencies."
git clone https://github.com/martasd/xo-stats.git $XOSTATS_REPO_DEST
pip install -r $XOSTATS_REPO_DEST/requirements.txt

echo "Run the following command at the deployment site to insert existing\
data from /library/users into the database:"
echo "$XOSTATS_REPO_DEST/process_journal_stats.py dbinsert $DB_NAME\
--deployment $DEPLOYMENT --server $DB_HOST"

echo "To manage Couch using browser dashboard:"
echo "$DB_HOST/_utils"
echo "To access the visualization:"
echo "$DB_URL/_design/xovis-couchapp/index.html"
