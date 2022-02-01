# 破解合约

现在您可以编译和运行测试，让我们尝试对代码进行一些更改，您可以查看它们是否有效. 如果您在上一节中还没有这样做，那么是时候克隆示例存储库并查看托管代码了:

```shell
git clone https://github.com/CosmWasm/cosmwasm-examples
cd cosmwasm-examples
git fetch --tags
git checkout escrow-0.10.0
cd contracts/escrow
```

注意:本指南与 `CosmWasm v0.14.x` 和 `wasmd v0.16.x` 兼容.

## 托管合同的演练

### 数据结构

合约中使用了三种关键数据结构——用于编码实例化消息、用于编码执行消息以及用于存储合约数据.我们在 `src/msg.rs` 中定义所有消息. `State` 结构通常在 `state.rs` 中，但如果只有一个，那么只需内联在 `contracts.rs` 中.

所有这些都必须以很长的 `derive` 行作为前缀以添加各种功能.否则，应该很清楚 `State` 如何定义合约的当前条件，`InitMsg` 将提供初始数据来配置所述合约.请注意，`State` 是多个合约调用之间保留的*唯一信息*.这些 `derive` 指令的目的:

* `Serialize`, `Deserialize` 生成方法，因此 [`serde-json`](https://github.com/serde-rs/json) 库可以反序列化它们(没有 [反射](https: //en.wikipedia.org/wiki/Reflection_(computer_programming)) in rust)
* `Clone` 允许您制作对象的副本 (`msg.clone()`)
* `Debug` 和 `PartialEq` 对测试非常有用.特别是它们允许使用 `assert_eq!(expected, msg);`
* [`schemars`](https://docs.rs/schemars/0.7.0/schemars) 需要`JsonSchema`，所以我们可以使用[`schema_for!`](https://docs.rs/schemars /0.7.0/schemars/macro.schema_for.html) 生成 json 模式对象(在 `schema/*.json` 中)

来自`state.rs`:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub arbiter: Addr,
    pub recipient: Addr,
    pub source: Addr,
    pub end_height: Option<u64>,
    pub end_time: Option<u64>,
}
```

From `msg.rs`:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub arbiter: String,
    pub recipient: String,
    /// When end height set and block height exceeds this value, the escrow is expired.
    /// Once an escrow is expired, it can be returned to the original funder (via "refund").
    pub end_height: Option<u64>,
    /// When end time (in seconds since epoch 00:00:00 UTC on 1 January 1970) is set and
    /// block time exceeds this value, the escrow is expired.
    /// Once an escrow is expired, it can be returned to the original funder (via "refund").
    pub end_time: Option<u64>,
}
```

请注意，我们使用“Addr”，它是一个经过验证的地址包装器，带有一些用于存储在“State”中的辅助函数，而我们使用应由开发人员验证的无效的“String”地址，用于消息和与用户交互的任何内容.有 [关于地址的更多信息](../../architecture/addresses).

`Option<u64>` 是一种告诉 rust 这个字段可能缺失的方法.它可能有一个值，比如 `Some(123456)` 或
是`无`.这意味着 init 消息可能会省略这些字段(或将它们作为 `null` 传递)并且我们不需要使用一些
像“0”这样的特殊值表示已禁用.

转到定义不同合约方法的 `ExecuteMsg` 类型，我们使用稍微复杂的 Rust 构造，[`enum`](https://doc.rust-lang.org/stable/rust-by -example/custom_types/enum.html).这也称为 [标记联合或总和类型](https://en.wikipedia.org/wiki/Tagged_union)，并包含一组固定的已定义可能数据类型或“变体”，*正是其中之一必须设置*.我们使用每个“变体”来编码不同的方法.例如 `Execute::Refund{}` 是一个可序列化的请求，用于退还托管，仅在超时后有效.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Approve {
        // release some coins - if quantity is None, release all coins in balance
        quantity: Option<Vec<Coin>>,
    },
    Refund {},
}
```

你可以在这里看到另一个指令(`#[serde(rename_all = "snake_case")]`). 这确保 json 看起来像:`{"approve": {"quantity": ...}}` 而不是 `{"Approve": {"quantity": ...}}`. 这控制了用 `Serialize` 和 `Deserialize` 生成的代码. 您会看到编译时代码生成(通过派生和宏)如何成为 Rust 的基石，并在其他更动态的语言中提供由运行时反射提供的大部分功能.

