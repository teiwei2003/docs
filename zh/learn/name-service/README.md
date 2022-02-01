# 介绍

Cosmos SDK 有 [一个很好的标准教程](https://tutorials.cosmos.network/nameservice/tutorial/00-intro.html)，它构建了一个示例名称服务应用程序.为了为现有 SDK 开发人员提供良好的过渡，我们将演示使用 CosmWasm 实现相同的应用程序.这是一个有用的教程，用于演示基本概念和应用您在介绍中学到的技能.我们还将制作另一个用于部署和使用 ERC20 合约的教程，对于来自以太坊背景的人来说可能更熟悉.

## 目标

正如在[原始教程](https://tutorials.cosmos.network/nameservice/tutorial/00-intro.html)中一样，您将构建一个在[Cosmos SDK](https://github.com/宇宙/宇宙-sdk/).在这种情况下，我们将使用 [`cosmwasm`](https://github.com/CosmWasm/cosmwasm) 来部署 Rust 合约，而不是开发原生 go 模块.在这个过程中，学习了 CosmWasm 的基本概念和结构.该示例将展示如何使用 CosmWasm 智能合约快速轻松地自定义 [默认 Cosmos SDK 应用程序](https://github.com/CosmWasm/wasmd).

在本教程结束时，您将拥有一个功能性的“nameservice”应用程序，即字符串到其他字符串的映射(“map[string]string”).这类似于 [Namecoin](https://namecoin.org/)、[ENS](https://ens.domains/)、[IOV](https://iov.one) 或 [Handshake]( https://handshake.org/)，它们都模拟了传统的 DNS 系统(`map[domain]zonefile`).用户将能够购买未使用的名称，或出售/交易他们的名称.

**即将推出**
