# Utiliser l'image Node pour la construction et l'exécution
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 4200
# Mode Dev
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
