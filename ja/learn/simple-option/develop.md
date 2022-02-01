# 開発契約

<iframe src = "https://player.vimeo.com/video/457702442" width = "640" height = "360" frameborder = "0" allow = "autoplay; fullscreen" allowfullscreen> </iframe>

まず、スターターが機能するかどうかをテストし、錆テストの結果に目を慣れさせます.

```shell
cargo unit-test
Compiling proc-macro2 v1.0.24
  Compiling unicode-xid v0.2.1
  Compiling syn v1.0.58
  Compiling serde_derive v1.0.120
  Compiling serde v1.0.120
  Compiling ryu v1.0.5
  Compiling serde_json v1.0.61
  Compiling schemars v0.7.6
  Compiling itoa v0.4.7
  Compiling base64 v0.13.0
  Compiling quote v1.0.8
  Compiling serde_derive_internals v0.25.0
  Compiling schemars_derive v0.7.6
  Compiling thiserror-impl v1.0.23
  Compiling cosmwasm-derive v0.13.2
  Compiling thiserror v1.0.23
  Compiling serde-json-wasm v0.2.3
  Compiling cosmwasm-std v0.13.2
  Compiling cosmwasm-schema v0.13.2
  Compiling cosmwasm-storage v0.13.2
  Compiling simple-option v0.8.0 (/home/orkunkl/Workspace/cosmwasm/cosmwasm-examples/simple-option)
    Finished test [unoptimized + debuginfo] target(s) in 25.42s
      Running target/debug/deps/simple_option-6787c8970c576a03

running 4 tests
test contract::tests::proper_initialization ... ok
test contract::tests::transfer ... ok
test contract::tests::burn ... ok
test contract::tests::execute ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

```

すべて良い.

