import pLimit from 'p-limit';
import { MemeAnalyzerChain } from '../chains/memeAnalyzerChain.js';
import { MemeData, TestResult, AggregateMetrics } from '../models/memeTypes.js';

interface PerformanceTestResult {
  concurrencyLevel: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDuration: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  results: TestResult[];
}

export class PerformanceTester {
  private chain: MemeAnalyzerChain;
  
  constructor(apiKey: string) {
    this.chain = new MemeAnalyzerChain(apiKey);
  }
  
  /**
   * 运行负载测试
   * @param memes 测试数据集
   * @param concurrencyLevel 并发级别
   * @param repeatCount 每个样本重复次数
   */
  async runLoadTest(
    memes: MemeData[], 
    concurrencyLevel: number = 5,
    repeatCount: number = 1
  ): Promise<PerformanceTestResult> {
    // 创建测试请求数组，可能包含重复项
    const testMemes: MemeData[] = [];
    for (let i = 0; i < repeatCount; i++) {
      testMemes.push(...memes);
    }
    
    console.log(`开始性能测试: ${testMemes.length}个请求, 并发度: ${concurrencyLevel}`);
    
    const limit = pLimit(concurrencyLevel);
    const startTime = Date.now();
    
    // 收集响应时间和测试结果
    const responseTimes: number[] = [];
    const testResults: TestResult[] = [];
    let successCount = 0;
    let failCount = 0;
    
    // 并发执行请求
    const promises = testMemes.map((meme) => {
      return limit(async () => {
        const requestStart = Date.now();
        try {
          // 分析Meme代币
          const analysis = await this.chain.analyzeMeme(meme);
            
          const responseTime = Date.now() - requestStart;
          responseTimes.push(responseTime);
          successCount++;
          
          // 记录测试结果
          testResults.push({
            sampleId: meme.tokenAddress,
            actualLabel: !meme.isScam,
            predictedScore: analysis.reliabilityScore,
            responseTime,
            success: true
          });
          
          return { success: true, responseTime };
        } catch (error) {
          failCount++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          // 记录失败的测试结果
          testResults.push({
            sampleId: meme.tokenAddress,
            actualLabel: !meme.isScam,
            predictedScore: 0,
            responseTime: Date.now() - requestStart,
            success: false,
            error: errorMsg
          });
          
          return { success: false, error };
        }
      });
    });
    
    await Promise.all(promises);
    const totalDuration = Date.now() - startTime;
    
    // 计算统计指标
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;
      
    const minResponseTime = responseTimes.length > 0 
      ? Math.min(...responseTimes) 
      : 0;
      
    const maxResponseTime = responseTimes.length > 0 
      ? Math.max(...responseTimes) 
      : 0;
      
    const requestsPerSecond = (successCount / totalDuration) * 1000;
    
    return {
      concurrencyLevel,
      totalRequests: testMemes.length,
      successfulRequests: successCount,
      failedRequests: failCount,
      totalDuration,
      averageResponseTime: avgResponseTime,
      minResponseTime,
      maxResponseTime,
      requestsPerSecond,
      results: testResults
    };
  }
  
  /**
   * 计算聚合指标
   */
  calculateAggregateMetrics(result: PerformanceTestResult): AggregateMetrics {
    // 从成功的请求中计算准确性指标
    const successfulResults = result.results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      throw new Error("没有成功的测试结果");
    }
    
    // 计算预测准确度
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    for (const r of successfulResults) {
      const predictedReliable = r.predictedScore > 0.5;
      const actualReliable = r.actualLabel;

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

    const accuracy = (truePositives + trueNegatives) / successfulResults.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * precision * recall / (precision + recall) || 0;
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      averageResponseTime: result.averageResponseTime,
      throughput: result.requestsPerSecond,
      successRate: result.successfulRequests / result.totalRequests
    };
  }
  
  /**
   * 打印性能测试报告
   */
  printPerformanceReport(result: PerformanceTestResult): string {
    const metrics = this.calculateAggregateMetrics(result);
    
    return `
====== 性能测试报告 ======

并发级别: ${result.concurrencyLevel}
总请求数: ${result.totalRequests}
成功请求: ${result.successfulRequests}
失败请求: ${result.failedRequests}
总执行时间: ${result.totalDuration}ms (${(result.totalDuration/1000).toFixed(2)}秒)

响应时间:
- 平均: ${result.averageResponseTime.toFixed(2)}ms
- 最小: ${result.minResponseTime}ms
- 最大: ${result.maxResponseTime}ms

性能指标:
- 吞吐量: ${result.requestsPerSecond.toFixed(2)} 请求/秒
- 成功率: ${(metrics.successRate * 100).toFixed(2)}%

准确性指标:
- 准确率: ${(metrics.accuracy * 100).toFixed(2)}%
- 精确率: ${(metrics.precision * 100).toFixed(2)}%
- 召回率: ${(metrics.recall * 100).toFixed(2)}%
- F1分数: ${(metrics.f1Score * 100).toFixed(2)}%
`;
  }
} 