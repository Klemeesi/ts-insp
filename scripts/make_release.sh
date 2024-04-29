#!/bin/bash

yarn install
echo 
yarn build
echo
yarn start -c ts-insp.config.ts
echo
npm pack --dry-run
echo
echo Update version number and run:
echo
echo npm publish --otp XXXXXX