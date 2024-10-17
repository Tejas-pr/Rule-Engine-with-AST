const { z } = require("zod");

const createRuleSchema = z.object({
  rule: z.string().nonempty("Rule must be a non-empty string"),
});

const astNodeSchema = z.object({
  type: z.enum(["operator", "operand"]),
  left: z.union([z.lazy(() => astNodeSchema), z.null()]),
  right: z.union([z.lazy(() => astNodeSchema), z.null()]),
  value: z.string().nonempty(),
});

const evaluateRuleSchema = z.object({
  ast: astNodeSchema,
  data: z.record(z.string(), z.union([z.string(), z.number()])),
});

const modifyRuleSchema = z.object({
  ruleId: z.string().length(24, "Invalid rule ID"),
  newRuleString: z.string().nonempty("New rule must be a non-empty string"),
});

module.exports = {
  createRuleSchema,
  evaluateRuleSchema,
  modifyRuleSchema,
};
