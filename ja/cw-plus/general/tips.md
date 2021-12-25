# 高度なREPLスキル

::: 危険
最初に[cw20チュートリアル](../cw20/03-cw20-base-tutorial.md)を読む必要があります。 このセクションは上に構築されています
最も重要な。
:::

Node REPLを使用して、手を汚します。 では、もう少し深く掘り下げましょう
使用できる高度な機能。

## インタラクティブディスカバリー

これまでのところ、チュートリアルでコマンドを切り取って貼り付けたのは、
ノードレプリケーションしかし、この契約で他に何ができるでしょうか？ 幸いなことにJavascript
いくつかの良い内省があります。 そして、そこにいくつかの追加の報酬を追加しました。 入力するだけ
REPLで `mine`を実行し、メソッドリストを表示します。

```
>> mine
{ contractAddress: 'cosmos1jatwj0hq5qxrmd6y4qnfrg5lstmdk26akcrasl',
  balance: [AsyncFunction: balance],
  allowance: [AsyncFunction: allowance],
  tokenInfo: [AsyncFunction: tokenInfo],
  minter: [AsyncFunction: minter],
  mint: [AsyncFunction: mint],
  transfer: [AsyncFunction: transfer],
  burn: [AsyncFunction: burn],
  increaseAllowance: [AsyncFunction: increaseAllowance],
  decreaseAllowance: [AsyncFunction: decreaseAllowance],
  transferFrom: [AsyncFunction: transferFrom] }
```

しかし、どうすればそれらを呼び出すことができますか？ 彼らはどのような議論をしますか？
いつでも確認できます
[ネットワークの元のヘルプファイル](https://github.com/CosmWasm/cosmwasm-plus/blob/master/contracts/cw20-base/helpers.ts#L151-L167)
そして、そこで定義されているすべてのタイプを見てください。

しかし、なぜブラウザに切り替えて他のことに気を取られるのでしょうか。
REPLを離れることなくこれを表示できる優れた `.type`演算子があります。

```
>> const _i = mine.increaseAllowance
undefined
>> .type _i
const _i: (recipient: string, amount: string) => Promise<string>

>> const _a = mine.allowance
undefined
>> .type _a
const _a: (owner: string, spender: string) => Promise<string>
```

One note, `.type` is a bit finicky and stops at the first dot, so this simpler version
doesn't work, just describes the `mine` object:

```
>> .type mine.increaseAllowance
const mine: CW20Instance
>> .type mine
const mine: CW20Instance
```

この知識を身につけて、手当を追加してクエリを実行してみましょう

```js
mine.increaseAllowance(other, "5000")
mine.allowance(client.senderAddress, other)
'5000'
```

## Multiple Wallets

You know how we keep starting every session with:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
```

What if I told you there was more you could do here? Don't believe me, just explore
for yourself:

```js
const { setup } = useOptions(hackatomOptions);
.type setup
//this gives:
const setup: (password: string, filename?: string) => Promise<SigningCosmWasmClient>
```

はい... 2番目のパラメータが必要です。 キーを `〜/.coral.key`に保存する必要はありません。 それだけです
デフォルト。 これは、異なるキーファイルを使用して2つのクライアントを作成できることも意味します。

```js
const client = await setup(YOUR_PASSWORD_HERE)
const partner = await setup(OTHER_PASSWORD, "/home/user/.test2.key")

//let's make sure they are unique
client.getAccount()
partner.getAccount()

//and move some tokens around
partner.sendTokens(client.senderAddress, [ { denom: 'ucosm', amount: '200000' }])

client.getAccount()
partner.getAccount()
```

これにより、CW20コントラクトを使用してより複雑なユースケースを試すことができます。
`transferFrom`、` burnFrom`などを行ったり来たりします。

私からのヒントで十分です。
自分で契約を結ぶ時が来ました...
