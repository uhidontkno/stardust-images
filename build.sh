#!/bin/bash
echo "✨Stardust: Building all images"


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
 	 echo "✨Stardust: Pushing Docker container ghcr.io/spaceness/$t"
	docker push ghcr.io/spaceness/$t
else
	echo "✨Stardust: Skipping push for ghcr.io/spaceness/$t"
fi
done
