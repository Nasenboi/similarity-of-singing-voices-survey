#!/bin/bash

# script adopted from https://gist.github.com/bclinkinbeard/1331790
# example use: ./makeRelease.sh (version is in version.txt)

# current Git branch
branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# read version from version.txt
versionLabel=$(cat version.txt | tr -d '\n')
echo "Creating version with version code $versionLabel"

# set branch and tag name variables
devBranch=develop
masterBranch=master
releaseBranch=release-$versionLabel

# create the release branch from develop branch
git checkout -b "$releaseBranch" $devBranch

npmFile="package.json"
appFile="imports/Globals.js"

# find version number assignment ("1.5.5-rc1" for example)
# and replace it with newly specified version number
# -i command does not work cross platform, this is solved by writing to .bak file first and then moving the .bak file back to original filename
sed -E "s/APP_VERSION = \"[0-9.]+\S*\"/APP_VERSION = \"$versionLabel\"/" $appFile >> "$appFile.bak"
mv "$appFile.bak" $appFile
sed -E "s/\"version\": \"[0-9.]+\S*\"/\"version\": \"$versionLabel\"/" $npmFile  >> "$npmFile.bak"
mv "$npmFile.bak" $npmFile

#Update package-lock file according to new package.json version code
npm i --package-lock-only

# commit version number increment
git commit -am "Incrementing version number to $versionLabel"

# merge release branch with new version number into master
git checkout $masterBranch
git merge --no-ff -m "merge release branch" "$releaseBranch"

# create tag for new version from -master
git tag "$versionLabel"

# merge master back into develop
git checkout $devBranch
git merge --no-ff -m "merge master back into develop" $masterBranch

# remove release branch
git branch -d "$releaseBranch"

