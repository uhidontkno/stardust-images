#!/bin/bash
# Start the VNC server
vncserver :1 -geometry 1280x800 -depth 24 &
websockify 3000 localhost:5901