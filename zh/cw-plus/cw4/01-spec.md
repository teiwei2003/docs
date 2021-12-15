# CW4 规范:组成员

cw4 包源代码:[https://github.com/CosmWasm/cosmwasm-plus/blob/master/packages/cw4/README.md](https://github.com/CosmWasm/cosmwasm-plus/blob/master /packages/cw4/README.md)

CW4是一个存储组成员的规范，可以组合
使用 CW3 多重签名。目的是存储一组成员/选民
可以访问以确定另一部分的权限。

由于这通常被部署为一个合约对，我们期望这个
经常使用 `QueryRaw` 和内部查询的合同
一些数据结构的布局成为公共 API 的一部分。
实现可能会添加更多的数据结构，但至少
此处列出的应在指定的键下并在
相同的格式。

在这种情况下，cw3 合同可以*读取*外部组合同
没有比读取本地存储更多的成本。然而，更新
该团体合同(如果允许)将是一个外部消息，并且
为每个合约收取实例化开销。

## 消息

我们定义了一个 `InitMsg{admin, members}` 来方便设置组
作为另一个流程的一部分。实现应该与这个设置一起工作，
但可能会为非必要扩展添加额外的 `Option<T>` 字段
在 `init` 阶段进行配置。

一个群合约支持三种消息:

`UpdateAdmin{admin}` - 更改(或清除)合约的管理员

`AddHook{addr}` - 添加一个合约地址，每个地址都会被调用
`UpdateMembers` 调用。这只能由管理员调用，并且必须小心
被带走。返回错误或耗尽气体的合约将
恢复成员资格更改(请参阅下面的 Hooks 部分中的更多信息)。

`RemoveHook{addr}` - 注销之前设置的合约地址
通过`AddHook`。

只有 `admin` 可以执行这些功能中的任何一个。因此，通过省略一个
`admin`，我们最终得到了一个类似的功能广告 `cw3-fixed-multisig`。
如果我们包括一个，通常可能希望是一个“cw3”合同
将此团体合同作为一个团体使用。这导致了一些鸡和蛋
问题，但我们介绍了如何在
[`cw3-flexible-multisig`](../cw3/03-cw3-flex-spec.md)

## 查询

### 聪明的

`TotalWeight{}` - 返回所有当前成员的总权重，
如果在“成员百分比”上定义了某些条件，这将非常有用。

`Member{addr, height}` - 如果他们是投票者的成员，则返回该投票者的权重
组(可能是 0)，如果他们不是组的成员，则为“无”。
如果设置了高度并且 cw4 实现支持快照，
这将返回该成员的权重
具有给定高度的块的开始。

`MemberList{start_after, limit}` - 允许我们对列表进行分页
所有成员中。将包括 0 权重成员。删除的成员不会。

`Admin{}` - 返回 `admin` 地址，如果未设置，则返回 `None`。

### 生的

除了上述构成公共 API 的“SmartQueries”之外，
我们定义了两个旨在提高效率的原始查询
在合同合同调用中。这些使用由`cw4`导出的密钥

`TOTAL_KEY` - 使用这个键 (`b"total"`) 进行原始查询将返回一个
JSON 编码的 `u64`

`members_key()` - 接受一个 `CanonicalAddr` 并返回一个可以是
用于原始查询 (`"\x00\x07members" || addr`)。这将返回
如果成员不在组内，则为空字节，否则为
JSON 编码的 `u64`

## 钩子

`cw4` 合约的一个特点是它们允许管理员
注册多个钩子。这些是需要反应的特殊合约
组成员的变化，这使他们保持同步。
再次注意这是一个强大的能力，你应该只设置钩子
到您完全信任的合约，通常是您部署的一些合约
和小组一起。

如果合约被注册为 cw4 合约的钩子，那么任何时候
`UpdateMembers` 执行成功，钩子会收到一个 `handle`
使用以下格式调用:

```json
{
  "member_changed_hook": {
    "diffs": [
      {
        "addr": "cosmos1y3x7q772u8s25c5zve949fhanrhvmtnu484l8z",
        "old_weight": 20,
        "new_weight": 24
      }
    ]
  }
}
```

有关完整详细信息，请参阅 [hook.rs](https://github.com/CosmWasm/cosmwasm-plus/blob/master/packages/cw4/src/hook.rs)。 注意这个例子
显示更新或现有成员。 `old_weight` 将
如果地址是第一次添加，则会丢失。 和
如果地址被删除，`new_weight` 将丢失。

接收合约必须能够处理`MemberChangedHookMsg`
并且只在想要更改功能时才返回错误
组合同的(例如，想要阻止成员资格的多重签名
在有公开提案时更改)。 然而，这样的案例相当
罕见且经常指向脆弱的代码。

请注意，消息发送者将是已更新的组合同。
确保在处理时检查这一点，因此外部参与者无法
调用这个钩子，只有受信任的组。
