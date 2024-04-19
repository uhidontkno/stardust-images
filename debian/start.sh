#!/bin/bash
vncserver -kill :1
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
vncserver :1 -passwd /home/stardust/.vnc/passwd &
tail -f /dev/null
