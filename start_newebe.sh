#!/bin/bash

# Replace these three settings.
PROJDIR="/home/newebe/Newebe/"
PIDFILE="$PROJDIR/newebe.pid"
SOCKET="$PROJDIR/newebe.sock"

cd $PROJDIR
if [ -f $PIDFILE ]; then
    kill `cat -- $PIDFILE`
    rm -f -- $PIDFILE
fi

exec /usr/bin/env - \
  PYTHONPATH="../python:.." \
  python manage.py runfcgi socket=$SOCKET pidfile=$PIDFILE

chmod 777 $SOCKET
