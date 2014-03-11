#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver from a USB stick
# Usage: deploy_offline_xovis.sh

# NOTE: Replicatation did not fully succeed
# TODO: Automate everything

RPMS="
curl-7.19.7-37.el6_4.i686.rpm
erlang-ibrowse-2.2.0-4.el6.i686.rpm
erlang-mochiweb-1.4.1-5.el6.i686.rpm
erlang-oauth-1.1.1-1.el6.i686.rpm
js-1.70-12.el6.i686.rpm
couchdb-1.0.4-2.el6.i686.rpm
perl-TermReadKey-2.30-13.el6.i686.rpm
python-pip-1.3.1-4.el6.noarch.rpm
"

ROOT_DIR=`pwd`
USER=admin
PASS=admin
CREDENTIALS=$USER:$PASS
XOVIS_HOST_TARGET_INIT=127.0.0.1:5984
XOVIS_HOST_TARGET=http://admin:admin@$XOVIS_HOST_TARGET_INIT
DB_NAME=xovis
XOVIS_DB=$XOVIS_HOST_TARGET_INIT/$DB_NAME

cd $ROOT_DIR/rpms
rpm -i $RPMS
echo "All RPMS are installed on the system: $RPMS."

service couchdb start
chkconfig --add couchdb
chkconfig couchdb on
echo "Couch configured to start on boot"

# Change the deployment name in lib/main.js before replicating
# From localhost
curl http://martasd:48951frei@localhost:5984/_replicate -H 'Content-Type: application/json' -d '{ "source": "xovis", "target": "http://admin:admin@172.18.96.1:5984/xovis" }'
echo "Successfully replicated couch db files to the server."
echo "Check that the database exists."
# curl http://martasd:48951frei@localhost:5984/xovis

# Make sure to change bind_address in /etc/couchdb/default.ini to 0.0.0.0

cd $ROOT_DIR/xo-stats
pip install CouchDB-0.9.tar.gz
pip install docopt-0.6.1.tar.gz
echo "Installed Python requirements for xo-stats"

echo "At the deployment site:"
echo "First, copy back user backup data to /library/users after updating the server"
echo "Then, run the following command at the deployment site to insert existing\
data into the database assuming you haven't changed default var values:"
echo "./process_journal_stats.py dbinsert xovis --deployment $DEPLOYMENT --server $XOVIS_HOST_TARGET"
