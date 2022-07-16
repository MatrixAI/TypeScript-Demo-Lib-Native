#!/usr/bin/env bash

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
  NPM_CONFIG_CACHE: "./tmp/npm"
  # Prefer offline node module installation
  NPM_CONFIG_PREFER_OFFLINE: "true"
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
  - check       # Linting, unit tests

image: registry.gitlab.com/matrixai/engineering/maintenance/gitlab-runner

check:test:
  stage: check
  needs:
    - pipeline: $PARENT_PIPELINE_ID
      job: check:test-prebuild
EOF
cat << EOF
  parallel: $CI_PARALLEL
EOF
cat << "EOF"
  script:
    - >
      nix-shell --run '
      npm test -- --ci --coverage --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL;
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
EOF