#!/bin/sh

cd `dirname $0`
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome http://localhost:8081/
php -S localhost:8081
