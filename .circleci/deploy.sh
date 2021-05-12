echo "deleting folder"
rm -rf ludo-khelo

echo "taking clone"
git clone https://github.com/smartgauravrana/ludo-khelo.git

echo "Inside source code"
cd ludo-khelo

# echo "stashing changes"
# git stash 

echo "taking pull"
git pull

echo "running npm install"
npm install

# echo "applying stashed changes"
# git stash apply

echo "copying env and client prod file"
cp ../.env ./
cp ../prod.js ./src/config

echo "running npm prod"
npm run prod

echo "copying Worker files"
cp ../OneSignalSDKUpdaterWorker.js build
cp ../OneSignalSDKWorker.js build