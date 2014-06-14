#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver connected to the Internet.
#
# Usage: install_xovis_dbdump.sh DEPLOYMENT [-c INSTALL_DEST]
# Parameters:
#   DEPLOYMENT, the name of the deployment site
#   INSTALL_DEST, path to where xo-stats repository is cloned (default: /opt)

DEPS="python-pip curl git couchdb"
USER=admin
PASS=admin
CREDENTIALS=$USER:$PASS
XOVIS_HOST_TARGET_INIT=127.0.0.1:5984
XOVIS_HOST_TARGET=http://$CREDENTIALS@$XOVIS_HOST_TARGET_INIT
DB_NAME=xovis
DB_URL=$XOVIS_HOST_TARGET_INIT/$DB_NAME
XOVIS_REPO=https://github.com/martasd/xovis.git

# defaults
INSTALL_DEST=/opt

# Parse cmdline arguments using getopts
USAGE="Usage: install_xovis_dbdump.sh [-d INSTALL_DEST] DEPLOYMENT"

while getopts "s:c:" opt; do
    case $opt in
	h)
	    echo $USAGE
	    exit 0
	    ;;
	d)
	    INSTALL_DEST=$OPTARG
	    mkdir -p $INSTALL_DEST
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

# We require at least one non-option arg
if [ $# -eq 0 ]
then
    echo $USAGE >&2
    exit 1
fi

# The only required arg is deployment name
for PARAM in "$@"; do
    DEPLOYMENT=$PARAM
done

yum install -y $DEPS 
echo "Installed CouchDB with all its dependencies."

sed -i 's/^\(bind_address\s*=\s*\).*$/\10\.0\.0\.0/' /etc/couchdb/default.ini
echo "Made couch application accessible from other hosts."

service couchdb start
chkconfig --add couchdb
chkconfig couchdb on
echo "Couch configured to start on boot"

DB_EXISTS=$(curl $DB_URL)
if [[ "$DB_EXISTS" == *not_found* ]]
then
	DB_CREATED=$(curl -X PUT $DB_URL)
	if [ "$DB_CREATED" == '{"ok":true}' ]
	then
		echo "Created a Couch db $DB_NAME."
	else
		echo "Db creation $DB_NAME failed."
		exit 1
	fi
else
	echo "Db $DB_NAME already exists."
fi

ADMIN_ADDED=$(curl -X PUT $XOVIS_HOST_TARGET_INIT/_config/admins/$USER -d "\"$PASS\"")

if [[ "$ADMIN_ADDED" == '' ]]
then
	echo "Added $USER to CouchDB admins."
else
	echo "$USER was not added to CouchDB admins."
	exit 1
fi

wget -O $INSTALL_DEST/xovis.json https://s3.amazonaws.com/xovis/xovis.json
couchdb-load $XOVIS_HOST_TARGET/$DB_NAME --input xovis.json
if [ $? -eq 0 ]
then
	echo "Loaded the latest version of XOvis into $DB_NAME"
else
	echo "Couldn't load XOvis."
	exit 1
fi


XOVIS_INSTALL_DEST=$INSTALL_DEST/xovis
git clone $XOVIS_REPO $XOVIS_INSTALL_DEST
pip install -r $INSTALL_DEST/process_stats/requirements.txt
echo "Copied the latest version of stats script into $XOSTATS_INSTALL_DEST."


echo "Run the following command at the deployment site to insert existing\
data from /library/users into the database:"
echo "$XOSTATS_INSTALL_DEST/process_stats/process_journal_stats.py dbinsert $DB_NAME
--deployment $DEPLOYMENT --server $XOVIS_HOST_TARGET"

echo "To manage Couch using browser dashboard:"
echo "$XOVIS_HOST_TARGET/_utils"
echo "To access the visualization:"
echo "$XOVIS_HOST_TARGET/$DB_NAME/_design/xovis-couchapp/index.html"
