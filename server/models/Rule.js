const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  ruleString: {
    type: String,
    required: true,
  },
  ast: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rule = mongoose.model("Rule", ruleSchema);
module.exports = Rule;
