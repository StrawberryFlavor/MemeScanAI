import { MemeData, MemeAnalysisResult, TestResult, AggregateMetrics } from '../models/memeTypes.js';

export class AccuracyEvaluator {
  private results: Array<{
    meme: MemeData;
    analysis: MemeAnalysisResult;
    responseTime: number;
  }> = [];

  /**
   * 添加单个测试结果
   */
  addResult(meme: MemeData, analysis: MemeAnalysisResult, responseTime: number) {
    this.results.push({ meme, analysis, responseTime });
  }

  /**
   * 计算评估指标
   */
  calculateMetrics(): AggregateMetrics {
    if (this.results.length === 0) {
      throw new Error("没有评估结果");
    }

    // 计算响应时间
    const avgResponseTime = this.results.reduce(
      (sum, item) => sum + item.responseTime, 0
    ) / this.results.length;

    // 计算预测准确度
    let truePositives = 0; // 正确预测可靠的代币
    let falsePositives = 0; // 错误预测可靠的代币
    let trueNegatives = 0; // 正确预测不可靠的代币
    let falseNegatives = 0; // 错误预测不可靠的代币

    for (const { meme, analysis } of this.results) {
      // 根据reliabilityScore>0.5判断AI是否认为可靠
      const predictedReliable = analysis.reliabilityScore > 0.5;
      const actualReliable = !meme.isScam;

      if (predictedReliable && actualReliable) {
        truePositives++;
      } else if (predictedReliable && !actualReliable) {
        falsePositives++;
      } else if (!predictedReliable && !actualReliable) {
        trueNegatives++;
      } else if (!predictedReliable && actualReliable) {
        falseNegatives++;
      }
    }

    const accuracy = (truePositives + trueNegatives) / this.results.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * precision * recall / (precision + recall) || 0;
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      averageResponseTime: avgResponseTime,
      throughput: (this.results.length / (avgResponseTime * this.results.length / 1000)), // 每秒处理请求数
      successRate: 1.0, // 在这个评估器中都是成功的
    };
  }

  /**
   * 生成详细的评估报告
   */
  generateReport(): string {
    const metrics = this.calculateMetrics();
    
    return `
====== Meme AI 分析准确性测试报告 ======

测试样本数: ${this.results.length}

准确性指标:
- 准确率: ${(metrics.accuracy * 100).toFixed(2)}%
- 精确率: ${(metrics.precision * 100).toFixed(2)}%
- 召回率: ${(metrics.recall * 100).toFixed(2)}%
- F1分数: ${(metrics.f1Score * 100).toFixed(2)}%

性能指标:
- 平均响应时间: ${metrics.averageResponseTime.toFixed(2)}ms
- 吞吐量: ${metrics.throughput.toFixed(2)} 请求/秒

详细结果:
${this.results.map(({ meme, analysis }) => 
  `* ${meme.name} (${meme.symbol})
   - 实际状态: ${meme.isScam ? '不可靠' : '可靠'}
   - AI评分: ${analysis.reliabilityScore.toFixed(2)}
   - AI建议: ${analysis.recommendation}
   - 评估: ${this.evaluateResult(meme, analysis)}`
).join('\n\n')}
`;
  }

  /**
   * 转换为结构化测试结果数组
   */
  getTestResults(): TestResult[] {
    return this.results.map(({ meme, analysis, responseTime }) => ({
      sampleId: meme.tokenAddress,
      actualLabel: !meme.isScam,
      predictedScore: analysis.reliabilityScore,
      responseTime,
      success: true
    }));
  }

  /**
   * 评估单个结果
   */
  private evaluateResult(meme: MemeData, analysis: MemeAnalysisResult): string {
    const predictedReliable = analysis.reliabilityScore > 0.5;
    const actualReliable = !meme.isScam;
    
    if (predictedReliable === actualReliable) {
      return '✓ 正确判断';
    } else {
      return '✗ 判断错误';
    }
  }
} 