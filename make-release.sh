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
mainBranch=main
releaseBranch=release-$versionLabel

# create the release branch from develop branch
git checkout -b "$releaseBranch" $devBranch

npmFile="package.json"

sed -E "s/\"version\": \"[0-9.]+\S*\"/\"version\": \"$versionLabel\"/" $npmFile  >> "$npmFile.bak"
mv "$npmFile.bak" $npmFile

#Update package-lock file according to new package.json version code
npm i --package-lock-only

# commit version number increment
git commit -am "Incrementing version number to $versionLabel"

# merge release branch with new version number into main
git checkout $mainBranch
git merge --no-ff -m "merge release branch" "$releaseBranch"

# create tag for new version from -main
git tag "$versionLabel"

# push tag to origin
git push origin "$versionLabel"

# merge main back into develop
git checkout $devBranch
git merge --no-ff -m "merge main back into develop" $mainBranch

# remove release branch
git branch -d "$releaseBranch"

