FROM debian:latest
ENV USER=root
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    dbus-x11 \
    xfce4 \
    xfce4-goodies \
    gnome-browser-connector \
    chromium \
    tightvncserver \
    websockify \
    git
RUN mkdir -p /root/.vnc
RUN touch /root/.vnc/passwd
RUN echo stardustVnc123 | vncpasswd -f > /root/.vnc/passwd
RUN chmod 600 /root/.vnc/passwd
RUN touch /root/.Xresources
RUN cp ./xstartup /root/.vnc/xstartup
RUN chmod +x /root/.vnc/xstartup
CMD ["bash", "start.sh"]
EXPOSE 5901 3000