import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, some of the World!');
});

app.get('/hello', (req, res) => {
  res.json({ message: 'hello hello hello' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
