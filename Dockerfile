FROM node:18-alpine As development

 # Set the working directory inside the container
WORKDIR /app
 # Copy package.json and package-lock.json to the working directory
COPY package*.json ./
 # Install dependencies
RUN npm i -g @nestjs/cli
 # Install dependencies
RUN npm install
 # Install dependencies
RUN npm run start:dev
 # Copy the rest of the application code to the working directory
COPY . .
 # Expose the port on which your NestJS application is running
EXPOSE 3000
 # Start the NestJS application
CMD ["npm", "run", "start:dev"]