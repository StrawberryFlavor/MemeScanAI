import { MemeAnalyzerChain } from '../../src/chains/memeAnalyzerChain.js';
import { MemeData } from '../../src/models/memeTypes.js';

// 模拟模型依赖
jest.mock('@langchain/openai', () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue(`{
          "tokenAddress": "0x123456789",
          "name": "测试币",
          "reliabilityScore": 0.7,
          "riskFactors": ["流动性较低", "社区活跃度不高"],
          "positiveFactors": ["代币具有明确用途", "开发团队透明"],
          "recommendation": "中性",
          "confidence": 0.8
        }`)
      };
    })
  };
});

describe('MemeAnalyzerChain', () => {
  let analyzerChain: MemeAnalyzerChain;
  
  beforeEach(() => {
    analyzerChain = new MemeAnalyzerChain("mock-api-key");
  });
  
  test('应正确分析Meme代币', async () => {
    // 准备测试数据
    const memeData: MemeData = {
      tokenAddress: "0x123456789",
      name: '测试币',
      symbol: 'TEST',
      holderCount: 500,
      twitterMentions: 300,
      smartMoneyBuys: 10,
      liquidity: 100000,
      priceChange24h: 5.2,
      marketCap: 1000000,
      isScam: false
    };
    
    // 执行分析
    const result = await analyzerChain.analyzeMeme(memeData);
    
    // 验证结果
    expect(result).toBeDefined();
    expect(result.reliabilityScore).toBe(0.7);
    expect(result.riskFactors).toBeInstanceOf(Array);
    expect(result.riskFactors).toContain('流动性较低');
    expect(result.positiveFactors).toBeInstanceOf(Array);
    expect(result.positiveFactors).toContain('代币具有明确用途');
    expect(result.recommendation).toBe('中性');
  });
  
  test('应处理没有可选字段的Meme数据', async () => {
    // 准备最小化的测试数据（只有必需字段）
    const minimalMemeData: MemeData = {
      tokenAddress: "0x987654321",
      name: '简测币',
      symbol: 'STEST',
      holderCount: 200,
      twitterMentions: 50,
      smartMoneyBuys: 3,
      liquidity: 25000,
      priceChange24h: -2.3,
      isScam: false
    };
    
    // 执行分析
    const result = await analyzerChain.analyzeMeme(minimalMemeData);
    
    // 验证结果
    expect(result).toBeDefined();
    expect(result.reliabilityScore).toBe(0.7); // 来自模拟
    expect(result.recommendation).toBe('中性'); // 来自模拟
  });
}); 