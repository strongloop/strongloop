#!/bin/sh

set -e

echo Updating loopback-example-app
rm -rf data
mkdir data
git clone --depth=1 --branch=production \
  https://github.com/strongloop/loopback-example-app.git \
  data/loopback-example-app
rm -rf data/loopback-example-app/.git
