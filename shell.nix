{ pkgs ? import ./pkgs.nix {} }:

with pkgs;
let
  utils = callPackage ./utils.nix {};
in
  pkgs.mkShell {
    nativeBuildInputs = [
      nodejs
      utils.node2nix
      utils.pkg
    ];
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

      # pkg is installed in package.json
      # this ensures that in nix-shell we are using the nix packaged versions
      export PATH="${lib.makeBinPath
        [
          utils.pkg
        ]
      }:$PATH"

      # Enables npm link
      export npm_config_prefix=~/.npm

      npm install

      set +v
    '';
  }
