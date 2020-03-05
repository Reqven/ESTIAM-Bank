FROM node:lts

WORKDIR /usr/src/app
COPY ./express-server/app/ ./
COPY ./express-server/entrypoint.sh /etc/init.d/entrypoint

EXPOSE 8080

RUN chmod +x /etc/init.d/entrypoint
CMD /etc/init.d/entrypoint