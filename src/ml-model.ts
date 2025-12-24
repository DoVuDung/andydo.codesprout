import * as vscode from 'vscode';

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  climate: 'cold' | 'temperate' | 'hot';
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

interface HydrationRecord {
  date: string; // YYYY-MM-DD
  consumedMl: number;
  targetMl: number;
  timeOfDay: number; // hour of day (0-23)
  activityLevel: number; // 1-5 scale
  weather: number; // temperature in Celsius
  externalFactors: string[]; // e.g., 'exercise', 'alcohol', 'caffeine'
}

interface MLRecommendation {
  dailyTargetMl: number;
  confidence: number; // 0-1
  factorsConsidered: string[];
  nextReviewDate: string; // YYYY-MM-DD
}

export class WaterIntakeMLModel {
  private userProfile: UserProfile | null = null;
  private hydrationHistory: HydrationRecord[] = [];
  private mlParams: {
    baseWeightFactor: number;
    activityFactor: number;
    climateFactor: number;
    patternAdjustment: number;
    learningRate: number;
  };

  constructor() {
    // Initialize ML parameters with reasonable defaults
    this.mlParams = {
      baseWeightFactor: 35, // Base ml per kg
      activityFactor: 0.15, // 15% increase per activity level above sedentary
      climateFactor: 0.1, // 10% increase per 5°C above 20°C
      patternAdjustment: 0.1, // Up to 10% adjustment based on patterns
      learningRate: 0.01 // How quickly the model adapts
    };
  }

  /**
   * Set or update the user profile for ML calculations
   */
  public setUserProfile(profile: Partial<UserProfile>): void {
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
  public addHydrationRecord(record: HydrationRecord): void {
    this.hydrationHistory.push(record);
    
    // Keep only the last 90 days of data for performance
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    this.hydrationHistory = this.hydrationHistory.filter(
      r => new Date(r.date) >= ninetyDaysAgo
    );
  }

  /**
   * Get all hydration records
   */
  public getHydrationHistory(): HydrationRecord[] {
    return [...this.hydrationHistory];
  }

  /**
   * Calculate personalized water intake using ML model
   */
  public calculateRecommendedIntake(): MLRecommendation {
    if (!this.userProfile) {
      // Fallback to simple calculation if no profile
      return {
        dailyTargetMl: 2275, // 65kg * 35ml
        confidence: 0.5,
        factorsConsidered: ['weight'],
        nextReviewDate: this.getNextReviewDate()
      };
    }

    // Start with base calculation (weight-based)
    let recommendedMl = this.userProfile.weight * this.mlParams.baseWeightFactor;
    const factorsConsidered: string[] = ['weight'];

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
  private getNextReviewDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  /**
   * Calculate multiplier based on activity level
   */
  private getActivityMultiplier(activityLevel: UserProfile['activityLevel']): number {
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
  private getClimateMultiplier(climate: UserProfile['climate']): number {
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
  private getSeasonMultiplier(season: UserProfile['season']): number {
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
  private getGenderMultiplier(gender: UserProfile['gender']): number {
    // Men generally need slightly more water
    return gender === 'male' ? 0.05 : 0;
  }

  /**
   * Calculate multiplier based on age
   */
  private getAgeMultiplier(age: number): number {
    if (age < 18) return 0.1; // Growing individuals need more
    if (age > 65) return 0.05; // Older adults may need more
    return 0;
  }

  /**
   * Calculate adjustments based on historical patterns
   */
  private calculatePatternAdjustment(): number {
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
  private calculateConfidence(): number {
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
  public updateModelWithFeedback(actualIntake: number, recommendedIntake: number, feedback: 'too_much' | 'too_little' | 'just_right'): void {
    const error = actualIntake - recommendedIntake;
    
    // Adjust parameters based on feedback
    if (feedback === 'too_much') {
      // Reduce recommendation slightly
      this.mlParams.baseWeightFactor *= (1 - (Math.abs(error) / recommendedIntake) * this.mlParams.learningRate);
    } else if (feedback === 'too_little') {
      // Increase recommendation slightly
      this.mlParams.baseWeightFactor *= (1 + (Math.abs(error) / recommendedIntake) * this.mlParams.learningRate);
    }
    
    // Ensure parameters stay within reasonable bounds
    this.mlParams.baseWeightFactor = Math.max(25, Math.min(50, this.mlParams.baseWeightFactor));
  }
}