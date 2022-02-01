# CW20 规范:可替代代币

cw20 包源代码:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw20](https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw20 )

CW20 是基于 CosmWasm 的可替代代币规范.
名称和设计松散地基于以太坊的 ERC20 标准，
但是已经做了很多改变.这里的类型可以通过
希望实现此规范的合约，或通过调用的合约
任何标准的 cw20 合同.

规范分为多个部分，一个合同只能
实现其中一些功能，但必须实现基础.

::: 小费
本节包含 CW20 规范实现细节.
如果你在玩合同，
跳过本节并转到[下一页](03-cw20-base-tutorial.md)
:::

## 根据

这将处理余额和转账.请注意，所有金额均为
处理为 `Uint128`(128 位整数，带有 JSON 字符串表示).
处理小数留给用户界面而不是解释

### 消息

`Transfer{recipient, amount}` - 从
`env.sender` 帐户到 `recipient` 帐户.这是为了
发送到由私钥控制的地址并且*不*触发
如果是合同，则对接收方的任何操作.

`Send{contract, amount, msg}` - 从
`env.sender` 帐户到 `recipient` 帐户. `contract` 必须是一个
实现“Receiver”接口的合约地址. `msg`
将与金额一起传递给接收者合约.

`Burn{amount}` - 从 `env.sender` 的余额中移除 `amount` 代币
并将 `total_supply` 减少相同的数量.

### 查询

`Balance{address}` - 返回给定地址的余额.
如果地址未知，则返回“0”.返回类型
是`BalanceResponse{balance}`.

`TokenInfo{}` - 返回合约的代币信息.返回类型是
`TokenInfoResponse{name, symbol, decimal, total_supply}`.

### 接收者

`Send` 的对应部分是 `Receive`，它必须由
任何希望管理 CW20 代币的合约.这通常是*不是*
由任何 CW20 合同实施.

`Receive{sender, amount, msg}` - 旨在处理 `Send`
消息.合约地址存储在`env.sender`中
所以它不能被伪造.合同应确保发件人匹配
它期望处理的代币合约，并且不允许任意地址.

`sender` 是请求移动代币的原始帐户
和 `msg` 是一个 `Binary` 数据，可以解码为特定于合约的数据
信息.如果我们只有一个默认操作，这可以为空，
或者它可能是一个 `ReceiveMsg` 变体来阐明意图.例如，
如果我发送到 Uniswap 合约，我可以指定我想要交换的代币
反对使用该字段.

##津贴

合约可以允许参与者将他们的一些余额委托给其他人
帐户.这不像 ERC20 那样重要，因为我们使用 `Send`/`Receive`
将代币发送到合约，而不是 `Approve`/`TransferFrom`.但它
仍然是一个很好的用例，您可以看到 Cosmos SDK 如何添加
对原生代币的支付津贴.这主要是为了提供
访问其他基于公钥的帐户.

原始 ERC20 批准规范中存在竞争条件问题.
如果您获得了 50 的批准，然后我想将其减少到 20，我会提交一份
Tx 将津贴设置为 20.如果您看到并立即提交 tx
使用全部 50 个，然后您可以访问其他 20 个.
在我可以减少它之前花掉50，你再免费得到20.

以太坊社区中讨论的解决方案是“IncreaseAllowance”
和 `DecreaseAllowance` 运算符(而不是 `Approve`).原先设定
一个批准，使用`IncreaseAllowance`，它可以正常工作，没有以前的津贴.
`DecreaseAllowance` 是健壮的，也就是说，如果你减少超过
当前的津贴(例如用户在中间花费了一些)，它会四舍五入
降到 0 并且不会产生任何下溢错误.

### 消息

`IncreaseAllowance{spender, amount, expires}` - 设置或增加津贴
这样`spender`可以访问最多`amount + current_allowance`令牌
来自 `env.sender` 帐户.这可以选择带有“过期”
时间，如果设置可以使用批准的限制(按时间或高度).

`DecreaseAllowance{spender, amount, expires}` - 减少或清除津贴
这样`spender`可以访问最多`current_allowance - amount`令牌
来自 `env.sender` 帐户.这可以选择带有“过期”
时间，如果设置可以使用批准的限制(按时间或高度).
如果`amount >= current_allowance`，这将清除配额(删除它).

`TransferFrom{owner, receiver, amount}` - 这使用了津贴
如果对 `env.sender` 有一个有效的、未过期的预先批准，
然后我们将 `amount` 代币从 `owner` 移动到 `recipient` 并扣除它
从可用的津贴.

`SendFrom{owner, contract, amount, msg}` - `SendFrom` 到 `Send`，什么
`TransferFrom` 是到 `Transfer`.这允许预先批准的帐户
不仅仅是转移代币，而是将它们发送到另一个合约
触发给定的动作. **注意** `SendFrom` 将设置 `Receive{sender}`
成为`env.sender`(触发转账的账户)
而不是“所有者”帐户(资金来自的帐户).
这是一个悬而未决的问题，我们是否应该切换它？

`BurnFrom{owner, amount}` - 这类似于 `TransferFrom`，但会燃烧
代币而不是转移它们.这将减少业主的
余额、`total_supply` 和来电者的津贴.

### 查询

`Allowance{owner,spender}` - 这将返回可用的津贴
`spender` 可以从 `owner` 的帐户访问，以及
到期信息.返回类型是“AllowanceResponse{balance, expire}”.

## Mintable

这允许另一个合约铸造新的代币，可能有上限.
这里只指定了一个铸币厂，如果你想要更复杂的
访问管理，请使用多重签名或其他合同作为
minter 地址并在那里处理更新 ACL.

### 消息

`Mint{recipient, amount}` - 如果 `env.sender` 是允许的铸币商，
这将创建 `amount` 新代币(更新总供应量)和
将它们添加到“接收者”的余额中.

### 查询

`Minter{}` - 返回可以铸造的人以及可以铸造的数量.返回类型是
`MinterResponse {minter, cap}`.上限可能未设置.
