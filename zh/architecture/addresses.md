# 名称和地址

区块链(几乎？)都使用地址通过公钥的散列来识别外部参与者，许多较新的区块链扩展了这一点，以识别具有唯一地址的链上“智能合约”。在链上，地址使用简洁、不可变的二进制格式表示，通常为 20 或 32 字节长，通常来自散列函数。但是，这些二进制地址有许多人类可读的表示形式，这些表示形式会显示给客户端。例如，[Bech32](https://en.bitcoin.it/wiki/Bech32)`bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9`，六角`0x8617E340B3D01FA5F11F306F4090FD50E238070D`或[checksumned六角](https://github.com/ethereum/EIPs/blob/master /EIPS/eip-55.md) `0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed`，甚至[大整数](https://research.kudelskisecurity.com/2018/01/16/blockchains-how-to-in-steal-6操作/)`3040783849904107057L`。

## 地址

Cosmos SDK 中的地址是 20 个字符长的字符串，并包含安全检查 - 例如 Bech32 中的链前缀、Bech32 中的校验和和校验和十六进制 (EIP55)。
由于 CosmWasm 是 Cosmos SDK 的扩展，因此遵循相同的地址规则；钱包、智能合约、模块都有一个带有定义前缀的标识符地址。 `cosmos1...` 用于 gaia，`wasm1...` 用于 CosmWasm 测试网。

要将地址传递给合约，请将其作为字符串传递，然后验证输入到一个:**Addr**
[Addr](https://github.com/CosmWasm/cosmwasm/blob/v0.14.0/packages/std/src/addresses.rs#L31) 只是简单字符串的包装器，提供有用的辅助函数，例如字符串验证到一个地址。

## 可选:规范地址

还有另一种地址表示可以解决人类表示改变的情况，但这种情况很少见。

例如比特币 [从 Base58 迁移到 Bech32](https://en.bitcoin.it/wiki/BIP_0173) 与 SegWit 一起编码，而 Rise 也在 [从 Lisk 格式迁移到 Bech32](https://medium.com /rise-vision/introducing-rise-v2-521a58e1e9de#41d5) 在 v2 升级中。

这意味着如果 `message.signer` 始终是签署交易的字符串地址，并且我用它来查找您的帐户余额，如果此编码发生更改，那么您将无法访问您的帐户。我们显然需要一个稳定的标识符来在内部使用。

这是我们定义*规范地址*的地方。这被定义为稳定且唯一的。也就是说，对于一个给定的帐户，只有一个规范地址(在区块链的生命周期内)。我们定义了一个 *canonical address* 格式，可以将多个字符串地址转换为该格式。它可以来回转换，无需任何更改

我们将 *Canonical Address* 定义为区块链内部使用的二进制表示。这是原生代币的索引依据，因此在帐户的生命周期内绝不能更改。这是可用于所有**存储查找**的表示(如果您使用地址的一部分作为存储中的键)。

##命名

越来越多，[human](https://app.ens.domains/about) [可读](https://docs.blockstack.org/core/naming/introduction.html) [names](https:// iov.one)在区块链[及其他]中越来越重要(https://hackernoon.com/everything-you-didnt-know-about-the-handshake-naming-system-how-this-blockchain-project-will- 483464309f33)。

曾几何时，我们考虑将名称作为 CosmWasm 的一等公民，并在消息中随处使用它们。直到我们意识到账户在初始化之前不能有名字，我们需要一个永久稳定的*地址*。但是，我们仍然希望名称尽可能成为区块链的核心。为此，我们可以将名称视为 *Address* 的另一种形式，尽管它需要合约查询(具有存储访问权限)来解析，而不仅仅是对纯函数的调用。

这种实际的格式和接口仍在讨论中，我们仍在研究[名称服务的教程版本](../learn/name-service/intro)。然而，为了论证，假设我们同意每个以`:` 开头的 *Address* 都是一个名称服务来查找的名称，其他的可以直接使用内置的区块链解析功能进行解析。因此，在为托管创建交易时，您可以使用 `{"arbiter": "cosmos1qqp837a4kvtgplm6uqhdge0zzu6efqgujllfst"}` 或 `{"arbiter": ":alice"}`，在合约内而不是仅在客户端中执行解析.当然，我们需要名称服务的标准查询格式，并且调用合约需要以某种方式知道要解析的规范名称服务合约的地址，这就是为什么此功能仍在讨论中的原因。

### DID

*注意:这可能需要很长时间才能完全实施。 它作为设计灵感*

一旦我们开发了名称服务问题的解决方案，让我们继续想象 *Human Names* 的可能性。 我们不仅可以使用引用来解析用户地址，还可以解析合约。 也许我们可以不通过其名称而是通过其*唯一注册的代币代码*向“ERC20”代币合约发送消息。 我们很快就需要使用某种方法来区分名称的范围或上下文。 这就是 [去中心化标识符 (DID)](https://www.w3.org/TR/did-core/) 可以发挥作用的地方。想象一下以下消息格式，它可以由终端客户端或由 一个智能合约“演员”:

```json
{
    "destination": "did:token:XRN",
    "msg": {
        "transfer": {
            "from": "did:account:alice",
            "to": "did:account:bob",
            "amount": "13.56"
        }
    }
}
```

这不是要在客户端解析的一些规范，而是区块链上使用的实际交换格式。 所以一个智能合约也可以在执行过程中发送这样的消息。 你喜欢这个主意吗？ 评论？ [请在github上添加您的想法](https://github.com/CosmWasm/cosmwasm/issues/80)。
