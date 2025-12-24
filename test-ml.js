"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ml_model_1 = require("./src/ml-model");
// Simple test to verify the ML model is working
function testMLModel() {
    console.log('Testing ML Model for Water Intake Recommendations...');
    const mlModel = new ml_model_1.WaterIntakeMLModel();
    // Test 1: Set a basic user profile
    mlModel.setUserProfile({
        weight: 70,
        height: 175,
        age: 28,
        gender: 'male',
        activityLevel: 'active',
        climate: 'hot',
        season: 'summer'
    });
    console.log('User profile set:', {
        weight: 70,
        height: 175,
        age: 28,
        gender: 'male',
        activityLevel: 'active',
        climate: 'hot',
        season: 'summer'
    });
    // Test 2: Calculate initial recommendation
    const initialRecommendation = mlModel.calculateRecommendedIntake();
    console.log('Initial ML recommendation:', initialRecommendation);
    // Test 3: Add some hydration history to see pattern adjustments
    const today = new Date().toISOString().split('T')[0];
    mlModel.addHydrationRecord({
        date: today,
        consumedMl: 2000,
        targetMl: 2450,
        timeOfDay: 10,
        activityLevel: 4,
        weather: 28,
        externalFactors: ['exercise']
    });
    mlModel.addHydrationRecord({
        date: today,
        consumedMl: 2200,
        targetMl: 2450,
        timeOfDay: 15,
        activityLevel: 4,
        weather: 28,
        externalFactors: ['exercise']
    });
    // Test 4: Calculate recommendation after adding history
    const updatedRecommendation = mlModel.calculateRecommendedIntake();
    console.log('Updated ML recommendation after adding history:', updatedRecommendation);
    console.log('ML Model test completed successfully!');
}
// Run the test
testMLModel();
