export interface MemeData {
  tokenAddress: string;
  name: string;
  symbol: string;
  creationDate?: string; // 设为可选字段，实时监控时可能不需要
  holderCount: number;
  twitterMentions: number;
  smartMoneyBuys: number;
  liquidity: number;
  priceChange24h: number;
  marketCap?: number;
  isScam: boolean; // 历史验证的结果
}

export interface MemeAnalysisResult {
  tokenAddress: string;
  name: string;
  reliabilityScore: number; // 0-1, 越高越可靠
  recommendation: "强烈推荐" | "推荐" | "中性" | "不推荐" | "强烈不推荐";
  riskFactors: string[];
  positiveFactors: string[];
  confidence: number; // AI的置信度
}

export interface TestResult {
  sampleId: string;
  actualLabel: boolean; // 实际是否为可靠代币
  predictedScore: number; // AI预测的可靠性分数
  responseTime: number; // 毫秒
  success: boolean; // 是否成功完成分析
  error?: string; // 如果分析失败，错误信息
}

export interface AggregateMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  averageResponseTime: number;
  throughput: number; // 每秒处理请求数
  successRate: number; // 成功率
} 