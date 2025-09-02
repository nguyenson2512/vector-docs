FROM node:20.19.3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--port", "3000", "--host", "0.0.0.0"]