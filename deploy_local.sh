#!/bin/sh
echo "DEPLOY: INIT"

echo "DEPLOY: git checkout and pull"
git checkout .
git pull


echo "DEPLOY: copying build to out"
cp -R build/ out/


echo "DEPLOY: Install production dependencies"

cd out
npm install --omit=dev
cd ..

echo "DEPLOY: START SERVICE"
sh start.sh

