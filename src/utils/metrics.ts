import { TestResult, AggregateMetrics } from '../models/memeTypes.js';
import fs from 'fs';

/**
 * 保存测试结果到JSON文件
 */
export function saveResultsToFile(
  results: any, 
  filepath: string
): void {
  const data = JSON.stringify(results, null, 2);
  fs.writeFileSync(filepath, data);
  console.log(`结果已保存到 ${filepath}`);
}

/**
 * 将测试结果转换为CSV格式
 */
export function convertToCsv(
  results: TestResult[]
): string {
  // CSV头部
  const headers = ['sampleId', 'actualLabel', 'predictedScore', 'responseTime', 'success', 'error'];
  const csvRows = [headers.join(',')];
  
  // 添加每行数据
  for (const result of results) {
    const row = [
      result.sampleId,
      result.actualLabel.toString(),
      result.predictedScore.toString(),
      result.responseTime.toString(),
      result.success.toString(),
      result.error || ''
    ];
    
    // 处理CSV特殊字符
    const csvRow = row.map(cell => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    
    csvRows.push(csvRow.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * 将测试结果保存为CSV文件
 */
export function saveResultsToCsv(
  results: TestResult[], 
  filepath: string
): void {
  const csvContent = convertToCsv(results);
  fs.writeFileSync(filepath, csvContent);
  console.log(`CSV结果已保存到 ${filepath}`);
}

/**
 * 格式化指标为人类可读的文本
 */
export function formatMetrics(metrics: AggregateMetrics): string {
  return `
准确性指标:
- 准确率: ${(metrics.accuracy * 100).toFixed(2)}%
- 精确率: ${(metrics.precision * 100).toFixed(2)}%
- 召回率: ${(metrics.recall * 100).toFixed(2)}%
- F1分数: ${(metrics.f1Score * 100).toFixed(2)}%

性能指标:
- 平均响应时间: ${metrics.averageResponseTime.toFixed(2)}ms
- 吞吐量: ${metrics.throughput.toFixed(2)} 请求/秒
- 成功率: ${(metrics.successRate * 100).toFixed(2)}%
`;
} 