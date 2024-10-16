const { z } = require('zod');

// Schema for creating a rule
const createRuleSchema = z.object({
    rule: z.string().nonempty("Rule must be a non-empty string")
});

// Schema for evaluating a rule
const astNodeSchema = z.object({
    type: z.enum(['operator', 'operand']),
    left: z.union([z.lazy(() => astNodeSchema), z.null()]), // Can be another AST node or null
    right: z.union([z.lazy(() => astNodeSchema), z.null()]), // Can be another AST node or null
    value: z.string().nonempty(),
});

const evaluateRuleSchema = z.object({
    ast: astNodeSchema, // Validate that 'ast' follows the defined structure
    data: z.record(z.string(), z.union([z.string(), z.number()])) // Validate 'data' as key-value pairs
});

// Schema for modifying a rule
const modifyRuleSchema = z.object({
    ruleId: z.string().length(24, "Invalid rule ID"), // Ensure the rule ID is a string of length 24 (for MongoDB ObjectIDs)
    newRuleString: z.string().nonempty("New rule must be a non-empty string"),
});

module.exports = {
    createRuleSchema,
    evaluateRuleSchema,
    modifyRuleSchema
};
