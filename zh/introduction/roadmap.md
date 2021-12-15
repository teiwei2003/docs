# 粗略的路线图

到目前为止，CosmWasm 是由 [ICF Grants](https://interchain.io) 资助的[小团队](http://confio.tech) 的成果。我们一直在构建核心技术来支持 Cosmos 生态系统中的各种区块链。以下是目前计划的路线图，主要基于 ICF 赠款的剩余资金。如果希望将其部署到生产的项目有强烈的兴趣(和资金)，则可以修改路线图的优先级。

您可以在我们的 [Github 项目页面](https://github.com/orgs/CosmWasm/projects/1) 中查看最新状态。

##过去的成就

**2019 年 8 月至 10 月**:

* 构建 CosmWasm 环境的核心工作，并构建系统、示例代码和 Cosmos SDK 集成。

**2019 年 11 月**:

* 测试了整个堆栈集成，编写了教程和文档，打磨了许多粗糙的地方。

**2019 年 12 月**:

* [CosmWasm 文档](https://www.cosmwasm.com) 已上线，包括 [教程](../getting-started/intro)。
* [CosmWasm v0.5.2](https://github.com/CosmWasm/cosmwasm/tree/v0.5.2)，完全支持`init`和`handle`是第一个稳定版本。
* [`wasmd`](https://github.com/CosmWasm/wasmd) 示例区块链已发布并经过测试。

**2020 年 1 月**:

* [CosmWasm v0.6.0 发布](https://medium.com/confio/annoucing-wasmd-release-d865abf381b) 支持`query` 和许多增强功能，使合约开发更符合人体工程学。
* [cosmwasm-examples](https://github.com/CosmWasm/cosmwasm-examples) 使用 `escrow` 和 `erc20` 合约
* 使用 [cosmwasm-opt] (https://github.com/CosmWasm/cosmwasm-opt) 进行可复制的构建
* 研究[在 AssemblyScript 中编写合约](https://github.com/CosmWasm/cosmwasm/pull/118) 以及 Rust 的可行性
* JS 接口的大量工作

**2020 年 2 月**:

* 第一个 [wasmd 稳定版本](https://medium.com/confio/annoucing-wasmd-release-d865abf381b) 带有标记的 Cosmos SDK 依赖项，以便其他项目轻松导入
* 第一个 [CosmWasm JS 发布](https://medium.com/confio/introduction-to-cosmwasm-js-548f58d9f6af)。 [`cosmwasm-js`](https://github.com/CosmWasm/cosmwasm-js) 是一个易于使用的 TypeScript SDK，用于与 CosmWasm 合约对话
* [chrome 扩展签署 CosmWasm 令牌合同](https://medium.com/confio/adding-cosmwasm-to-the-neuma-multichain-wallet-ec657d893268)的演示集成。在这种情况下，允许类似 ERC20 的合约与原生代币一起交易。
* [nameservice 合约](https://github.com/CosmWasm/cosmwasm-examples/tree/master/nameservice) 作为示例发布到并行 Cosmos SDK 教程

**2020 年 3 月**:

* [CosmWasm v0.7.0 发布](https://medium.com/confio/cosmwasm-0-7-released-6db5a037f943) 发布了大量内部合约清理，但特别是更强大和更干净的`wasmd` REST API(受到正在进行的“cosmwasm-js”工作的启发)
* [Demo Net 启动](https://medium.com/confio/cosmwasm-demo-net-launched-4c604674f3e0) 无需本地区块链即可上传和运行您的合约
* [`code-explorer`](https://github.com/CosmWasm/code-explorer) 发布，检查链上所有代码和合约
* [Enigma testnet 与 CosmWasm 一起运行](https://forum.enigma.co/t/testnet-is-live-with-smart-contracts/1386) 智能合约支持
* [Verify Rust source](https://medium.com/confio/dont-trust-cosmwasm-verify-db1caac2d335) 在上传的 CosmWasm 合约背后
* 大大增强了`cosmwasm-js`:[阅读](https://medium.com/confio/cosmwasmclient-part-1-reading-e0313472a158) 和写作
* NameService React 应用演示全栈解决方案(从合约到 UI)

**2020 年 4 月/5 月**:

* CosmWasm 0.8 发布
* [跨合约查询](../architecture/composition.md)
* 将迭代器添加到存储层
* [可定制的消息和查询](https://github.com/CosmWasm/wasmd/blob/v0.8.0/INTEGRATION.md#adding-custom-hooks)
* 与 Staking 模块集成

**2020 年 6 月**:

* CosmWasm 1 年(这个想法诞生于 2019 年 6 月柏林 Hackatom 期间)
* 1st Live Workshop(自定义令牌)-与我们一起编写代码
* CosmJS 计划始于 Cosmos 中的其他项目

**2020 年 7 月**:

* Cosmwasm 0.9 和 0.10 发布
  * 由所有者启用合同迁移
  * 实现对合约全生命周期的治理控制
  * 在编译二进制文件时选择加入，我们提供对无许可和有许可系统的支持
* Fullfil [Cosmos Hub 提案](https://hubble.figment.network/cosmos/chains/cosmoshub-3/governance/proposals/25):
* 领导 Launchpad 计划并做出贡献
* Confio 和 CosmWasm 品牌重塑
* Fetch.ai 集成 CosmWasm

**2020 年 8 月**:

* CosmJS 0.22.0 发布
* 万岁智能合约测试场【珊瑚网络】(https://github.com/CosmWasm/testnets/tree/master/coral) 发布
* 团队成长(Dev Relations/Orkun、Frontend/Abel、COO/产品副总裁/Martin)
* 推出 CosmWasm Discord 服务器
* Confio 和 CosmWasm 的新网站

## 计划工作

添加 IBC 支持(基于 ICF 授权):

* 将 IBC 暴露给合约的简单接口
* `wasmd` 中的完整 IBC 集成

## 超过

* 支持在 *AssemblyScript* 或 *TinyGo* 中编写 CosmWasm 合约
*更严格和更可配置的气体计量
* 支持更多主机平台(在 i686/Amd64 上超越 Linux 和 OSX)
* 在 CosmWasm 上构建的项目要求的其他功能。
* 进一步开发“概念链”
