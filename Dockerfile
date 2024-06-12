FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Глобально устанавливаем PM2
RUN npm install pm2 -g

# Копируем исходный код
COPY . .

# Запускаем приложение через PM2
CMD ["pm2-runtime", "main.js"]
