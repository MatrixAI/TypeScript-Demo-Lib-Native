# TypeScript-Demo-LIb

[![pipeline status](https://gitlab.com/MatrixAI/open-source/TypeScript-Demo-Lib/badges/master/pipeline.svg)](https://gitlab.com/MatrixAI/open-source/TypeScript-Demo-Lib/commits/master)

## Installation

Note that JavaScript libraries are not packaged in Nix. Only JavaScript applications are.

Building the package:

```sh
nix-build -E '(import ./pkgs.nix).callPackage ./default.nix {}'
```

Building the releases:

```sh
nix-build ./release.nix --attr application
nix-build ./release.nix --attr docker
```

Install into Nix user profile:

```sh
nix-env -f ./release.nix --install --attr application
```

Install into Docker:

```sh
docker load --input "$(nix-build ./release.nix --attr docker)"
```

## Path Aliases

Due to https://github.com/microsoft/TypeScript/issues/10866, you cannot use path aliases without a bundler like Webpack to further transform the generated JavaScript code in order to resolve the path aliases. Because this is a simple library demonstrate, there's no need to use a bundler. In fact, for such libraries, it is far more efficient to not bundle the code.

However we have left the path alias configuration in `tsconfig.json`, `jest.config.json` and in the tests we are making use of the `@typescript-demo-lib` alias.
