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

module.exports = {
    createRuleSchema,
    evaluateRuleSchema
};
