===========
Newebe
===========
:Info: Newebe is a distributed social platform.
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
* markdown >= 2.0.0
* lettuce >= 0.1.9


Set up a development environment (Ubuntu 10.4)
==============================================

**Server**

Install following packages:

    python python-setuptools python-pycurl python-daemon couchdb git

Then via easy_install:

    easy_install couchdbkit django tornado markdown lettuce

Retrieve Newebe project:

   git clone http://github.com/gelnior/newebe.git 

In Newebe settings file (*settings.py*), set *DEBUG* variable to *True*.

Then, still in Newebe directory set DB by running:

   python syncdb.py

and, at last run the server:

   python newebe_server.py
   
In your browser, connect to http://localhost:8000/ and check that 
everything is fine.


**Client**

To work on client you will need node.js. So first install it:

   git clone https://github.com/ry/node.git

   cd node
   ./configure
   make
   make install

Then install its package manager, NPM:

     curl http://npmjs.org/install.sh | sh

Now install tools we need, Coffeescript compiler:

     npm install coffe-script

Cake, the build tool:

     npm install cake

UglifyJS, the minifier:

    npm install uglifyjs

And the Stylus compiler for CSS:

     npm install stylus

Then when you finish to work on client code. At the root of the module you
worked on, type:

     cake build 

or for automatic build:

    cake watch

