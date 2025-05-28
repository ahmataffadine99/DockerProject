Projet E-Commerce Microservices avec Docker & Docker Swarm

Ce projet vise à maîtriser les meilleures pratiques de conteneurisation et d'orchestration pour une application e-commerce basée sur une architecture microservices. Il utilise Docker, Docker Compose et Docker Swarm pour gérer les environnements de développement et de production.
Table des matières

    Objectifs du Projet
    Architecture de l'Application
    Prérequis
    Démarrage Rapide (Environnement de Développement)
        Construction et Exécution
        Accès à l'Application
        Arrêt de l'Environnement
    Déploiement en Production (Docker Swarm)
        Initialisation de Docker Swarm
        Construction des Images de Production
        Déploiement de la Stack
        Vérification du Statut des Services
        Accès à l'Application en Production
        Arrêt de la Stack de Production
    Configurations Spécifiques aux Environnements
        Environnement de Développement
        Environnement de Production
    Bonnes Pratiques Appliquées
        Optimisation des Images Docker
        Sécurité
        Orchestration
    Commandes Utiles pour Tester les Services
        Vérification de l'État des Services
        Accès aux Logs
        Exécution de Commandes dans les Conteneurs
        Tests Fonctionnels
    Contribution
    Licence

1. Objectifs du Projet

Ce projet a été réalisé dans le but de :

    Créer des Dockerfile optimisés pour chaque microservice, en utilisant le multi-stage et en distinguant les configurations de développement et de production.
    Configurer des fichiers docker-compose.yml et docker-compose.prod.yml adaptés aux différents environnements.
    Utiliser Docker Swarm pour l'orchestration de l'application en production.
    Assurer la sécurité et l'optimisation des images Docker (utilisateur non-root, taille réduite, gestion des secrets).
    Documenter l'ensemble du travail pour faciliter la compréhension et le déploiement.

2. Architecture de l'Application

L'application est composée des microservices suivants :

    auth-service : Gestion des utilisateurs et de l'authentification.
    product-service : Gestion des produits disponibles.
    order-service : Gestion du panier d'achat et des commandes.
    frontend : Interface utilisateur (Vue.js).
    mongodb : Base de données NoSQL.

3. Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre système :

    Docker Desktop (inclut Docker Engine, Docker Compose et Docker Swarm)
    Git

4. Démarrage Rapide (Environnement de Développement)

Cet environnement est conçu pour la facilité de développement local.
Construction et Exécution

    Clonez le dépôt Git :
    Bash

git clone <URL_DE_VOTRE_DÉPÔT>
cd <NOM_DU_DOSSIER_DU_PROJET>

Lancez l'environnement de développement : Assurez-vous d'être à la racine du projet où se trouve docker-compose.yml.
Bash

    docker compose up --build -d

    Cette commande va construire les images (si elles ne sont pas déjà présentes ou si les Dockerfiles ont changé) et démarrer tous les services en arrière-plan.

Accès à l'Application

    Frontend : Accédez à l'application via votre navigateur à l'adresse : http://localhost:8080
    Services Backend :
        Auth Service : http://localhost:3001
        Product Service : http://localhost:3000
        Order Service : http://localhost:3002

Arrêt de l'Environnement

Pour arrêter et supprimer tous les conteneurs et les réseaux de l'environnement de développement :
Bash

docker compose down

5. Déploiement en Production (Docker Swarm)

L'environnement de production utilise Docker Swarm pour l'orchestration, offrant haute disponibilité et scalabilité.
Initialisation de Docker Swarm

Si Docker Swarm n'est pas déjà initialisé sur votre machine (manager) :
Bash

docker swarm init --advertise-addr <ADRESSE_IP_DE_VOTRE_MACHINE>
# Exemple : docker swarm init --advertise-addr 10.0.2.15

Construction des Images de Production

Avant de déployer sur Swarm, vous devez construire les images Docker spécifiques à la production. Assurez-vous d'être à la racine du projet.
Bash

docker build -t auth-service:latest ./services/auth-service
docker build -t product-service:latest ./services/product-service
docker build -t order-service:latest ./services/order-service
docker build -t frontend:latest ./frontend

Note : Ces commandes utilisent les Dockerfile multi-stage configurés pour la production.
Déploiement de la Stack

Déployez l'application e-commerce en tant que stack sur Docker Swarm en utilisant le fichier docker-compose.prod.yml.

    Supprimez toute stack précédente (si existante) :
    Bash

docker stack rm ecommerce-prod
# Optionnel : docker volume rm mongodb_data_prod (supprime les données MongoDB)

