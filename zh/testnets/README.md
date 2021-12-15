# 测试网

在本节中，我们将解释如何加入测试网，在哪里可以找到测试网配置，以及一些使过程更快的脚本。

## 选择您的网络

您可以在 [CosmWasm/testnets](https://github.com/CosmWasm/testnets) 上找到活动和非活动测试网信息，例如配置和端点。

## 设置

让我们开始滚动您的节点并开始在 testnet 环境中生成块。

**在开始之前**，您可以使用 [CosmWasm/tesnets/devops](https://github.com/CosmWasm/testnets/tree/master/devops)，其中包含 wasmd 的简单设置脚本
node, faucet, [block explorer](https://github.com/CosmWasm/big-dipper), lcd, nginx 等脚本
下面本质上做了一些作为 **devops repo** 的事情，只是更多的手动并且不包括 nginx 和系统主管。随意
使用它们。我们使用 [cosmovisor](https://github.com/cosmos/cosmos-sdk/tree/master/cosmovisor) 升级管理器来处理网络升级。
我们的安装脚本可以帮助您设置 cosmovisor 和 wasmd:[wasmd w/cosmovisor 设置脚本](https://github.com/CosmWasm/testnets/tree/master/devops/node/cosmovisor)g

### 手动设置

首先确保您遵循了[构建要求部分](./build-requirements.md) 中的安装步骤。您应该拥有所需的二进制文件。如果您只想复制和执行以下脚本，请确保设置环境变量:

下面是【贻贝网配置】(https://github.com/CosmWasm/testnets/tree/master/musselnet)。

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

为了无缝运行这些脚本，我们建议您为 CosmWasm 工具创建一个目录:
`mkdir CosmWasm && cd CosmWasm && export CW_DIR=$(pwd)`

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

现在您应该看到正在重播的块，并且您的节点正在赶上测试网。 这可能需要一段时间。

### 成为验证者(可选)

为了作为验证者加入网络，您需要一些 staking 代币。
请在 [discord testnets channel](https://docs.cosmwasm.com/chat) 中提问

如果您想参与活跃的区块构建，您需要将一些硬币抵押到您的验证者地址。

对于那些对验证器堆栈感兴趣的人，这里有一个关于验证器架构的很好的阅读资源:[certus one blog](https://kb.certus.one/)

**注意**:在升级到验证器之前，请确保您的验证器已同步

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

### 运行轻客户端守护进程

与 wasmd 版本 v0.13 lcd 客户端和节点合并。 要启用轻客户端，请将 `app.toml/api` 值更改为 true。

## 加入即将推出的测试网

::: 小费
您需要在网络创世文件中定义您的地址和信息才能加入尚未启动的测试网。
这是您可以运行以自动处理它的脚本。
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

网络启动后，您可以关注[Joining Live Testnets](#joining-live-testnets)。

## 将合约部署到测试网

[入门部分](../getting-started/intro.md) 是最好的阅读资源，教你使用基本的智能合约编译和部署合约的过程。 如果您对开发自己的合同感兴趣，请在阅读入门教程后前往 [Hijacking Escrow](../learn/hijack-escrow/intro.md)，在那里您可以使用示例托管合同。
