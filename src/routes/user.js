import express from 'express';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../lib/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, usuario, senha } = req.body;

  if (!email || !usuario || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  if (usuario.length < 5 || usuario.length > 12) {
    return res.status(400).json({ error: 'O nome de usuário deve ter entre 5 e 12 caracteres.' });
  }

  if (senha.length < 8 || senha.length > 15) {
    return res.status(400).json({ error: 'A senha deve ter entre 8 e 15 caracteres.' });
  }

  const db = await connectToDatabase();
  const existingUser = await db.collection('usuarios').findOne({ usuario });

  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já registrado' });
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const newUser = {
    email,
    usuario,
    senha: hashedPassword
  };

  await db.collection('usuarios').insertOne(newUser);

  res.status(201).json({ message: "Usuário cadastrado com sucesso!!" });
});


router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  const db = await connectToDatabase();
  const user = await db.collection('usuarios').findOne({ usuario });

  if (!user) {
    return res.status(400).json({ error: 'Email ou senha inválidos' });
  }

  const validPassword = await bcrypt.compare(senha, user.senha);

  if (!validPassword) {
    return res.status(400).json({ error: 'Email ou senha inválidos' });
  }

  res.status(200).json({ message: 'Login bem-sucedido' });
});

export default router;
