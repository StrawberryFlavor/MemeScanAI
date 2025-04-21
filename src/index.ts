import dotenv from 'dotenv';
import { parseArgs } from 'node:util';
import { MemeAnalyzerChain } from './chains/memeAnalyzerChain.js';
import { AccuracyEvaluator } from './evaluators/accuracyEvaluator.js';
import { PerformanceTester } from './evaluators/performanceTest.js';
import { getRandomTestSet, getReliableMemes, getScamMemes } from './data/memeHistoryData.js';
import { saveResultsToFile, saveResultsToCsv } from './utils/metrics.js';

// 加载环境变量
dotenv.config();

// 解析命令行参数
const { values } = parseArgs({
  options: {
    test: { type: 'string', short: 't', default: 'all' },
    samples: { type: 'string', short: 's', default: '5' },
    concurrency: { type: 'string', short: 'c', default: '3' }
  }
});

// 获取OpenAI API密钥
const apiKey = process.env.OPENAI_API_KEY;
const testType = values.test;
const sampleCount = parseInt(values.samples as string, 10);
const concurrencyLevel = parseInt(values.concurrency as string, 10);

// 检查API密钥是否已设置
if (!apiKey) {
  console.error('错误: 未设置OPENAI_API_KEY环境变量。请在.env文件中添加您的API密钥。');
  process.exit(1);
}

console.log('使用OpenAI ChatGPT API进行测试');

/**
 * 运行准确性测试
 */
async function runAccuracyTest() {
  // 已经在上面检查过apiKey是否存在，这里可以断言它一定存在
  const chain = new MemeAnalyzerChain(apiKey as string);
  const evaluator = new AccuracyEvaluator();
  
  console.log('\n======= 开始准确性测试 =======');
  
  // 从已知数据中选择测试样本
  const reliableSamples = getReliableMemes().slice(0, 3);
  const scamSamples = getScamMemes().slice(0, 2);
  const testSamples = [...reliableSamples, ...scamSamples];
  
  console.log(`将使用真实OpenAI API分析${testSamples.length}个样本`);
  
  // 执行分析和评估
  for (const meme of testSamples) {
    console.log(`分析: ${meme.name} (${meme.symbol})`);
    try {
      const startTime = Date.now();
      // 调用ChatGPT分析接口
      const analysis = await chain.analyzeMeme(meme);
      
      const responseTime = Date.now() - startTime;
      evaluator.addResult(meme, analysis, responseTime);
    } catch (error) {
      console.error(`分析失败: ${meme.name}`, error);
    }
  }
  
  // 生成并显示报告
  const report = evaluator.generateReport();
  console.log(report);
  
  // 保存结果
  const testResults = evaluator.getTestResults();
  saveResultsToFile({
    metrics: evaluator.calculateMetrics(),
    results: testResults
  }, 'accuracy_test_results.json');
  
  saveResultsToCsv(testResults, 'accuracy_test_results.csv');
}

/**
 * 运行性能测试
 */
async function runPerformanceTest() {
  console.log('\n======= 开始性能测试 =======');
  
  // 已经在上面检查过apiKey是否存在，这里可以断言它一定存在
  const performanceTester = new PerformanceTester(apiKey as string);
  
  // 选择测试样本
  const testSamples = getRandomTestSet(sampleCount);
  
  console.log(`将使用真实OpenAI API测试${testSamples.length}个样本的性能，并发度: ${concurrencyLevel}`);
  console.log('注意: 这将消耗API配额并产生费用');
  
  // 执行负载测试
  const result = await performanceTester.runLoadTest(
    testSamples,
    concurrencyLevel,
    1 // 每个样本重复一次
  );
  
  // 显示报告
  console.log(performanceTester.printPerformanceReport(result));
  
  // 保存结果
  saveResultsToFile({
    performanceMetrics: {
      concurrencyLevel: result.concurrencyLevel,
      totalRequests: result.totalRequests,
      successfulRequests: result.successfulRequests,
      failedRequests: result.failedRequests,
      totalDuration: result.totalDuration,
      averageResponseTime: result.averageResponseTime,
      requestsPerSecond: result.requestsPerSecond
    },
    aggregateMetrics: performanceTester.calculateAggregateMetrics(result),
    results: result.results
  }, 'performance_test_results.json');
  
  saveResultsToCsv(result.results, 'performance_test_results.csv');
}

/**
 * 主函数
 */
async function main() {
  console.log('=== Meme AI 评估工具 ===');
  console.log(`使用模型: gpt-3.5-turbo (ChatGPT)`);
  console.log(`样本数: ${sampleCount}`);
  console.log(`并发级别: ${concurrencyLevel}`);
  
  try {
    if (testType === 'accuracy' || testType === 'all') {
      await runAccuracyTest();
    }
    
    if (testType === 'performance' || testType === 'all') {
      await runPerformanceTest();
    }
    
    console.log('\n所有测试已完成！');
  } catch (error) {
    console.error('测试执行失败:', error);
  }
}

// 执行主函数
main().catch(console.error); 