const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mongoose = require("mongoose");
const config = require("./config");

app.use(express.json());

//connect to DB
mongoose.connect(config.connectionString).then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error("Database connection failed:", error.message);
});

app.use('/rules', ruleRoutes);