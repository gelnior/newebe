# Get parameters from user
while true; do
read -p "On which port do you want to setup Newebe (default is 8000) ? " userport
    case $userport in
        [0-9]* ) if [ $userport -gt 20000 -o $userport -lt 3000 ]
                 then echo "Port must be comprised between 3000 and 20000"
                 else PORT=$userport; break;
                 fi;;
        "" ) PORT=8000; break;;
        * ) echo "Please give a valid port";;
    esac
done
echo "Selected port is $PORT"

while true; do
read -p "Which name do you want for your database (default is newebe) ? " userdbname
    case $userdbname in
        "" ) DBNAME="newebe"; break;;
        * ) DBNAME=$userdbname; break;;
    esac
done
echo "Selected port is $DBNAME"


while true; do
echo "Which time zone do you want for your database (default is Europe/Paris) ?"
    echo "Timezone list : https://github.com/gelnior/newebe/wiki/Available-timezones"
    read usertimezone
    case $usertimezone in
        "" ) TIMEZONE="Europe/Paris"; break;;
        * ) TIMEZONE=$usertimezone; break;;
    esac
done

sudo apt-get install python python-setuptools python-pip python-pycurl python-imaging couchdb git libjpeg8-dev libxml2-dev libxslt-dev

sudo pip install virtualenv
git clone http://github.com/gelnior/newebe.git
cd newebe

virtualenv --no-site-packages virtualenv
. virtualenv/bin/activate

pip install -r deploy/requirements.txt
pip install -r deploy/requirements-dev.txt

python syncdb.py

echo "TORNADO_PORT = $PORT" > local_settings.py
echo "COUCHDB_DB_NAME = \"$DBNAME\"" >> local_settings.py
echo "TIMEZONE = \"$TIMEZONE\"" >> local_settings.py
echo "DEBUG = True" >> local_settings.py
echo "COOKIE_KEY = \"`< /dev/urandom tr -dc A-Za-z0-9_ | head -c50`\"" >> local_settings.py
