## 与 Solidity 合约的比较

首先，部署-执行过程由 3 个步骤组成，而不是 2 个步骤。虽然以太坊是围绕许多独特合约的概念构建的，每个合约都可能是为任何双边协议定制的，但现实似乎表明，编写一个没有错误的合约合同比原先想象的要困难，而且大多数是标准模板的副本，如 OpenZepellin。考虑到这一点，并意识到上传和验证 wasm 代码的开销，我们定义了合约的以下 3 个阶段:

* 上传代码 - 上传一些优化的 wasm 代码，没有状态和合约地址(例如标准 ERC20 合约)
* 实例化合约 - 使用一些初始状态实例化代码引用，创建新地址(例如为 *my* ERC20 令牌设置令牌名称、最大发行量等)
* 执行合约 - 这可能支持许多不同的调用，但它们都是先前实例化合约的非特权使用，取决于合约设计(例如:发送 ERC20 代币，授予其他合约的批准)

就像以太坊一样，合约的实例化和执行是计量的，需要gas。此外，实例化和执行都允许签名者将一些代币与消息一起发送到合约。两个主要区别是将代币直接发送到合约，例如。通过`SendMsg`，虽然可能，*不触发任何合约代码*。这是一个明确的设计决策，可以减少可能的攻击媒介。它不会使任何事情变得不可能，但要求所有合同的执行都必须*明确要求*。

## 避免重入攻击

