# --- Étape 1: Builder (pour installer les dépendances et préparer l'application) ---
# Utilise une image Node.js Alpine pour une taille réduite
FROM node:18-alpine AS builder
#FROM node:20-slim AS builder
# Définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copie les fichiers de définition des dépendances en premier.
# Les chemins sont maintenant relatifs au contexte de build (./services/auth-service)
COPY package*.json ./

# Installe toutes les dépendances.
RUN npm install

# Copie le reste du code source du service d'authentification
# Les chemins sont maintenant relatifs au contexte de build (./services/auth-service)
COPY . .

# --- Étape 2: Production (Image finale optimisée et sécurisée) ---
# Utilise la même image Node.js Alpine pour la production
FROM node:18-alpine
#FROM node:20-slim 


# Définit le répertoire de travail
WORKDIR /app

# Crée un utilisateur non-root pour des raisons de sécurité
# L'UID 1001 est un choix courant pour les utilisateurs non-root
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser


# Copie uniquement les fichiers nécessaires depuis l'étape 'builder'
# Cela inclut les dépendances (production seulement) et le code source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/jest.config.cjs ./

COPY --from=builder /app/tests ./tests
RUN chown -R appuser:appgroup /app
# Définit l'environnement comme production
ENV NODE_ENV=production

# Expose le port sur lequel le service écoute
EXPOSE 3001

# Change l'utilisateur pour 'appuser' pour des raisons de sécurité
USER appuser

# Commande pour démarrer le service en production
CMD ["node", "src/app.js"]





