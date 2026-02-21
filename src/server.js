const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { PORT } = require("./config/config");

dotenv.config();

connectDB();
const port = Number(PORT);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
