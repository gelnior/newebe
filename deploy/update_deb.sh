# 

NEWEBEFOLDER=`pwd`
DATE=`date "+%Y-%d-%m-%H-%M-%S"`


# Backup newebe installation in a directory set at current date. Then zip it
# and remove created folder.

echo "\nStep 1: Backup your current installation in newebe-$DATE"
echo "-----------------------------------------------------------------------\n"
cd ..
cp -r newebe newebe-backup-$DATE
tar -czf newebe-backup-$DATE.tar.gz newebe-backup-$DATE
rm -rf newebe-backup-$DATE
cd $NEWEBEFOLDER


echo "\nStep 2: Update source code"
echo "-----------------------------------------------------------------------\n"
git reset --hard
git pull


echo "\nStep 3: Restart Newebe"
echo "-----------------------------------------------------------------------\n"
sudo /etc/init.d/newebe restart
