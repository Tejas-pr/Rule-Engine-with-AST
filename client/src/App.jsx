// src/App.jsx
import React from 'react';
import RulesList from './components/RulesList';
import './index.css'; // Ensure your CSS file is imported here

function App() {
  return (
    <>
    <div className="bg-black min-h-screen items-center justify-center">
      <h1 className="text-white text-4xl mb-6 flex justify-center items-center p-8">Rule Engine</h1>
      <RulesList />
    </div>
    </>
  );
}

export default App;