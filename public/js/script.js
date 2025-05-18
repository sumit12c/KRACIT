// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const interviewScreen = document.getElementById('interview-screen');
const analysisScreen = document.getElementById('analysis-screen');
const startBtn = document.getElementById('start-btn');
const fieldSelect = document.getElementById('field');
const questionCountInput = document.getElementById('question-count');
const questionText = document.getElementById('question-text');
const currentQ = document.getElementById('current-q');
const totalQ = document.getElementById('total-q');
const listenBtn = document.getElementById('listen-btn');
const recordBtn = document.getElementById('record-btn');
const recordingStatus = document.getElementById('recording-status');
const answerText = document.getElementById('answer-text');
const skipBtn = document.getElementById('skip-btn');
const nextBtn = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const analysisText = document.getElementById('analysis-text');
const restartBtn = document.getElementById('restart-btn');

// Interview state
let interviewState = {
  field: '',
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  speechSynthesis: window.speechSynthesis,
  recognition: null,
  isRecording: false
};

// Initialize speech recognition if available
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    interviewState.recognition = new SpeechRecognition();
    interviewState.recognition.continuous = false;
    interviewState.recognition.interimResults = false;
    
    interviewState.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      answerText.value = transcript;
      recordingStatus.textContent = 'Recording complete';
      interviewState.isRecording = false;
    };
    
    interviewState.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      recordingStatus.textContent = 'Error: ' + event.error;
      interviewState.isRecording = false;
    };
  } else {
    console.warn('Speech recognition not supported');
    recordBtn.disabled = true;
    recordBtn.title = 'Speech recognition not supported in your browser';
  }
}

// Start the interview
startBtn.addEventListener('click', () => {
  const field = fieldSelect.value;
  const questionCount = parseInt(questionCountInput.value);
  
  if (questionCount < 3 || questionCount > 10) {
    alert('Please select between 3 to 10 questions');
    return;
  }
  
  interviewState.field = field;
  interviewState.questions = getRandomQuestions(field, questionCount);
  interviewState.currentQuestionIndex = 0;
  interviewState.answers = [];
  
  totalQ.textContent = questionCount;
  currentQ.textContent = 1;
  
  showQuestion();
  setupScreen.classList.add('hidden');
  interviewScreen.classList.remove('hidden');
});

// Show current question
function showQuestion() {
  if (interviewState.currentQuestionIndex < interviewState.questions.length) {
    const question = interviewState.questions[interviewState.currentQuestionIndex];
    questionText.textContent = question;
    answerText.value = '';
    currentQ.textContent = interviewState.currentQuestionIndex + 1;
    recordingStatus.textContent = 'Not recording';
  } else {
    // All questions answered, show analysis
    analyzeInterview();
  }
}

// Speak the question
listenBtn.addEventListener('click', () => {
  if (interviewState.speechSynthesis.speaking) {
    interviewState.speechSynthesis.cancel();
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(questionText.textContent);
  interviewState.speechSynthesis.speak(utterance);
});

// Record answer
recordBtn.addEventListener('click', () => {
  if (!interviewState.recognition) {
    alert('Speech recognition not supported in your browser');
    return;
  }
  
  if (interviewState.isRecording) {
    interviewState.recognition.stop();
    interviewState.isRecording = false;
    recordingStatus.textContent = 'Stopped recording';
    return;
  }
  
  interviewState.isRecording = true;
  recordingStatus.textContent = 'Recording...';
  answerText.value = '';
  interviewState.recognition.start();
});

// Skip question
skipBtn.addEventListener('click', () => {
  interviewState.answers.push('(Skipped)');
  interviewState.currentQuestionIndex++;
  showQuestion();
});

// Next question
nextBtn.addEventListener('click', () => {
  if (answerText.value.trim() === '') {
    alert('Please provide an answer or skip the question');
    return;
  }
  
  interviewState.answers.push(answerText.value.trim());
  interviewState.currentQuestionIndex++;
  showQuestion();
});

// Analyze interview with Gemini AI
async function analyzeInterview() {
  interviewScreen.classList.add('hidden');
  analysisScreen.classList.remove('hidden');
  
  // Show loading state
  analysisText.textContent = 'Analyzing your answers... This may take a moment.';
  
  try {
    const response = await fetch('/analyze-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions: interviewState.questions,
        answers: interviewState.answers,
        field: fieldSelect.options[fieldSelect.selectedIndex].text
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze interview');
    }
    
    const data = await response.json();
    
    // Extract score from analysis (assuming it's in the format "Score: XX/100")
    const scoreMatch = data.analysis.match(/Score: (\d+)\/100/i) || 
                      data.analysis.match(/(\d+)\s*out of 100/i);
    
    if (scoreMatch && scoreMatch[1]) {
      scoreElement.textContent = scoreMatch[1];
    } else {
      scoreElement.textContent = '?';
    }
    
    analysisText.innerHTML = marked.parse(data.analysis);
  } catch (error) {
    console.error('Error:', error);
    analysisText.textContent = 'Failed to analyze interview. Please try again later.';
  }
}

// Restart interview
restartBtn.addEventListener('click', () => {
  analysisScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});

// Initialize the app
function init() {
  initSpeechRecognition();
  
  // Load marked.js for markdown rendering if not already loaded
  if (typeof marked === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(script);
  }
}

// Start the app
init();