### JSON 格式

当一个 `ExecuteMsg` 实例被编码时，它最终看起来像 `{"approve": {"quantity": [{"amount": "10", "denom": "ATOM"}]}}` 或 ` {“退款”:{}}`. 这也是我们应该在客户端使用的格式，当提交消息体以供稍后由 `execute` 处理时.

### 实例化逻辑

在执行合约之前，`instantiate` 函数将被调用一次. 它是一个“特权”功能，因为它可以设置任何其他方法调用都无法修改的配置. 如果你看这个例子，第一行将输入从原始字节解析为我们的合约定义的消息. 然后我们创建初始状态，并检查它是否已经过期. 如果过期，我们返回一个通用的合约错误，否则，我们存储状态并返回一个成功代码:

```rust
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        arbiter: deps.api.addr_validate(&msg.arbiter)?,
        recipient: deps.api.addr_validate(&msg.recipient)?,
        source: info.sender,
        end_height: msg.end_height,
        end_time: msg.end_time,
    };

    if state.is_expired(&env) {
        return Err(ContractError::Expired {
            end_height: msg.end_height,
            end_time: msg.end_time,
        });
    }

    config(deps.storage).save(&state)?;
    Ok(Response::default())
}
```

`config` 定义在 `state.rs` 中，是一个辅助包装器，用于与底层的 `Storage` 交互. 它处理前缀和反/序列化
自动为您删除一些样板. 它是完全可选的，您也可以直接使用“存储”. 我们也鼓励
如果您想让某些用例更容易(例如，表示队列)，您可以开发其他共享库以与 `Storage` 交互:

```rust
pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}
```

### 执行逻辑

正如 `init` 是实例化新合约的入口点一样，`handle` 是执行代码的入口点. 由于 `handle` 接受一个带有多个 `variants` 的 `enum`，我们不能直接跳入业务逻辑，而是首先从加载状态和分派消息开始:

```rust
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    let state = config_read(deps.storage).load()?;
    match msg {
        ExecuteMsg::Approve { quantity } => try_approve(deps, env, state, info, quantity),
        ExecuteMsg::Refund {} => try_refund(deps, env, info, state),
    }
}
```

CosmWasm 在调用之前自动将传入的 json 解析为特定于合约的 `ExecuteMsg`，假设是 JSON 编码的消息.我们还看到使用 `config_read` 在没有任何样板的情况下加载.注意尾随的`?`.这适用于 `Result` 类型并意味着，“如果这是一个错误，则返回潜在的错误.如果这是成功的，请给我值”.这是一个非常有用的 rust 速记，并替换了 Go 中的 `if err != nil { return err }` 样板.

