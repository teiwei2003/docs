# CosmWasm 文档

CosmWasm 是为 Cosmos 生态系统构建的新型智能合约平台.如果您还没有听说过，请[查看此介绍](https://blog.cosmos.network/annoucing-the-launch-of-cosmwasm-cc426ab88e12).本文档的目的是让希望试用或将其集成到产品中的开发人员深入了解该技术.特别是，它面向具有 Cosmos SDK 经验的 Go 开发人员，以及正在寻找区块链平台的 Rust 开发人员. {概要}

## 如何使用 CosmWasm

CosmWasm 被编写为可以插入 Cosmos SDK 的模块.这意味着当前使用 Cosmos SDK 构建区块链的任何人都可以快速轻松地将 CosmWasm 智能合约支持添加到他们的链中，而无需调整现有逻辑.我们还提供了一个集成到 `gaiad` 二进制文件中的 CosmWasm 示例二进制文件，称为 [`wasmd`](https://github.com/CosmWasm/wasmd)，因此您可以从box，使用记录和测试的工具以及与 Cosmos Hub 相同的安全模型.

您将需要一个正在运行的区块链来托管您的合约并从应用程序中使用它们.我们将解释如何[连接到测试网](/getting-started/setting-env.md#setting-up-environment) 或[设置本地“开发网”](/getting-started/setting-env. md#run-local-node-optional)在后面的部分.并计划很快发布一个托管测试网，所有开发人员都可以简单地将他们的合约上传到该测试网，以便轻松运行演示并与他人共享他们的合约.

## 部分

* [入门](/getting-started/intro.md) 带您进入实践培训.它轻轻地引导你通过
在本地区块链上修改、部署和执行智能合约.它是了解和熟悉系统所有方面的理想场所，无需过多的繁重编码工作.

* [架构](/architecture/multichain.md) 解释了 CosmWasm 的许多高级设计和架构.
在开始设计系统之前，最好先了解系统的心智模型和功能.如果您只是想接触可工作的代码，您可以暂时跳过本节，等您准备好思考设计时再回来.

* [Testnets](/testnets/build-requirements.md) 如果您正在寻找实时
网络在稳定且易于使用的测试环境中测试和破解您的智能合约.此外，“**我们有足够多的验证者加入了测试网**”，从来没有人说过 😉

* [Learn](/learn/README.md) 将逐步演示从零到生产的智能合约开发
解释、代码片段、脚本等.

* [研讨会](/learn/videos-workshops.md) 收集了大量的演示和口头解释
  我们的团队在各种活动和组织中记录的 CosmWasm 技术堆栈.

* [社区](/community/hall-of-fame.md) 用于社区互动.

* [Plus](/cw-plus/general/overview.md) 适用于最先进的 CosmWasm 智能合约.

* [IBC](/ibc/01-overview.md) 是所有与 CosmWasm 和 IBC 相关的东西.中继器、活动网络连接、启用 IBC
  智能合约等等.

## 深度学习

您可以深入研究我们的代码并开始编写您自己的合约:

* [一组示例合约](https://github.com/CosmWasm/cosmwasm-examples) 供你fork和实验
* [核心合约库]的 Rustdoc(https://docs.rs/cosmwasm-std/0.13.1/cosmwasm_std/)
* [存储助手] 的 Rustdoc(https://docs.rs/cosmwasm-storage/0.13.1/cosmwasm_storage/)

有很多[关于中等的高级文章](https://medium.com/confio) 解释了
我们的堆栈和我们要去的地方.

非常感谢 [Interchain Foundation](https://interchain.io/) 资助大部分开发工作
CosmWasm 到生产.
