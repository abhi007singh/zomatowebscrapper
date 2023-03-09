require("dotenv").config();
const express = require("express");

const { scrap } = require("./zomatoScraper/scraper");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/").get(async (req, res) => {
  const target = req.body.target;
  const data = await scrap(target);
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
