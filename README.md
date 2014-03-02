# XOvis

This is a Couch App built using [Kanso](http://kan.so) framework which
visualizes XO Journal backup data from a local Couch database.


## Installation


### On a schoolserver

* Ensure all dependencies are installed

		yum install -y python-pip curl git"

* Install Couch package

		yum install couchdb

* Verify that installation succeeded

		curl http://127.0.0.1:5984
		
* Create a new Couch database

		curl -X PUT http://127.0.0.1:5984/<deployment-name>

	Couch also provides a graphical interface for managing databases called
    *Futon*. To create a new database using Futon, go to 

		http://127.0.0.1:5984/_utils

	and click on *Create Database ...* in the upper left corner.

* Replicate existing visualization application `xovis` from the source server
  to the local database

		curl http://127.0.0.1:5984/_replicate -H 'Content-Type: application/json' -d '{ "source": "<source-server-name>/xovis", "target": "https://127.0.0.1:5984/<deployment-name>" }'
		
* Verify that the replication succeeded

		curl http://127.0.0.1:5984/<deployment-name>

  `doc_count` should be equal to 1.


	Congratulations! You have successfuly installed `XOvis` Couch application!
But wait, there is no data to visualize yet!


## Load existing deployment data

* Clone the latest `process_journal_stats.py` script

		git clone https://github.com/martasd/xo-stats.git

	This script will insert data from Sugar Journal backups into the newly
created Couch database.

* Install Python dependencies

		cd xo-stats
		pip install -r requirements.txt

* Insert Journal backup data into the database

		./process_journal_stats.py dbinsert <db-name> --deployment <deployment-name>
		
	For all command-line options, see `--help`.

* Verify that data has been inserted into the database

		curl http://127.0.0.1:5984/<deployment-name>

	Alternatively, go to Futon, select the deployment's database and browse
through the newly added records.


## Visualize

* Open up a browser and go to

		http://127.0.0.1:5984/<deployment-name>/_design/xovis/index.html

**Enjoy the beautiful view!**


## For developers

* Install Kanso framework

		yum install nodejs npm
		npm install -g kanso

* See Kanso documentation for modifying the Couch App.
