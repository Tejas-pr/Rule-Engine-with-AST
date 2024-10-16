const express = require("express");
const router = express.Router();
const Node = require("../models/Node");
const Rule = require("../models/Rule");
const { createRuleSchema, evaluateRuleSchema } = require("../validate"); // Import the schemas

const validAttributes = ["age", "department", "salary", "experience"];

// Function for createAST
function createAST(rule) {
    // Parsing logic for AND and OR
    if (rule.includes("AND")) {
        const parts = rule.split("AND");
        const left = createAST(parts[0].trim());
        const right = createAST(parts[1].trim());
        return new Node("operator", left, right, "AND");
    } else if (rule.includes("OR")) {
        const parts = rule.split("OR");
        const left = createAST(parts[0].trim());
        const right = createAST(parts[1].trim());
        return new Node("operator", left, right, "OR");
    } else {
        // Handle individual conditions
        const match = rule.match(/([\w\s]+)\s*(>=|<=|!=|[><=]+)\s*([\w\s'"]+)/);
        if (match) {
            const [_, attribute, operator, value] = match;
            return new Node("operand", null, null, `${attribute} ${operator} ${value}`);
        }
        throw new Error("Invalid rule format");
    }
}

// Function to evaluate AST against user data
function evaluateAST(node, data) {
    if (!node) return false;

    if (node.type === "operand") {
        const [attr, operator, value] = node.value.split(" ");
        if (!validAttributes.includes(attr)) {
            throw new Error(`Invalid attribute: ${attr}`);
        }
        // Handle comparisons based on operator
        if (operator === ">") return data[attr] > parseInt(value);
        if (operator === "=") return data[attr] === value.replace(/['"]+/g, "");
    } else if (node.type === "operator") {
        if (node.value === "AND") {
            return evaluateAST(node.left, data) && evaluateAST(node.right, data);
        } else if (node.value === "OR") {
            return evaluateAST(node.left, data) || evaluateAST(node.right, data);
        }
    }
    return false;
}

// Create a rule API
router.post("/create-rule", async (req, res) => {
    // Validate the incoming request body
    const ValidRule = createRuleSchema.safeParse(req.body);
    if (!ValidRule.success) {
        return res.status(400).json({
            error: ValidRule.error.errors,
        });
    }

    // Decode the rule
    const ruleString = ValidRule.data.rule;

    try {
        // Create AST from the rule string
        const ast = createAST(ruleString);

        // Create a new Rule instance
        const newRule = new Rule({
            ruleString: ruleString,
            ast: ast,
        });

        await newRule.save(); // Save the rule to the database

        // Return the AST in the response
        res.json({ ast });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Evaluate a rule against the data
router.post("/evaluate-rule", (req, res) => {
    // Log the incoming request body for debugging
    console.log("Incoming Request Body:", req.body);

    // Validate the incoming request body
    const validRules = evaluateRuleSchema.safeParse(req.body);
    if (!validRules.success) {
        return res.status(400).json({
            error: validRules.error.errors,
        });
    }

    // Destructure ast and data from the validated request body
    const { ast, data } = validRules.data;

    // Log ast and data for verification
    console.log("AST:", ast);
    console.log("Data:", data);

    // Check if 'data' has valid attributes
    for (const key in data) {
        if (!validAttributes.includes(key)) {
            return res.status(400).json({
                error: `Invalid attribute ${key}`,
            });
        }
    }

    // Evaluation function
    try {
        const result = evaluateAST(ast, data); // Evaluate the AST with data
        res.json({ result });
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
});

module.exports = router;
