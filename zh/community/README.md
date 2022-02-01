# 名人堂

_ ** 在这里，我们向您展示 CosmWasm 名人堂!感谢贡献者为制作这些惊人的项目所做的努力!** _
让我们给他们应有的知名度和名望:

## NFT Marketplace by BlockScape

文章:[https://devpost.com/software/nft-marketplace](https://devpost.com/software/nft-marketplace)

在伽利略奖中获得**第一名**(使用 Cosmos SDK 和 Tendermint 的最具创意的 dAppchain，可以选择使用 IBC)和古灵阁奖中的第三名.
![](../../.vuepress/public/assets/nft_marketplace.jpeg)
NFT 市场提供了一个通用平台，用于使用 CW20 代币买卖 CW721 代币.人们可以出售他们的代币并从其他卖家那里购买代币.
我们已经看到了两个账户之间交易 NFT 的几个示例实现，但所有这些都是基于每个合约的.这意味着对于每笔交易，都有一个单独的合同，这使得很难知道哪些代币实际上正在出售以及使用了哪些代币.这使我们想到提供一个中心位置来出售代币，以最大限度地提高代币销售的可见性.
该项目通过使用3个部署在链上的合约，很好地演示了CosmWasm合约交互.您可以在此处查看团队如何实施自定义 cw721 合同.该团队通过开发打字稿助手客户端为 NFT 合约做出了贡献.此外，该项目还集成了 Keplr 钱包.

演示:[https://hackatom.blockscape.network/home](https://hackatom.blockscape.network/home)

回购:[https://github.com/BlockscapeNetwork/hackatom_v](https://github.com/BlockscapeNetwork/hackatom_v)

## 回扣账户

文章:[https://devpost.com/software/clawback-account-in-cosmwasm](https://devpost.com/software/clawback-account-in-cosmwasm)

获得**盖亚奖第一名**(Cosmos Hub 最佳上市项目)
受比特币保险库的启发.
这个项目的代码质量是一流的.非常广泛的合同单元测试证明了这一点.
这是原生代币和 CW20 代币“回扣”的原型合约代码.回拨的工作原理如下:
有一个“持有人”密钥/帐户、一个“备份”密钥/帐户和一个“回拨期”(决定回拨何时到期).
在一个“回扣期”内，“持有人”可以转让给“持有人”/其他回扣(前提是他们的条款与传出合同匹配:他们有相同的“回扣”，“回扣期”至少一样长，他们支持相同的令牌)或刷新回拨持续时间.回扣期结束后，“持有人”可以收回代币.
在“回扣期”内，“备份”可以转移给另一个持有人，刷新回扣期限或销毁代币/销毁合约.

演示文稿:[https://docs.google.com/presentation/d/13aEcVFhjQFKo9bGjHe0V9HiHnqbM7eGSHbDB27Psa24/edit?usp=sharing](https://docs.google.com/presentation/d/13aEcVFhjQFKo97bHjp2HjpHypSharing)

回购:[https://github.com/tomtau/hackatom](https://docs.google.com/presentation/d/13aEcVFhjQFKo9bGjHe0V9HiHnqbM7eGSHbDB27Psa24/edit?usp=sharing)

## 随机信标

文章:[https://medium.com/confio/when-your-blockchain-needs-to-roll-the-dice-ed9da121f590](https://medium.com/confio/when-your-blockchain-needs-掷骰子 ed9da121f590)

Simon Warta 的分布式随机数生成器.

在 drand，随机信标通过 HTTP、Gossipsub、Tor 或 Twitter 分发.区块链无法直接访问此类网络资源.但是，我们可以创建一个 CosmWasm 智能合约，允许在链上存储随机信标.使用跨合约查询，其他合约可以读取这些随机值并在其逻辑中使用它们.

回购:[https://github.com/confio/rand](https://github.com/confio/rand)

## 智子

文章:[https://devpost.com/software/sophon](https://devpost.com/software/sophon)

**获得盖亚奖第三名.**
正如以太坊上的 [yearn.finance](https://yearn.finance/) 可以优化 DeFi 的操作一样，团队认为 CosmWasm 上的智能合约可以优化 Staking 的操作.
当资金存入合约时，它会将资金委托给每个重新委托利率最高的验证者.

回购:[https://github.com/Ninja-Chain/sophon](https://github.com/Ninja-Chain/sophon)
