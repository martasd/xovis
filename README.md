# XOvis

The objective of this project is to gain insights into how XOs are used in
Nepalese classrooms. In order to learn about XO usage, first data is collected
from their Journal backups on the schoolserver. Subsequently, the data is
processed and imported into a database and finally visualized using fancy
interactive charts. The application that implements the visualization of the
data is called XOvis, a Couch App built using [Kanso](htttp://kan.so)
framework. See dataflow.svg for a schematic representation of the entire
workflow.

## Installation

### On RHEL/Fedora machine

#### Install with a bash script

* To install the application, simply run `install_xovis.sh`

		./scripts/install_xovis.sh

#### Install manually

* Install project dependencies

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

#### Alternative install (without requiring NodeJS)

* If you prefer to avoid having to install Node JS, you can also install from a
database dump:

		./scripts/install_xovis_dbdump.sh

	*Note:* Downloads of database dump file.

### Load existing deployment data into the database

* Insert XO Journal backup data into the same database using a Python script

		pip install -r requirements.txt
		./process_stats/process_journal_stats.py dbinsert xovis --deployment <deployment-name>
		
	*Note:*

	The script can also output statistical data to a file instead of inserting it
	into a database. To produce all statistical data from the Journal, one row per
	Journal record, call:
	
		process_journal_stats.py all
	
	To extract statistical data about the use of activities on the system, use:
	
		process_journal_stats.py activity
	
	To learn about all options of the script, see:
	
		process_journal_stats.py --help

* To manage Couch databases using a browser dashboard, go to

		http://localhost:5984/_utils

## Visualize

* Open up a browser and go to

		http://localhost:5984/<deployment-name>/_design/xovis-couchapp/index.html

**Enjoy the beautiful view!**

## Acknowledgments

`process_journal_stats.py` script is based on
[olpc-journal-processor](https://github.com/Leotis/olpc_journal_processor)
script Leotis' Buchanan and
[get-journal-stats](http://gitorious.paraguayeduca.org/get-journal-stats) by
Raul Gutierrez Segales.
