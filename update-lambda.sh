#!/bin/sh

rm -rf function.zip

zip -r function.zip node_modules index.js

aws lambda update-function-code --function-name resize --zip-file fileb://function.zip
