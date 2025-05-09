document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const submitBtn = document.getElementById('submit-btn');
  const nextEraBtn = document.getElementById('next-era-btn');
  const inputField = document.getElementById('input');
  const eraElement = document.getElementById('era');
  const scoreElement = document.getElementById('score');
  const responseElement = document.getElementById('response');
  const storyContainer = document.getElementById('story-container');
  const challengeContainer = document.getElementById('challenge-container');
  const inputLabel = document.createElement('label'); // Add input label

  // Insert label above input field
  inputField.parentNode.insertBefore(inputLabel, inputField);

  // Game state
  let currentEra = 'prehistoric';
  let score = 0;
  const eras = ['prehistoric', 'medieval', 'modern', 'future'];
  let eraIndex = 0;
  let isProcessing = false;

  // Initialize game
  fetchEraStory();

  // Event listeners
  submitBtn.addEventListener('click', handleSubmit);
  nextEraBtn.addEventListener('click', advanceToNextEra);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Handle Start Challenge button (delegated event)
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'start-challenge-btn') {
      startChallenge();
    }
    if (e.target && e.target.classList.contains('retry-btn')) {
      responseElement.innerHTML = '';
    }
  });

  function startChallenge() {
    storyContainer.style.display = 'none';
    challengeContainer.style.display = 'block';
    
    // Update input field based on era
    if (currentEra === 'prehistoric' || currentEra === 'medieval') {
      inputLabel.textContent = 'Describe your solution:';
      inputField.placeholder = 'Type your creative solution here...';
      inputField.rows = 5;
    } else {
      inputLabel.textContent = 'Enter your code solution:';
      inputField.placeholder = 'Type your code here...';
      inputField.rows = 10;
    }
    
    inputField.focus();
    updateChallengeInstructions();
  }

  // Main submission handler
  async function handleSubmit() {
    if (isProcessing) return;
    
    const userInput = inputField.value.trim();
    if (!userInput) {
      showAlert('Please enter your solution!');
      return;
    }

    isProcessing = true;
    submitBtn.disabled = true;
    showLoadingIndicator();

    try {
      const response = await fetch('/api/qwen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: buildPrompt(userInput, currentEra),
          era: currentEra
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI feedback');
      }

      displayFeedback(data.answer);
      updateScore();
      handleGameProgress();
    } catch (error) {
      console.error('Submission error:', error);
      displayError(error.message);
    } finally {
      isProcessing = false;
      submitBtn.disabled = false;
    }
  }

  function buildPrompt(userInput, era) {
    const eraPrompts = {
      prehistoric: `Evaluate this creative solution for building a firewood pyramid in prehistoric times:
      
  User's description: ${userInput}
  
  Please provide feedback on the creativity and practicality of this solution. Suggest improvements if needed and explain how well it would work for cavemen. Keep the feedback fun and engaging for children. (Max 60 words)`,
  
      medieval: `Evaluate this creative solution for defending a medieval castle:
      
  User's description: ${userInput}
  
  Please provide feedback on the strategic thinking and historical appropriateness. Suggest improvements if needed and explain how well it would work against invaders. Keep the feedback fun and engaging for children. (Max 60 words)`,
  
      modern: 'You are a friendly and supportive modern coding assistant helping users debug JavaScript robot control systems. The code has an empty loop, so the robot won"t move. Add logic inside the loop to handle directions. Debug this robot control code:\n\nfunction moveRobot(directions) {\n  // Should move in square pattern\n  for (let i = 0; i < directions.length; i++) {\n    // Debug this loop\n  }\n} (NO LIMIT ANSWER)',
  
      future: `Optimize this AI performance code:
  ${userInput}
  
  Focus on optimization techniques and innovation in the solution. Provide specific technical solution.`
    };
    
    return eraPrompts[era];
  }

  function updateChallengeInstructions() {
    const challenges = {
      prehistoric: {
        title: "Challenge: Firewood Pyramid",
        description: `<p>Describe how you would help the cavemen build a firewood pyramid.</p>
        <p>Example:</p>
        <p>"First, we'll find the biggest logs for the bottom. Then we'll stack them in a circle, getting smaller as we go up. Finally, we'll use dry leaves to start the fire!"</p>`
      },
      medieval: {
        title: "Challenge: Castle Defense",
        description: `<p>Describe how you would defend the castle against invaders.</p>
        <p>Example:</p>
        <p>"I would position archers on the towers, pour hot oil on attackers, and have knights ready to counterattack through the side gates!"</p>`
      },
      modern: {
        title: "Challenge: Robot Debug",
        description: `<p>Debug this robot control code that's causing the robot to move erratically.</p>
        <pre>function moveRobot(directions) {
  // Should move in square pattern
  for (let i = 0; i < directions.length; i++) {
    // Debug this loop
  }
}</pre>`
      },
      future: {
        title: "Challenge: AI Optimization",
        description: `<p>Optimize this neural network code to run faster.</p>
        <pre>function trainAI(data) {
  // Current slow implementation
  data.forEach(item => {
    // Optimize this
  });
}</pre>`
      }
    };
    
    const challenge = challenges[currentEra];
    document.getElementById('challenge-title').textContent = challenge.title;
    document.getElementById('challenge-description').innerHTML = challenge.description;
  }

  
  function showLoadingIndicator() {
    responseElement.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Analyzing your ${currentEra} solution...</span>
      </div>
    `;
  }

  function displayFeedback(feedback) {
    responseElement.innerHTML = `
      <div class="feedback-container">
        <div class="feedback-header">
          <h3>🧠 AI Mentor Feedback</h3>
          <span class="era-tag">${currentEra.charAt(0).toUpperCase() + currentEra.slice(1)}</span>
        </div>
        <div class="feedback-content">${formatFeedbackText(feedback)}</div>
      </div>
    `;
  }

  function formatFeedbackText(text) {
    // First remove all markdown headers
    let cleanText = text.replace(/^#{1,6}\s*/gm, ''); // Removes #, ##, ### etc. at start of lines
    
    // Preserve bold formatting but clean up other markdown
    cleanText = cleanText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Keep bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Keep italics
      .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>') // Format code blocks
      .replace(/`(.*?)`/g, '<code>$1</code>') // Format inline code
      .replace(/\n{2,}/g, '<br><br>') // Convert multiple newlines to HTML breaks
      .replace(/^\s+|\s+$/g, ''); // Trim whitespace
  
    return cleanText;
  }

  function updateScore() {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
  }

  function handleGameProgress() {
    if (eraIndex < eras.length - 1) {
      nextEraBtn.style.display = 'block';
    } else {
      responseElement.innerHTML += `
        <div class="completion-message">
          <h3>🎉 Congratulations!</h3>
          <p>You've completed all eras with a score of ${score}!</p>
        </div>
      `;
      nextEraBtn.style.display = 'none';
    }
  }

  function advanceToNextEra() {
    eraIndex++;
    currentEra = eras[eraIndex];
    nextEraBtn.style.display = 'none';
    inputField.value = '';
    responseElement.innerHTML = '';
    challengeContainer.style.display = 'none';
    fetchEraStory();
  }

  async function fetchEraStory() {
    try {
      const response = await fetch('/api/era-stories');
      const stories = await response.json();
      updateUI(stories[currentEra]);
    } catch (error) {
      console.error('Error fetching era story:', error);
      updateUI({
        title: "Time Travel Adventure",
        content: "Welcome to Time Travel Code Adventure! The story for this era couldn't be loaded."
      });
    }
  }

  function updateUI(story) {
    document.body.className = currentEra;
    
    eraElement.textContent = `Era: ${currentEra.charAt(0).toUpperCase() + currentEra.slice(1)}`;
    
    storyContainer.innerHTML = `
      <h2>${story.title}</h2>
      <div class="story-content">
        ${story.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
      </div>
      <button id="start-challenge-btn" class="action-button">Start Challenge</button>
    `;
    
    challengeContainer.style.display = 'none';
    storyContainer.style.display = 'block';
  }

  function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert-message';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }
});

