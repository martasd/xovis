#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver from a USB stick. Currently,
# this script requires that Couch DB is running on a host from which XOvis can
# be replicated
#
# Usage: install_xovis_offline.sh IP-ADDRESS
#        IP-ADDRESS- ip address of the db source host
#
# Precondition: Change the deployment name in lib/main.js in XOvis Couch App
#               before replicating

# TODO: Use couchdb dump/restore instead of replication.

RPMS="
erlang-ibrowse-2.2.0-4.el6.i686.rpm
erlang-mochiweb-1.4.1-5.el6.i686.rpm
erlang-oauth-1.1.1-1.el6.i686.rpm
js-1.70-12.el6.i686.rpm
couchdb-1.0.4-2.el6.i686.rpm
python-pip-1.3.1-4.el6.noarch.rpm
"

SOURCE_IP=$1
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

DB_CREATED=$(curl -X PUT $DB_URL)
ADMIN_ADDED=$(curl -X PUT $XOVIS_HOST_TARGET_INIT/_config/admins/$USER -d "\"$PASS\"")
if [ "$DB_CREATED" == '{"ok":true}' ] && [ "$ADMIN_ADDED" == '']
then
    echo "Created a Couch db $DEPLOYMENT and added $USER to admins. Relax.:)"
else
    echo "Db creation $DEPLOYMENT failed or user $USER was not added as admin."
    exit 1
fi


# Needs to have Couch DB running on a host with SOURCE_IP
DB_REPLICATED=$(curl $XOVIS_HOST_TARGET/_replicate -H 'Content-Type: application/json' -d  "{ \"source\": \"http://$SOURCE_IP:5984/deploy-xovis\", \"target\": \"$DB_NAME\" }")
if [[ "$DB_REPLICATED" == "\"ok\":true" ]]
then
    echo "Successfully replicated XOvis Couch App to $XOVIS_HOST_TARGET/$DB_NAME."
else
    echo "Replication failed."
    exit 1
fi 


cd $ROOT_DIR/python-packages
pip install CouchDB-0.9.tar.gz
pip install docopt-0.6.1.tar.gz
echo "Installed Python requirements for xo-stats"

echo "At the deployment site:"
echo "First, copy back user backup data to the server after updating it:"
echo "rsync -rH <path-to-backup> /library/users"
echo "Then, run the following command at the deployment site to insert existing\
data into the database assuming you haven't changed default var values:"
echo "./process_journal_stats.py dbinsert $DB_NAME --deployment $DEPLOYMENT"

echo "To manage Couch using browser dashboard go to: $XOVIS_HOST_TARGET/_utils"
