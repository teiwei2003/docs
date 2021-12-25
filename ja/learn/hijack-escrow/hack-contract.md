# 契約を破る

これで、テストをコンパイルして実行し、コードにいくつかの変更を加えて、それらが機能するかどうかを確認できます。 前のセクションでこれを行っていない場合は、サンプルリポジトリのクローンを作成し、マネージコードを確認します。

```shell
git clone https://github.com/CosmWasm/cosmwasm-examples
cd cosmwasm-examples
git fetch --tags
git checkout escrow-0.10.0
cd contracts/escrow
```

注:このガイドは、 `CosmWasmv0.14.x`および` wasmdv0.16.x`と互換性があります。

## エスクロー契約のウォークスルー

### データ構造

コントラクトでは、3つの主要なデータ構造が使用されます。インスタンス化メッセージのエンコードに使用され、実行メッセージのエンコードに使用され、コントラクトデータの保存に使用されます。すべてのメッセージを `src/msg.rs`で定義します。 `State`構造は通常` state.rs`にありますが、1つしかない場合は、 `contracts.rs`にインライン化するだけで済みます。

さまざまな機能を追加するには、これらすべての前に長い `derive`行を付ける必要があります。それ以外の場合は、 `State`が契約の現在の条件をどのように定義するかを明確にする必要があり、` InitMsg`は契約を構成するための初期データを提供します。 `State`は、複数のコントラクトコール間で保持される*唯一の情報*であることに注意してください。これらの派生命令の目的は次のとおりです。

