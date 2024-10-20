# Rule Engine with AST

This project is focused on creating a **Rule Engine** that utilizes an **Abstract Syntax Tree (AST)** to evaluate dynamic rules based on specified attributes such as age, department, salary, and experience focused on backend. The application comprises an API built with **Node.js** and **Express**, which allows users to create rules, modify existing ones, and evaluate these rules against user data. The rules are stored in a **MongoDB** database, ensuring persistence and easy retrieval.

[DEMO VIDEO](https://www.loom.com/share/f78f12bf701c4fdaa64d371f1d97860a?sid=c1652bc7-d69f-4af2-a53b-b0c62ce719a9)

## Features

- Create new rules
- Evaluate existing rules against user data
- Modify existing rules
- Retrieve all stored rules
- Implemented input validation using **Zod**

## Dependencies

This project uses the following dependencies:

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **Mongoose**: ODM library for MongoDB and Node.js
- **Cors**: Package to enable CORS (Cross-Origin Resource Sharing)
- **Zod**: Type-safe schema declaration and validation library
- **.env**: Reducing the need for manual configuration

## Design Choices

#### 1. Node.js with Express.js

- Chosen for its asynchronous nature and ability to handle a large number of requests. Express simplifies server creation and routing.

#### 2. MongoDB

- NoSQL database allows for flexible schema design, which is ideal for dynamic rule storage.

#### 3. Abstract Syntax Tree (AST)

- Provides a structured way to parse and evaluate complex rules. The tree-based approach allows for breaking down rules into operands and operators that are easier to evaluate programmatically.

#### 4. Zod for Validation

- Zod simplifies input validation with schema definitions, ensuring type safety.

#### 5. Mongoose

- Simplifies the integration between Node.js and MongoDB by providing an easy-to-use object data modeling (ODM) library.

## Setup Instructions

Clone the repository to your local machine:

```bash
git clone https://github.com/Tejas-pr/Rule-Engine-with-AST.git
```

Navigate to the project directory and install the dependencies:

```bash
cd Rule-Engine-with-AST
npm install
```

Create a .env and congig file in the root directory of your project and add your MongoDB connection string:

```bash
# config.js:
{
    "connectionString" : "MONGO_DB_CONNECTION_STRING"
}

# .env
PORT = PORT_NUMBER
```

Start the server using Nodemon for development:

```bash
npm run dev
```

The server will run on http://localhost:5000/${routes}

## API Endpoints - Postman

```postman
<!-- postman route collection -->
https://www.postman.com/science-participant-14299000/sharing-postman/collection/jt4it0k/rule-engine-with-ast
```

Create Rule :

- Endpoint: POST /rules/create-rule ( http://localhost:5000/rules/create-rule )

Body :

```json
{
  "rule": "age >= 30 AND department = 'Sales'"
}
```

Evaluate Rule :

- Endpoint: POST /rules/evaluate-rule ( http://localhost:5000/rules/evaluate-rule )

Body :

```json
{
  "ast": {
    "type": "operator",
    "left": {
      "type": "operand",
      "left": null,
      "right": null,
      "value": "age >= 30"
    },
    "right": {
      "type": "operand",
      "left": null,
      "right": null,
      "value": "department = 'Sales'"
    },
    "value": "AND"
  },
  "data": {
    "age": 35,
    "department": "Sales"
  }
}
```

Modify Rule :

- Endpoint: POST /rules/modify-rule ( http://localhost:5000/rules/modify-rule )

Body :

```json
{
  "ruleId": "existing_rule_id", // Replace _id from mongooDB database
  "newRuleString": "new rule string"
}
```

Get All Rules :

- Endpoint: GET /rules ( http://localhost:5000/rules )

##

**Thank You!** 👋  
tejas.teju02@gmail.com  
+91 9538632743