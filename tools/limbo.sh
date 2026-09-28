#!/usr/bin/env bash

while :;
do
  git fetch;
  [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ] && git pull --rebase --autostash && git push;
  # We don't need this to be super reactive, 5 seconds is fine.
  sleep 5
done