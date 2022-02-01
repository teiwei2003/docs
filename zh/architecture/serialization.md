# 序列化格式

除了设计的安全性之外，开发 CosmWasm 的驱动力之一是包含一个非常好的开发人员用户体验.其关键是能够检查和调试在区块链上发送的消息，并在不需要复杂库的情况下解析结果.也不需要下载自定义模式和 ABI 只是为了进行方法调用.

## JSON

自然的解决方案是在任何地方使用 JSON.它是自描述的、人类可读的，并在各地的 API 中使用.它确实有一些缺点，例如处理超过 2^53 的数字(仅使用字符串)，字符串和 base64 编码的二进制文件之间没有明显区别，并且没有硬编码模式.我们为[合约的公共 API](https://github.com/CosmWasm/cosmwasm-examples/tree/master/escrow/) 自动生成 [JSON Schema](https://json-schema.org/) 描述符schema)，可用于检查支持的 API，并可选择在客户端工具中使用以自动验证消息.

使用它进行开发和调试时的反馈是积极的，我们对开发人员用户体验非常满意.现在判断消息大小和自由格式模式是否会成为生产中的障碍还为时过早.但是，请注意合约定义了自己的消息解析逻辑，编解码器不是由框架强制执行的.我们通过 [`cosmwasm::serde`](https://github.com/CosmWasm/cosmwasm/blob/master/src/serde.rs) 和 [`cosmwasm-template`](https ://github.com/CosmWasm/cosmwasm-template)，但任何人都可以将其换掉——前提是他们为该格式提供客户端支持.

保持一致性有助于客户开发以及合同-合同调用.

## 原型缓冲区

Protobuf 是一种众所周知且得到广泛支持的二进制格式.它提供了比 JSON 更严格的模式保证和更紧凑的格式.协议缓冲区和 GRPC 支持已随 Cosmos SDK v0.39.0 升级添加.

## Cap'n Proto

[Cap'n Proto](https://capnproto.org/) 是一种零拷贝读取的超精益编码格式，无需解析.这已[建议在 CosmWasm 中使用](https://github.com/CosmWasm/cosmwasm/issues/78) 作为可选添加.这可以被视为希望这种效率或严格模式的合同的选择格式，或者可能仅用于编码内部数据结构(`Params`).

## 学分

非常感谢 [Jehan Tremback](https://github.com/jtremback)，他坚持对所有消息采用通用的、人类可读的格式.
