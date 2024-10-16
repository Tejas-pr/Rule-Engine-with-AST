const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const ruleRoutes = require("./routes/ruleRoutes");

const app = express();
app.use(express.json());

app.use("/rules", ruleRoutes);

mongoose
  .connect(config.connectionString)
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
