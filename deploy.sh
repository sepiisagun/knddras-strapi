#!/bin/bash

export NVM_DIR=$HOME/.nvm;
. $NVM_DIR/nvm.sh;

cd /home/ec2-user/knddras-strapi
git pull origin develop
nvm use v18
yarn install
pm2 resurrect
pm2 restart knddras-strapi