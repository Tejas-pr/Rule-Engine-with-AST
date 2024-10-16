const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
    ruleString: {
        type: String,
        required: true
    },
    ast: {
        type: Object,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Rule", ruleSchema);