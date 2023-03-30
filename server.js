const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  const { word, translation } = req.body;

  if (word && translation) {
    const newEntry = `${word},${translation}\n`;
    fs.appendFile('public/kamus.csv', newEntry, (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
