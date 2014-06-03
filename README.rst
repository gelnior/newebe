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

Install following packages::

    python python-setuptools python-pip python-pycurl python-imaging couchdb
    git libxml2-dev libxslt-dev


For ubuntu::

    sudo apt-get build-dep python-imaging

Add link required by PIL::

    ln -s /usr/lib/x86_64-linux-gnu/libjpeg.so /usr/lib

Install virtualenv::

    sudo pip install virtualenv

Retrieve Newebe project::

   git clone http://github.com/gelnior/newebe.git 
   cd newebe

Create and activate virtualenv::

    virtualenv --no-site-packages virtualenv
    . virtualenv/bin/activate

Then via easy_install::

    pip install -r deploy/requirements.txt
    pip install -r deploy/requirements-dev.txt

In Newebe settings file (*settings.py*), set *DEBUG* variable to *True*.

Go inside newebe folder::

   cd newebe

Then, still in Newebe directory set DB by running::

   python tools/syncdb.py


Change parameters such as port, debug mode and timezone inside a config file 
called config.yaml. Here is an exemple of config file (see 
wiki_ for a complete descritpion)::

    main:
        port: 8000
        timezone: "Europe/Paris"
        debug: True
    db:
        name: "newebe"
    security:
        cookie_key: "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="

Run server::

    python newebe_server.py --debug=True

In your browser, connect to http://localhost:8000/ and check that 
everything is fine.

.. _wiki: //github.com/gelnior/newebe/wiki/Config-file]

**Client**

To work on client you will need node.js. So first install it::

   git clone https://github.com/ry/node.git

   cd node
   ./configure
   make
   make install

Now install Brunch the front-end assembler:

     npm install brunch -g

Install build dependencies

     cd client
     npm install

Then watch for file modifications to build the client on change:

     cd client
     brunch w


Run tests (backend)
===================

Activate your virtual env, then install test dependencies::
    
   virtualenv --distribute --no-site-packages virtualenv
   . virtualenv/bin/activate
   pip install -r deploy/requirements-dev.txt

Then run tests for each module. Tests require that a second newebe runs on 
port 8889::

   sh launch_tests.sh


Infos
=====

:Description: Newebe is a distributed social network
:Author: Gelnior (http://gelnior.wordpress.com)
:License: AGPL v3.0
:Version: 0.5.0

