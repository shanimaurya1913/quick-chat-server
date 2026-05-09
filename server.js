const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "config.env") });

const dbConfig = require("./config/dbConfig");

const server = require("./app");

const port = process.env.PORT || process.env.PORT_NUMBER || 3001;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
