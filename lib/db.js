// lib/mongo.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // carrega variáveis do .env

const uri = process.env.CONNECT_TO_DATABASE;

const client = new MongoClient(uri);
let db;

export async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('nomeDoBanco'); // troque para o nome real do seu banco
  }
  return db;
}
