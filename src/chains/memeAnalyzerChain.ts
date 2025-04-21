import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { MemeData, MemeAnalysisResult } from "../models/memeTypes.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class MemeAnalyzerChain {
  private model: ChatOpenAI;
  private chain: RunnableSequence;

  constructor(apiKey: string) {
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",  // 使用ChatGPT模型
      temperature: 0
    });

    const template = `你是一个专业的加密货币Meme代币分析专家，专注于实时监控和快速分析新发布的代币。请分析以下Meme代币信息，并给出可靠性评估：

代币地址: {tokenAddress}
名称: {name}
符号: {symbol}
持有人数量: {holderCount}
推特提及次数: {twitterMentions}
聪明资金买入次数: {smartMoneyBuys}
流动性(USD): {liquidity}
24小时价格变化(%): {priceChange24h}

请基于以上信息，快速评估该代币的可靠性和投资建议，重点关注风险指标和异常模式。
回答必须是严格的JSON格式，包含以下字段：
- tokenAddress: 代币地址
- name: 代币名称
- reliabilityScore: 可靠性分数(0-1，越高越可靠)
- recommendation: 投资建议("强烈推荐"、"推荐"、"中性"、"不推荐"、"强烈不推荐")
- riskFactors: 风险因素数组
- positiveFactors: 积极因素数组
- confidence: 你对分析的置信度(0-1)

仅返回JSON格式，不要有其他文字。`;

    const prompt = PromptTemplate.fromTemplate(template);
    const outputParser = new StringOutputParser();

    // 使用新的RunnableSequence替代弃用的LLMChain
    this.chain = RunnableSequence.from([
      prompt,
      this.model,
      outputParser
    ]);
  }

  async analyzeMeme(meme: MemeData): Promise<MemeAnalysisResult> {
    const startTime = Date.now();
    
    try {
      console.log(`开始分析[${meme.name}]...`);
      
      // 使用新的调用方式
      const result = await this.chain.invoke({
        tokenAddress: meme.tokenAddress,
        name: meme.name,
        symbol: meme.symbol,
        holderCount: meme.holderCount,
        twitterMentions: meme.twitterMentions,
        smartMoneyBuys: meme.smartMoneyBuys,
        liquidity: meme.liquidity,
        priceChange24h: meme.priceChange24h
      });

      const responseTime = Date.now() - startTime;
      console.log(`分析完成[${meme.name}]，响应时间: ${responseTime}ms`);
      
      // 解析JSON结果
      const analysisResult = JSON.parse(result) as MemeAnalysisResult;
      return analysisResult;
    } catch (error) {
      console.error(`分析代币时出错: ${meme.name}`, error);
      throw error;
    }
  }
} 