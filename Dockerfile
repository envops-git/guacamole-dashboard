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

RUN ls

RUN mv build ../../

RUN cd ..

RUN rm -r temp

RUN cd ..

RUN mv build server

RUN cd server

CMD ["npm", "run", "start"]