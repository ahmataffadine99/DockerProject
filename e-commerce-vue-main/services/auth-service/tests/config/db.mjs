// services/auth-service/tests/config/db.js

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo;

const connectDBTest = async () => {
    if (mongo) {
        console.log('MongoDB Memory Server is already running. Reusing connection.');
        return;
    }

    // --- MODIFICATION ICI ---
    // Spécifiez une version de MongoDB qui est disponible et compatible.
    // La 5.0.19 a échoué. Essayons une version plus récente de la série 5.x.
    // Vous pouvez vérifier les versions disponibles ici :
    // https://www.mongodb.com/download-center/community/releases/archive
    mongo = await MongoMemoryServer.create({
        binary: {
            version: '4.4.18', 
            downloadDir: process.env.MONGOMS_DOWNLOAD_DIR || '/tmp/mongodb-binaries',// <-- CHANGEZ LA VERSION ICI
        },
        // Pour des versions plus récentes de Node.js avec Alpine, parfois il faut être plus spécifique
        // platform: 'linux', // Peut être utile si l'auto-détection pose problème
        // arch: 'x64'
    });
    // --- FIN MODIFICATION ---

    const uri = mongo.getUri();

    await mongoose.connect(uri);
    console.log(`MongoDB Memory Server connected at ${uri}`);
};

const closeDBTest = async () => {
    if (mongo) {
        // Assurez-vous que la connexion est bien ouverte avant de tenter de la dropper/fermer
        if (mongoose.connection.readyState === 1) { // 1 = connected
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }
        await mongo.stop();
        console.log('MongoDB Memory Server disconnected and stopped.');
        mongo = null; // Réinitialiser pour permettre une nouvelle création si nécessaire
    }
};

const clearDBTest = async () => {
    if (mongoose.connection.readyState === 1) { // Vérifiez si connecté
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({}); // Vider la collection
        }
        console.log('MongoDB Memory Server collections cleared.');
    } else {
        console.warn('Tentative de vider la base de données, mais Mongoose n\'est pas connecté.');
    }
};

export { connectDBTest, closeDBTest, clearDBTest };