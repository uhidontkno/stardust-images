#!/bin/bash

# Reset
OFF='\033[0m'       # Text Reset

# Regular Colors
BLACK='\033[0;30m'        # BLACK
RED='\033[0;31m'          # RED
GREEN='\033[0;32m'        # GREEN
YELLOW='\033[0;33m'       # YELLOW
BLUE='\033[0;34m'         # BLUE
PURPLE='\033[0;35m'       # PURPLE
CYAN='\033[0;36m'         # CYAN
WHITE='\033[0;37m'        # WHITE

# Bold
BBLACK='\033[1;30m'       # BLACK
BRED='\033[1;31m'         # RED
BGREEN='\033[1;32m'       # GREEN
BYELLOW='\033[1;33m'      # YELLOW
BBLUE='\033[1;34m'        # BLUE
BPURPLE='\033[1;35m'      # PURPLE
BCYAN='\033[1;36m'        # CYAN
BWHITE='\033[1;37m'       # WHITE

BANNER="$GREEN✨ Stardust$OFF:"

if [ "$EUID" -ne 0 ]; then
    printf "$BANNER$BRED Not running as sudo! You may encounter permission errors.$OFF \n"
fi

printf "$BANNER$BYELLOW Building$OFF all images!\n\n"

images=("chromium" "debian" "firefox" "gimp")

push_flag=false
for arg in "$@"; do
  if [ "$arg" == "-p" ]; then
    push_flag=true
    break
  fi
done


for t in ${images[@]}; do
	docker build -t ghcr.io/spaceness/$t -f $t/Dockerfile .;
	if $push_flag; then
 	printf "$BANNER$BBLUE Pushing$OFF Docker container$BLUE ghcr.io/spaceness/$t$OFF\n"
	docker push ghcr.io/spaceness/$t
else
	printf "\n$BANNER$BRED Skipping$OFF push for$BLUE ghcr.io/spaceness/$t$OFF\n\n"
fi
done
