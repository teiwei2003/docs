# cw20-ベースチュートリアル

:::暖かい
このチュートリアルは、cosmjs0.23には適用されません. 0.24が出たら修正されます.
:::

これは、強力なノードREPLと対話する方法を示す簡単なチュートリアルです.
[musselnet](https://github.com/CosmWasm/testnets/tree/master/musselnet)CW20トークン契約(ERC20などの代替トークン).

コントラクトコードのアップロードと特定のインスタンス(同じ `cw20-base`)の作成について説明します
wasmコードを再利用して、さまざまなシンボルとディストリビューションを持つ数十のトークンコントラクトを作成できます).
次に、契約を簡単に操作する方法を説明します. JSON操作およびローカル変数として
BASHにはそれほど楽しいものはありません.[`@ cosmjs/cli`](https://github.com/CosmWasm/cosmjs/tree/master/packages/cli)を使用します
`wasmd`CLIツールの代わりのツール.

しかし、スマートコントラクトをプレイする楽しい部分に入る前に、確認したいのは
あなたはあなたの秘密鍵を失う代わりにあなたのツールを使う方法を知っています.

Node 10+を実行するには、ローカルにインストールする必要があります. Ubuntuでテストされていますが、そうでない場合があります
Windowsでは正常に動作します(HOME環境変数を想定しています). PRへようこそ.

## チェーンに接続する

何かをする前の最初のステップは、アカウントを作成してチェーンに接続できることを確認することです.
常に次のコマンドを使用して `@ cosmjs/cli`を起動し、cw20固有のヘルパーをプリロードします.
(それが持っているすべての一般的なアシスタントを除いて).

```shell
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/cosmwasm-plus/master/contracts/cw20-base/helpers.ts
```

ソースコードをダウンロードして起動すると、黄色のテキスト(プリロードされているコードを示す)が表示されます.
次に、おなじみのノードプロンプトがあります: `>>`. これはスーパーチャージされたREPLであり、 `await`を使用できることに注意してください.
`Promises`を簡単に使用し、コードを実行する前にタイプチェックします. タイプを定義する必要はありません、
ただし、 `client.getCodez()`と入力すると、有用な情報が得られます.
'SigningCosmWasmClient'タイプの属性 'getCodez'は存在しません. 「getCodes」のことですか？ `、
通常の「TypeError:client.getCodezは関数ではありません」よりもはるかに優れています
さらに悪いことに、 `undefinedを呼び出すことはできません`.

それ以上の苦労なしに、それを使い始めましょう、そしてエラーメッセージを読んでください:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
client.getAccount();
```

初めてタップを押して確認するため、これには数秒かかります
手数料を支払うためのアカウント内のいくつかのトークン. 戻ると、次のように表示されます.

```js
{ address: 'cosmos16hn7q0yhfrm28ta9zlk7fu46a98wss33xwfxys',
  balance: [ { denom: 'ucosm', amount: '1000000' } ],
  pubkey: undefined,
  accountNumber: 31,
  sequence: 0 }
```

## ウォレットをリロードします

シェルに入力を続けるか、シェルを閉じて後でいくつかの部分を実行することができます.
常に次のように開始します.

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
```

クライアントを設定します. `useOptions`はすべてからmusselnet構成を取得します
bech32prefixを指すトークンのURL. パスワードを使用して `setup`を呼び出すと、チェックが行われます
`〜/.helder.key`を作成し、存在しない場合は新しいキーを作成します.存在しない場合は、ファイルからキーをロードします.
秘密鍵(実際にはニーモニック)は暗号化されて保存されており、再度使用するには同じパスワードが必要です.
`cat〜/.helder.key`を使用して、実際に暗号化されていることを証明するか、別のリロードを試してください
パスワード.

ニーモニックフレーズが必要な場合は、ファイルとパスワードが残っている限り、いつでも回復できます.
これを使用して後で復元することも、同じニーモニックを使用してキーを `helder`cliツールにインポートすることもできます.

```js
useOptions(hackatomOptions).recoverMnemonic(YOUR_PASSWORD_HERE)
```

::: 警告
このコマンドは、暗号化された `〜/.helder.key`にキーを保存します.パスワードを忘れた場合は、削除するか合格してください
`filename`とパスワードで新しいキーを作成します.
:::

また、無効なパスワードでこれを試して、どのように失敗するかを確認してください.

キー(および後でキーをロードする機能)についてより安全に感じたので、始めましょう
いくつかの契約.

## CW20トークンを送信する

クライアントを設定したので、試してみましょう
[`cw20-base`](https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw20-base)
トークン契約、それは実装します
[`cw20`仕様](https://github.com/CosmWasm/cosmwasm-plus/blob/master/packages/cw20/README.md).

コンパイルされたwasmコードをアップロードし、独自のコントラクトをインスタンス化する方法を示します(おそらく
コードを再利用します)、次にコントラクトでトークンを作成して転送します.

## コントラクトをアップロードしてインスタンス化します

HeldernetでサンプルCW20コントラクトを設定する方法について説明します.

### 例:スター

私がアップロードした最初の契約は、STARトークン、つまり「ゴールデンスター」でした.
ウェブ上の[上位3つのバリデーター](https://bigdipper.musselnet.cosmwasm.com/validators).

これを逐語的にコピーするのではなく、そのような契約を初めて設定して展開する方法を見てください.

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);

const cw20 = CW20(client);
const codeId = await cw20.upload();
console.log(`CodeId: ${codeId}`);
//output: 429

//enable REPL editor mode to edit multiline code then execute
.editor
const initMsg = {
  name: "Golden Stars",
  symbol: "STAR",
  decimals: 2,
 //list of all validator self-delegate addresses - 100 STARs each!
  initial_balances: [
    { address: "cosmos1ez03me7uljk7qerswdp935vlaa4dlu48mys3mq", amount: "10000"},
    { address: "cosmos1tx7ga0lsnumd5hfsh2py0404sztnshwqaqjwy8", amount: "10000"},
    { address: "cosmos1mvjtezrn8dpateu0435trlw5062qy76gf738n0", amount: "10000"},
  ],
  mint: {
    minter: client.senderAddress,
  },
};
//exit editor using `^D` and execute entered code
^D

const contract = await cw20.instantiate(codeId, initMsg, "STAR");
console.log(`Contract: ${contract.contractAddress}`);
//Contract: cosmos1hjzk8wr2gy9f3xnzdrtv5m9735jcxeljhm0f8u

console.log(await contract.balance("cosmos1ez03me7uljk7qerswdp935vlaa4dlu48mys3mq"));
//10000
console.log(await contract.balance());
//0
```

### 自宅でこれを試してください:私の

アップロードしたので、2番目の契約に簡単に署名できます. これお願いします
フィールド名とトークン数を入力する前に、必ず実行してカスタマイズしてください.

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
const address = client.senderAddress;

const cw20 = CW20(client);

.editor
const initMsg = {
  name: "My Coin",
  symbol: "MINE",
  decimals: 6,
 //list of all validator self-delegate addresses - 100 STARs each!
  initial_balances: [
    { address, amount: "12345678000"},
  ],
  mint: {
    minter: address,
    cap: "99900000000"
  },
};
^D

const codeId = 429;
const mine = await cw20.instantiate(codeId, initMsg, "MINE");
console.log(`Contract: ${mine.contractAddress}`);
//Contract:  cosmos10ajume5hphs9gcrpl9mw2m96fv7qu0q7esznj2

//now, check the configuration
mine.balance();
mine.tokenInfo()
mine.minter()
```

ほら、あなたは今お金を持っています! 富を分かち合う時が来ました.

## 契約を使用する

このセクションでは、新しく作成したトークンの使用方法を示します.
「MINE」の作成に使用したものと同じREPLを引き続き入力できます
トークン(またはあなたが発明したより良い名前)、しかしあなたがそれを閉じて
戻って、これは再接続する方法です:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
const cw20 = CW20(client);

//if you forgot your address, but remember your label, you can find it again
const contracts = await client.getContracts(4)
contracts
const contractAddress = contracts.filter(x => x.label === 'MINE')[0].address;

//otherwise, you can just cut and paste from before
const contractAddress = "cosmos10ajume5hphs9gcrpl9mw2m96fv7qu0q7esznj2"

//now, connect to that contract and make sure it is yours
const mine = cw20.use(contractAddress);
mine.tokenInfo()
mine.minter()
mine.balance()
```

さて、あなたはあなたの契約に接続されています. cw20の機能を見てみましょう.
ここで私はトークンを造る方法をあなたに示します(あなたはあなた自身に与えました
initの特別な権限ですね. )そしてトークンを他の人に転送します
ユーザー.

```js
const someone = "cosmos13nt9rxj7v2ly096hm8qsyfjzg5pr7vn56p3cay";
const other = "cosmos1ve2n9dd4uy48hzjgx8wamkc7dp7sfdv82u585d";

//right now, only you have tokens
mine.balance()
mine.balance(someone)
mine.balance(other)
//and watch the total
mine.tokenInfo()

//let's mint some tokens for someone
mine.mint(someone, "999888000")
//Bonus, take the tx hash printed out and cut-paste that into https://bigdipper.wasmnet.cosmwasm.com
//eg 26D5514CF437EE584793768B56CB4E605F1F6E61FC0123030DC64E08E2EE97FA

//See balances updated
mine.balance(someone)
mine.balance()
//and the supply goes up
mine.tokenInfo()

//Okay, now let's transfer some tokens... that is the more normal one, right?
mine.transfer(other, "4567000");
//eg. 4A76EFFEB09C82D0FEB97C3B5A9D5BADB6E9BD71F4EF248A3EF8B232C2F7262A
mine.balance(other)
mine.balance()
```

すばらしいです.コンテンツを移動して、クエリとブロックブラウザで表示しています.
プロのように振る舞う時が来ました.
