const express = require('express');
const router = express.Router();
const Node = require('../models/Node');
const Rule = require('../models/Rule');
const { createRuleSchema, evaluateRuleSchema } = require("../validate");

const validAttributes = ['age', 'department', 'salary', 'experience'];



//create a rule API
router.post('/create-rule', async (req, res) => {
    const ValidRule = createRuleSchema.safeParse(req.body);
    if(!ValidRule.success){
        return res.status(400).json({
            error: ValidRule.error.errorsr
        });
    }

    //decode the rule 
    const ruleString = ValidRule.data.rule;

    try{
        //function to create AST
        const ast = createAst(rule);
        const newRule = new Rule({
            ruleString: ast
        });
        await newRule.save();
        res.json({
            ast
        });
    }catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});