### Newebe install script

## Main parameters
PORT=8000
DBNAME="newebe"
TIMEZONE="Europe/Paris"
DEBUG="True"


# Get parameters from user
echo "On which port do you want to setup Newebe (default is 8000) ?"
read userport
if [  $userport =~ [0-9]+ -a $userport -gt 3000 -a $userport -lt 20000 ]
then PORT=$userport
fi

echo "Which name do you want for your database (default is newebe) ?"
read userdbname
if [ -n $userdbname ]
then DBNAME=$userdbname
fi

echo "Which time zone do you want for your database (default is Europe/Paris) ?"
echo "Timezone list : https://github.com/gelnior/newebe/wiki/Available-timezones"
read usertimezone
if [ -n $usertimezone ]
then TIMEZONE=$usertimezone
fi


# Install needed tools

echo "\nStep 1: Install tools needed by Newebe : Python binary, Pyton utils,"
echo "Couchdb and Git"
echo "-----------------------------------------------------------------------\n"
sudo apt-get install python python-setuptools python-pip python-pycurl python-daemon python-imaging couchdb git


echo "\n\nStep 2: Clone newebe repository"
echo "-----------------------------------------------------------------------\n"
# Clone Newebe repository
git clone git://github.com/gelnior/newebe.git 


# Go to newebe folder
cd newebe

echo "\n\nStep 3: Install Newebe dependecies"
echo "-----------------------------------------------------------------------\n"
# Install python dependecies
sudo pip install -r deploy/requirements.txt

# Set up db
echo "\n\nStep 4: Set up Newebe database"
echo "-----------------------------------------------------------------------\n"
python syncdb.py


# Set local configuration file
echo "\n\nStep 5: Build configuration file"
echo "-----------------------------------------------------------------------\n"

echo "TORNADO_PORT = $PORT" > local_settings.py
echo "COUCHDB_DB_NAME = \"$DBNAME\"" >> local_settings.py
echo "TIMEZONE = \"$TIMEZONE\"" >> local_settings.py
echo "DEBUG = $DEBUG" >> local_settings.py

echo "newebe/local_settings.py created\n"


# Set auto starter
echo "\n\nStep 6: Set newebe for automatic startup"
echo "-----------------------------------------------------------------------\n"

path=`pwd`
cat deploy/newebe_init > deploy/newebe_starter
echo "NEWEBE_PATH=$path""/newebe" >> deploy/newebe_starter
echo "PIDFILE=$path""/newebe/newebe.pid" >> deploy/newebe_starter
cat deploy/newebe_commands >> deploy/newebe_starter

sudo cp deploy/newebe_starter /etc/init.d/newebe
sudo chmod +x /etc/init.d/newebe
sudo /usr/sbin/update-rc.d -f newebe defaults


echo "-----------------------------------------------------------------------\n"
echo "\n\nInstallation finished, to start your newebe run :"
echo "sudo /etc/init.d/newebe start"



# leave newebe folder
cd ..

