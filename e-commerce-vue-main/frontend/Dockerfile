# Utilisation d'une image Node.js comme base
FROM node:18-alpine AS builder

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de package pour installer les dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du frontend
COPY . .

# Build de l'application Vue.js pour la production
RUN npm run build

# Utilisation d'un serveur web léger pour servir les fichiers statiques
FROM nginx:alpine

# Copie des fichiers buildés depuis l'étape 'builder'
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration personnalisée de Nginx (si nécessaire, crée un fichier 'default.conf' dans 'frontend')
# COPY frontend/default.conf /etc/nginx/conf.d/default.conf

# Exposition du port sur lequel Nginx écoute
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]