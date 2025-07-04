# Usa una imagen oficial de Node
FROM node:20

# Crea el directorio de la app
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 
EXPOSE 4010

# Comando para iniciar el servidor
CMD ["node", "server.js"]
