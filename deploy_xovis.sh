#!/bin/bash

# Deploys XOvis app on a RHEL-based schoolserver
# Usage: deploy_xovis.sh DEPLOYMENT_NAME

# TODO:
#  Check local OLE server URL once it's deployed


DEPS="python-pip curl git"
DEPLOYMENT=$1
USER=admin
PASS=admin
CREDENTIALS=$USER:$PASS
XOVIS_HOST_SRC=http://dev.olenepal.org:5984
XOVIS_HOST_TARGET_INIT=127.0.0.1:5984
XOVIS_HOST_TARGET=http://admin:admin@$XOVIS_HOST_TARGET_INIT
XOVIS_DB=$XOVIS_HOST_TARGET_INIT/$DEPLOYMENT
INSERT_STATS_REPO=https://github.com/martasd/xo-stats.git

yum install -y $DEPS
echo "All dependencies are installed on the system: $DEPS."

yum install -y couchdb 

DB_CREATED=$(curl -X PUT $XOVIS_DB)
ADMIN_ADDED=$(curl -X PUT $XOVIS_HOST_TARGET_INIT/_config/admins/$USER -d "$PASS")
if [ "$DB_CREATED" == '{"ok":true}' ] && [ "$ADMIN_ADDED" == '']
then
    echo "Created a Couch database $DEPLOYMENT and added $USER to admins. Relax:)."
fi

curl $XOVIS_HOST_TARGET/_replicate -H 'Content-Type: application/json' -d '{ \
"source": "$XOVIS_HOST_SRC/xovis", "target": \
"$XOVIS_HOST_TARGET/$DEPLOYMENT" }'
echo "Replicated XOvis App into $XOVIS_HOST_TARGET/$DEPLOYMENT."
echo "Verify that database exists in dashboard: $XOVIS_HOST_TARGET/_utils"

git clone $INSERT_STATS_REPO
cd xo-stats
pip install -r requirements.txt
echo "Fetched the latest version of stats script."

echo "Make sure to run the following command at the deployment site to insert \
existing data into the database assuming you haven't changed default var values:"
echo "./process_journal_stats.py dbinsert $DEPLOYMENT"
