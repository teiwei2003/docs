# 介绍

DeFi 浪潮冲击 2020 年的加密货币场景，带来巨大影响并带来兴奋.
高收益吸引了包括机构玩家在内的所有人的关注，
但是加密推特还有另一种令人兴奋的感觉:
对未经审计的 Solidity 代码中的单个错误的焦虑可能会以多米诺骨牌效应破坏系统.
甚至没有提到仅执行一份智能合约所支付的巨额费用.

CosmWasm 的前景之一是为 DeFi dApp 提供坚实的基础.

为了证明这个大胆的主张并表明 CosmWasm 是正确的道路，我们将演示一个[简单选项](https://en.wikipedia.org/wiki/Option_(finance)) 合约并一路教你.

::: 小费
期权是金融衍生品，赋予买家以商定的价格和日期买卖标的资产的权利，但没有义务.
:::

我们在研讨会上为 HackAtom V India 参与者演示了合同.

<iframe src="https://player.vimeo.com/video/457486858" width="640" height="361" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

您可以将研讨会的录音打开到侧面，并按照书面教程作为成绩单.在研讨会中，我们从样板代码开始，并在此基础上进行构建.在本教程中，您将了解完成的版本.
我们建议您从模板启动一个项目并按照 Ethan 的研讨会视频进行开发，您将了解诸如开发流程和可能的错误，这些是您仅通过阅读书面教程无法了解的.

您可以在 [github/cosmwasm-examples](https://github.com/CosmWasm/cosmwasm-examples) 找到完整的存储库.

注意代码示例中如下所示的注释.有关代码本身的详细信息在注释中.

此外，视频是使用旧版本的 cosmwasm 录制的，但教程已更新到最新版本 (0.13)，因此可能存在细微差别.
```
/*
 *
 */
```