另一个很大的区别是我们通过设计避免了所有的可重入攻击。这一点值得单独写一篇文章，但简而言之[以太坊中的一大类漏洞就是基于这个技巧](https://consensys.github.io/smart-contract-best-practices/known_attacks/)。这个想法是在合约 A 上执行函数的过程中，它调用第二个合约(通过发送显式或隐式)。这会将控制权转移到合约 B，后者现在可以执行代码，并再次调用合约 A。现在有两个合约 A 正在运行，除非你在执行任何远程合约之前非常非常小心地管理状态或在子调用中设置非常严格的 gas 限制，否则这可能会触发合约 A 中的未定义行为，以及一个聪明的黑客可以将其重入作为漏洞利用的基础，例如 DAO hack。

Cosmwasm 通过阻止任何合约直接调用另一个合约来完全避免这种情况。显然我们希望允许组合，但对恶意代码的内联函数调用会造成安全噩梦。 CosmWasm 采用的方法是允许任何合约 *返回 * 消息列表 *将在同一交易中执行*。这意味着合约可以在完成后请求发送(例如释放托管)，或调用其他合约。如果未来的消息失败，那么整个交易将恢复，包括对合约状态的更新。这允许原子组合和相当多的安全保证，唯一真正的缺点是您无法查看执行另一个合约的结果，而您只能执行“错误恢复”。

有时我们会需要来自另一个合约的信息，在 0.8 版本中，我们向其他合约或底层 Cosmos SDK 模块添加了同步查询。这些查询只能访问只读数据库快照，无法修改状态或向其他模块发送消息，从而避免了任何可能的重入问题。

## 资源限制

除了漏洞利用(例如重入攻击)，智能合约的另一个攻击向量是拒绝服务攻击。恶意行为者可以上传运行无限循环的合约以停止链或写入大量数据以填满磁盘。 Web Assembly 提供了一个严密的沙箱，没有对操作系统的默认访问，所以我们只需要担心为智能合约提供严格的资源限制。所有开发人员都应该了解这些限制。

*内存使用* - 实例化 Wasm VM 时，默认情况下由 32MB 的 RAM 提供。这是为了存储字节码以及运行进程(堆栈和堆)使用的所有内存。对于几乎所有合同来说，这应该是足够大的，但也许一些复杂的零知识电路会在那里达到极限。它也足够小以确保合约对区块链内存使用的影响最小。

*CPU 使用率* - 我们使用的 [Wasmer 运行时](https://github.com/wasmerio/wasmer) 能够将计量逻辑注入到 wasm 代码中。它计算各种操作和费用的价格，并在每个跳转语句(循环、函数调用等)之前检查限制，以产生确定性的 gas 价格，而不管 CPU 速度、平台等。在执行合约之前，设置了 wasm 的 gas 限制基于剩余的 Cosmos SDK gas，并在合约结束时扣除 gas(有一个常数乘数可以转换，目前 100 wasm gas 到 1 sdk gas)。这对任何 CPU 计算施加了硬性限制，因为您必须为使用的周期付费。

*磁盘使用* - 所有磁盘访问都是通过 KVStore 上的读取和写入进行的。 Cosmos SDK 已经[强制 KVStore 访问的gas 支付](https://github.com/cosmos/cosmos-sdk/blob/4ffabb65a5c07dbb7010da397535d10927d298c1/store/types/gas.go#L154-L162)。由于合约中的所有磁盘访问都是通过回调到 SDK 进行的，因此在那里收费。如果要将 CosmWasm 集成到另一个运行时中，您还必须确保对那里的访问收费。

## 从以太坊中吸取的教训

以太坊是所有区块链智能合约平台的祖父，比任何其他平台都有更多的使用和现实世界的经验。我们不能低估这些知识，而是从他们的成功和失败中学习，以产生更强大的智能合约平台。

他们编制了一份[所有已知的以太坊攻击向量](https://github.com/sigp/solidity-security-blog) 以及缓解策略的列表。我们将 Cosmwasm 与此列表进行比较，以了解其中有多少适用于此。许多这些攻击媒介在设计上是封闭的。仍然存在一些问题，并且计划有一个部分来避免剩余的此类问题。

### :heavy_check_mark: [重入](https://github.com/sigp/solidity-security-blog#reentrancy)

在 cosmwasm 中，我们在相同的原子操作中返回消息以执行其他合约，但 * 在合约完成之后。这是基于参与者模型并避免了可重入攻击的可能性——调用合约时永远不会有易失性状态。

### :heavy_check_mark: [算术欠/溢出](https://github.com/sigp/solidity-security-blog#ouflow)

Rust 允许你在 [Cargo manifest](https://doc.rust-lang.org/cargo/reference/manifest.html#the-profile-sections) 中简单地设置 `overflow-checks = true` 来中止程序如果检测到任何溢出。无法选择退出安全数学。

### :warning: [意外的以太](https://github.com/sigp/solidity-security-blog#ether)

**糟糕的设计模式**

这涉及依赖于对其余额的完全控制的合同。在任何合约系统中都应该避免的设计模式。在 CosmWasm 中，当向合约发送代币时不会调用合约，但是当它们被调用时，它们可以查询其当前余额。您可以注意到 [样本托管合同](https://github.com/CosmWasm/cosmwasm-examples/blob/escrow-0.4.0/escrow/src/contract.rs) 没有记录发送到它在初始化期间，而是[释放当前余额](https://github.com/CosmWasm/cosmwasm-examples/blob/escrow-0.4.0/escrow/src/contract.rs#L83-L92)退出或退还金额。这确保没有令牌卡住。

### :heavy_check_mark: [Delegate Call](https://github.com/sigp/solidity-security-blog#delegatecall)

我们在 CosmWasm 中没有这样的委托调用逻辑。您可以导入模块，但它们在编译时链接在一起，这允许将它们作为一个整体进行测试，并且在合约逻辑中没有微妙的入口点。

### :heavy_check_mark: [默认可见性](https://github.com/sigp/solidity-security-blog#visibility)

与其为代码中的每个函数/方法自动生成入口点(更糟糕的是，如果未指定，则假设为 public)，开发人员必须明确定义要处理的消息列表并将它们分派到适当的函数。不可能以这种方式意外地暴露一个函数。

### :warning: [熵错觉](https://github.com/sigp/solidity-security-blog#entropy)

**计划修复**

与以太坊中的矿工相比，Tendermint 中的区块提议者更容易操纵区块哈希(以及时间戳的最后一位数字)。它们绝对不应该用于随机性。有计划提供安全的随机信标，并将这个安全的熵源暴露给智能合约。

### :heavy_check_mark: [外部合同引用](https://github.com/sigp/solidity-security-blog#contract-reference)

**计划缓解**

如果您使用给定的 `HandleMsg` 调用合约，则只需要合约具有指定的 API，但没有说明那里的代码。我可以使用与所需合约(或 API 的超集)相同的 API 上传恶意代码，并要求您直接调用它或从合约调用它。这可用于窃取资金，实际上我们[在教程中演示](../learn/hijack-escrow/hack-contract.md)。

这里有两个缓解措施。第一个是在 CosmWasm 中，您不需要在运行时调用 Solidity 库来处理大小限制，但鼓励将所有需要的代码链接到一个 wasm blob 中。仅此一项就消除了对外部合同引用的大部分使用。

另一个缓解措施是允许用户快速找到链上 wasm 合约背后经过验证的锈源。这种方式是[etherscan使用的](https://medium.com/coinmonks/how-to-verify-and-publish-on-etherscan-52cf25312945#bc72)，开发者可以在那里发布原始源代码，它将编译代码。如果相同的字节码在链上，我们就知道可以证明它来自这个锈源。我们已经为 rust wasm 构建了确定性构建系统，并且
拥有[验证原始源代码的简单工具](https://medium.com/confio/dont-trust-cosmwasm-verify-db1caac2d335)。
我们还[发布了一个代码浏览器](https://demonet.wasm.glass/codes)，允许您浏览合约和本地
在一个命令中验证源代码。

### :heavy_check_mark: [短地址/参数攻击](https://github.com/sigp/solidity-security-blog#short-address)

这是一种利用 RLP 编码机制和固定 32 字节堆栈大小的漏洞。它不适用于我们的类型检查 json 解析器。

### :heavy_check_mark: [未检查的调用返回值](https://github.com/sigp/solidity-security-blog#unchecked-calls)

CosmWasm 不允许直接调用其他合约，而是返回消息稍后由路由器调度。路由器会检查所有消息的结果，如果链中的**任何**消息返回错误，则整个事务中止，状态改变回滚。这使您可以在安排对其他合约的调用时安全地专注于成功案例，知道如果没有按计划进行，所有状态都将回滚。

### :warning: [比赛条件/前跑](https://github.com/sigp/solidity-security-blog#race-conditions)

这是所有区块链的普遍问题。在形成块之前，所有节点之间会传播已签名的消息。关键矿工/验证器可以创建另一笔交易并将其插入您的交易之前(可能会延迟您的交易)。这通常不是问题，但在分布式交易所中会出现很多。如果在 90 有一个长期卖单，我在 100 下买单，它通常只会在 90 匹配。但是，矿工可以在两者之间插入两笔交易，一笔以 90 买入，另一笔以 100 卖出，然后将您的交易延迟到最后。你最终会以 100 的价格接受他们的报价，而他们只是为了进行套利而赚取 10 个代币的利润。

这也是高频交易和任何依赖于客户之间的排序来确定结果的系统中的一个问题，在区块链中更为明显，因为延迟是几秒而不是微秒。对于大多数应用程序，这不是问题，对于去中心化交易所，有一些设计，例如。批量拍卖，消除了抢先的可能性。

###:警告:[拒绝服务](https://github.com/sigp/solidity-security-blog#dos)

**有限情况**

这个想法是，如果合约依赖于一些外部用户定义的输入，它可以以一种它会用完处理它的气体的方式进行设置。那里的许多情况不应该影响 CosmWasm，特别是因为 wasm 运行得更快，而且 CPU 的 gas 限制允许在一笔交易中进行大量处理(包括 wasm 中的 ed25519 签名验证，无需预编译)。但是，循环访问存储中用户控制的密钥数量将很快耗尽 gas。

### :heavy_check_mark: [区块时间戳操作](https://github.com/sigp/solidity-security-blog#block-timestamp)

Tendermint 在所有区块链标头中提供 [BFT Timestamps](https://github.com/tendermint/tendermint/blob/master/docs/spec/blockchain/blockchain.md#time-1)。这意味着您需要大多数验证者串通来操纵时间戳，并且它可以像区块链本身一样受信任。 (同样的大多数人可以停止链条或在叉子上工作)

### :heavy_check_mark: [Constructors with Care](https://github.com/sigp/solidity-security-blog#constructors)

这是具有构造函数命名的 Solidity 语言的一个特性。你极不可能在 cosmwasm 中重命名 `init`，如果你这样做了，它将无法编译而不是产生后门。

### :heavy_check_mark: [未初始化的存储指针](https://github.com/sigp/solidity-security-blog#storage)

CosmWasm 不会自动填充变量，您必须从存储中显式加载它们。并且 rust 不允许在任何地方使用未初始化的变量(除非你开始编写 `unsafe` 块，并进行特殊调用以访问未初始化的内存......但你自找麻烦)。使存储显式而不是隐式可以消除此类故障。

### :heavy_check_mark: [浮点数和精度](https://github.com/sigp/solidity-security-blog#precision)

Solidity 和 CosmWasm 都不支持浮点运算，因为舍入中可能存在不确定性(这取决于 CPU)。 Solidity 除了进行整数数学运算外别无选择，许多开发人员手动将整数逼近于十进制数，这可能会引入舍入误差。

在 CosmWasm 中，您可以导入任何 rust 包，只需选择一个合适的包并在内部使用它。像 [rust_decimal](https://docs.rs/rust_decimal/1.0.3/rust_decimal/) 一样，“用纯 Rust 编写的 Decimal 实现适用于需要重要整数和小数位且没有舍入错误的金融计算。” .或 [fixed](https://docs.rs/fixed/0.5.0/fixed/) 提供定点十进制数学。它最多支持 128 位数字，这对于小数点前 18 位和后 18 位来说已经足够了，这对于任何用例来说都足够了。

### :heavy_check_mark: [Tx.Origin 认证](https://github.com/sigp/solidity-security-blog#tx-origin)

CosmWasm 不暴露 `tx.origin`，而是只暴露合约或用户直接调用合约作为 `params.message.signer`。这意味着不可能依赖错误的身份验证，因为只有一个值可供比较。
