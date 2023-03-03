require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/").get((req, res) => {
    
})

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
