FROM node:latest

WORKDIR /opt/app

COPY . .

EXPOSE 80

RUN npm i

RUN npm run build

ENTRYPOINT ["npm", "run", "preview", "--", "--port", "80", "--host"]