Déployez la nouvelle stack :
Bash

    docker stack deploy -c docker-compose.prod.yml ecommerce-prod

Vérification du Statut des Services

Pour vérifier que tous les services sont bien démarrés :
Bash

docker stack ps ecommerce-prod

Assurez-vous que tous les services affichent un état Running.
Accès à l'Application en Production

    Frontend : Accédez à l'application via votre navigateur à l'adresse : http://localhost:8080 (si le port est mappé de cette manière dans docker-compose.prod.yml).
    Les services backend ne sont généralement pas directement accessibles de l'extérieur en production, mais communiquent via le réseau overlay de Swarm.

Arrêt de la Stack de Production

Pour arrêter et supprimer l'application déployée sur Swarm :
Bash

docker stack rm ecommerce-prod

6. Configurations Spécifiques aux Environnements
Environnement de Développement (docker-compose.yml)

    Volume Mounts : Utilise des montages de volumes pour le code source (./services/<service>:/app) permettant un rechargement à chaud (hot-reloading) lors des modifications de code.
    Build Context : Inclut souvent le contexte de build directement pour faciliter les reconstructions.
    Variables d'environnement : Gérées via des fichiers .env ou directement dans le docker-compose.yml.

Environnement de Production (docker-compose.prod.yml)

    Images Pré-construites : Utilise des images Docker finalisées (ex: auth-service:latest) pour un déploiement rapide.
    Réseau Overlay : Utilise un réseau de type overlay (app-network-prod) pour la communication entre les services au sein du cluster Swarm.
    Volumes Nommés : Pour la persistance des données (mongodb_data_prod).
    Gestion des Secrets : (À venir, sera détaillé ici comment les secrets Docker Swarm sont utilisés pour les informations sensibles).
    Exécution Non-Root : Les services s'exécutent avec des utilisateurs non-root pour une sécurité accrue.

7. Bonnes Pratiques Appliquées
Optimisation des Images Docker

    Dockerfiles Multi-stage : Réduit la taille des images finales en séparant l'environnement de build de l'environnement d'exécution.
    Images de Base Légères : Utilisation d'images alpine (ex: node:18-alpine, nginx:alpine) pour minimiser la taille.
    Cache Docker : Organisation des instructions COPY et RUN pour optimiser l'utilisation du cache Docker.
    Dépendances de Production : Installation uniquement des dépendances nécessaires à l'exécution en production (npm install --only=production).
    Exclusion de Fichiers : Utilisation de fichiers .dockerignore pour exclure les fichiers inutiles du contexte de build.

Sécurité

    Utilisateur Non-Root : Les processus des applications s'exécutent avec un utilisateur dédié (appuser) au lieu de root pour limiter les privilèges.
    Ports Exposés Minimaux : Seuls les ports nécessaires sont exposés.
    Gestion des Secrets Docker Swarm : (À détailler) Pour les identifiants de base de données et autres données sensibles.

Orchestration

    Docker Swarm : Utilisation d'un orchestrateur natif de Docker pour gérer le déploiement, la scalabilité et la haute disponibilité des services en production.
    Réseaux Overlay : Permettent une communication transparente entre les services sur différents nœuds Swarm.

8. Commandes Utiles pour Tester les Services
Vérification de l'État des Services

    Voir l'état de la stack Swarm :
    Bash

docker stack ps ecommerce-prod

Lister tous les conteneurs :
Bash

    docker ps

Accès aux Logs

    Voir les logs d'un service Swarm :
    Bash

docker service logs ecommerce-prod_<NOM_DU_SERVICE>
# Exemple : docker service logs ecommerce-prod_auth-service-prod

Voir les logs d'un conteneur spécifique :
Bash

    docker logs <ID_DU_CONTENEUR>

Exécution de Commandes dans les Conteneurs

    Exécuter un shell dans un conteneur (pour débogage) :
    Bash

docker exec -it <ID_DU_CONTENEUR> sh
# Ou pour les conteneurs Node : docker exec -it <ID_DU_CONTENEUR> bash

Vérifier l'utilisateur d'exécution des processus :
Bash

    docker exec -it <ID_DU_CONTENEUR> ps aux

Tests Fonctionnels

    Après déploiement, validez les fonctionnalités clés de l'application via le frontend (http://localhost:8080) :
        Inscription / Connexion utilisateur
        Navigation des produits
        Ajout au panier
        Passer une commande (vérifier la validation)

9. Contribution

(Instructions sur la façon de contribuer au projet, si applicable)
10. Licence

(Informations sur la licence du projet)
