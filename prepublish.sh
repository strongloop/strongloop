#!/bin/sh

set -e

echo Updating example dependencies
EXAMPLES="sls-sample-app sn-example-blog sn-example-chat sn-example-urlsaver"
rm -rf data
mkdir -p data
for e in $EXAMPLES
do
  # Remove old data
  rm -rf data/$e

  # If sl-install fails, it just does an npm install, so module won't be in
  # data/.
  sl-install -d data $e || cp -fr node_modules/$e data/

  # Remove the dependencies, we don't package them
  rm -rf data/$e/node_modules

  # npm shrinkwrap fails with extraneous installed modules
  rm -rf node_modules/$e
done

echo Prune oracle connector
find node_modules -depth -name loopback-connector-oracle -exec rm -rf {} \;
echo Prune test directories of dependent modules
#find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -print
find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -exec rm -rf {} \;
