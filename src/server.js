import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoute from './routes/user.js'
import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/db.js';

dotenv.config();


const server = express();
server.use(express.json())

connectToDatabase()

server.use(
    cors({
      origin: 'http://localhost:5173',  // Frontend (Vite) rodando aqui
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    })
  )
  
server.use(helmet());

server.use('/api', userRoute)

server.listen(5000, () => {
    console.log("Servidor rodando!!")
})