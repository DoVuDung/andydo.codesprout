// Get references to DOM elements
const waterButton = document.getElementById('waterButton');
const settingsButton = document.getElementById('settingsButton');
const refreshChartButton = document.getElementById('refreshChart');
const plantElement = document.querySelector('.plant');
const streakElement = document.getElementById('streak');
const consumedElement = document.getElementById('consumed');
const progressElement = document.getElementById('progress');
const recommendedElement = document.getElementById('recommended');
const heightElement = document.getElementById('height');
const weightElement = document.getElementById('weight');
const chartCanvas = document.getElementById('hydrationChart');

// Chart context
const ctx = chartCanvas.getContext('2d');
let hydrationHistory = [];

// Add event listener to the water button
waterButton.addEventListener('click', () => {
  // Send a message to the extension
  vscode.postMessage({
    type: 'waterPlant'
  });
  
  // Animate the plant
  animatePlant();
});

// Add event listener to the settings button
settingsButton.addEventListener('click', () => {
  // Send a message to the extension to open settings
  vscode.postMessage({
    type: 'openSettings'
  });
});

// Add event listener to the refresh chart button
refreshChartButton.addEventListener('click', () => {
  // Request history data from the extension
  vscode.postMessage({
    type: 'requestHistory'
  });
});

// Request history data when the webview loads
window.addEventListener('load', () => {
  vscode.postMessage({
    type: 'requestHistory'
  });
});

// Function to animate the plant when watered
function animatePlant() {
  // Change plant to happy state
  plantElement.className = 'plant happy';
  plantElement.textContent = '*';
  
  // Add animation class
  plantElement.classList.add('animate');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    plantElement.classList.remove('animate');
  }, 1000);
  
  // Update stats (in a real implementation, this would come from the extension)
  updateStats();
}

// Function to update stats
function updateStats() {
  // This is just for demonstration - in a real implementation,
  // these values would come from the extension backend
  const currentStreak = parseInt(streakElement.textContent) + 1;
  streakElement.textContent = currentStreak;
  hydrationElement.textContent = '100';
}

// Handle messages from the extension
window.addEventListener('message', event => {
  const message = event.data;
  
  switch (message.type) {
    case 'updateStats':
      streakElement.textContent = message.streak;
      consumedElement.textContent = message.consumed;
      progressElement.textContent = message.progress;
      recommendedElement.textContent = message.dailyTarget;
      animatePlant();
      break;
    case 'historyData':
      hydrationHistory = message.history.records;
      renderChart();
      break;
  }
});

// Render chart with hydration history data
function renderChart() {
  // Clear canvas
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  
  if (hydrationHistory.length === 0) {
    return;
  }
  
  // Get last 7 days of data
  const last7Days = hydrationHistory.slice(-7);
  
  // Extract data for chart
  const dates = last7Days.map(record => record.date.split('-')[2]); // Just day number
  const consumed = last7Days.map(record => record.consumedMl);
  const targets = last7Days.map(record => record.targetMl);
  
  // Chart dimensions
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 30;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Find max value for scaling
  const maxValue = Math.max(...consumed, ...targets) * 1.1;
  
  // Draw axes
  ctx.strokeStyle = 'var(--vscode-foreground)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw grid lines and labels
  ctx.fillStyle = 'var(--vscode-foreground)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  
  // X-axis labels (dates)
  const xStep = chartWidth / (dates.length - 1);
  for (let i = 0; i < dates.length; i++) {
    const x = padding + i * xStep;
    ctx.fillText(dates[i], x, height - padding + 15);
  }
  
  // Y-axis labels
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const value = Math.round((maxValue * i) / ySteps / 100) * 100;
    const y = height - padding - (i * chartHeight) / ySteps;
    ctx.fillText(value, padding - 5, y);
  }
  
  // Draw target line
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < targets.length; i++) {
    const x = padding + (i * chartWidth) / (targets.length - 1);
    const y = height - padding - (targets[i] / maxValue) * chartHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Draw consumed bars
  ctx.fillStyle = '#2196F3';
  const barWidth = (chartWidth / consumed.length) * 0.6;
  for (let i = 0; i < consumed.length; i++) {
    const x = padding + (i * chartWidth) / consumed.length + (chartWidth / consumed.length - barWidth) / 2;
    const barHeight = (consumed[i] / maxValue) * chartHeight;
    const y = height - padding - barHeight;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
}

// Initialize the plant animation
setTimeout(() => {
  plantElement.classList.add('sway');
}, 1000);