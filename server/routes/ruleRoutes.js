const express = require("express");
const router = express.Router();
const Node = require("../models/Node");
const Rule = require("../models/Rule");
const {
  createRuleSchema,
  evaluateRuleSchema,
  modifyRuleSchema,
} = require("../validate");

const validAttributes = ["age", "department", "salary", "experience"];

function createAST(rule) {
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

function evaluateAST(node, data) {
  if (!node) return false;

  if (node.type === "operand") {
    const [attr, operator, value] = node.value.split(" ");

    if (!validAttributes.includes(attr)) {
      throw new Error(`Invalid attribute: ${attr}`);
    }

    const parsedValue = isNaN(value)
      ? value.replace(/['"]+/g, "")
      : parseFloat(value);

    switch (operator) {
      case ">":
        return data[attr] > parsedValue;
      case "<":
        return data[attr] < parsedValue;
      case ">=":
        return data[attr] >= parsedValue;
      case "<=":
        return data[attr] <= parsedValue;
      case "!=":
        return data[attr] != parsedValue;
      case "=":
        return data[attr] === parsedValue;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  } else if (node.type === "operator") {
    if (node.value === "AND") {
      return evaluateAST(node.left, data) && evaluateAST(node.right, data);
    } else if (node.value === "OR") {
      return evaluateAST(node.left, data) || evaluateAST(node.right, data);
    }
  }
  return false;
}

router.post("/create-rule", async (req, res) => {
  const ValidRule = createRuleSchema.safeParse(req.body);
  if (!ValidRule.success) {
    return res.status(400).json({
      error: ValidRule.error.errors,
    });
  }

  const ruleString = ValidRule.data.rule;

  try {
    const ast = createAST(ruleString);

    const newRule = new Rule({
      ruleString: ruleString,
      ast: ast,
    });

    await newRule.save();

    res.json({ ast });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/evaluate-rule", (req, res) => {
  const validRules = evaluateRuleSchema.safeParse(req.body);
  if (!validRules.success) {
    return res.status(400).json({
      error: validRules.error.errors,
    });
  }

  const { ast, data } = validRules.data;

  for (const key in data) {
    if (!validAttributes.includes(key)) {
      return res.status(400).json({
        error: `Invalid attribute ${key}`,
      });
    }
  }

  try {
    const result = evaluateAST(ast, data);
    res.json({ result });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post("/modify-rule", async (req, res) => {
  const validationResult = modifyRuleSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ errors: validationResult.error.errors });
  }

  const { ruleId, newRuleString } = validationResult.data;

  try {
    const newAst = createAST(newRuleString);
    await Rule.findByIdAndUpdate(
      ruleId,
      { ruleString: newRuleString, ast: newAst },
      { new: true }
    );
    res.json({ message: "Rule updated successfully", newAst });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;