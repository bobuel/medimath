import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

function getEmail(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as { email: string };
    return decoded.email;
  } catch {
    return null;
  }
}

interface Stats { hp: number; attack: number; defense: number }
export interface CharacterArchetype {
  id: string
  name: string
  description: string
  avatarUrl: string
  stats: Stats
}

interface User {
  email: string
  passwordHash: string
  character?: CharacterArchetype
}

const users = new Map<string, User>();
const JWT_SECRET = 'secret';

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users.has(email)) return res.status(400).json({ error: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash });
  res.json({ message: 'User created' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email }, JWT_SECRET);
  res.json({ token, email });
});

app.get('/api/character', (req, res) => {
  const email = getEmail(req);
  if (!email) return res.status(401).json({ error: 'Invalid token' });
  const user = users.get(email);
  if (!user || !user.character) return res.status(404).json({ error: 'No character' });
  res.json(user.character);
});

app.post('/api/character', (req, res) => {
  const email = getEmail(req);
  if (!email) return res.status(401).json({ error: 'Invalid token' });
  const user = users.get(email);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const { archetype } = req.body as { archetype: CharacterArchetype };
  if (!archetype) return res.status(400).json({ error: 'No archetype' });
  user.character = archetype;
  res.json({ message: 'saved' });
});

app.get('/api/protected', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as { email: string };
    res.json({ message: `Hello, ${decoded.email}` });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
