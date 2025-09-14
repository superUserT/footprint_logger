import {
  suggestionsKey,
  personalisedMessages,
} from "./utils/helper_objects.js";

export default class EmissionSentimentAnalyzer {
  constructor() {}

  analyzeUserPerformance(userStats, recentLogs = []) {
    const { totalCo2Saved, activityCount, averageCo2PerActivity } = userStats;

    const frequencyScore = this.calculateFrequencyScore(activityCount);
    const impactScore = this.calculateImpactScore(totalCo2Saved);
    const consistencyScore = this.calculateConsistencyScore(recentLogs);

    const overallScore = (frequencyScore + impactScore + consistencyScore) / 3;

    return {
      overallScore,
      frequencyScore,
      impactScore,
      consistencyScore,
      category: this.categorizePerformance(overallScore),
      suggestions: this.generateSuggestions(
        overallScore,
        frequencyScore,
        impactScore,
        consistencyScore
      ),
    };
  }

  calculateFrequencyScore(activityCount) {
    const activitiesPerWeek = activityCount / 4;
    return Math.min(100, (activitiesPerWeek / 5) * 100);
  }

  calculateImpactScore(totalCo2Saved) {
    return Math.min(100, (totalCo2Saved / 50) * 100);
  }

  calculateConsistencyScore(recentLogs) {
    if (recentLogs.length < 3) return 50;
    const lastWeekLogs = recentLogs.filter(
      (log) =>
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    return (lastWeekLogs.length / 7) * 100;
  }

  categorizePerformance(score) {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";
    return "beginner";
  }

  generateSuggestions(
    overallScore,
    frequencyScore,
    impactScore,
    consistencyScore
  ) {
    const suggestions = [];

    if (frequencyScore < 40) {
      suggestions.push(suggestionsKey.lessThan40);
    }

    if (impactScore < 50) {
      suggestions.push(suggestionsKey.lessThan50);
    }

    if (consistencyScore < 60) {
      suggestions.push(suggestions.lessThan60);
    }

    if (overallScore >= 70) {
      suggestions.push(suggestionsKey.greaterThan70);
    }

    return suggestions.length > 0
      ? suggestions
      : [suggestionsKey.defaultSuggestion];
  }

  analyzeSentiment(text) {
    const positiveWords = [
      "great",
      "excellent",
      "amazing",
      "good",
      "wonderful",
      "fantastic",
      "awesome",
      "perfect",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "worse",
      "poor",
      "disappointing",
    ];

    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    return positiveCount - negativeCount;
  }

  generatePersonalizedMessage(analysis) {
    const { category, overallScore, suggestions } = analysis;

    const randomMessage =
      personalisedMessages[category][
        Math.floor(Math.random() * personalisedMessages[category].length)
      ];

    return {
      message: randomMessage,
      suggestions,
      score: Math.round(overallScore),
      category,
    };
  }
}
