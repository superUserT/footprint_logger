import EmissionSentimentAnalyzer from "../../insight_engine.js";

describe("EmissionSentimentAnalyzer", () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new EmissionSentimentAnalyzer();
  });

  it("should create an instance of EmissionSentimentAnalyzer", () => {
    expect(analyzer).toBeDefined();
    expect(analyzer instanceof EmissionSentimentAnalyzer).toBeTrue();
  });

  describe("calculateFrequencyScore", () => {
    it("should return 100 when activityCount is high", () => {
      expect(analyzer.calculateFrequencyScore(40)).toBe(100);
    });

    it("should return proportional score for moderate activity", () => {
      expect(analyzer.calculateFrequencyScore(20)).toBeCloseTo(100); // 20/4=5 → (5/5)*100
    });

    it("should return lower scores for low activity", () => {
      expect(analyzer.calculateFrequencyScore(4)).toBeCloseTo(20);
    });
  });

  describe("calculateImpactScore", () => {
    it("should cap the score at 100 for high CO₂ savings", () => {
      expect(analyzer.calculateImpactScore(1000)).toBe(100);
    });

    it("should return proportional score for moderate CO₂ savings", () => {
      expect(analyzer.calculateImpactScore(25)).toBeCloseTo(50);
    });
  });

  describe("calculateConsistencyScore", () => {
    it("should return 50 if fewer than 3 logs exist", () => {
      expect(analyzer.calculateConsistencyScore([{ date: new Date() }])).toBe(
        50
      );
    });

    it("should calculate based on logs in the last week", () => {
      const logs = [
        { date: new Date().toISOString() },
        { date: new Date().toISOString() },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }, // 10 days ago
      ];
      const result = analyzer.calculateConsistencyScore(logs);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe("categorizePerformance", () => {
    it("should categorize as excellent when score >= 80", () => {
      expect(analyzer.categorizePerformance(85)).toBe("excellent");
    });

    it("should categorize as average when score is around 50", () => {
      expect(analyzer.categorizePerformance(55)).toBe("average");
    });

    it("should categorize as poor when score is low", () => {
      expect(analyzer.categorizePerformance(20)).toBe("beginner");
    });
  });

  describe("analyzeUserPerformance", () => {
    it("should return an object with overall score and breakdown", () => {
      const userStats = {
        totalCo2Saved: 50,
        activityCount: 20,
        averageCo2PerActivity: 2.5,
      };
      const logs = [
        { date: new Date().toISOString() },
        { date: new Date().toISOString() },
        { date: new Date().toISOString() },
      ];

      const result = analyzer.analyzeUserPerformance(userStats, logs);

      expect(result).toEqual(
        jasmine.objectContaining({
          overallScore: jasmine.any(Number),
          frequencyScore: jasmine.any(Number),
          impactScore: jasmine.any(Number),
          consistencyScore: jasmine.any(Number),
          category: jasmine.any(String),
          suggestions: jasmine.any(Array),
        })
      );
    });
  });
});
