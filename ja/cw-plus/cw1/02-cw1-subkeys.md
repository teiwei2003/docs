# CW1サブキー

[CW1サブキー](https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw1-subkeys)
[Cosmos SDK機能の提案](https://forum.cosmos.network/t/proposal-adding-subkey-feature-to-cosmos-sdk-and-apply-it-to-the-hub/2358)に触発されました。

これは基本的な代理店契約です。いくつかの内部トークンで契約を開始し、
許可されたアカウントは
アローワンス( `spender、denom`)各アカウントの制限。アローワンスロジックは似ています
[CW20](../cw20/01-spec.md)に移動します。承認後、彼らの手当は減らされます、そして
送信されたメッセージが中継されます。十分な承認がない場合は、
または、他の種類のメッセージをプロキシしようとすると、その試みは拒否されます。
管理者は、initmsgブロードキャスト中またはブロードキャスト後にアカウントにクォータを追加できます
中身。

コントラクトには、指定されたキーの実行を許可および禁止するパーミッションロジックが含まれています
特定のニュース。現在、これらのメッセージはステーキングメッセージです(現在、_Delegate、Undelegate、Redelegate、Withdraw_をカバーしています)、
ただし、新しいメッセージタイプを追加できるのは、ほんの数行のコードだけです。アローワンスとパーミッションのチェックは別々に実行されます。つまり、サブキーは消費トークンのアローワンスを持つことができます。
ただし、許可されたメッセージの実行はありません。その逆も同様です。

## 契約デモ

まず、ノードreplを初期化します。

```shell
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/cosmwasm-plus/v0.3.2/contracts/cw1-subkeys/helpers.ts
```

::: warning
ヘルパーコードはcw1-subkeysスマートコントラクトバージョン** v0.3.2 **と互換性があります
:::

Load wallet:

```ts
const client = await useOptions(hackatomOptions).setup(PASSWORD);
const factory = CW1(client);
```

コードと契約をアップロードする:

```ts
//upload using code below
//if the code is already uploaded use code id to initiate
const codeId = await factory.upload()
//contract is already uploaded on heldernet: codeId -> 430
const { address } = await client.getAccount()
const contract = await factory.instantiate(430, { admins: [address], mutable: true}, "My Gift to a Friend")

//print out contract.contractAddress for later
contract.contractAddress
//address -> 'cosmos1q7kc6y94zuvr7wsekg45e6pr8nhef6ku9ugw8r'
```

管理者として「住所」のみのコードから契約書を作成しました。 UpdateManager
デモンストレーションに使用されます。

```ts
//Use a key you control to test out execute with subkey
const friendAddr = "cosmos1ve2n9dd4uy48hzjgx8wamkc7dp7sfdv82u585d"

//generate second address if you don't have one:
//const friendClient = await useOptions(hackatomOptions).setup(PASSWORD, KEY_FILE);
//const friendAddr = await friendClient.getAccount().then(x => x.address);

contract.updateAdmins([address, friendAddr]);
```

最後の行の後、2人の管理者はサブキーマスターコントラクトを制御できます。
`contract.admins()`を実行すると、新しい管理者が追加されたことがわかります。
管理者から友人のアドレスを削除しましょう、あなたは彼を望まない
資金で逃げる。 管理者から彼のアドレスを削除し、契約を凍結します。
フリーズとは、管理者が後で変更できないことを意味します。

```ts
contract.updateAdmins([address])
contract.freeze()
```

### Allowance

Let's give some allowance to your friends account, so he can buy a lambo:

```ts
//lets pour some money to the account
client.sendTokens(contractAddress, [{denom: "ucosm", amount: "1000000"}])
//verify tokens are transferred
client.getAccount(contractAddress)

contract.increaseAllowance(friendAddr, {denom: "ucosm", amount: "90000"})
contract.allowance(friendAddr)
```

次に、彼がメッセージを実行できるかどうかをテストします。 別のターミナル画面を開きます。

```ts
const friendClient = await useOptions(hackatomOptions).setup(PASSWORD, KEY_FILE);
const factory = CW1(friendClient)
const contract = factory.use('cosmos1q7kc6y94zuvr7wsekg45e6pr8nhef6ku9ugw8r')

contract.execute([{bank: {send: {from_address: contractAddress, to_address: address, amount: [{denom: "ucosm", amount: "20000"}]}}}])
```

許可されたアカウントはトークンを使うことができます。 友達を減らしていたずらしましょう
管理端末での彼の手当:

```ts
contract.decreaseAllowance(randomAddress, {denom: "ucosm", amount: "69999"}, { at_height: { height: 40000}})
```

これらの操作の後、彼は_1ucosm_しか使うことができません。 いたずら
最良の部分は `at_height`フィールドです。 40,000の高さの後、彼の手当は
非アクティブとは、彼がトークンを使うことができなくなったことを意味します。

### Permissions

Initially keys do not have any permission to send permissioned messages and needs to be set key basis:

```ts
let permissions: Permissions = { delegate: true, undelegate: false, redelegate: true, withdraw: true}

contract.setStakingPermissions(randomAddress, permissions)

let dmsg: DelegateMsg = {staking: {delegate: {validator:"cosmosvaloper1ez03me7uljk7qerswdp935vlaa4dlu487syyhn", amount:{denom:"ureef",amount:"999"}}}}
contract.execute([dmsg])
//will be approved

let unmsg: UndelegateMsg = {staking: {undelegate: {validator:"cosmosvaloper1ez03me7uljk7qerswdp935vlaa4dlu487syyhn", amount:{denom:"ureef",amount:"999"}}}}
contract.execute([unmsg])
//will be rejected

```

## 助ける

このコントラクトロジックは、さまざまなメッセージタイプを追加することで改善できます。
メッセージの種類、1日の消費量など、さまざまな権限。 試験
[cosmos sdkプロポーザル](https://forum.cosmos.network/t/proposal-adding-subkey-feature-to-cosmos-sdk-and-apply-it-to-the-hub/2358)
その他のアイデア。
