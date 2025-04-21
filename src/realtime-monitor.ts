import dotenv from 'dotenv';
import { MemeAnalyzerChain } from './chains/memeAnalyzerChain.js';
import { MemeData } from './models/memeTypes.js';

// 加载环境变量
dotenv.config();

// 获取OpenAI API密钥
const apiKey = process.env.OPENAI_API_KEY;

// 检查API密钥是否已设置
if (!apiKey) {
  console.error('错误: 未设置OPENAI_API_KEY环境变量。请在.env文件中添加您的API密钥。');
  process.exit(1);
}

/**
 * 实时分析单个meme代币
 */
export async function analyzeRealtimeMeme(memeData: MemeData) {
  const analyzer = new MemeAnalyzerChain(apiKey as string);
  
  console.log(`🔍 开始分析新代币: ${memeData.name} (${memeData.symbol})`);
  console.log(`📊 代币数据: 持有人数量=${memeData.holderCount}, 流动性=${memeData.liquidity}, 24h价格变化=${memeData.priceChange24h}%`);
  
  try {
    const startTime = Date.now();
    const analysis = await analyzer.analyzeMeme(memeData);
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ 分析完成 [${responseTime}ms]`);
    console.log(`📈 可靠性评分: ${analysis.reliabilityScore.toFixed(2)} (${analysis.recommendation})`);
    
    if (analysis.riskFactors.length > 0) {
      console.log(`⚠️ 风险因素:`);
      analysis.riskFactors.forEach(factor => console.log(`  - ${factor}`));
    }
    
    if (analysis.positiveFactors.length > 0) {
      console.log(`✅ 积极因素:`);
      analysis.positiveFactors.forEach(factor => console.log(`  - ${factor}`));
    }
    
    // 返回分析结果
    return {
      analysis,
      responseTime
    };
  } catch (error) {
    console.error(`❌ 分析失败:`, error);
    throw error;
  }
}

/**
 * 从命令行直接分析代币的入口点
 */
async function main() {
  // 示例代币数据，在实际使用时可以从API或参数获取
//   const exampleToken: MemeData = {
//     tokenAddress: "0x" + Math.random().toString(16).slice(2, 12),
//     name: "新Meme币",
//     symbol: "NMEME",
//     holderCount: 1250,
//     twitterMentions: 8500,
//     smartMoneyBuys: 15,
//     liquidity: 125000,
//     priceChange24h: 28.5,
//     isScam: false // 这个字段在实时分析中实际上不会用到
//   };
  
  console.log("🚀 Meme AI 实时监控工具");
  console.log("-------------------------------");
  
  // 分析代币
//   await analyzeRealtimeMeme(exampleToken);
}

// 如果直接运行此文件，则执行main函数
if (process.argv[1].endsWith('realtime-monitor.js') || process.argv[1].endsWith('realtime-monitor.ts')) {
  main().catch(console.error);
} 