您还将看到 [`match` 语句](https://doc.rust-lang.org/1.30.0/book/2018-edition/ch06-02-match.html).这是另一个不错的 Rust 习惯用法，它允许您在多个模式之间“切换”.在这里，我们检查了 `ExecuteMsg` 枚举的多个变体.请注意，如果您没有涵盖所有情况，编译器将拒绝继续.

我们传入 `deps` 来让处理程序访问运行时回调，它提供特定于区块链的逻辑.特别是，我们目前使用 `deps.api` 以特定于区块链的方式将 `String` 验证为 `Addr`.或者使用 `secp256k1_verify,ed25519_verify` 验证加密签名.我们也使用
`deps.querier` 查询合约的当前余额.

如果我们现在查看 `try_approve` 函数，我们将看到如何响应消息.如果 `signer` 不是我们期望的，我们可以返回 `unauthorized` 错误，如果我们的业务逻辑拒绝消息，我们可以返回 `ContractError`. `let amount =` 行显示了我们如何使用模式匹配来使用 msg 中存在的硬币数量(如果提供)，或者默认为合约的整个余额.

```rust
fn try_approve(
    deps: DepsMut,
    env: Env,
    state: State,
    info: MessageInfo,
    quantity: Option<Vec<Coin>>,
) -> Result<Response, ContractError> {
    if info.sender != state.arbiter {
        return Err(ContractError::Unauthorized {});
    }

    // throws error if state is expired
    if state.is_expired(&env) {
        return Err(ContractError::Expired {
            end_height: state.end_height,
            end_time: state.end_time,
        });
    }

    let amount = if let Some(quantity) = quantity {
        quantity
    } else {
        // release everything

        // Querier guarantees to returns up-to-date data, including funds sent in this handle message
        // https://github.com/CosmWasm/wasmd/blob/master/x/wasm/internal/keeper/keeper.go#L185-L192
        deps.querier.query_all_balances(&env.contract.address)?
    };

    Ok(send_tokens(state.recipient, amount, "approve"))
}
```

最后，如果成功，我们想发送一些令牌. Cosmwasm 合约不能直接调用其他合约，相反，我们创建一条消息来表示我们的请求 (`CosmosMsg::Bank(BankMsg::Send)`) 并在我们的合约结束时返回它. 这将由 go 中的 `wasm` 模块解析，它将在同一事务中*执行和定义操作. 这意味着，虽然我们将无法访问返回值，但我们可以确保如果发送失败(用户指定的硬币比托管中的硬币多)，则该合约中的所有状态更改都将被还原......就像 如果我们返回“未经授权”. 这被拉入一个助手以使代码更清晰:

```rust
fn send_tokens(to_address: Addr, amount: Vec<Coin>, action: &str) -> Response {
    let attributes = vec![attr("action", action), attr("to", to_address.clone())];

    Response {
        submessages: vec![],
        messages: vec![CosmosMsg::Bank(BankMsg::Send {
            to_address: to_address.into(),
            amount,
        })],
        data: None,
        attributes,
    }
}
```

请注意，`Env` 编码了来自区块链的大量信息，如果您来自 Cosmos SDK，则本质上提供了 `Context`.这是经过验证的数据，可以信任来比较任何消息.请参阅[标准`cosmwasm` 类型](https://github.com/CosmWasm/cosmwasm/blob/v0.10.0/packages/std/src/types.rs#L7-L41) 以获取所有可用类型的参考在环境中.

## 添加新消息

在此示例中，我们将修改此合约以添加更多功能.特别是，让我们为合约制作一个后门.以 `ExecuteMsg::Steal` 变体的形式，必须由一些硬编码的 `THIEF` 地址签名，并将整个合约余额释放到消息中包含的地址.简单的？

请注意，这也表明需要验证合约背后的代码，而不仅仅是依赖原始 wasm.由于我们有一个可重复的编译步骤(详细信息如下)，如果我向您展示我声称属于合约的代码，您可以编译它并将哈希与存储在区块链上的哈希进行比较，以验证这确实是原始的锈代码.在接下来的几个月中，我们将添加工具来自动执行此步骤并使其更简单，但就目前而言，此示例用于说明为什么它很重要.

### 添加处理程序

在您的[选择的编辑器](./intro#setting-up-your-ide) 中打开`src/msg.rs`，让我们向`ExecuteMsg` 枚举添加另一个变体，称为`Steal`.请记住，它必须有一个目标地址:

[需要提示吗？](./edit-escrow-hints#handlemsg)

现在，您可以添加消息处理程序.作为快速检查，尝试运行 `cargo wasm` 或在您的 IDE 中查找编译错误.还记得我告诉你的关于“匹配”的内容吗？好的，现在，添加一个函数来处理 `ExecuteMsg::Steal` 变体.对于顶级`THIEF`，您可以使用占位符地址(我们将在部署前将其设置为您拥有的地址).

[需要提示吗？](./edit-escrow-hints#adding-handler)

完成后，检查它是否编译:

```shell
cargo wasm
```

### 编写测试

我们在 `contracts.rs` 中有许多测试作为模板，所以让我们使用它们. 您可以复制 `handle_refund` 测试并将其重命名为 `handle_steal`. 请记住在顶部包含 `#[test]` 声明. 现在，进入并编辑它以测试小偷确实可以窃取资金，而其他人则无法窃取. 在我们尝试使用它之前，请确保我们的后门工作正常.

现在，尝试运行 `cargo unit-test` 并查看您的代码是否按计划运行. 如果失败，请尝试“RUST_BACKTRACE=1 cargo unit-test”以获取完整的堆栈跟踪. 现在，这不是比尝试测试 Solidity 合约更好吗？

[在此处查看解决方案](./edit-escrow-hints#test-steal)
