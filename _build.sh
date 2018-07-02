#!/bin/sh

sub=$1

# Script to quickly build site
jekyll build --config _config${1}.yml --destination _site${1}
