#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

shopt -s globstar
shopt -s nullglob

# Using shards to optimise tests
# In the future we can incorporate test durations rather than using
# a static value for the parallel keyword

# Number of parallel shards to split the test suite into
CI_PARALLEL=2

# Quote the heredoc to prevent shell expansion
cat << "EOF"
variables:
  GIT_SUBMODULE_STRATEGY: "recursive"
  GH_PROJECT_PATH: "MatrixAI/${CI_PROJECT_NAME}"
  GH_PROJECT_URL: "https://${GITHUB_TOKEN}@github.com/${GH_PROJECT_PATH}.git"
  # Cache .npm
  npm_config_cache: "${CI_PROJECT_DIR}/tmp/npm"
  # Prefer offline node module installation
  npm_config_prefer_offline: "true"
  # Homebrew cache only used by macos runner
  HOMEBREW_CACHE: "${CI_PROJECT_DIR}/tmp/Homebrew"

default:
  interruptible: true
  before_script:
    # Replace this in windows runners that use powershell
    # with `mkdir -Force "$CI_PROJECT_DIR/tmp"`
    - mkdir -p "$CI_PROJECT_DIR/tmp"

# Cached directories shared between jobs & pipelines per-branch per-runner
cache:
  key: $CI_COMMIT_REF_SLUG
  # Preserve cache even if job fails
  when: 'always'
  paths:
    - ./tmp/npm/
    # Homebrew cache is only used by the macos runner
    - ./tmp/Homebrew
    # Chocolatey cache is only used by the windows runner
    - ./tmp/chocolatey/
    # `jest` cache is configured in jest.config.js
    - ./tmp/jest/
    # `npm_config_devdir` cache for `node-gyp` headers and libraries used by windows and macos
    - ./tmp/node-gyp

stages:
  - build       # Cross-platform library compilation, unit tests

image: registry.gitlab.com/matrixai/engineering/maintenance/gitlab-runner

build:linux:
  stage: build
  needs:
    - pipeline: $PARENT_PIPELINE_ID
      job: build:linux-prebuild
EOF
cat << EOF
  parallel: $CI_PARALLEL
EOF
cat << "EOF"
  script:
    - >
      nix-shell --arg ci true --run $'
      npm test -- --ci --coverage --shard="$CI_NODE_INDEX/$CI_NODE_TOTAL";
      '
  artifacts:
    when: always
    reports:
      junit:
        - ./tmp/junit/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: ./tmp/coverage/cobertura-coverage.xml
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:windows:
  stage: build
  needs:
    - pipeline: $PARENT_PIPELINE_ID
      job: build:windows-prebuild
EOF
cat << EOF
  parallel: $CI_PARALLEL
EOF
cat << "EOF"
  tags:
    - windows
  before_script:
    - mkdir -Force "$CI_PROJECT_DIR/tmp"
  script:
    - .\scripts\choco-install.ps1
    - refreshenv
    - npm install --ignore-scripts
    - $env:Path = "$(npm bin);" + $env:Path
    - npm test -- --ci --coverage --shard="$CI_NODE_INDEX/$CI_NODE_TOTAL"
  artifacts:
    when: always
    reports:
      junit:
        - ./tmp/junit/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: ./tmp/coverage/cobertura-coverage.xml
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:macos:
  stage: build
  needs:
    - pipeline: $PARENT_PIPELINE_ID
      job: build:macos-prebuild
EOF
cat << EOF
  parallel: $CI_PARALLEL
EOF
cat << "EOF"
  tags:
    - shared-macos-amd64
  image: macos-11-xcode-12
  script:
    - eval "$(brew shellenv)"
    - ./scripts/brew-install.sh
    - hash -r
    - npm install --ignore-scripts
    - export PATH="$(npm bin):$PATH"
    - npm test -- --ci --coverage --shard="$CI_NODE_INDEX/$CI_NODE_TOTAL"
  artifacts:
    when: always
    reports:
      junit:
        - ./tmp/junit/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: ./tmp/coverage/cobertura-coverage.xml
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
EOF
