require("dotenv").config();

const express = require("express");
const cors = require("cors");

const hierarchyRoutes = require("./routes/hierarchyRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Chitkara Bajaj Challenge Backend Running");
});

// API Routes
app.use("/api", hierarchyRoutes);

// Server Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});