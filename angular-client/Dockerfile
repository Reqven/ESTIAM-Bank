FROM node:lts

WORKDIR /usr/src/app
COPY ./angular-client/app/ ./
COPY ./angular-client/entrypoint.sh /etc/init.d/entrypoint

EXPOSE 4200

RUN chmod +x /etc/init.d/entrypoint
CMD /etc/init.d/entrypoint