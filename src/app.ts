
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Welcome to the Bookstore API');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
