# 環境の設定

契約を実行するための環境が必要です.ノードをローカルで実行するか、に接続できます
既存のネットワーク.テストを容易にするために、musclenetネットワークはオンラインです.これを使用して、
契約する.ローカルブロックチェーンを設定して実行する場合は、[クリックしてください
ここで)(#run-local-node-optional)

テストネットが現在実行されていることを確認するには、次のURLがすべて適切であることを確認してください.

-[https://rpc.musselnet.cosmwasm.com/status](https://rpc.musselnet.cosmwasm.com/status)
-[https://faucet.musselnet.cosmwasm.com/status](https://faucet.musselnet.cosmwasm.com/status)
-[https://lcd.musselnet.cosmwasm.com/node_info](https://lcd.musselnet.cosmwasm.com/node_info)

バリデーターとなる `FRITES`(` urites`)と、
料金を支払う.
利用可能なフロントエンド:

-[ブロックエクスプローラー](https://musselnet.cosmwasm.aneka.io/)
-[コードブラウザ](https://code-explorer.musselnet.cosmwasm.com/)

これらを使用して、トランザクション、アドレス、バリデーター、および契約を調べることができます
私たちを指すrpc/lcdサーバーを自由にデプロイしてください.リストします.

他のテストネットに関する詳細情報を見つけることができます:
[CosmWasm/testnets](https://github.com/CosmWasm/testnets)および[Testnet
パート](./../testnets/testnets.md).

ネットワークと対話するときは、GoクライアントまたはNodeREPLの `wasmd`を使用できます.ノードREPLは
JSON操作はShell/Goクライアントにとって直感的ではないため、コントラクト操作に推奨されます.

## GoCLIを設定する

`wasmd` execを構成し、それをテストネットにポイントし、ウォレットを作成して、蛇口からトークンを要求しましょう.

まず、musselnetネットワーク構成をシェルに供給します.

```shell
source <(curl -sSL https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/defaults.env)
```

Setup the client:

```shell
# add wallets for testing
wasmd keys add fred
>
{
  "name": "fred",
  "type": "local",
  "address": "wasm13nt9rxj7v2ly096hm8qsyfjzg5pr7vn5saqd50",
  "pubkey": "wasmpub1addwnpepqf4n9afaefugnfztg7udk50duwr4n8p7pwcjlm9tuumtlux5vud6qvfgp9g",
  "mnemonic": "hobby bunker rotate piano satoshi planet network verify else market spring toward pledge turkey tip slim word jaguar congress thumb flag project chalk inspire"
}

wasmd keys add bob
wasmd keys add thief
```

You need some tokens in your address to interact. If you are using local node you can skip this
step. Requesting tokens from faucet:

```shell
JSON=$(jq -n --arg addr $(wasmd keys show -a fred) '{"denom":"umayo","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" https://faucet.musselnet.cosmwasm.com/credit
JSON=$(jq -n --arg addr $(wasmd keys show -a thief) '{"denom":"umayo","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" https://faucet.musselnet.cosmwasm.com/credit
```

## wasmdパラメータをエクスポートする

wasmdをクライアントとして使用する場合は、これらの変数を設定することをお勧めします.
それ以外の場合は、実行する各コマンドでノードタイプ、チェーンID、およびガス価格の詳細を定義する必要があります.
また、このチュートリアルでは、これらの変数を使用します. したがって、先に進む前に、必ずこれらをエクスポートしてください.

```bash
export NODE=(--node "https://rpc.musselnet.cosmwasm.com:443")
export TXFLAG=($NODE --chain-id ${CHAIN_ID} --gas-prices 0.01umayo --gas auto --gas-adjustment 1.3)
```

## ノードREPLを設定します


標準のCLIツールに加えて、柔軟なTypeScriptライブラリも作成しました
[CosmJS](https://github.com/CosmWasm/cosmjs)、Node.jsと最新のブラウザーで実行されます
そして、問い合わせを処理し、トランザクションを送信します. このライブラリと一緒に、
[@ cosmjs/cli](https://www.npmjs.com/package/@cosmjs/cli)、これはスーパーチャージされたノードコンソールです. それ
`await`をサポートし、有用なエラーメッセージの型チェックを実行し、多くのCosmJSユーティリティをプリロードします.
Nodeコンソールに満足している場合は、よりシンプルで強力なものになっているかもしれません.
CLIツールより.

完全な使用とインストール[手順
README](https://github.com/CosmWasm/cosmjs/tree/master/packages/cli)、これも事前にパッケージ化されたソースコードです
すぐに使用できるネットワーク構成:

::: 暖かい
次のコマンドは廃止され、まもなく更新されます.
:::

```shell
## musselnet
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/cli_helper.ts
```

Using the REPL:

```js
//Create or load account
const mnemonic = loadOrCreateMnemonic('fred.key')
mnemonicToAddress(mnemonic)

const { address, client } = await connect(mnemonic, {})
address

client.getAccount()
//if empty - this only works with CosmWasm
hitFaucet(defaultFaucetUrl, address, 'FRITES')
client.getAccount()
```


RPCエンドポイントとを組み合わせる必要があります
## ローカルノードを実行する(オプション)

ローカルネットワークの実行に関心がある場合は、次のスクリプトを使用できます.

```shell
# default home is ~/.wasmd
# if you want to setup multiple apps on your local make sure to change this value
APP_HOME="~/.wasmd"
RPC="http://localhost:26657"
CHAIN_ID="localnet"
# initialize wasmd configuration files
wasmd init localnet --chain-id ${CHAIN_ID} --home ${APP_HOME}

# add minimum gas prices config to app configuration file
sed -i -r 's/minimum-gas-prices = ""/minimum-gas-prices = "0.01ucosm"/' ${APP_HOME}/config/app.toml

# add your wallet addresses to genesis
wasmd add-genesis-account $(wasmd keys show -a main) 10000000000ucosm,10000000000stake --home ${APP_HOME}
wasmd add-genesis-account $(wasmd keys show -a validator) 10000000000ucosm,10000000000stake --home ${APP_HOME}

# add fred's address as validator's address
wasmd gentx validator 1000000000stake --home ${APP_HOME} --chain-id ${CHAIN_ID}

# collect gentxs to genesis
wasmd collect-gentxs --home ${APP_HOME}

# validate the genesis file
wasmd validate-genesis --home ${APP_HOME}

# run the node
wasmd start --home ${APP_HOME}
```
