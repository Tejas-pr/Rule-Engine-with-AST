const express = require("express");
const router = express.Router();
const Node = require("../models/Node");
const Rule = require("../models/Rule");
const { createRuleSchema, evaluateRuleSchema } = require("../validate");

const validAttributes = ["age", "department", "salary", "experience"];

// Function for createAST
function createAST(rule) {
  // Parsing logic for AND and OR
  if (rule.includes("AND")) {
    const parts = rule.split("AND");
    const left = createAST(parts[0]);
    const right = createAST(parts[1]);
    return new Node("operator", left, right, "AND");
  } else if (rule.includes("OR")) {
    const parts = rule.split("OR");
    const left = createAST(parts[0]);
    const right = createAST(parts[1]);
    return new Node("operator", left, right, "OR");
  } else {
    // This will handle white spaces, operators etc.
    const match = rule.match(/([\w\s]+)\s*(>=|<=|!=|[><=]+)\s*([\w\s'"]+)/);
    if (match) {
      const [_, attribute, operator, value] = match;
      return new Node(
        "operand",
        null,
        null,
        `${attribute} ${operator} ${value}`
      );
    }
    throw new Error("Invalid rule format");
  }
}

// Create a rule API
router.post("/create-rule", async (req, res) => {
    const ValidRule = createRuleSchema.safeParse(req.body);
    if (!ValidRule.success) {
      return res.status(400).json({
        error: ValidRule.error.errors,
      });
    }
  
    // Decode the rule
    const ruleString = ValidRule.data.rule;
  
    try {
      // Function to create AST
      const ast = createAST(ruleString); // Pass the ruleString to createAST
  
      // Create a new Rule instance with both ruleString and ast
      const newRule = new Rule({
        ruleString: ruleString, // Store the original rule string
        ast: ast,               // Store the AST object
      });
  
      await newRule.save(); // Save the rule to the database
  
      // Return the AST in the response
      res.json({
        ast,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  });
  

module.exports = router;
