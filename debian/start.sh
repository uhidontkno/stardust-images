#!/bin/bash
vncserver -kill :1
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
echo "while :
do
vncserver :1 -passwd /home/stardust/.vnc/passwd -localhost no
sleep 5
done
" | bash &
sleep 1
tail -f /dev/null
