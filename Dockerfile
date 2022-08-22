FROM node:lts-bullseye

WORKDIR /

RUN mkdir server

RUN cd server

RUN mkdir temp

RUN cd temp

COPY . .

RUN npm ci

RUN npm run build

RUN cd build

RUN npm ci

RUN cd ..

RUN mv build ../../guac-server

RUN cd ..

RUN rm -r temp

RUN cd ..

RUN rm -r server

RUN cd guac-server

RUN ls

RUN cat package.json

CMD ["npm", "run", "start"]