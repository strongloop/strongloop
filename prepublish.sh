#!/bin/sh

set -e

echo Updating loopback-example-app
rm -rf data loopback-example-app
mkdir -p data
git clone --depth=1 --branch=production http://github.com/strongloop/loopback-example-app.git
mv loopback-example-app data/
