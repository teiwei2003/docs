# CW4 组

cw4-group 源代码:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw4-group](https://github.com/CosmWasm/cosmwasm-plus/tree/master/合同/cw4-group)

这是 [cw4 规范](01-spec.md) 的基本实现.
它满足规范的所有元素，包括原始查询查找，
它旨在用作后备存储
[符合 cw3 的合同](../cw3/01-spec.md).

它与管理员一起存储一组成员，并允许管理员
更新状态. 原始查询(用于跨合约查询)
可以查询给定的会员地址和总重量. 智能查询(设计
对于客户端 API) 可以做同样的事情，也可以查询管理地址以及
对所有成员进行分页.

## 在里面

要创建它，您必须传入成员列表以及可选的
`admin`，如果你希望它是可变的.

```rust
pub struct InitMsg {
    pub admin: Option<HumanAddr>,
    pub members: Vec<Member>,
}

pub struct Member {
    pub addr: HumanAddr,
    pub weight: u64,
}
```

成员由地址和权重定义. 这是变身
并以定义的格式存储在它们的“CanonicalAddr”下
[cw4 原始查询](01-spec.md#raw).

请注意，0 *是允许的重量*. 这不赋予任何投票权，但是
它确实定义了这个地址是组的一部分. 这可以用于
例如 一个 KYC 白名单，表示他们被允许，但不能参与
做决定.

## 消息

基本更新消息、查询和挂钩由
[cw4 规范](01-spec.md). 请参阅它以获取更多信息.

`cw4-group` 添加一条消息来控制组成员身份:

`UpdateMembers{add, remove}` - 获取成员差异并添加/更新
成员，以及删除任何提供的地址. 如果一个地址在两个
列表，它将被删除. 如果它在 `add` 中多次出现，则只有
将使用最后一次出现.
