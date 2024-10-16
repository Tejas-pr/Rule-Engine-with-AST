const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("./config");
const ruleRoutes = require("./routes/ruleRoutes");
app.use(express.json());

// Connect to DB
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

// Use the rule routes
app.use("/rules", ruleRoutes); // Use the imported router here
