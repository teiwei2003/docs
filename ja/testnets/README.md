# テストネット

このセクションでは、テストネットに参加する方法、テストネット構成を見つける場所、およびプロセスを高速化するためのいくつかのスクリプトについて説明します.

## ネットワークを選択してください

[CosmWasm/testnets](https://github.com/CosmWasm/testnets)で、構成やエンドポイントなどのアクティブおよび非アクティブなテストネット情報を見つけることができます.

## 設定

ノードのローリングを開始し、テストネット環境でブロックの生成を開始しましょう.

**始める前に** [CosmWasm/tesnets/devops](https://github.com/CosmWasm/testnets/tree/master/devops)を使用できます.これには、wasmdの簡単なセットアップスクリプトが含まれています.
ノード、蛇口、[ブロックエクスプローラー](https://github.com/CosmWasm/big-dipper)、lcd、nginx、その他のスクリプト
以下は基本的に** devopsレポジトリ**として機能しますが、より手動であり、nginxとシステムスーパーバイザーは含まれていません.ランダム
それらを使用してください. [cosmovisor](https://github.com/cosmos/cosmos-sdk/tree/master/cosmovisor)アップグレードマネージャーを使用して、ネットワークのアップグレードを処理します.
インストールスクリプトは、cosmovisorとwasmdのセットアップに役立ちます:[wasmd w/cosmovisorセットアップスクリプト](https://github.com/CosmWasm/testnets/tree/master/devops/node/cosmovisor)g

### 手動設定

まず、[ビルド要件セクション](./build-requirements.md)のインストール手順に従っていることを確認してください.必要なバイナリが必要です.次のスクリプトをコピーして実行するだけの場合は、必ず環境変数を設定してください.

以下は[Musselnet構成](https://github.com/CosmWasm/testnets/tree/master/musselnet)です.

```shell
export CHAIN_ID="musselnet-4"
export TESTNET_NAME="musselnet-4"
export WASMD_VERSION="v0.15.0"
export CONFIG_DIR=".wasmd"
export BINARY="wasmd"

export COSMJS_VERSION="v0.24.2"
export GENESIS_URL="https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/config/genesis.json"
export APP_CONFIG_URL="https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/config/app.toml"
export CONFIG_URL="https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/config/config.toml"

export RPC="https://rpc.musselnet.cosmwasm.com:443"
export LCD="https://lcd.musselnet.cosmwasm.com"
export FAUCET="https://faucet.musselnet.cosmwasm.com"

export COSMOVISOR_VERSION=v0.41.0
export COSMOVISOR_HOME=/root/.wasmd
export COSMOVISOR_NAME=wasmd

export SEED_NODE="c065c5ac440d1a9ba484a9a8b25c24d264b0a1a6@49.12.67.47:26656"
```

これらのスクリプトをシームレスに実行するには、CosmWasmツールのディレクトリを作成することをお勧めします.
`mkdir CosmWasm && cd CosmWasm && export CW_DIR = $(pwd)

```shell
cd $CW_DIR
git clone https://github.com/CosmWasm/wasmd
cd wasmd
# Check which version to use on testnets repo
git checkout $WASMD_VERSION
# build wasmd
make build
# add the executables to path
export PATH="${PATH}:$(pwd)/build"
```

Initialize wallet using command:

```shell
# create wallet
wasmd keys add mywallet
```

## Joining Live Testnets

### Run wasmd Full Node

```shell
export MONIKER=new_validator
# initialize wasmd configuration
wasmd init $MONIKER

# get the testnets genesis file
curl -sSL $GENESIS_URL > ~/.wasmd/config/genesis.json

# get app.toml. Minimum gas prices must be 0.025umayo
curl -sSL $APP_CONFIG_URL > ~/.wasmd/config/app.toml

# You need to configure p2p seeds
# Either you can insert the seed addresses in $HOME/.wasmd/config/config.toml to "seeds"
# For simplicity we will pass the seed ID and domain as argument
# You can get the seed it using command:
## Start wasmd
wasmd start --p2p.seeds $SEED_NODE
```

これで、ブロックが再生され、ノードがテストネットに追いついていることがわかります. これは時間がかかる場合があります.

### バリデーターになる(オプション)

バリデーターとしてネットワークに参加するには、ステーキングトークンが必要です.
[discord testnetschannel](https://docs.cosmwasm.com/chat)で質問してください

アクティブなブロック構築に参加したい場合は、バリデーターのアドレスにいくつかのコインを誓約する必要があります.

ベリファイアスタックに関心のある方のために、ベリファイアアーキテクチャに関する優れた資料を以下に示します.[certus one blog](https://kb.certus.one/)

**注**:バリデーターにアップグレードする前に、バリデーターが同期されていることを確認してください

```shell
wasmd tx staking create-validator \
  --amount=1000000ufrites \
  --pubkey=$(wasmd tendermint show-validator) \
  --moniker=$MONIKER \
  --chain-id=$CHAIN_ID \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --node $RPC \
  --fees=5000umayo \
  --from=mywallet
```

### ライトクライアントデーモンを実行する

wasmdバージョンv0.13lcdクライアントおよびノー​​ドとマージされました. ライトクライアントを有効にするには、 `app.toml/api`の値をtrueに変更します.

## 今後のテストネットに参加する

::: ヒント
まだ開始されていないテストネットに参加するには、ネットワークジェネシスファイルでアドレスと情報を定義する必要があります.
これは、自動的に処理するために実行できるスクリプトです.
:::

```shell
cd $CW_DIR
## Fork github.com:CosmWasm/testnets to your account and clone.
## You cannot push directly to CosmWasm/testnets repo
git clone git@github.com:<your-name>/testnets
cd testnets
git checkout -b add-gen-acc-<validator-name>
cd $TESTNET_NAME

wasmd keys add validator

wasmd add-genesis-account --home . $(wasmd keys show -a validator) 100000000ufrites,100000000umayo

# please sort the genesis file, so the diff makes sense
SORTED=$(jq -S . < ./config/genesis.json) && echo "$SORTED" > ./config/genesis.json

git add ./config/genesis.json
git commit -m "Add <myvalidator> account to network genesis"
git push

# Open PR to CosmWasm/testnets:master (https://github.com/CosmWasm/testnets)
```

ネットワークが開始したら、[ライブテストネットへの参加](#joining-live-testnets)をフォローできます.

## コントラクトをテストネットにデプロイします

[はじめに](../getting-started/intro.md)は、基本的なスマートコントラクトを使用してコントラクトをコンパイルおよびデプロイするプロセスを説明するための最良の資料です. 独自の契約を作成することに興味がある場合は、サンプルのエスクロー契約を使用できる入門チュートリアルを読んだ後、[Hijacking Escrow](../learn/hijack-escrow/intro.md)にアクセスしてください.
