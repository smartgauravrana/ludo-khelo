ssh ubuntu@ec2-18-218-159-166.us-east-2.compute.amazonaws.com
echo "Resetting local changes:"
cd ../ #inside ludo-khelo
git reset --hard
echo "taking latest master changes: "
git pull
cd ../
echo "copying .env and prod.js: "
cp -b .env ./ludo-khelo
cp -b prod.js ./.ludo-khelo
echo "running npm prod: " 
cd ludo-khelo
npm run prod