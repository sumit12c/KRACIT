const questionsDatabase = {
  software: [
    "Explain the concept of object-oriented programming.",
    "What is the difference between SQL and NoSQL databases?",
    "How would you optimize a slow-running database query?",
    "Explain the SOLID principles in software development.",
    "What is your approach to debugging a complex issue?",
    "How do you handle conflicts in a team coding environment?",
    "Explain the difference between REST and GraphQL APIs.",
    "What are some common security vulnerabilities in web applications?",
    "How do you stay updated with the latest technologies?",
    "Describe your experience with version control systems."
  ],
  marketing: [
    "How would you measure the success of a marketing campaign?",
    "What's your approach to creating buyer personas?",
    "Explain the difference between SEO and SEM.",
    "How would you handle a PR crisis on social media?",
    "What metrics are most important in email marketing?",
    "How do you stay updated with digital marketing trends?",
    "Describe a successful marketing campaign you've worked on.",
    "How would you market a product with a limited budget?",
    "What's your experience with marketing automation tools?",
    "How do you approach A/B testing for ad campaigns?"
  ],
  finance: [
    "Explain the difference between EBITDA and net income.",
    "How would you value a company using DCF analysis?",
    "What are the key financial ratios you would analyze?",
    "How do you stay updated with financial regulations?",
    "Explain the concept of risk-adjusted returns.",
    "Describe your experience with financial modeling.",
    "How would you present complex financial data to non-financial stakeholders?",
    "What's your approach to budgeting and forecasting?",
    "How do you assess the creditworthiness of a company?",
    "Explain the impact of interest rate changes on investments."
  ]
};

function getRandomQuestions(field, count) {
  const allQuestions = [...questionsDatabase[field]];
  const selectedQuestions = [];
  
  // Make sure we don't try to get more questions than available
  count = Math.min(count, allQuestions.length);
  
  while (selectedQuestions.length < count) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
  }
  
  return selectedQuestions;
}

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { questionsDatabase, getRandomQuestions };
}