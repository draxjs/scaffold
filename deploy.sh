#!/bin/sh
echo "DEPLOY: START"

echo "DEPLOY: git checkout and pull"
git checkout .
git pull


echo "DEPLOY: building"
sh build.sh


echo "DEPLOY: Build install dependencies"

cd out
npm install --production
cd ..

echo "DEPLOY: Copy runpm2.sh"
sh runpm2.sh

echo "DEPLOY: END"
