FROM debian:latest
LABEL org.opencontainers.image.source https://github.com/spaceness/stardust-images
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
WORKDIR /app
RUN apt-get update && apt-get install --no-install-recommends -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy unzip \
     xfwm4 xfce4-terminal xfce4-session xterm xfconf xfce4-notifyd wget curl inetutils-ping imagemagick nano
RUN apt-get install -y libsdl2-mixer-2.0-0 libsdl2-2.0-0 fluidsynth
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&\
    apt-get install -y nodejs
RUN apt-get install --no-install-recommends -y \
    tigervnc-tools tigervnc-standalone-server tigervnc-common
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
RUN touch /home/stardust/.Xresources
COPY ./server ./server
RUN cd server && \
    sudo npm i -g pnpm tsx && \
    sudo pnpm i && \
    sudo pnpm build
COPY ./start.sh ./start.sh
COPY ./pinball/xstartup ./xstartup
USER root
COPY ./pinball/files ./files
RUN cd files && unzip PINBALL.ZIP && chmod 777 * && chmod 777 .
USER stardust
RUN cp ./xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
RUN touch /home/stardust/.Xauthority
CMD ["bash", "start.sh"]
EXPOSE 5901 6080
