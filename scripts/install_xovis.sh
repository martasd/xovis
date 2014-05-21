#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver connected to the Internet.
#
# Usage: install_xovis.sh [-d REPO_DEST] [-i] DEPLOYMENT
# Parameters:
#   DEPLOYMENT, the name of the deployment site
#   REPO_DEST, path to where app repositories are cloned (default: /opt)
# 

function online_install {

DEPS="python-pip git couchdb nodejs npm"
XOVIS_REPO_DEST=$REPO_DEST/xovis
XOSTATS_REPO_DEST=$REPO_DEST/xostats
mkdir -p $REPO_DEST

echo "Installing project dependencies."
yum install -y $DEPS

npm install -g kanso

systemctl enable couchdb
systemctl start couchdb
echo "Couch configured to start on boot"

if [ ! -d "$XOVIS_REPO_DEST" ]
then
	echo "Cloning xovis repository."
	git clone https://github.com/martasd/xovis.git $XOVIS_REPO_DEST
fi

DBS=$(kanso listdb)
if [[ "$DBS" == *$DB_NAME* ]]
then
	echo "Db $DB_NAME already exists"
else
	echo "Creating empty database for the app."
	kanso createdb $DB_URL
fi

echo "Loading the application into new database $DB_NAME."
kanso push $XOVIS_REPO_DEST $DB_URL

if [ ! -d "$XOSTATS_REPO_DEST" ]
then
	echo "Cloning xo-stats repository."
	git clone https://github.com/martasd/xo-stats.git $XOSTATS_REPO_DEST
fi

echo "Installing Python dependencies."
pip install -r $XOSTATS_REPO_DEST/requirements.txt

echo "Run the following command at the deployment site to insert existing\
data from /library/users into the database:"
echo "$XOSTATS_REPO_DEST/process_journal_stats.py dbinsert $DB_NAME\
--deployment $DEPLOYMENT --server $DB_HOST"

} # online_install

function offline_install {

RPMS="
erlang-ibrowse-2.2.0-4.el6.i686.rpm
erlang-mochiweb-1.4.1-5.el6.i686.rpm
erlang-oauth-1.1.1-1.el6.i686.rpm
js-1.70-12.el6.i686.rpm
couchdb-1.0.4-2.el6.i686.rpm
python-pip-1.3.1-4.el6.noarch.rpm
"
ROOT_DIR=`pwd`

cd $ROOT_DIR/rpms
rpm -i $RPMS
echo "All RPMS are installed on the system: $RPMS."

sed -i 's/^\(bind_address\s*=\s*\).*$/\10\.0\.0\.0/' /etc/couchdb/default.ini
echo "Made couch application accessible from other hosts."

service couchdb start
chkconfig --add couchdb
chkconfig couchdb on
echo "Couch configured to start on boot"

ADMIN_ADDED=$(curl -X PUT $DB_HOST_INIT/_config/admins/$USER -d "\"$PASS\"")

DB_EXISTS=$(curl $DB_URL)
if [[ "$DB_EXISTS" == *not_found* ]]
then
	DB_CREATED=$(curl -X PUT $DB_URL)
	if [ "$DB_CREATED" == '{"ok":true}' ]
	then
		echo "Created a Couch db $DB_NAME."
	else
		echo "$DB_CREATED"
		echo "Db creation $DB_NAME failed."
		exit 1
	fi
else
	echo "Db $DB_NAME already exists."
fi

cd $ROOT_DIR/python-packages
pip install CouchDB-0.9.tar.gz
pip install docopt-0.6.1.tar.gz
echo "Installed Python requirements for xo-stats and couchdb-load\n"

cd $ROOT_DIR
couchdb-load $DB_URL --input xovis.json
echo "Loaded the latest version of XOvis into $DB_NAME"

echo "Run the following command at the deployment site to insert existing data into the database:"
echo "./process_journal_stats.py dbinsert $DB_NAME --deployment $DEPLOYMENT --server $DB_HOST"

} # offline_install


USER=admin
PASS=admin
DB_NAME=xovis
DB_HOST_INIT=localhost:5984
DB_HOST=http://$USER:$PASS@$DB_HOST_INIT
DB_URL=$DB_HOST/$DB_NAME

# defaults
REPO_DEST=/opt
ONLINE=false

# Parse cmdline arguments using getopts
USAGE="Usage: install_xovis.sh [-d REPO_DEST] [-i] DEPLOYMENT"

while getopts "hd:i" opt; do
	case $opt in
		h)
			echo $USAGE
			exit 0
			;;
		d)
			REPO_DEST=$OPTARG
						;;
		i)
			ONLINE=true
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


if [ "$ONLINE" = true ]
then
	online_install
else
	offline_install
fi

echo "To manage Couch using browser dashboard:"
echo "$DB_HOST/_utils"
echo "To access the visualization app:"
echo "$DB_URL/_design/xovis-couchapp/index.html"
