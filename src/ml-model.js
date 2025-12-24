"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterIntakeMLModel = void 0;
class WaterIntakeMLModel {
    constructor() {
        this.userProfile = null;
        this.hydrationHistory = [];
        // Initialize ML parameters with reasonable defaults
        this.mlParams = {
            baseWeightFactor: 35,
            activityFactor: 0.15,
            climateFactor: 0.1,
            patternAdjustment: 0.1,
            learningRate: 0.01 // How quickly the model adapts
        };
    }
    /**
     * Set or update the user profile for ML calculations
     */
    setUserProfile(profile) {
        if (!this.userProfile) {
            this.userProfile = {
                weight: 65,
                height: 170,
                age: 30,
                gender: 'other',
                activityLevel: 'moderate',
                climate: 'temperate',
                season: 'spring'
            };
        }
        this.userProfile = { ...this.userProfile, ...profile };
    }
    /**
     * Add hydration data for ML model training
     */
    addHydrationRecord(record) {
        this.hydrationHistory.push(record);
        // Keep only the last 90 days of data for performance
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        this.hydrationHistory = this.hydrationHistory.filter(r => new Date(r.date) >= ninetyDaysAgo);
    }
    /**
     * Get all hydration records
     */
    getHydrationHistory() {
        return [...this.hydrationHistory];
    }
    /**
     * Calculate personalized water intake using ML model
     */
    calculateRecommendedIntake() {
        if (!this.userProfile) {
            // Fallback to simple calculation if no profile
            return {
                dailyTargetMl: 2275,
                confidence: 0.5,
                factorsConsidered: ['weight'],
                nextReviewDate: this.getNextReviewDate()
            };
        }
        // Start with base calculation (weight-based)
        let recommendedMl = this.userProfile.weight * this.mlParams.baseWeightFactor;
        const factorsConsidered = ['weight'];
        // Apply activity level factor
        const activityMultiplier = this.getActivityMultiplier(this.userProfile.activityLevel);
        recommendedMl *= (1 + activityMultiplier);
        factorsConsidered.push('activity');
        // Apply climate factor
        const climateMultiplier = this.getClimateMultiplier(this.userProfile.climate);
        recommendedMl *= (1 + climateMultiplier);
        factorsConsidered.push('climate');
        // Apply seasonal factor
        const seasonMultiplier = this.getSeasonMultiplier(this.userProfile.season);
        recommendedMl *= (1 + seasonMultiplier);
        factorsConsidered.push('season');
        // Apply gender factor
        const genderMultiplier = this.getGenderMultiplier(this.userProfile.gender);
        recommendedMl *= (1 + genderMultiplier);
        factorsConsidered.push('gender');
        // Apply age factor (adjustments for different age groups)
        const ageMultiplier = this.getAgeMultiplier(this.userProfile.age);
        recommendedMl *= (1 + ageMultiplier);
        factorsConsidered.push('age');
        // Apply pattern-based adjustments from historical data
        if (this.hydrationHistory.length > 7) {
            const patternAdjustment = this.calculatePatternAdjustment();
            recommendedMl *= (1 + patternAdjustment);
            factorsConsidered.push('historical_patterns');
        }
        // Calculate confidence based on available data
        const confidence = this.calculateConfidence();
        // Ensure the recommendation is within reasonable bounds
        recommendedMl = Math.max(1000, Math.min(5000, recommendedMl));
        return {
            dailyTargetMl: Math.round(recommendedMl),
            confidence,
            factorsConsidered,
            nextReviewDate: this.getNextReviewDate()
        };
    }
    /**
     * Get the next date to review and potentially adjust recommendations
     */
    getNextReviewDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    /**
     * Calculate multiplier based on activity level
     */
    getActivityMultiplier(activityLevel) {
        const multipliers = {
            'sedentary': 0,
            'light': 0.1,
            'moderate': 0.15,
            'active': 0.25,
            'very_active': 0.35
        };
        return multipliers[activityLevel];
    }
    /**
     * Calculate multiplier based on climate
     */
    getClimateMultiplier(climate) {
        const multipliers = {
            'cold': -0.05,
            'temperate': 0,
            'hot': 0.2
        };
        return multipliers[climate];
    }
    /**
     * Calculate multiplier based on season
     */
    getSeasonMultiplier(season) {
        const multipliers = {
            'spring': 0,
            'summer': 0.15,
            'fall': 0,
            'winter': -0.05
        };
        return multipliers[season];
    }
    /**
     * Calculate multiplier based on gender
     */
    getGenderMultiplier(gender) {
        // Men generally need slightly more water
        return gender === 'male' ? 0.05 : 0;
    }
    /**
     * Calculate multiplier based on age
     */
    getAgeMultiplier(age) {
        if (age < 18)
            return 0.1; // Growing individuals need more
        if (age > 65)
            return 0.05; // Older adults may need more
        return 0;
    }
    /**
     * Calculate adjustments based on historical patterns
     */
    calculatePatternAdjustment() {
        if (this.hydrationHistory.length < 7) {
            return 0;
        }
        // Calculate average consumption vs target over the last 7 days
        const recentRecords = this.hydrationHistory.slice(-7);
        const avgConsumed = recentRecords.reduce((sum, r) => sum + r.consumedMl, 0) / recentRecords.length;
        const avgTarget = recentRecords.reduce((sum, r) => sum + r.targetMl, 0) / recentRecords.length;
        // If user consistently drinks less than target, slightly reduce recommendation
        // If user consistently drinks more than target, slightly increase recommendation
        const ratio = avgConsumed / avgTarget;
        const adjustment = (ratio - 1) * this.mlParams.patternAdjustment;
        // Limit adjustment to ±10%
        return Math.max(-0.1, Math.min(0.1, adjustment));
    }
    /**
     * Calculate confidence in the recommendation
     */
    calculateConfidence() {
        let confidence = 0.5; // Base confidence
        // Increase confidence based on available data
        if (this.userProfile) {
            confidence += 0.2; // Profile data adds confidence
        }
        if (this.hydrationHistory.length > 0) {
            // More history = more confidence (up to a point)
            const historyContribution = Math.min(0.3, this.hydrationHistory.length * 0.005);
            confidence += historyContribution;
        }
        return Math.min(1.0, confidence);
    }
    /**
     * Update model parameters based on user feedback
     */
    updateModelWithFeedback(actualIntake, recommendedIntake, feedback) {
        const error = actualIntake - recommendedIntake;
        // Adjust parameters based on feedback
        if (feedback === 'too_much') {
            // Reduce recommendation slightly
            this.mlParams.baseWeightFactor *= (1 - (Math.abs(error) / recommendedIntake) * this.mlParams.learningRate);
        }
        else if (feedback === 'too_little') {
            // Increase recommendation slightly
            this.mlParams.baseWeightFactor *= (1 + (Math.abs(error) / recommendedIntake) * this.mlParams.learningRate);
        }
        // Ensure parameters stay within reasonable bounds
        this.mlParams.baseWeightFactor = Math.max(25, Math.min(50, this.mlParams.baseWeightFactor));
    }
}
exports.WaterIntakeMLModel = WaterIntakeMLModel;
