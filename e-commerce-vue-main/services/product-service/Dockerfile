# Utilisation d'une image Node.js comme base pour le build
FROM node:18-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de package pour installer les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du service
COPY . .

# Étape pour l'environnement de production (image finale)
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie uniquement des modules node et du code source buildé depuis l'étape builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Exposition du port sur lequel le service écoute
EXPOSE 3000

# Commande pour démarrer le service en production
CMD ["node", "src/app.js"]