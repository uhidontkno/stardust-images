FROM ubuntu:latest
ENV USER=stardust
WORKDIR /app
RUN apt-get update && apt-get install --no-install-recommends -y xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev python3 python3-pip xterm git procps python3-numpy neofetch xfce4 wget curl xfce4-goodies inetutils-ping firefox-esr chromium gimp remmina remmina-plugin-vnc flatpak nano
RUN apt-get install --no-install-recommends -y tigervnc-tools tigervnc-standalone-server tigervnc-common
RUN mkdir -p /run/dbus
RUN useradd --uid 1000 stardust
RUN mkdir -p /home/stardust
RUN chown stardust /home/stardust
RUN chmod 777 /home/stardust
RUN chmod 777 /app
RUN echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
RUN usermod -aG sudo stardust
USER stardust
RUN mkdir -p /home/stardust/.vnc
RUN echo stardustVnc123 | vncpasswd -f > /home/stardust/.vnc/passwd
RUN chmod 600 /home/stardust/.vnc/passwd
RUN touch /home/stardust/.Xresources
COPY . .
RUN cp ./xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
RUN touch /home/stardust/.Xauthority
CMD ["bash", "start.sh"]
EXPOSE 5901
