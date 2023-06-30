FROM node:18-alpine As production

 # Set the working directory inside the container
WORKDIR /app
 # Copy package.json and package-lock.json to the working directory
COPY package*.json ./
 # Install dependencies
RUN npm install --production
 # Copy the rest of the application code to the working directory
COPY . .
 # Expose the port on which your NestJS application is running
EXPOSE 3000
 # Start the NestJS application