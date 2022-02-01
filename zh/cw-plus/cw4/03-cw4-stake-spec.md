# CW4 股份

cw4-stake 源代码:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw4-stake](https://github.com/CosmWasm/cosmwasm-plus/tree/master/合同/cw4-stake)

这是 [cw4 规范](01-spec.md) 的第二个实现.
它满足规范的所有元素，包括原始查询查找，
并且旨在用作后备存储
[符合 cw3 的合同](../cw3/01-spec.md).

它提供了一个类似于 [`cw4-group`](处理选举成员资格)的 API，
但不是任命成员(通过管理员或多重签名)，他们的
会员资格和权重基于他们所抵押的代币数量.
这类似于许多 DAO.

只能以“min_bond”作为最小金额绑定一个面额
必须由一个地址发送才能进入，以及`tokens_per_weight`，
可用于标准化权重(例如，如果令牌是 uatom
并且你想要每个 ATOM 1 个权重，你可以设置 `tokens_per_weight = 1_000_000`).

还有一个解除绑定期(`Duration`)，它设置了多长时间
令牌在释放之前被冻结.这些冻结的代币也不能
用于投票，也不会被原所有者认领.仅在此期间之后
你能拿回你的代币吗？这种流动性损失是“游戏中的皮肤”
通过对本合约进行质押提供.

## 在里面

**去做**

要创建它，您必须传入成员列表以及可选的
`admin`，如果你希望它是可变的.

```rust
pub struct InitMsg {
    /// denom of the token to stake
    pub stake: String,
    pub tokens_per_weight: u64,
    pub min_bond: Uint128,
    pub unbonding_period: Duration,
}
```

成员由地址和权重定义.这是变身
并以定义的格式存储在它们的“CanonicalAddr”下
[cw4 原始查询](01-spec.md#raw).

请注意，0 *是允许的重量*.这不赋予任何投票权，
但它确实定义了这个地址是组的一部分，这可能是
在某些情况下有意义.

成员的权重将计算为他们发送的资金
(以代币为单位)除以`tokens_per_weight`，四舍五入到最接近的
整数(即使用整数除法).如果发送的总数少于
`min_bond`，股份将保留，但不会被视为
成员.如果 `min_bond` 高于 `tokens_per_weight`，你不能
拥有任何权重为 0 的成员.

## 消息

大多数消息和查询是由
[cw4 规范](01-spec.md).请参阅它以获取更多信息.

添加了以下消息来处理取消/质押代币:

`Bond{}` - 绑定所有随消息发送的质押代币并更新成员权重

`Unbond{tokens}` - 开始给定数字的解绑过程
代币.发件人立即从这些代币中减重，
并且可以在“unbonding_period”之后将它们取回他的钱包

`Claim{}` - 用于声明您之前“解除绑定”的原生代币
在合同规定的等待期之后(例如 1 周)

以及相应的查询:

`Claims{address}` - Claims 显示正在解绑的代币
对于这个地址

`Staked{address}` - 显示当前由该地址抵押的代币数量.
