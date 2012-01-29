### Newebe install script

## Main parameters
PORT=8000
DBNAME="newebe"
TIMEZONE="Europe/Paris"
DEBUG="False"


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
echo "Selected timezone is $TIMEZONE"



# Install needed tools

echo "\nStep 1: Install tools needed by Newebe : Python binary, Pyton utils,"
echo "Couchdb and Git"
echo "-----------------------------------------------------------------------\n"
sudo apt-get install python python-setuptools python-pip python-pycurl python-daemon python-imaging couchdb git


# Clone Newebe repository

echo "\n\nStep 2: Clone newebe repository"
echo "-----------------------------------------------------------------------\n"
git clone git://github.com/gelnior/newebe.git 


# Go to newebe folder

cd newebe

# Install python dependecies

echo "\n\nStep 3: Install Newebe dependecies"
echo "-----------------------------------------------------------------------\n"
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
echo "NEWEBE_PATH=$path" >> deploy/newebe_starter
echo "PIDFILE=$path""/newebe.pid" >> deploy/newebe_starter
cat deploy/newebe_commands >> deploy/newebe_starter

sudo cp deploy/newebe_starter /etc/init.d/newebe
sudo chmod +x /etc/init.d/newebe
sudo /usr/sbin/update-rc.d -f newebe defaults


# Finish text

echo "\n\n\nInstallation finished !"
echo "-----------------------------------------------------------------------\n"

echo "To start your newebe run :"
echo "sudo /etc/init.d/newebe start"



# leave newebe folder
cd ..