* `Serialize`、` Deserialize`生成メソッド。したがって、[`serde-json`](https://github.com/serde-rs/json)ライブラリはそれらを逆シリアル化できます([reflection](https://en。 wikipedia.org/wiki/Reflection_(computer_programming))in rust)
* `Clone`を使用すると、オブジェクトのコピーを作成できます(` msg.clone() `)
* `Debug`と` PartialEq`はテストに非常に役立ちます。特に、 `assert_eq！(expected、msg);`を使用できます。
* [`schemars`](https://docs.rs/schemars/0.7.0/schemars)には` JsonSchema`が必要なので、[`schema_for！`](https://docs.rs/schemars/0.7 .0/schemas/macro.schema_for.html)jsonスキーマオブジェクトを生成します( `schema/*。json`内)

`state.rs`から:

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
   ///When end height set and block height exceeds this value, the escrow is expired.
   ///Once an escrow is expired, it can be returned to the original funder (via "refund").
    pub end_height: Option<u64>,
   ///When end time (in seconds since epoch 00:00:00 UTC on 1 January 1970) is set and
   ///block time exceeds this value, the escrow is expired.
   ///Once an escrow is expired, it can be returned to the original funder (via "refund").
    pub end_time: Option<u64>,
}
```

「State」に保存するためのいくつかのヘルパー関数を備えた検証済みアドレスラッパーである「Addr」を使用し、開発者が検証する必要のある無効な「String」アドレスを使用することに注意してください。メッセージとユーザーインタラクションに使用されるコンテンツ。はい[アドレスに関する詳細情報](../../アーキテクチャ/アドレス)。

`Option <u64>`は、このフィールドが欠落している可能性があることをrustに伝える方法です。 `Some(123456)`や
「いいえ」です。これは、initメッセージがこれらのフィールドを省略(または `null`として渡す)する可能性があり、一部を使用する必要がないことを意味します
「0」のような特別な値は、無効になっていることを意味します。

さまざまなコントラクトメソッドを定義する `ExecuteMsg`タイプに目を向けると、もう少し複雑なRust構造[` enum`](https://doc.rust-lang.org/stable/rust-by -example/custom_types/enum。html)。これは[タグ付き共用体または合計型](https://en.wikipedia.org/wiki/Tagged_union)とも呼ばれ、定義された可能なデータ型または「バリアント」の固定セットが含まれています。*そのうちの1つを設定する必要があります* 。それぞれの「バリアント」を使用して、異なるメソッドをエンコードします。たとえば、 `Execute :: Refund {}`はシリアル化可能なリクエストであり、エスクローの払い戻しに使用され、タイムアウト後にのみ有効です。

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Approve {
       //release some coins - if quantity is None, release all coins in balance
        quantity: Option<Vec<Coin>>,
    },
    Refund {},
}
```

ここに別の命令が表示されます( `#[serde(rename_all =" snake_case ")]`)。これにより、jsonは `{" Approve ":{" quantity ":...}}`ではなく `{" approve ":{" quantity ":...}}`のようになります。これは、 `Serialize`と` Deserialize`で生成されたコードを制御します。コンパイル時のコード生成(派生とマクロによる)がRustの基礎になり、他のより動的な言語でのランタイムリフレクションによって提供される機能のほとんどを提供する方法がわかります。

### JSON形式

`ExecuteMsg`のインスタンスがエンコードされると、` {"approve":{"quantity":[{"amount": "10"、 "denom": "ATOM"}]}} `または`のようになります。 {"払い戻し":{}} `。これは、後で `execute`によって処理するためにメッセージ本文を送信するときに、クライアント側で使用する必要がある形式でもあります。

### インスタンス化ロジック

コントラクトを実行する前に、 `instantiate`関数が1回呼び出されます。他のメソッド呼び出しでは変更できない構成を設定できるため、これは「特権」機能です。この例を見ると、最初の行はrawバイトからの入力を解析してコントラクトで定義されたメッセージに変換します。次に、初期状態を作成し、有効期限が切れているかどうかを確認します。有効期限が切れると、一般契約エラーが返されます。それ以外の場合は、状態が保存され、成功コードが返されます。

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

`config`は` state.rs`で定義されており、基盤となる `Storage`と対話するために使用される補助ラッパーです。 プレフィックスとデシリアライズを処理します
一部のテンプレートは自動的に削除されます。 これは完全にオプションであり、「ストレージ」を直接使用することもできます。 また、
特定のユースケース(キューの表現など)を簡単にしたい場合は、他の共有ライブラリを開発して `Storage`と対話することができます。

```rust
pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}
```

### 実行ロジック

`init`が新しいコントラクトをインスタンス化するためのエントリポイントであるように、` handle`はコードを実行するためのエントリポイントです。 `handle`は複数の` variants`を持つ `enum`を受け入れるため、ビジネスロジックに直接ジャンプすることはできませんが、最初にロードステータスとメッセージのディスパッチから始めます。

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

CosmWasmは、JSONでエンコードされたメッセージであると想定して、呼び出す前に着信jsonをコントラクト固有の `ExecuteMsg`に自動的に解析します。また、ボイラープレートなしでロードするために `config_read`を使用することも確認しました。末尾の `？`に注意してください。これは `Result`タイプに適用され、「これがエラーの場合は、潜在的なエラーを返します。これが成功した場合は、値を教えてください」という意味です。これは非常に便利な錆の省略形であり、Goの `if err！= nil {returnerr}`ボイラープレートに置き換わるものです。

[`match`ステートメント](https://doc.rust-lang.org/1.30.0/book/2018-edition/ch06-02-match.html)も表示されます。これは、複数のモードを「切り替える」ことができるもう1つの優れたRustイディオムです。ここでは、 `ExecuteMsg`列挙の複数のバリアントを調べました。すべての状況をカバーしていない場合、コンパイラーは続行を拒否することに注意してください。

`deps`を渡して、ハンドラーがブロックチェーン固有のロジックを提供するランタイムコールバックにアクセスできるようにします。特に、現在、ブロックチェーン固有の方法で `String`を` Addr`として検証するために `deps.api`を使用しています。または、 `secp256k1_verify、ed25519_verify`を使用して、暗号化された署名を検証します。私たちも使用します
`deps.querier`は、契約の現在の残高を照会します。

ここで `try_approve`関数を見ると、メッセージに応答する方法がわかります。 `signer`が期待どおりでない場合は、` unauthorized`エラーを返すことができ、ビジネスロジックがメッセージを拒否した場合は、 `ContractError`を返すことができます。行 `let amount =`は、パターンマッチングを使用して、msgに存在するコインの数(提供されている場合)を使用する方法、またはデフォルトで契約の残高全体を使用する方法を示しています。

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

   //throws error if state is expired
    if state.is_expired(&env) {
        return Err(ContractError::Expired {
            end_height: state.end_height,
            end_time: state.end_time,
        });
    }

    let amount = if let Some(quantity) = quantity {
        quantity
    } else {
       //release everything

       //Querier guarantees to returns up-to-date data, including funds sent in this handle message
       //https://github.com/CosmWasm/wasmd/blob/master/x/wasm/internal/keeper/keeper.go#L185-L192
        deps.querier.query_all_balances(&env.contract.address)?
    };

    Ok(send_tokens(state.recipient, amount, "approve"))
}
```

最後に、成功した場合は、いくつかのトークンを送信します。 Cosmwasmコントラクトは、他のコントラクトを直接呼び出すことはできません。代わりに、リクエストを示すメッセージ( `CosmosMsg :: Bank(BankMsg :: Send)`)を作成し、コントラクトが終了したときにそれを返します。 これは、goの `wasm`モジュールによって解決されます。このモジュールは、同じトランザクションで操作を実行および定義します。 つまり、戻り値にアクセスすることはできませんが、送信が失敗した場合(ユーザーがエスクローのコインよりも多くのコインを指定した場合)、契約のすべての状態変化が復元されることを保証できます... 「無許可」を返す場合。 これは、コードを明確にするためにヘルパーに取り込まれます。

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

`Env`はブロックチェーンからの多くの情報をエンコードすることに注意してください。CosmosSDKからの場合は、基本的に` Context`を提供します。これは検証済みのデータであり、メッセージを比較するために信頼できます。使用可能なすべてのタイプのリファレンスについては、[標準の `cosmwasm`タイプ](https://github.com/CosmWasm/cosmwasm/blob/v0.10.0/packages/std/src/types.rs#L7-L41)を参照してください。環境で。

## 新しいメッセージを追加

この例では、このコントラクトを変更して機能を追加します。特に、契約の裏口を作りましょう。 `ExecuteMsg :: Steel`のバリアントの形式では、ハードコードされた` THIEF`アドレスによって署名され、メッセージに含まれているアドレスに契約残高全体を解放する必要があります。単純？

これは、元のwasmだけに依存するのではなく、コントラクトの背後にあるコードを検証する必要があることも示していることに注意してください。繰り返し可能なコンパイル手順があるため(詳細は以下)、コントラクトに属していると主張するコードを表示した場合、それをコンパイルし、ハッシュをブロックチェーンに格納されているハッシュと比較して、これが実際に元のRustコードであることを確認できます。今後数か月以内に、このステップを自動化して簡単にするためのツールを追加しますが、今のところ、この例を使用して、それが重要である理由を説明します。

### ハンドラーを追加

[選択したエディター](./intro#setting-up-your-ide)で `src/msg.rs`を開き、` ExecuteMsg`列挙に `Steal`という別のバリアントを追加しましょう。ターゲットアドレスが必要であることを忘れないでください。

[ヒントが必要ですか？ ](./edit-escrow-hints#handlemsg)

これで、メッセージハンドラーを追加できます。簡単なチェックとして、 `cargo wasm`を実行するか、IDEでコンパイルエラーを探してみてください。 「マッチング」について私があなたに言ったことを覚えていますか？さて、ここで、 `ExecuteMsg :: Steal`バリアントを処理する関数を追加します。トップレベルの `THIEF`には、プレースホルダーアドレスを使用できます(デプロイ前に所有しているアドレスに設定します)。

[ヒントが必要ですか？ ](./edit-escrow-hints#adding-handler)

終了したら、コンパイルされるかどうかを確認します。

```shell
cargo wasm
```

### テストを書く

`contracts.rs`にはテンプレートとして多くのテストがあるので、それらを使用してみましょう。 `handle_refund`テストをコピーして、名前を` handle_steal`に変更できます。 上部に `#[test]`ステートメントを含めることを忘れないでください。 次に、それを入力して編集し、泥棒が実際に資金を盗むことができるのに対し、他の人はできないことをテストします。 使用する前に、バックドアが正常に機能していることを確認してください。

次に、 `cargo unit-test`を実行して、コードが計画どおりに実行されるかどうかを確認します。 失敗した場合は、「RUST_BACKTRACE = 1カーゴユニットテスト」を試して、完全なスタックトレースを取得してください。 さて、これはSolidityコントラクトをテストするよりも優れているのではないでしょうか。

[ここで解決策を見る](./edit-escrow-hints#test-steal)
