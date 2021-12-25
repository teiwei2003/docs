# テスト

<iframe src = "https://player.vimeo.com/video/457705991" width = "640" height = "360" frameborder = "0" allow = "autoplay; fullscreen" allowfullscreen> </iframe>

コードはこの時点でコンパイルされているはずですが、機能するかどうかはテストされていません。
変更を加えるたびに、コードをチェーンにデプロイできます。 しかし、さあ、あなたの時間はそれよりも貴重です。
さらに、契約を乱さないようにし、将来の変更をテストするのが最善です。

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info, MOCK_CONTRACT_ADDR};
    use cosmwasm_std::{attr, coins, CosmosMsg};
```

これがRustでのテストの始まりです。 [コードリファレンス](https://github.com/CosmWasm/cosmwasm-examples/blob/master/simple-option/src/contract.rs)。
テストとコードを同じファイルまたは別々のファイルに保存できます。

## Test Initialization

::: tip
Timecode [https://vimeo.com/457705991#t=3m34s](https://vimeo.com/457705991#t=3m34s)
:::

テストごとに、ブロック時間、状態などの特定の変数をモックする必要があります。 簡単に設定できる関数を作成します。

```rust
#[test]
fn proper_initialization() {
    let mut deps = mock_dependencies(&[]);

    let msg = InitMsg {
        counter_offer: coins(40, "ETH"),
        expires: 100_000,
    };
    let info = mock_info("creator", &coins(1, "BTC"));

   //we can just call .unwrap() to assert this was a success
    let res = init(deps.as_mut(), mock_env(), info, msg).unwrap();
    assert_eq!(0, res.messages.len());

   //it worked, let's query the state
    let res = query_config(deps.as_ref()).unwrap();
    assert_eq!(100_000, res.expires);
    assert_eq!("creator", res.owner.as_str());
    assert_eq!("creator", res.creator.as_str());
    assert_eq!(coins(1, "BTC"), res.collateral);
    assert_eq!(coins(40, "ETH"), res.counter_offer);
}
```

これで、テスト環境の初期化プログラムができました。 これは非常に単純な方法であり、変数を関数に渡してさまざまな調整を行うことができます。
詳細については、cosmwasm-plusを参照してください。

### 依存関係、環境、メッセージ情報をシミュレートする

2つの3つのシミュレーションツールを改善する必要があります。

```rust
///All external requirements that can be injected for unit tests.
///It sets the given balance for the contract itself, nothing else
pub fn mock_dependencies(
    contract_balance: &[Coin],
) -> OwnedDeps<MockStorage, MockApi, MockQuerier> {
    let contract_addr = HumanAddr::from(MOCK_CONTRACT_ADDR);
    OwnedDeps {
        storage: MockStorage::default(),
        api: MockApi::default(),
        querier: MockQuerier::new(&[(&contract_addr, contract_balance)]),
    }
}
```

これにより、ストレージ、API、クエリなどのテストの依存関係が設定されます。

```rust
///Returns a default enviroment with height, time, chain_id, and contract address
///You can submit as is to most contracts, or modify height/time if you want to
///test for expiration.
///
///This is intended for use in test code only.
pub fn mock_env() -> Env {
    Env {
        block: BlockInfo {
            height: 12_345,
            time: 1_571_797_419,
            time_nanos: 879305533,
            chain_id: "cosmos-testnet-14002".to_string(),
        },
        contract: ContractInfo {
            address: HumanAddr::from(MOCK_CONTRACT_ADDR),
        },
    }
}
```

`mock_env` is for mocking block, and contract environment.

```rust
///Just set sender and sent funds for the message. The essential for
///This is intended for use in test code only.
pub fn mock_info<U: Into<HumanAddr>>(sender: U, sent: &[Coin]) -> MessageInfo {
    MessageInfo {
        sender: sender.into(),
        sent_funds: sent.to_vec(),
    }
}
```

`mock_info` is for mocking transaction environment.

## Test Handler

::: tip
Timecode [https://vimeo.com/457705991#t=7m34s](https://vimeo.com/457705991#t=7m34s)
:::

### Test Transfer Handler

```rust
#[test]
fn transfer() {
    let mut deps = mock_dependencies(&[]);

    let msg = InitMsg {
        counter_offer: coins(40, "ETH"),
        expires: 100_000,
    };
    let info = mock_info("creator", &coins(1, "BTC"));

   //we can just call .unwrap() to assert this was a success
    let res = init(deps.as_mut(), mock_env(), info, msg).unwrap();
    assert_eq!(0, res.messages.len());

   //random cannot transfer
    let info = mock_info("anyone", &[]);
    let err = handle_transfer(deps.as_mut(), mock_env(), info, HumanAddr::from("anyone"))
        .unwrap_err();
    match err {
        ContractError::Unauthorized {} => {}
        e => panic!("unexpected error: {}", e),
    }

   //owner can transfer
    let info = mock_info("creator", &[]);
    let res =
        handle_transfer(deps.as_mut(), mock_env(), info, HumanAddr::from("someone")).unwrap();
    assert_eq!(res.attributes.len(), 2);
    assert_eq!(res.attributes[0], attr("action", "transfer"));

   //check updated properly
    let res = query_config(deps.as_ref()).unwrap();
    assert_eq!("someone", res.owner.as_str());
    assert_eq!("creator", res.creator.as_str());
}
```

### Test Execute

::: tip
Timecode [https://vimeo.com/457705991#t=14m21s](https://vimeo.com/457705991#t=14m21s)
:::

```rust
#[test]
fn execute() {
    let mut deps = mock_dependencies(&[]);

    let amount = coins(40, "ETH");
    let collateral = coins(1, "BTC");
    let expires = 100_000;
    let msg = InitMsg {
        counter_offer: amount.clone(),
        expires: expires,
    };
    let info = mock_info("creator", &collateral);

   //we can just call .unwrap() to assert this was a success
    let _ = init(deps.as_mut(), mock_env(), info, msg).unwrap();

   //set new owner
    let info = mock_info("creator", &[]);
    let _ = handle_transfer(deps.as_mut(), mock_env(), info, HumanAddr::from("owner")).unwrap();

   //random cannot execute
    let info = mock_info("creator", &amount);
    let err = handle_execute(deps.as_mut(), mock_env(), info).unwrap_err();
    match err {
        ContractError::Unauthorized {} => {}
        e => panic!("unexpected error: {}", e),
    }

   //expired cannot execute
    let info = mock_info("owner", &amount);
    let mut env = mock_env();
    env.block.height = 200_000;
    let err = handle_execute(deps.as_mut(), env, info).unwrap_err();
    match err {
        ContractError::OptionExpired { expired } => assert_eq!(expired, expires),
        e => panic!("unexpected error: {}", e),
    }

   //bad counter_offer cannot execute
    let msg_offer = coins(39, "ETH");
    let info = mock_info("owner", &msg_offer);
    let err = handle_execute(deps.as_mut(), mock_env(), info).unwrap_err();
    match err {
        ContractError::CounterOfferMismatch {
            offer,
            counter_offer,
        } => {
            assert_eq!(msg_offer, offer);
            assert_eq!(amount, counter_offer);
        }
        e => panic!("unexpected error: {}", e),
    }

   //proper execution
    let info = mock_info("owner", &amount);
    let res = handle_execute(deps.as_mut(), mock_env(), info).unwrap();
    assert_eq!(res.messages.len(), 2);
    assert_eq!(
        res.messages[0],
        CosmosMsg::Bank(BankMsg::Send {
            from_address: MOCK_CONTRACT_ADDR.into(),
            to_address: "creator".into(),
            amount,
        })
    );
    assert_eq!(
        res.messages[1],
        CosmosMsg::Bank(BankMsg::Send {
            from_address: MOCK_CONTRACT_ADDR.into(),
            to_address: "owner".into(),
            amount: collateral,
        })
    );

   //check deleted
    let _ = query_config(deps.as_ref()).unwrap_err();
}
```

Now run the tests:

```shell
cargo test
```

すべてが緑色の場合、コードはチェーン上で機能します。
