# 介绍

在本教程中，您将学习如何构建基于 [CosmJS](https://github.com/cosmos/cosmjs) 的 dApp。 示例 dApp 将是一个余额检查器，它允许您使用您输入的地址查看您的原生代币和合约的 CW20 代币。

## 视图

它看起来像这样:

### 登录
![图片](../../.vuepress/public/assets/frontend-dapp/login.png)

### 本机平衡
![图片](../../.vuepress/public/assets/frontend-dapp/balance-native.png)

### CW20 合约的余额
![图片](../../.vuepress/public/assets/frontend-dapp/balance-cw20.png)

### 没有合同的地址错误
![图片](../../.vuepress/public/assets/frontend-dapp/balance-error.png)

##设置环境

我们建议使用 [Visual Studio Code](https://code.visualstudio.com)，但使用任何其他文本编辑器应该可以轻松遵循本教程。

您应该使用您喜欢的方法下载最新版本的 [`CosmWasm/dApps`](https://github.com/CosmWasm/dApps) monorepo。
