# 设置环境

您需要一个环境来运行合约.您可以在本地运行您的节点或连接到
现有网络.为方便测试，musselnet 网络已上线，您可以使用它来部署和运行您的
合同.如果您想针对本地区块链进行设置和运行，请[单击
这里](#run-local-node-optional)

要验证测试网当前是否正在运行，请确保以下 URL 都适合您:

- [https://rpc.musselnet.cosmwasm.com/status](https://rpc.musselnet.cosmwasm.com/status)
- [https://faucet.musselnet.cosmwasm.com/status](https://faucet.musselnet.cosmwasm.com/status)
- [https://lcd.musselnet.cosmwasm.com/node_info](https://lcd.musselnet.cosmwasm.com/node_info)

我们已经设置了两个原生代币 - `FRITES` (`urites`) 用于成为验证器，`MAYO` (`umayo`) 用于
支付费用.
可用的前端:

- [区块浏览器](https://musselnet.cosmwasm.aneka.io/)
- [代码浏览器](https://code-explorer.musselnet.cosmwasm.com/)

您可以使用这些来探索交易、地址、验证器和合约
随意部署一个指向我们的 rpc/lcd 服务器，我们将列出它.

您可以找到有关其他测试网的更多信息:
[CosmWasm/testnets](https://github.com/CosmWasm/testnets) 和 [Testnet
部分](./../testnets/testnets.md).

与网络交互时，您可以使用 Go 客户端或 Node REPL 的 `wasmd`.尽管节点 REPL 是
推荐用于合约操作，因为 JSON 操作对于 Shell/Go 客户端并不直观.

## 设置 Go CLI

让我们配置 `wasmd` exec，将其指向测试网，创建钱包并从 faucet 请求代币:

首先将 musselnet 网络配置源到 shell:

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

## 导出 wasmd 参数

如果您打算使用 wasmd 作为客户端，我们建议您设置这些变量.
否则，您必须在执行的每个命令中定义节点类型、链 id 和 gas-prices 详细信息.
同样在本教程中，我们将使用这些变量. 因此，请确保在继续之前导出这些.

```bash
export NODE=(--node "https://rpc.musselnet.cosmwasm.com:443")
export TXFLAG=($NODE --chain-id ${CHAIN_ID} --gas-prices 0.01umayo --gas auto --gas-adjustment 1.3)
```

## 设置节点 REPL


除了标准的 CLI 工具，我们还制作了一个灵活的 TypeScript 库
[CosmJS](https://github.com/CosmWasm/cosmjs)，在 Node.js 和现代浏览器中运行
并处理查询和提交交易. 与这个库一起，我们制作了
[@cosmjs/cli](https://www.npmjs.com/package/@cosmjs/cli)，这是一个超级充电的Node控制台. 它
支持 `await`，对有用的错误消息进行类型检查，并预加载许多 CosmJS 实用程序.
如果您对 Node 控制台感到满意，您可能会发现它更简单、更强大
比 CLI 工具.

完整的使用和安装 [说明在
README](https://github.com/CosmWasm/cosmjs/tree/master/packages/cli)，这里也是预打包的源代码
您可以即时使用的网络配置:

::: 警告
下面的命令已过时并很快更新.
:::

```shell
## musselnet
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/testnets/master/musselnet/cli_helper.ts
```

Using the REPL:

```js
// Create or load account
const mnemonic = loadOrCreateMnemonic('fred.key')
mnemonicToAddress(mnemonic)

const { address, client } = await connect(mnemonic, {})
address

client.getAccount()
// if empty - this only works with CosmWasm
hitFaucet(defaultFaucetUrl, address, 'FRITES')
client.getAccount()
```


你需要把 RPC 端点和
## 运行本地节点(可选)

如果您有兴趣运行本地网络，可以使用以下脚本:

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
