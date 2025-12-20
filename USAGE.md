# CodeSprout Usage Guide

Welcome to CodeSprout, your friendly hydration companion for VS Code! This guide will help you get started with using the extension effectively.

## Table of Contents
1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Core Features](#core-features)
4. [Personalization](#personalization)
5. [Tracking Your Progress](#tracking-your-progress)
6. [Viewing Reports](#viewing-reports)
7. [Settings Configuration](#settings-configuration)
8. [Tips for Best Results](#tips-for-best-results)

## Installation

### From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "CodeSprout"
4. Click "Install"
5. Restart VS Code if prompted

### Manual Installation
1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Go to Extensions view
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

## Initial Setup

After installation, you'll want to personalize CodeSprout for the best experience:

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "CodeSprout"
3. Enter your height and weight for personalized water intake calculation
4. Adjust the reminder interval to your preference

## Core Features

### Virtual Plant Companion
- A cute pixel art plant lives in your VS Code sidebar
- The plant responds to your hydration habits
- Watch your plant grow and thrive as you stay hydrated!

### Hydration Reminders
- Gentle, non-intrusive reminders to drink water
- Customizable intervals (default: every 45 minutes)
- Status bar notifications that don't block your work

### Streak Tracking
- Build healthy hydration habits with streak tracking
- See your progress over time
- Motivational feedback to keep you going

### Volume-Based Tracking
- Each "Water Plant" click adds 250ml to your daily total
- Progress tracking toward your personalized daily goal
- Accurate measurement of your water consumption

## Personalization

### Setting Your Physical Stats
1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "CodeSprout"
3. Set your height (in centimeters) and weight (in kilograms)
4. The extension automatically calculates your daily water target:
   `Daily Target = Weight (kg) × 35 ml`

### Manual Target Override
If you prefer to set your own target:
1. In settings, find "CodeSprout › Daily Water Target"
2. Enter your preferred amount in milliliters
3. Set to 0 to use automatic calculation

## Tracking Your Progress

### Daily Tracking
1. Open the CodeSprout sidebar by clicking the leaf icon in the Activity Bar
2. Click "Water Plant" each time you drink water (typically 250ml)
3. Watch your progress update in real-time:
   - "Drank Today" shows your consumption
   - "Progress" shows percentage toward your daily goal
   - "Streak" tracks consecutive days of meeting your goal

### Streak Mechanics
- Your streak increases when you meet at least 90% of your daily target
- Missing a day resets your streak
- Consistency is key to building healthy habits

## Viewing Reports

### Weekly Summary Chart
1. In the CodeSprout sidebar, scroll to the "Weekly Summary" section
2. View your hydration history for the last 7 days
3. Compare your actual consumption (blue bars) with your daily targets (green line)
4. Click "Refresh" to update the chart with the latest data

### Chart Interpretation
- Blue bars: Actual water consumed each day
- Green line: Your daily target for each day
- X-axis: Days of the week
- Y-axis: Water volume in milliliters

## Settings Configuration

### Available Settings
| Setting | Description | Default Value |
|---------|-------------|---------------|
| `codeSprout.height` | Your height in centimeters | 170 |
| `codeSprout.weight` | Your weight in kilograms | 65 |
| `codeSprout.dailyWaterTarget` | Daily water target in ml (0 = auto-calculate) | 0 |
| `codeSprout.interval` | Minutes between water reminders | 45 |

### Accessing Settings
1. **Through Settings UI**:
   - Press Ctrl+, (Cmd+, on Mac)
   - Search for "CodeSprout"
   - Modify values as needed

2. **Through settings.json**:
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Preferences: Open Settings (JSON)"
   - Add or modify CodeSprout settings

## Tips for Best Results

### Establishing a Routine
- Place your water bottle near your workstation
- Respond to reminders promptly
- Try to drink consistently throughout the day
- Use the 250ml increments as a guide (a standard glass)

### Maximizing the Experience
- Keep the sidebar open to monitor your plant's status
- Celebrate streak milestones to stay motivated
- Review your weekly reports to identify patterns
- Adjust settings as your routine evolves

### Troubleshooting
- If reminders aren't appearing, check your interval setting
- If the plant isn't responding, ensure you're clicking "Water Plant"
- For persistent issues, restart VS Code

## Privacy and Data

### Local Storage Only
- All data is stored locally in VS Code's global state
- No information is sent to external servers
- Your hydration data never leaves your computer

### Data Structure
- Daily records include date, target amount, and consumed amount
- Historical data enables streak calculation and reporting
- All data is automatically cleaned up after 30 days

## Getting Help

### Reporting Issues
If you encounter problems:
1. Check the GitHub issues page
2. Include your VS Code version and operating system
3. Describe the steps to reproduce the issue

### Feature Requests
We welcome suggestions for improvement:
1. Open an issue on GitHub
2. Clearly describe the feature you'd like to see
3. Explain how it would improve your experience

Enjoy staying hydrated with CodeSprout! 💧🌱