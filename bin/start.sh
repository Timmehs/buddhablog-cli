#!/usr/bin/env bash

NODE_ENV=development yarn webpack-dev-server --hotOnly --devtool eval-source-map --history-api-fallback --open "$@"
