# --- Étape 1: Builder (pour copier le code source et préparer les dépendances) ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copie les fichiers de package pour que npm puisse résoudre les dépendances
# Les chemins sont maintenant relatifs au contexte de build (./services/order-service)
COPY package*.json ./

# Installe toutes les dépendances dans le stage de build
# Cela garantit que toutes les devDependencies sont disponibles si des scripts de build les utilisent
RUN npm install

# Copie tout le code source
# Les chemins sont maintenant relatifs au contexte de build (./services/order-service)
COPY . .

# --- Étape 2: Production (Image finale optimisée et sécurisée) ---
FROM node:18-alpine

WORKDIR /app

# Crée un utilisateur non-root pour des raisons de sécurité
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copie uniquement les fichiers de package et le code source depuis l'étape 'builder'
# Nous allons réinstaller les dépendances en mode production dans cette étape
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Définit l'environnement comme production
ENV NODE_ENV=production

# Installe uniquement les dépendances de production dans l'image finale
# C'est une étape clé pour réduire la taille de l'image de production
RUN npm install --only=production

# Expose le port sur lequel le service écoute
EXPOSE 3002

# Change l'utilisateur pour 'appuser' pour des raisons de sécurité
USER appuser

# Commande pour démarrer le service en production
CMD ["node", "src/app.js"]

# --- Fichier .dockerignore (à placer à la racine de votre dossier services/order-service) ---
# node_modules
# npm-debug.log
# .git
# .gitignore
# .vscode
# *.log
# Dockerfile
# docker-compose.yml







# Utilisation d'une image Node.js comme base pour le build
#FROM node:18-alpine AS builder

# Définition du répertoire de travail
#WORKDIR /app

# Copie des fichiers de package pour installer les dépendances
#COPY package*.json ./

# Installation des dépendances
#RUN npm install

# Copie du reste des fichiers du service
#COPY . .

# Étape pour l'environnement de production (image finale)
#FROM node:18-alpine

# Définition du répertoire de travail
#WORKDIR /app

# Copie uniquement des modules node et du code source buildé depuis l'étape builder
##COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/src ./src
#COPY --from=builder /app/package*.json ./

# Exposition du port sur lequel le service écoute
#EXPOSE 3002

# Commande pour démarrer le service en production
#CMD ["node", "src/app.js"]