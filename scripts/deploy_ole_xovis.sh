#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver from a USB stick.
#
# Usage: deploy_offline_xovis.sh DEPLOYMENT_NAME
#        DEPLOYMENT_NAME- name of the deployment

RPMS="
erlang-ibrowse-2.2.0-4.el6.i686.rpm
erlang-mochiweb-1.4.1-5.el6.i686.rpm
erlang-oauth-1.1.1-1.el6.i686.rpm
js-1.70-12.el6.i686.rpm
couchdb-1.0.4-2.el6.i686.rpm
python-pip-1.3.1-4.el6.noarch.rpm
"

DEPLOYMENT=$1
ROOT_DIR=`pwd`
USER=admin
PASS=admin
CREDENTIALS=$USER:$PASS
XOVIS_HOST_TARGET_INIT=127.0.0.1:5984
XOVIS_HOST_TARGET=http://$CREDENTIALS@$XOVIS_HOST_TARGET_INIT
DB_NAME=xovis
DB_URL=$XOVIS_HOST_TARGET_INIT/$DB_NAME

cd $ROOT_DIR/rpms
rpm -i $RPMS
echo "All RPMS are installed on the system: $RPMS."

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
	echo "$DB_CREATED"
	echo "Db creation $DB_NAME failed."
	exit 1
    fi
else
    echo "Db $DB_NAME already exists."
fi

ADMIN_ADDED=$(curl -X PUT $XOVIS_HOST_TARGET_INIT/_config/admins/$USER -d "\"$PASS\"")

cd $ROOT_DIR/python-packages
pip install CouchDB-0.9.tar.gz
pip install docopt-0.6.1.tar.gz
echo "Installed Python requirements for xo-stats and couchdb-load\n"

cd $ROOT_DIR
couchdb-load $XOVIS_HOST_TARGET/$DB_NAME --input xovis.json
echo "Loaded the latest version of XOvis into $DB_NAME"

echo "Run the following command at the deployment site to insert existing data into the database:"
echo "./process_journal_stats.py dbinsert $DB_NAME --deployment $DEPLOYMENT --server $XOVIS_HOST_TARGET"
echo "To manage Couch using browser dashboard go to: http://$CREDENTIALS@schoolserver:5984/_utils"
