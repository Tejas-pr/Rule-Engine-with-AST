import React, { useState, useEffect } from "react";
import axios from "axios";

const RulesList = () => {
  const [rules, setRules] = useState([]);
  const [ruleString, setRuleString] = useState("");
  const [data, setData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [newRuleString, setNewRuleString] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [ast, setAst] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rules");
      setRules(response.data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const createRule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/rules/create-rule",
        { rule: ruleString }
      );
      console.log("AST created:", response.data.ast);
      setAst(response.data.ast);
      fetchRules();
    } catch (error) {
      console.error("Error creating rule:", error.response.data);
    }
  };

  const evaluateRule = async (e) => {
    e.preventDefault();
    if (!ast) {
      console.error("AST must be provided");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/rules/evaluate-rule",
        { ast, data }
      );
      setEvaluationResult(response.data.result);
    } catch (error) {
      console.error("Error evaluating rule:", error.response.data);
    }
  };

  const modifyRule = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/rules/modify-rule", {
        ruleId,
        newRuleString,
      });
      console.log("Rule modified successfully");
      fetchRules();
    } catch (error) {
      console.error("Error modifying rule:", error.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-10">
          <div className="flex gap-28">
            <div>
              <h1 className="text-white text-2xl mb-4">Rules List</h1>
              <form onSubmit={createRule} className="mb-6">
                <h2 className="text-white text-xl mb-2">Create Rule</h2>
                <input
                  type="text"
                  value={ruleString}
                  onChange={(e) => setRuleString(e.target.value)}
                  placeholder="Enter rule string"
                  className="p-3 mb-2 w-full text-black rounded-lg"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded-lg"
                >
                  Create Rule
                </button>
              </form>

              <h2 className="text-white text-xl mb-2">All Rules</h2>
              <ul className="mb-6">
                {rules.map((rule) => (
                  <li key={rule._id} className="text-white mb-2">
                    {rule.ruleString}
                    <button
                      onClick={() => {
                        setRuleId(rule._id);
                        setNewRuleString(rule.ruleString);
                      }}
                      className="bg-purple-600 text-white ml-2 p-1 rounded-lg"
                    >
                      Modify
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <form onSubmit={modifyRule} className="mb-6">
                <h2 className="text-white text-xl mb-2">Modify Rule</h2>
                <input
                  type="text"
                  value={newRuleString}
                  onChange={(e) => setNewRuleString(e.target.value)}
                  placeholder="New rule string"
                  className="p-3 mb-2 w-full text-black rounded-lg"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded-lg"
                >
                  Modify Rule
                </button>
              </form>

              <form onSubmit={evaluateRule} className="mb-6">
                <h2 className="text-white text-xl mb-2">Evaluate Rule</h2>
                <input
                  type="text"
                  placeholder="Enter data as JSON"
                  onChange={(e) => {
                    try {
                      setData(JSON.parse(e.target.value)); // Parse JSON input
                    } catch (err) {
                      console.error("Invalid JSON format");
                    }
                  }}
                  className="p-3 mb-2 w-full text-black rounded-lg"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded-lg"
                >
                  Evaluate Rule
                </button>
              </form>

              {evaluationResult !== null && (
                <div>
                  <h3 className="text-white">
                    Evaluation Result: {evaluationResult ? "True" : "False"}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RulesList;
