#!/bin/sh
echo "BUILD: START"

node -v

echo "BUILD: Clear build dir"
rm -R build

echo "BUILD: Backend Start"
cd back
npm install
npm run build:local

echo "BUILD: Frontend Start"
cd ../front
npm install
npm run build:local
cd ..

echo "BUILD: Add build to git"

git add build
