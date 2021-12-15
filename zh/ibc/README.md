# IBC 和 CosmWasm

区块链间通信协议([IBC](https://ibcprotocol.org/))是一个端到端的、面向连接的、
用于在排列的异构区块链之间进行可靠、有序和经过身份验证的通信的有状态协议
在未知的动态拓扑中。该协议通过指定一组数据结构、抽象、
只要满足一小组要求，任何分布式账本都可以实现语义和语义。

:::小费
有关 IBC 的内部工作原理，请前往 [cosmos/ics](https://github.com/cosmos/ics) 规范和
从 [ics1](https://github.com/cosmos/ics/tree/master/spec/ics-001-ics-standard) 开始阅读。
:::

CosmWasm 支持 IBC 协议**开箱即用**，并在上面增加了智能合约的功能。
CosmWasm 依赖于 **Dynamic IBC** 协议，它不同于
【跨链标准】(https://github.com/cosmos/ics#ibcapp)(目前是ics20和跨链账户)。
该术语是由 [Agoric](https://medium.com/agoric/the-road-to-dynamic-ibc-4a43bc964bca) 创造和提出的，并且
通信协议和方案由合同定义。合同应规定在执行期间采取的行动
IBC 握手。

## 指数

* [Relayer](02-relayer.md) 部分解释了 IBC 的中继组件并演示了如何设置一个用于
  连接启用 CosmWasm 的链。

* [Active IBC Connections section](03-active-connections.md) 有一个远程测试网网络连接列表
  可用于测试和学习。

* [cw20-ics](04-cw20-ics20.md) 是首创的智能合约。这是一个 IBC 启用合同
  允许我们
  通过标准 ICS20 协议将 CW20 代币从一条链发送到另一条链的银行模块。简而言之，
  它让我们用 IBC 发送我们的自定义 CW20 代币，并像使用其他链上的原生代币一样使用它们。
