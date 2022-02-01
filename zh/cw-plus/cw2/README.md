# CW2 规范:迁移的合同信息

回购链接:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw2](https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw2)

大多数 CW* 规范都集中在*公共接口*
合同的.用于 `HandleMsg` 或 `QueryMsg` 的 API.
但是，当我们希望从合约 A 迁移到合约 B 时，
合约 B 需要以某种方式知道 *状态是如何编码的*.

一般我们使用Singletons和Buckets来存储状态，但是
如果我升级到“cw20-with-bonding-curve”合约，它只会
如果我从 `cw20-base` 合同迁移，可以正常工作.但是如何
新合约可以知道数据存储的格式吗？

这就是 CW2 的用武之地.它指定了特殊的 Singleton
由 `init` 上的所有合约存储在磁盘上.当`迁移`
函数被调用，然后新合约可以读取该数据并
看看这是否是我们可以从中迁移的预期合同.并且
如果我们支持多次迁移，则包含额外的版本信息
路径.

### 数据结构

**必需的**

所有符合 CW2 的合约都必须存储以下数据:

* 键:`\x00\x0dcontract_info`(长度前缀为“contract_info”，使用单例模式)
* 数据:Json 序列化的 `ContractVersion`

```rust
pub struct ContractVersion {
    /// contract is a globally unique identifier for the contract.
    /// it should build off standard namespacing for whichever language it is in,
    /// and prefix it with the registry we use.
    /// For rust we prefix with `crates.io:`, to give us eg. `crates.io:cw20-base`
    pub contract: String,
    /// version is any string that this implementation knows. It may be simple counter "1", "2".
    /// or semantic version on release tags "v0.6.2", or some custom feature flag list.
    /// the only code that needs to understand the version parsing is code that knows how to
    /// migrate from the given contract (and is tied to it's implementation somehow)
    pub version: String,
}
```

Thus, an serialized example may looks like:

```json
{
    "contract": "crates.io:cw20-base",
    "version": "v0.1.0"
}
```

### 查询

由于状态是明确定义的，我们不需要支持任何“智能查询”.
我们确实提供了一个帮助程序来构造一个“原始查询”来读取 ContractInfo
任何符合 CW2 的合同.
