export const getDummyTestData = (testId) => {
  // You can add multiple test data sets here based on testId
  const testDataSets = {
    "test-1": {
      testData: {
        _id: "test-1",
        title: "JavaScript Fundamentals Assessment",
        description:
          "Test your knowledge of JavaScript basics and ES6 features",
        testCode: "JS-FUND-001",
        testType: "Technical Assessment",
        duration: 45, // minutes
        totalQuestions: 15,
        totalPoints: 150,
        passingScore: 70,
        dueDate: "2024-12-31T23:59:59.000Z",
        shuffleQuestions: true,
        showResultsImmediately: false,
        questions: [
          {
            id: 1,
            text: "What is the correct way to declare a variable in JavaScript?",
            description:
              "Choose the most appropriate modern JavaScript syntax.",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "var myVariable = 'hello';" },
              { id: "b", text: "let myVariable = 'hello';" },
              { id: "c", text: "const myVariable = 'hello';" },
              { id: "d", text: "All of the above are correct" },
            ],
          },
          {
            id: 2,
            text: "Which of the following are JavaScript data types?",
            description: "Select all that apply.",
            type: "multiple-select",
            points: 15,
            options: [
              { id: "a", text: "String" },
              { id: "b", text: "Number" },
              { id: "c", text: "Boolean" },
              { id: "d", text: "Object" },
              { id: "e", text: "Function" },
              { id: "f", text: "Integer" },
            ],
          },
          {
            id: 3,
            text: "JavaScript is a statically typed language.",
            type: "true-false",
            points: 5,
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
          },
          {
            id: 4,
            text: "What does the '===' operator do in JavaScript?",
            type: "short-answer",
            points: 10,
          },
          {
            id: 5,
            text: "Which method is used to add an element to the end of an array?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "array.push()" },
              { id: "b", text: "array.pop()" },
              { id: "c", text: "array.shift()" },
              { id: "d", text: "array.unshift()" },
            ],
          },
          {
            id: 6,
            text: "What is the output of: console.log(typeof null)?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "'null'" },
              { id: "b", text: "'undefined'" },
              { id: "c", text: "'object'" },
              { id: "d", text: "'boolean'" },
            ],
          },
          {
            id: 7,
            text: "Which of the following are ways to create a function in JavaScript?",
            type: "multiple-select",
            points: 15,
            options: [
              { id: "a", text: "function myFunc() {}" },
              { id: "b", text: "const myFunc = function() {}" },
              { id: "c", text: "const myFunc = () => {}" },
              { id: "d", text: "var myFunc = new Function()" },
            ],
          },
          {
            id: 8,
            text: "Arrow functions have their own 'this' context.",
            type: "true-false",
            points: 5,
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
          },
          {
            id: 9,
            text: "What is a closure in JavaScript?",
            type: "short-answer",
            points: 15,
          },
          {
            id: 10,
            text: "Which of the following will create a new array?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "let arr = []" },
              { id: "b", text: "let arr = new Array()" },
              { id: "c", text: "let arr = Array.from()" },
              { id: "d", text: "All of the above" },
            ],
          },
          {
            id: 11,
            text: "What does 'hoisting' mean in JavaScript?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "Moving variables to the top of their scope" },
              { id: "b", text: "Lifting heavy objects" },
              { id: "c", text: "Creating global variables" },
              { id: "d", text: "Optimizing code performance" },
            ],
          },
          {
            id: 12,
            text: "Which ES6 features help with asynchronous programming?",
            type: "multiple-select",
            points: 15,
            options: [
              { id: "a", text: "Promises" },
              { id: "b", text: "Async/Await" },
              { id: "c", text: "Generators" },
              { id: "d", text: "Template Literals" },
            ],
          },
          {
            id: 13,
            text: "The 'let' keyword creates block-scoped variables.",
            type: "true-false",
            points: 5,
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
          },
          {
            id: 14,
            text: "Explain the difference between 'call', 'apply', and 'bind' methods.",
            type: "short-answer",
            points: 20,
          },
          {
            id: 15,
            text: "What is the purpose of the 'use strict' directive?",
            type: "multiple-choice",
            points: 10,
            options: [
              {
                id: "a",
                text: "To enable strict mode for better error checking",
              },
              { id: "b", text: "To make code run faster" },
              { id: "c", text: "To enable ES6 features" },
              { id: "d", text: "To compress the code" },
            ],
          },
        ],
      },
      candidateData: {
        id: "candidate-001",
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    "test-2": {
      testData: {
        _id: "test-2",
        title: "React.js Development Quiz",
        description:
          "Assessment covering React fundamentals, hooks, and best practices",
        testCode: "REACT-DEV-002",
        testType: "Frontend Development",
        duration: 60,
        totalQuestions: 20,
        totalPoints: 200,
        passingScore: 75,
        dueDate: "2024-12-31T23:59:59.000Z",
        shuffleQuestions: true,
        showResultsImmediately: false,
        questions: [
          {
            id: 1,
            text: "What is JSX in React?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "A JavaScript extension syntax" },
              { id: "b", text: "A CSS framework" },
              { id: "c", text: "A database query language" },
              { id: "d", text: "A testing library" },
            ],
          },
          {
            id: 2,
            text: "Which hooks are built into React?",
            type: "multiple-select",
            points: 15,
            options: [
              { id: "a", text: "useState" },
              { id: "b", text: "useEffect" },
              { id: "c", text: "useContext" },
              { id: "d", text: "useRouter" },
              { id: "e", text: "useReducer" },
            ],
          },
          {
            id: 3,
            text: "React components must return a single parent element.",
            type: "true-false",
            points: 5,
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
          },
          {
            id: 4,
            text: "What is the purpose of the useEffect hook?",
            type: "short-answer",
            points: 15,
          },
          {
            id: 5,
            text: "How do you pass data from parent to child component?",
            type: "multiple-choice",
            points: 10,
            options: [
              { id: "a", text: "Through props" },
              { id: "b", text: "Through state" },
              { id: "c", text: "Through context" },
              { id: "d", text: "Through refs" },
            ],
          },
          // Add more questions as needed...
        ],
      },
      candidateData: {
        id: "candidate-002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
    },
  };

  return testDataSets[testId] || null;
};

// You can also export individual test data if needed
export const getAvailableTests = () => {
  return [
    {
      id: "test-1",
      title: "JavaScript Fundamentals Assessment",
      description: "Test your knowledge of JavaScript basics and ES6 features",
      duration: 45,
      questions: 15,
      difficulty: "Intermediate",
    },
    {
      id: "test-2",
      title: "React.js Development Quiz",
      description:
        "Assessment covering React fundamentals, hooks, and best practices",
      duration: 60,
      questions: 20,
      difficulty: "Advanced",
    },
  ];
};
