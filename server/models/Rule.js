const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleString: {
        type: String, // Save the rule in string format
        required: true
    },
    ast: {
        type: Object, // Save the AST as an object
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
