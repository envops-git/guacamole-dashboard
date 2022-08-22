FROM node:lts-bullseye

WORKDIR /

RUN mkdir temp

RUN cd temp

COPY . .

RUN npm ci

RUN npm run build

RUN cd build

RUN npm ci

RUN cd ..

RUN mv build /guac-server

RUN cd ..

RUN rm -r temp

RUN cd ..

RUN cd guac-server

RUN pwd

RUN ls

CMD ["npm", "run", "start"]