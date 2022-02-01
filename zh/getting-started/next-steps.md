# 下一步

这是我们开发的托管合约的一个非常简单的示例，但它应该向您展示什么是
可能，仅受您上传的 wasm 代码和您发送的 json 消息的限制.下一步是
[劫持托管教程](../learn/hijack-escrow/intro.md) 您将在其中编辑智能合约以
放置一个后门，使小偷能够窃取资金.如果你想要一个指导教程来构建一个
从头到尾签约，查看【名称服务】
教程](../learn/name-service/intro).

我们策划了一些视频和研讨会资源，您可以查看:[视频和研讨会](../learn/videos-workshops)

如果你觉得你足够了解(并且有过 Rust 的经验)，请随意抓住
[`cosmwasm-template`](https://github.com/CosmWasm/cosmwasm-template) 并将其用作配置
项目开始修改.不要克隆 repo，而是按照
[README](https://github.com/CosmWasm/cosmwasm-template/blob/master/README.md) 关于如何使用
`cargo-generate` 来生成你的骨架.

在任何一种情况下，都有一些文档
[`go-cosmwasm`](https://github.com/CosmWasm/go-cosmwasm/blob/master/spec/Index.md) 和
[`cosmwasm`](https://github.com/CosmWasm/cosmwasm/blob/master/README.md) 可能会有所帮助.任何
问题(错误或只是混乱)，请将它们提交到
[`cosmwasm/issues`](https://github.com/CosmWasm/cosmwasm/issues) 如果他们处理智能
合同，以及 [`wasmd/issues`](https://github.com/CosmWasm/wasmd/issues) 如果它们与
SDK集成.

快乐黑客!
