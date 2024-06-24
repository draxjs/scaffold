#!/bin/sh
echo "BUILD: Build install dependencies"

cd out
npm install --omit=dev
cd ..

