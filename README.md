# XOvis

XOvis is a Couch App built using [Kanso](htttp://kan.so) framework, which
visualizes XO Journal backup data collected from OLPC deployments on
schoolservers.

## Installation

### On RHEL/Fedora machine

#### Install with a bash script

* To install the application, simply run `install_xovis.sh`

		./scripts/install_xovis.sh

#### Install manually

* Install project dependecies

		yum install python-pip git couchdb nodejs npm"

* Install Kanso framework

		npm install -g kanso

* Clone this repository in the destination of your choice

		git clone https://github.com/martasd/xovis.git

* Install the application into a new database
	
		cd xovis
		kanso createdb http://localhost:5984/xovis
		kanso push http://localhost:5984/xovis

where `xovis` is the name of the new database.

### Load existing deployment data into the database

* Copy XO Journal backup data into the same database using xostats Python script

		git clone https://github.com/martasd/xostats.git
		pip install -r requirements.txt
		./process_journal_stats.py dbinsert xovis --deployment <deployment-name>
		
* To manage Couch databases using a browser dashboard, go to

		http://localhost:5984/_utils
		

#### Alternative install (without requiring NodeJS)

* If you prefer to avoid having to install Node JS, you can also install from a
database dump:

		./scripts/install_xovis_dbdump.sh

	
*Note:* Downloads of database dump file.


## Visualize

* Open up a browser and go to

		http://localhost:5984/<deployment-name>/_design/xovis-couchapp/index.html

**Enjoy the beautiful view!**
