#!/bin/sh
echo "BUILD: START"

node -v

echo "BUILD: Backend Start"
cd back
npm install
npm run build

echo "BUILD: Frontend Start"
cd ../front
npm install
npm run build
cd ..

echo "BUILD: Build install dependencies"

cd out
npm install --production
cd ..

