# 什么是多链合约？

CosmWasm 从头开始​​设计和构建，旨在成为智能合约的多链解决方案.
由于它来自 Cosmos 生态系统，因此它专为网络设计也就不足为奇了
区块链，而不是传统的区块链孤岛.但是我们所说的多链究竟是什么意思？

## 不同的链，相同的合约

由于我们对宿主应用程序的要求很少，因此任何 Cosmos SDK 应用程序都很容易
嵌入 `wasm` 模块并根据需要自定义许可或费用.所有代码
被设计为与底层链的细节无关，所以只需编写一个
CosmWasm 合约，你很快就能在 Cosmos 生态系统的许多不同链上运行.

[Regen Network](https://regen.network) 计划在启动时包含 CosmWasm 支持.许多其他连锁店正在考虑添加这种支持.

## 区块链间合约

如果你听说过 Cosmos，那很可能是关于【区块链间通信】(https://cosmos.network/ibc/). [Tendermint BFT 共识](https://tendermint.com) 的力量和他们的[新型保税权益证明算法](https://blog.cosmos.network/what-does-the-launch-of-cosmos- mean-for-the-blockchain-ecosystem-952e14f67d0d)只是他们启用革命性协议以允许在区块链之间进行无信任消息传递语义的基础.没有中间人，没有时间问题，完全安全.

潜在意味着一条链上的代码可以在另一条链上执行交易.但是代码必须围绕这样的消息传递习语来设计. CosmWasm 完全包含 [演员模型](./actor)，因此自然适用于此类 IBC.触发并忘记消息，而不是等待承诺并担心竞争条件和可重入攻击.随着 IBC 的稳定，我们将对 IBC 原语的一流支持添加到 [CosmWasm](https://github.com/CosmWasm/cosmwasm) 库以及 [Cosmos SDK 模块](https://github.com) 中. com/CosmWasm/wasmd/tree/master/x/wasm) 托管它.

## 易于集成

CosmWasm 的另一个设计目标是更像是一个库而不是一个框架.这意味着它所需 API 的表面积很小，您可以选择加入大部分代码.它可以让您的生活变得轻松，但您也可以轻松地按照自己的方式构建它.这有两大好处:

首先是它可以更容易地添加对多种语言的支持来编写合约.因此我们可以添加对 [AssemblyScript](https://docs.assemblyscript.org/) 或 [Go](https:/ /github.com/tinygo-org/tinygo)，适合那些不喜欢用 Rust 编写的人.

第二个好处是，由于它对主机系统的要求有限，因此可以嵌入到其他框架中，而不仅仅是 Cosmos SDK.核心运行时逻辑 [`cosmwasm-vm`](https://github.com/CosmWasm/cosmwasm/tree/master/lib/vm) 在 Rust 中，[`go-cosmwasm`](https://github .com/CosmWasm/go-cosmwasm)提供了一个通用的 Go 绑定.由于 Go 和 Rust 是编写区块链最流行的两种语言，这为许多集成打开了大门.当然，除非你的链运行在 [Tendermint](https://tendermint.com) 或潜在的另一个 BFT Instant Finality Consensus 算法如 [Babble](https://babble.io/) 之上，否则合约不会能够参加IBC.

## 构建平台

CosmWasm 不想将你锁定在一种区块链，甚至一种编程语言中.它旨在适应多种环境，并*连接*区块链.这使它成为一个坚实的平台.即使一条链发展得不好，您所有的智能合约和 dApp 也可以迅速转移到另一条链上.或者，如果您的应用程序增长迅速，您可以启动自己的链来部署下一版本的合约，并通过 IBC 将所有现有代币转移到您的新链上.可能性仅受您的想象力的限制.
