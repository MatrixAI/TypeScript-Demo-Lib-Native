{ pkgs ? import ./pkgs.nix {} }:

with pkgs;
let
  utils = callPackage ./utils.nix {};
in
  mkShell.override { stdenv = multiStdenv; } {
    nativeBuildInputs = [
      nodejs
      nodejs.python
      utils.node2nix
    ];
    # Don't set rpath for native addons
    NIX_DONT_SET_RPATH = true;
    NIX_NO_SELF_RPATH = true;
    PKG_CACHE_PATH = utils.pkgCachePath;
    PKG_IGNORE_TAG = 1;
    shellHook = ''
      echo 'Entering Typescript-Demo-Lib'
      set -o allexport
      . ./.env
      set +o allexport
      set -v

      mkdir --parents "$(pwd)/tmp"

      # Built executables and NPM executables
      export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"

      # Enables npm link
      export npm_config_prefix=~/.npm

      # Path to headers used by node-gyp for native addons
      export npm_config_nodedir="${nodejs}"

      # Verbose logging of the Nix compiler wrappers
      export NIX_DEBUG=1

      npm install --ignore-scripts

      set +v
    '';
  }
