# Node base image
FROM node:20-alpine

# Work dir
WORKDIR /usr/src/app


COPY package*.json ./

# Install dependencies 
RUN npm install

# Copy rest of code
COPY . .

# Exponer el puerto del healthcheck
EXPOSE 4010

# Comando por defecto
CMD ["npm", "start"]
