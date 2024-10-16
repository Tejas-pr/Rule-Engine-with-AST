// creating a structure of a rule in an Abstract Syntax Tree (AST) for evaluation

class Node{
    constructor(type, left = null, right = null, value = null){
        this.type = type;
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

module.exports = Node;