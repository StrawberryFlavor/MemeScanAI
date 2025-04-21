# Meme AI 分析测试框架

一个基于人工智能的加密货币Meme代币分析系统，专门用于实时评估和监控Meme代币的可靠性与投资风险。

## 项目背景

在与 hashkey 开发者的技术讨论中，获益颇深，试图利用 AI 技术解决新手小白在加密货币市场中 Meme 代币分析真伪识别和风险评估的问题。目前采用ChatGPT API进行深度分析，通过多维度指标对新发布的代币进行快速可靠性评估。

为验证AI分析的有效性，建立了 Mock 数据，可通过标识 isScam 来体现该 MEME 在当时实际的一个有效性，可以通过对比 GPT 返回的评估数据，来测试AI分析结果的有效性

在人人都是开发者的时代，此项目大部分代码利用 AI 生成，我是工具的使用者和受益者

## 核心功能

- **实时代币分析**：快速分析新发布的Meme代币，提供可靠性评分和风险评估
- **多维度指标**：考量持有人数量、流动性、价格变化、社交媒体热度等关键指标
- **风险预警**：识别异常模式和潜在风险因素，提供投资建议
- **性能测试**：评估不同并发级别下的系统响应能力
- **准确性评估**：通过已知样本对AI分析的准确性进行科学验证

## 技术架构

- **AI分析引擎**：基于LangChain和OpenAI API构建的分析链
- **数据处理层**：处理代币历史数据和实时数据
- **评估系统**：科学评估AI判断的准确性和性能
- **报告生成**：导出详细分析报告，支持JSON和CSV格式

## 项目结构

```
agentTest/
├── src/
│   ├── chains/          # AI分析链实现
│   ├── data/            # 历史数据和数据处理
│   ├── evaluators/      # 评估工具
│   ├── models/          # 数据模型和类型定义
│   ├── utils/           # 工具函数和辅助方法
│   ├── index.ts         # 测试入口文件
│   └── realtime-monitor.ts  # 实时监控入口
├── .env                 # 环境变量配置
├── package.json         # 项目配置
└── tsconfig.json        # TypeScript配置
```

## 安装指南

1. 克隆仓库
```bash
git clone https://github.com/StrawberryFlavor/agentTest.git
cd agentTest
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，添加您的OpenAI API密钥
```

## 使用方法

### 实时监控模式

实时分析新发布的Meme代币：

```bash
npm run monitor:realtime
```

### 准确性测试

评估AI在分析Meme代币可靠性方面的准确度：

```bash
npm run test:accuracy
```

### 性能测试

测试系统在高负载情况下的表现：

```bash
# 默认配置
npm run test:performance

# 自定义测试参数
npm run test:performance -- --samples=10 --concurrency=5
```

### 全面测试

运行所有测试套件：

```bash
npm run test:all
```

## 命令行参数

- `--test=<type>`: 测试类型 (accuracy/performance/all)
- `--samples=<n>`: 测试样本数量 (默认: 5)
- `--concurrency=<n>`: 并发请求数 (默认: 3)

## 测试报告

测试结果将保存为以下格式：

- **JSON报告**: `accuracy_test_results.json` 和 `performance_test_results.json`
- **CSV数据**: `accuracy_test_results.csv` 和 `performance_test_results.csv`

报告包含详细的准确性指标、性能数据和每个样本的分析结果。

## 后续开发计划

系统仍在持续开发中，计划增加以下功能：

1. 实时获取链上新池子信息和价格变化数据
2. 根据合约地址自动获取相关推特信息和社区活跃度
3. 建立智能资金地址和KOL地址数据库
4. 优化实时预警机制和通知系统

## 注意事项

该框架需要有效的OpenAI API密钥才能运行。API调用将产生费用，费用取决于您所使用的模型和测试数量。默认使用gpt-3.5-turbo模型以平衡性能和成本。

## 自定义数据

要添加自定义Meme代币测试数据，请编辑 `src/data/memeHistoryData.ts` 文件，按照现有格式添加更多代币记录。 