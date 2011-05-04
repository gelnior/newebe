===========
Newebe
===========
:Info: Newebe is a (almost) distributed social platform.
:Author: Gelnior (http://gelnior.wordpress.com)
:License: AGPL v3.0


Dependencies
============
* python >= 2.6
* django >= 1.2
* couchdb >= 0.11.0
* coucdbkit >= 0.4.8
* tornado >= 1.2.0
* daemon >= 1.0.0
* pycurl >= 1.0.0


Set up a development environment (Ubuntu 10.4)
==============================================
Install following packages:

    python python-setuptools python-pycurl python-daemon couchdb git

Then via easy_install:

    easy_install couchdbkit django tornado

Retrieve Newebe project:

   git clone http://github.com/gelnior/newebe.git 

In Newebe settings file (*settings.py*), set *DEBUG* variable to *True*.

Then, still in Newebe directory set DB by running:

   python manage.py sync_couchdb

and, at last run the server:

   python newebe_server.py
   
In your browser, connect to http://localhost:8000/ and check that 
everything is fine.


