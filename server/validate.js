// validation the input 
const { z } = require('zod');

//creatinf rule
const createRuleSchema = z.object({
    rule: z.string().nonempty("Rule must be non-empty String")
});

//evaluate Rule
const evaluateRuleSchema = z.object({
    ast: z.object(),
    data: z.record(z.string(), z.union([z.string(), z.number()]))
});

module.exports = {
    createRuleSchema,
    evaluateRuleSchema
}