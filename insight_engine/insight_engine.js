export default class EmissionSentimentAnalyzer {
  constructor() {
    // No need for natural library dependencies
  }

  analyzeUserPerformance(userStats, recentLogs = []) {
    const { totalCo2Saved, activityCount, averageCo2PerActivity } = userStats;

    // Calculate performance scores (0-100)
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
      suggestions.push(
        "Try to log at least 2-3 activities per week to build better habits."
      );
    }

    if (impactScore < 50) {
      suggestions.push(
        "Focus on high-impact activities like biking to work or reducing meat consumption."
      );
    }

    if (consistencyScore < 60) {
      suggestions.push(
        "Consistency is key! Try to make sustainable activities part of your daily routine."
      );
    }

    if (overallScore >= 70) {
      suggestions.push(
        "Great job! Consider mentoring others or setting more ambitious goals."
      );
    }

    return suggestions.length > 0
      ? suggestions
      : ["Keep up the good work! You're doing great."];
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

    const messages = {
      excellent: [
        "🌟 Outstanding! You're a sustainability superstar!",
        "🔥 Amazing work! You're making a significant environmental impact!",
        "✅ Perfect! You've mastered sustainable living habits!",
      ],
      good: [
        "👍 Great job! You're well on your way to sustainability mastery!",
        "📈 Solid progress! Your consistent efforts are paying off!",
        "💚 Well done! You're making a positive difference every day!",
      ],
      average: [
        "📊 Good start! Every small action contributes to bigger change!",
        "🌱 You're building great habits! Try to be more consistent.",
        "🔄 Keep going! Sustainability is a journey of continuous improvement.",
      ],
      beginner: [
        "👋 Welcome to your sustainability journey! Every step counts!",
        "🚀 Ready to start? Pick one sustainable habit to focus on this week!",
        "💡 Beginner's mind! You have a great opportunity to build lasting habits!",
      ],
    };

    const randomMessage =
      messages[category][Math.floor(Math.random() * messages[category].length)];

    return {
      message: randomMessage,
      suggestions,
      score: Math.round(overallScore),
      category,
    };
  }
}
