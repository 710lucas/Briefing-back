FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV POSTGRES_HOST=postgres

CMD ["sh", "-c", "npm install && npm run build && npm run dev"]
