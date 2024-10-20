const express = require("express");
const mongoose = require("mongoose");
const ruleRoutes = require("./routes/ruleRoutes");
require('dotenv').config();

const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors({
  origin: process.env.allowed_origin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/rules", ruleRoutes);

mongoose
  .connect(process.env.connectionString)  
  .then(() => {
    console.log("MongoDB connected successfully");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });
