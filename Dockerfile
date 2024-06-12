FROM node:20-alpine

# Specify working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install pm2 -g

# Copy source code
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the app
CMD ["npm", "start"]