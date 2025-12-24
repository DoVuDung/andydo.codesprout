# CodeSprout Usage Guide

**Grow your code, water your self.**

CodeSprout is a VS Code extension that helps you stay hydrated while coding by gamifying the process with a virtual plant companion.

---

## ✨ Features

* 🌱 **Virtual Plant Companion**: A cute pixel art plant that lives in your VS Code sidebar
* 💧 **Hydration Reminders**: Gentle reminders to drink water at customizable intervals
* 🔥 **Streak Tracking**: Track your hydration habits over time
* 🎯 **Personalized Water Calculation**: Calculates recommended daily water intake based on your weight (Weight × 35 ml) with optional machine learning for more personalized recommendations based on multiple factors
* 📊 **Volume-Based Tracking**: Tracks actual water consumption with 250ml per drink
* 📈 **Historical Reporting**: View weekly hydration trends with interactive charts
* ⚙️ **Customizable Settings**: Easily adjust your height, weight, reminder intervals, and manual water targets

> Note: CodeSprout provides general wellness reminders and is not a medical tool.

---

## 🖼️ Screenshots

> *Coming soon*: Screenshots or GIF showing the plant companion and hydration tracking.

---

## 🔧 Requirements

* VS Code version 1.74.0 or higher
* No special system requirements

---

## ⚙️ Extension Settings

This extension contributes the following settings:

* `codeSprout.interval`: Set the interval between water reminders (in minutes, default: 45)
* `codeSprout.height`: Your height in centimeters (default: 170)
* `codeSprout.weight`: Your weight in kilograms (default: 65)
* `codeSprout.age`: Your age in years (default: 30)
* `codeSprout.gender`: Your gender (default: other, options: male, female, other)
* `codeSprout.activityLevel`: Your activity level (default: moderate, options: sedentary, light, moderate, active, very_active)
* `codeSprout.climate`: Your local climate (default: temperate, options: cold, temperate, hot)
* `codeSprout.useMLRecommendations`: Enable machine learning for personalized water intake recommendations (default: false)
* `codeSprout.waterPerDrink`: Amount of water in ml consumed per drink (default: 250ml)
* `codeSprout.dailyWaterTarget`: Daily water target in ml (0 = auto-calculate based on weight, default: 0)
* `codeSprout.overhydrationThreshold`: Overhydration warning threshold as percentage of daily target (0 = disabled, default: 150)

---

## 🚀 Usage

1. Look for the blue water drop icon in the VS Code Activity Bar
2. Click the icon to open the CodeSprout sidebar
3. Click "Water Plant" each time you drink water (typically 250ml)
4. Track your daily progress and build up your hydration streak!
5. Customize your settings through VS Code's Settings UI (search for "CodeSprout")

---

## 🐞 Known Issues

* The plant companion is currently decorative and doesn't visually change based on hydration levels
* Charts may take a moment to load with large datasets

---

## 📦 Release Notes

### 0.0.3

* Updated icon to a more visible blue water drop design
* Improved documentation with clearer usage instructions
* Fixed packaging issues with icon references

### 0.0.2

* Fixed icon display issues in VS Code Marketplace
* Resolved package configuration problems

### 0.0.1

* Initial release: Virtual plant companion with hydration tracking
* Personalized water intake calculation
* Streak tracking and reporting features

---

## 📚 Resources

* [CodeSprout Repository](https://github.com/DoVuDung/andydo.codesprout)
* [Issue Tracker](https://github.com/DoVuDung/andydo.codesprout/issues)

---

## 🤝 Contributing

Pull requests and issues are welcome! If you'd like to help improve this extension, please open a GitHub issue first to discuss what you'd like to change.

See our [Contribution Guide](CONTRIBUTING.md) for details.

---

**Enjoy staying hydrated with CodeSprout!** 💧🌱
