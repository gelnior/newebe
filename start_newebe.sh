#!/bin/bash

PROJDIR="/home/newebe/Newebe/"
PIDFILE="$PROJDIR/newebe.pid"
SOCKET="$PROJDIR/newebe.sock"

# Remove old PID.
cd $PROJDIR
if [ -f $PIDFILE ]; then
    kill `cat -- $PIDFILE`
    rm -f -- $PIDFILE
fi

# Set up a new django fast-cgi socket.
exec /usr/bin/env - \
  PYTHONPATH="../python:.." \
  python manage.py runfcgi socket=$SOCKET pidfile=$PIDFILE

# Add permissions on socket for allowing lighttpd to use it.
chmod 770 $SOCKET
