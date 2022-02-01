# CW2仕様:移行された契約情報

再購入リンク:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw2](https://github.com/CosmWasm/cosmwasm-plus/tree/master/packages/cw2)

ほとんどのCW *仕様は、*パブリックインターフェイス*に焦点を合わせています
契約. `HandleMsg`または` QueryMsg`のAPI.
ただし、契約Aから契約Bに移行する場合は、
コントラクトBは、何らかの方法で*状態がどのようにエンコードされるか*を知る必要があります.

通常、状態を保存するためにシングルトンとバケットを使用しますが、
「cw20-with-bonding-curve」契約にアップグレードすると、
`cw20-base`コントラクトから移行すると、正常に動作します.しかし、どのように
新しい契約はデータストレージの形式を知ることができますか？

これがCW2の出番です.特別なシングルトンを指定します
`init`によるすべてのコントラクトはディスクに保存されます. 「移行」時
関数が呼び出されると、新しいコントラクトはデータを読み取り、
これが移行可能な契約であるかどうかを確認してください.と
複数の移行をサポートする場合は、追加のバージョン情報を含めてください
道.

### データ構造

**必須**

すべてのCW2準拠の契約では、次のデータを保存する必要があります.

*キー: `\ x00 \ x0dcontract_info`(長さのプレフィックスは" Contract_info "、シングルトンモードが使用されます)
*データ:Jsonは `ContractVersion`をシリアル化しました

```rust
pub struct ContractVersion {
   ///contract is a globally unique identifier for the contract.
   ///it should build off standard namespacing for whichever language it is in,
   ///and prefix it with the registry we use.
   ///For rust we prefix with `crates.io:`, to give us eg. `crates.io:cw20-base`
    pub contract: String,
   ///version is any string that this implementation knows. It may be simple counter "1", "2".
   ///or semantic version on release tags "v0.6.2", or some custom feature flag list.
   ///the only code that needs to understand the version parsing is code that knows how to
   ///migrate from the given contract (and is tied to it's implementation somehow)
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

### お問い合わせ

ステータスが明確に定義されているため、「スマートクエリ」をサポートする必要はありません.
ContractInfoを読み取るための「生のクエリ」を作成するためのヘルパーを提供します
CW2に準拠する契約.
