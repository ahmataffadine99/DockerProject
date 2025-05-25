# --- Étape 1: Builder (pour compiler l'application Vue.js) ---
# Utilise une image Node.js Alpine pour un build léger
FROM node:18-alpine AS builder

# Définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copie les fichiers de définition des dépendances en premier pour optimiser le cache Docker.
# Puisque le Dockerfile est dans le dossier 'frontend', 'package*.json' est relatif à ce dossier.
COPY package*.json ./

# Installe les dépendances de l'application frontend
RUN npm install

# Copie le reste du code source du frontend.
# Puisque le Dockerfile est dans le dossier 'frontend', '.' fait référence au contenu de 'frontend'.
# Assurez-vous d'avoir un fichier .dockerignore dans le dossier 'frontend' pour exclure les fichiers inutiles.
COPY . .

# Lance le build de l'application Vue.js pour la production.
# Cela générera les fichiers statiques optimisés dans le dossier 'dist'.
RUN npm run build

# --- Étape 2: Production (Image finale optimisée avec Nginx pour servir les fichiers statiques) ---
# Utilise une image Nginx Alpine, très légère et performante pour servir des fichiers statiques
FROM nginx:alpine

# Copie les fichiers buildés depuis l'étape 'builder' vers le répertoire de service de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie la configuration Nginx personnalisée.
# Puisque le Dockerfile est dans le dossier 'frontend', 'nginx.conf' est relatif à ce dossier.
# Ce fichier doit être créé manuellement dans le dossier 'frontend'.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80, le port HTTP standard sur lequel Nginx écoute
EXPOSE 80

# Commande pour démarrer Nginx en mode non-daemon (pour rester au premier plan du conteneur)
CMD ["nginx", "-g", "daemon off;"]

# --- Rappel pour le fichier .dockerignore (à placer dans le dossier 'frontend') ---
# node_modules/
# npm-debug.log
# .git/
# .gitignore
# .vscode/
# *.log
# Dockerfile
# docker-compose.yml
# dist/ (si vous ne voulez pas copier le dossier de build local)













# Utilisation d'une image Node.js comme base
#FROM node:18-alpine AS builder

# Définition du répertoire de travail dans le conteneur
#WORKDIR /app

# Copie des fichiers de package pour installer les dépendances
#COPY package*.json ./

# Installation des dépendances
#RUN npm install

# Copie du reste des fichiers du frontend
#COPY . .

# Build de l'application Vue.js pour la production
#RUN npm run build

# Utilisation d'un serveur web léger pour servir les fichiers statiques
#FROM nginx:alpine

# Copie des fichiers buildés depuis l'étape 'builder'
#COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration personnalisée de Nginx (si nécessaire, crée un fichier 'default.conf' dans 'frontend')
# COPY frontend/default.conf /etc/nginx/conf.d/default.conf

# Exposition du port sur lequel Nginx écoute
#EXPOSE 80

# Commande pour démarrer Nginx
#CMD ["nginx", "-g", "daemon off;"]