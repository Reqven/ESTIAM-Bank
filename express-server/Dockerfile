FROM node:lts

WORKDIR /usr/src/app
COPY ./express-server/ ./
COPY ./express-server/start /etc/init.d/start

EXPOSE 8080

RUN chmod +x /etc/init.d/start
CMD /etc/init.d/start