::: ヒント
タイムコード[https://vimeo.com/457702442#t=39s](https://vimeo.com/457702442#t=39s)
:::

[src/lib.rs](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/lib.rs)ファイルにはwasmバインディングが含まれています. スマートコントラクト*(handle、init、query)*関数をRust関数の周りにラップします. 高度なwasm調整を行っていない場合は、触れないでください.

## 情報

::: ヒント
タイムコード[https://vimeo.com/457702442#t=1m46s](https://vimeo.com/457702442#t=1m46s)
:::

スマートコントラクトの入力データ構造を含む[src/msg.rs](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/msg.rs)で開発が開始されました.

### 初期化メッセージ

[`InitMsg`](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/msg.rs)から始めます. この構造には、コードからスマートコントラクトを初期化するための初期値があり、ロジック設定に必要なデータを提供します.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InitMsg {
   //owner and creator come from env
   //collateral comes from env
    pub counter_offer: Vec<Coin>,
    pub expires: u64,
}
```

`#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]` implements specified traits for this structure using macros. More read [Rust docs/Derive](https://doc.rust-lang.org/stable/rust-by-example/trait/derive.html)

::: warning
* _Owner_, _creator_ and _collateral_ comes from message transaction context, meaning owner and creator is the address signed the tx and collateral is funds sent along the message.
* _counter_offer_ is [strike price](https://www.investopedia.com/terms/s/strikeprice.asp).
:::

### HandleMsg

コントラクトの実行は、 `HandleMsg`列挙型を使用して分岐されます.各フィールドは、メッセージとそのメッセージのコンテンツを定義します.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum HandleMsg {
   ///Owner can transfer to a new owner
    Transfer { recipient: HumanAddr },
   ///Owner can post counter_offer on unexpired option to execute and get the collateral
    Execute {},
   ///Burn will release collateral if expired
    Burn {},
}
```

::: ヒント
標準および人間のアドレス
正規アドレスは、暗号アドレスのバイナリ形式を表します.
一方、人間の住所はUIに最適です.これらは常にASCIIテキストのサブセットであり、多くの場合、Bech32のチェーンプレフィックス(cosmos1h57760w793q6vh06jsppnqdkc4ejcuyrrjxnkeなど)などのセキュリティチェックが含まれています.

`canonicalize(humanize(canonical_addr)) == canonical_addr`

For more details: [Names and Addresses](/architecture/addresses.md)
:::

### QueryMsg

スマートコントラクトの状態クエリは、 `QueryMsg`列挙型を使用して分岐します.スマートコントラクトの` Config`クエリは後で実装します.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    Config {},
}
```

## State

::: ヒント
タイムコード[https://vimeo.com/457702442#t=7m36s](https://vimeo.com/457702442#t=7m36s)
:::

[状態](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/state.rs)は、スマートコントラクトデータが保存およびアクセスされるデータベースの状態を処理します.

状態をモデリングする場合、2つのオプションがあります.
1. **シングルトン**:コントラクトは、一意のdbキーを使用して構造のインスタンスを1つだけ保存します.このチュートリアルでは、これを使用します.
2.**構造化ストア**:モデルは動的に構造化および保存できます.インデックス作成およびルックアップ機能を使用して、1対1、1対多、および多対多の関係を形成できます.

```rust
//configuration instance key. config object will be saved under this key.
pub static CONFIG_KEY: &[u8] = b"config";

//contract state structure, this will be saved.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub creator: HumanAddr,
    pub owner: HumanAddr,
    pub collateral: Vec<Coin>,
    pub counter_offer: Vec<Coin>,
    pub expires: u64,
}

pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<State> {
    singleton_read(storage, CONFIG_KEY)
}

```


## コントラクトハンドラー

::: ヒント
タイムコード[https://vimeo.com/457702442#t=11m12s](https://vimeo.com/457702442#t=11m12s)
:::

レゴブロック** msgs **、** handler **、** state **が定義されています. 次に、[contract.rs](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/contract.rs)でそれらをバインドする必要があります.

### 中身

コントラクトを実行する前に、init関数が1回呼び出されます. これは「特権」機能です.
他のメソッド呼び出しでは変更できない構成を設定できます. 最初の行は、rawからの入力を解析します
契約で定義されたメッセージへのバイト. 次に、オプションの有効期限が切れているかどうかを確認してから、初期状態を作成します. 有効期限が切れた場合、
一般的な契約エラーを返します.それ以外の場合は、状態を保存して成功コードを返します.

```rust
pub fn init(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InitMsg,
) -> Result<InitResponse, ContractError> {
    if msg.expires <= env.block.height {
        return Err(ContractError::OptionExpired {
            expired: msg.expires,
        });
    }

    let state = State {
        creator: info.sender.clone(),
        owner: info.sender.clone(),
        collateral: info.sent_funds,
        counter_offer: msg.counter_offer,
        expires: msg.expires,
    };

    config(deps.storage).save(&state)?;

    Ok(InitResponse::default())
}
```

機能は見た目はシンプルです.オプションの有効期限を確認し、状態を保存して、応答を返します.

```rust
pub fn init(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InitMsg,
) -> Result<InitResponse, ContractError> {
```

このシグネチャは、CosmWasmハンドラー関数に表示されます. Depsによってハンドラーに渡された実行コンテキストを使用します.これには、ストレージ、API、およびQuerier関数が含まれます.Envには、ブロック、メッセージ、およびコントラクト情報が含まれます.MSGについては、説明は必要ありません.

`Result <T、ContractError>`は、成功([`Ok`])または失敗([` Err`])を示すタイプです. 実行が成功した場合はタイプ `T`を返し、そうでない場合は` ContractError`を返します. できます.

### 対処する

::: ヒント
タイムコード[https://vimeo.com/457702442#t=15m55s](https://vimeo.com/457702442#t=15m55s)
:::

`handle`メソッドは、メッセージを関数にルーティングします. これは、CosmosSDKハンドラーの設計に似ています.

```rust
pub fn handle(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: HandleMsg,
) -> Result<HandleResponse, ContractError> {
    match msg {
        HandleMsg::Transfer { recipient } => handle_transfer(deps, env, info, recipient),
        HandleMsg::Execute {} => handle_execute(deps, env, info),
        HandleMsg::Burn {} => handle_burn(deps, env, info),
    }
}

```

#### Transfer

```rust
pub fn handle_transfer(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    recipient: HumanAddr,
) -> Result<HandleResponse, ContractError> {
   //ensure msg sender is the owner
    let mut state = config(deps.storage).load()?;
    if info.sender != state.owner {
        return Err(ContractError::Unauthorized {});
    }

   //set new owner on state
    state.owner = recipient.clone();
    config(deps.storage).save(&state)?;

    let mut res = Context::new();
    res.add_attribute("action", "transfer");
    res.add_attribute("owner", recipient);
    Ok(res.into())
}
```


#### 执行

你会在 plus 和示例智能合约中看到 `handle_execute`，但实际上它只是一个命名，没什么特别的.
大多数功能与`transfer`相同. 只有两个新东西:消息资金检查和返回上下文中的 sdk 消息.

```rust
pub fn handle_execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<HandleResponse, ContractError> {
   //ensure msg sender is the owner
    let state = config(deps.storage).load()?;
    if info.sender != state.owner {
        return Err(ContractError::Unauthorized {});
    }

   //ensure not expired
    if env.block.height >= state.expires {
        return Err(ContractError::OptionExpired {
            expired: state.expires,
        });
    }

   //ensure sending proper counter_offer
    if info.sent_funds != state.counter_offer {
        return Err(ContractError::CounterOfferMismatch {
            offer: info.sent_funds,
            counter_offer: state.counter_offer,
        });
    }

   //release counter_offer to creator
    let mut res = Context::new();
    res.add_message(BankMsg::Send {
        from_address: env.contract.address.clone(),
        to_address: state.creator,
        amount: state.counter_offer,
    });

   //release collateral to sender
    res.add_message(BankMsg::Send {
        from_address: env.contract.address,
        to_address: state.owner,
        amount: state.collateral,
    });

   //delete the option
    config(deps.storage).remove();

    res.add_attribute("action", "execute");
    Ok(res.into())
}
```

### Query

このコントラクトクエリメソッドは非常に単純で、構成クエリのみです.
より複雑なクエリについては、[cosmwasm-plus](https://github.com/CosmWasm/cosmwasm-plus/)コントラクトを確認してください.
ゼロから学び始めた場合は、20分のcosmwasmの経験があります.スキムと契約を進めて、シンプルさを確認してください.

```rust
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_binary(&query_config(deps)?),
    }
}

fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let state = config_read(deps.storage).load()?;
    Ok(state)
}
```

### Build

単純にコードをビルドして、それが機能するかどうかを確認するには、次のようにします.

```shell
cargo build
```

### Tooling

読みやすさのためにスマートコントラクト全体で同じコーディングスタイルを維持し、高いコード品質のためにそれをリントするのは良いことです:

```shell
rustup update
rustup component add clippy rustfmt
```

```shell
cargo fmt
```

通常、Rustコンパイラはその仕事をうまく行い、エラーの解決策に導き、警告などを表示します.
ただし、コードでlinterを実行することは常に良いことです.

```shell
cargo clippy -- -D warnings
```

### Compile

このセクションでは、[Compiling Contract](/getting-started/compile-contract.md)ドキュメントの主要なコマンドをコンパイルします.詳細については、ドキュメントに進んでください.

基本的なコンパイル:

```shell
cargo wasm
```

最適化されたコンパイル:

```shell
RUSTFLAGS='-C link-arg=-s' cargo wasm
```

Reproducible and optimized compilation:

```shell
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.10.7
```

チェーンにデプロイする前に、上記のコマンドを使用する必要があります.

### Schema

コントラクトを使用しようとするすべての人のガイドとして機能するJSONスキーマを生成することもできます.これは主にドキュメント化を目的としていますが、コードエクスプローラーで[TypeScript定義を開く]をクリックすると、それらを使用して生成する方法を確認できます. TypeScriptバインディング.

```shell
cargo schema
```

生成されたスキーマは[simple-option/schema](https://github.com/CosmWasm/cosmwasm-examples/tree/master/simple-option/schema)で確認できます.

```
schema
├── config_response.json
├── handle_msg.json
├── init_msg.json
└── query_msg.json
```

先に進み、スキーマを調べてください.
