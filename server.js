import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Direct shortcuts for root-level favicon and manifest requests
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'favicon.ico'));
});
app.get('/apple-touch-icon.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'apple-touch-icon.png'));
});
app.get('/site.webmanifest', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'site.webmanifest'));
});

// Fallback to index.html for not found routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
