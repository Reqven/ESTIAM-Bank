FROM node:lts

WORKDIR /usr/src/app
COPY ./angular-client/ ./
COPY ./angular-client/start /etc/init.d/start

EXPOSE 8181

RUN chmod +x /etc/init.d/start
CMD /etc/init.d/start