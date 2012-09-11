==========================
Newebe, Feel Free to Share
==========================

Growth of web applications has been a huge improvement for social sharing and
collaborative work. Unfortunately, to enjoy these new tools, we have traded 
our privacy. Newebe aims to solve this problem by providing a social 
tool you host at your home and that connects directly with your contacts. 

Before you ask, Newebe is not like Diaspora, it is thinked distributed in a
peer-2-peer manner : it is designed to be self-hosted and does not require
3rd party server.


Installation Instructions
=========================

Check the website install section : http://newebe.org/#install

Set up a development environment (Ubuntu and Debian)
==============================================

**Server**

Install following packages:

    python python-setuptools python-pip python-pycurl ython-imaging couchdb git openssl

Then via easy_install:

    pip install -r deploy/requirements.txt

Retrieve Newebe project:

   git clone http://github.com/gelnior/newebe.git 

In Newebe settings file (*settings.py*), set *DEBUG* variable to *True*.

Then, still in Newebe directory set DB by running:

   python syncdb.py

Set DEBUG constant to True in *settings.py* or *local_settings.py*

To change database name or port change, you must modify your *settings.py* file by settings the following constants : TORNADO_PORT and COUCHDB_DB_NAME. Default port is 8000 and default database name is newebe. 
Time zone is set in the same way. So if you want to set your own time zone, you must change the TIMEZONE constant value by your timezone (cf. wiki). 

NB: The best way to deal with specific configuration is to set this variable in a file called *local_settings.py* in the same directory as *settings.py*.

*local_settings.py* exemple::

    TORNADO_PORT = 8000
    COUCHDB_DB_NAME = "newebe"
    TIMEZONE = "Europe/Paris"
    DEBUG = True
    COOKIE_KEY = "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="

Run server:

    python newebe_server.py

In your browser, connect to http://localhost:8000/ and check that 
everything is fine.


**Client**

To work on client you will need node.js. So first install it::

   git clone https://github.com/ry/node.git

   cd node
   ./configure
   make
   make install

Now install tools we need, Coffeescript, Cake, Stylus and UglifyJS:

     npm install coffe-script cake uglifyjs stylus

Then when you finish to work on client code. At the root of the module you
worked on, type:

    cake build 

or for automatic build:

    cake watch

Run tests (backend)
===================

Activate your virtual env, then install test dependencies::
    
   virtualenv --distribute --no-site-packages virtualenv
   . virtualenv/bin/activate
   pip install -r deploy/requirements-dev.txt

Then run tests for each module::

   lettuce activities/tests
   lettuce auth/tests
   lettuce lib/tests
   lettuce notes/tests
   lettuce news/tests

Infos
=====

:Description: Newebe is a distributed social network
:Author: Gelnior (http://gelnior.wordpress.com)
:License: AGPL v3.0
:Version: 0.5.0

