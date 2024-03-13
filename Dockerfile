FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV POSTGRES_HOST=postgres

CMD ["npm", "run", "dev"]
