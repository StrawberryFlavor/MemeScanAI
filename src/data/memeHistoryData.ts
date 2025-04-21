import { MemeData } from '../models/memeTypes.js';

// 示例历史数据
export const HISTORICAL_MEMES: MemeData[] = [
  {
    tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    name: "Pepe",
    symbol: "PEPE",
    creationDate: "2023-04-14",
    holderCount: 144500,
    twitterMentions: 47800,
    smartMoneyBuys: 230,
    liquidity: 12500000,
    priceChange24h: 5.2,
    marketCap: 485000000,
    isScam: false
  },
  {
    tokenAddress: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3",
    name: "Dogecoin",
    symbol: "DOGE",
    creationDate: "2013-12-06",
    holderCount: 4850000,
    twitterMentions: 125000,
    smartMoneyBuys: 1240,
    liquidity: 240000000,
    priceChange24h: -2.1,
    marketCap: 10500000000,
    isScam: false
  },
  {
    tokenAddress: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
    name: "Shiba Inu",
    symbol: "SHIB",
    creationDate: "2020-08-01",
    holderCount: 1240000,
    twitterMentions: 89000,
    smartMoneyBuys: 450,
    liquidity: 98000000,
    priceChange24h: 1.8,
    marketCap: 7200000000,
    isScam: false
  },
  {
    tokenAddress: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
    name: "HEX",
    symbol: "HEX",
    creationDate: "2019-12-02",
    holderCount: 240000,
    twitterMentions: 12000,
    smartMoneyBuys: 10,
    liquidity: 2500000,
    priceChange24h: -5.4,
    marketCap: 6800000000,
    isScam: true // 有争议的项目
  },
  {
    tokenAddress: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    name: "SAFE MOON",
    symbol: "SAFEMOON",
    creationDate: "2021-03-08",
    holderCount: 2900000,
    twitterMentions: 75000,
    smartMoneyBuys: 5,
    liquidity: 1800000,
    priceChange24h: -12.4,
    marketCap: 280000000,
    isScam: true // 有争议的项目
  },
  {
    tokenAddress: "0xf4d2888d29d722226fafa5d9b24f9164c092421e",
    name: "ScamToken",
    symbol: "SCAM",
    creationDate: "2023-06-12",
    holderCount: 250,
    twitterMentions: 12000, // 虚假热度
    smartMoneyBuys: 3,
    liquidity: 12000,
    priceChange24h: 145.8, // 异常高涨幅
    isScam: true
  },
  {
    tokenAddress: "0x74232704659ef37d08ce21d9c958917eb3ea2844",
    name: "MoonPump",
    symbol: "MPUMP",
    creationDate: "2023-01-05",
    holderCount: 580,
    twitterMentions: 35000, // 虚假热度
    smartMoneyBuys: 2,
    liquidity: 45000,
    priceChange24h: 87.3,
    isScam: true
  },
  {
    tokenAddress: "0xd78c475133731cd54dadcb430f7aa9f5a09af998",
    name: "Floki Inu",
    symbol: "FLOKI",
    creationDate: "2021-06-28",
    holderCount: 450000,
    twitterMentions: 42000,
    smartMoneyBuys: 180,
    liquidity: 28000000,
    priceChange24h: 3.1,
    marketCap: 1200000000,
    isScam: false
  },
  {
    tokenAddress: "0x4a080377f83d669d7bb83b3184a8a5e61b500608",
    name: "Wojak",
    symbol: "WOJAK",
    creationDate: "2022-11-14",
    holderCount: 15800,
    twitterMentions: 8900,
    smartMoneyBuys: 25,
    liquidity: 1200000,
    priceChange24h: 0.8,
    marketCap: 35000000,
    isScam: false
  },
  {
    tokenAddress: "0x8e3bcc334657560253b83f08331d85267316e08a",
    name: "ButtCoin",
    symbol: "BUTT",
    creationDate: "2022-04-01",
    holderCount: 7800,
    twitterMentions: 5600,
    smartMoneyBuys: 8,
    liquidity: 450000,
    priceChange24h: -2.3,
    marketCap: 12000000,
    isScam: false
  }
];

// 分类获取数据
export function getReliableMemes(): MemeData[] {
  return HISTORICAL_MEMES.filter(meme => !meme.isScam);
}

export function getScamMemes(): MemeData[] {
  return HISTORICAL_MEMES.filter(meme => meme.isScam);
}

// 获取随机样本进行测试
export function getRandomTestSet(count: number): MemeData[] {
  const shuffled = [...HISTORICAL_MEMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
} 