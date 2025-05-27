import request from 'supertest';
import { connectDBTest, closeDBTest, clearDBTest } from '../config/db.mjs';
import app from '../../src/app.js'; // Assurez-vous que le chemin vers votre app.js est correct

describe('Auth Service', () => {
  // Avant tous les tests de ce bloc
  beforeAll(async () => {
    await connectDBTest(); // Connecte à la base de données de test en mémoire
  });

  // Avant chaque test
  beforeEach(async () => {
    await clearDBTest(); // Nettoie la base de données avant chaque test pour l'isolation
  });

  // Après tous les tests de ce bloc
  afterAll(async () => {
    await closeDBTest(); // Ferme la connexion et arrête la base de données de test
  });

  // --- Vos tests commencent ici ---

  test('should allow a user to register successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201); // Vérifie que le statut HTTP est 201 (Created)
    expect(response.body).toHaveProperty('token'); // Vérifie qu'un token est renvoyé
    expect(response.body).toHaveProperty('userId'); // Vérifie qu'un userId est renvoyé
    expect(response.body).toHaveProperty('message', 'User registered successfully'); // Vérifie le message de succès
  });

  test('should not register a user with an existing email', async () => {
    // Enregistrement d'un premier utilisateur
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existinguser',
        email: 'ahmat@gmail.com',
        password: 'password123',
      });

    // Tentative d'enregistrement d'un deuxième utilisateur avec la même email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'anotheruser',
        email: 'ahmat@gmail.com', // Même email
        password: 'affadine',
      });

    expect(response.statusCode).toBe(400); // S'attendre à un statut 400 (Bad Request)
    expect(response.body).toHaveProperty('message', 'Email already exists'); // Vérifier le message d'erreur
  });

  // Ajoutez d'autres tests ici, par exemple pour la connexion, les champs manquants, etc.
});