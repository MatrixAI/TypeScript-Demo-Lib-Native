import (
  let rev = "42674051d12540d4a996504990c6ea3619505953"; in
  fetchTarball "https://github.com/NixOS/nixpkgs-channels/archive/${rev}.tar.gz"
)
