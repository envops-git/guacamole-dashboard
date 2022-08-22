FROM node:lts-bullseye

WORKDIR /

RUN mkdir temp

COPY . /temp

RUN npm --prefix /temp ci

RUN npm --prefix /temp run build

RUN npm --prefix /temp/build ci

RUN mv /temp/build /guac-server

RUN rm -r /temp

CMD ["npm","--prefix", "/guac-server", "run", "start"]