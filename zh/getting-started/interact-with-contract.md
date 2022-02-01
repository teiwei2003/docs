# 上传和交互

我们已经准备好了二进制文件. 现在是时候看到一些 wasm 行动了. 您可以使用 [Go CLI](#go-cli) 或
[节点控制台](#node-console) 如你所愿.

## 去 CLI

我们在上一章中生成了一个 wasm 二进制可执行文件. 让我们把它投入使用. 现在，我们将
将代码上传到区块链. 之后，您可以下载字节码以验证它是否正确:

```shell
# see how many codes we have now
wasmd query wasm list-code $NODE

# gas is huge due to wasm size... but auto-zipping reduced this from 1.8M to around 600k
# you can see the code in the result
RES=$(wasmd tx wasm store contract.wasm --from fred $TXFLAG -y --output json)

# you can also get the code this way
CODE_ID=$(echo $RES | jq -r '.logs[0].events[0].attributes[-1].value')

# no contracts yet, this should return an empty list
wasmd query wasm list-contract-by-code $CODE_ID $NODE --output json

# you can also download the wasm from the chain and check that the diff between them is empty
wasmd query wasm code $CODE_ID $NODE download.wasm
diff contract.wasm download.wasm
```

### 实例化合约

我们现在可以创建这个 wasm 合约的实例. 在这里，验证者将为托管提供资金，即
将允许 fred 控制支出，并且在发布后，资金将转到 bob.

```shell
# instantiate contract and verify
INIT=$(jq -n --arg fred $(wasmd keys show -a fred) --arg bob $(wasmd keys show -a bob) '{"arbiter":$fred,"recipient":$bob}')
wasmd tx wasm instantiate $CODE_ID "$INIT" \
    --from fred --amount=50000umayo  --label "escrow 1" $TXFLAG -y --output json

# check the contract state (and account balance)
wasmd query wasm list-contract-by-code $CODE_ID $NODE --output json
CONTRACT=$(wasmd query wasm list-contract-by-code $CODE_ID $NODE --output json | jq -r '.contracts[-1]')
echo $CONTRACT

# we should see this contract with 50000umayo
wasmd query wasm contract $CONTRACT $NODE
wasmd query account $CONTRACT $NODE

# you can dump entire contract state
wasmd query wasm contract-state all $CONTRACT $NODE

# note that we prefix the key "config" with two bytes indicating it's length
# echo -n config | xxd -ps
# gives 636f6e666967
# thus we have a key 0006636f6e666967

# you can also query one key directly
wasmd query wasm contract-state raw $CONTRACT 0006636f6e666967 $NODE --hex

# Note that keys are hex encoded, and val is base64 encoded.
# To view the returned data (assuming it is ascii), try something like:
# (Note that in many cases the binary data returned is non in ascii format, thus the encoding)
wasmd query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].key' | xxd -r -ps
wasmd query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].value' | base64 -d

# or try a "smart query", executing against the contract
wasmd query wasm contract-state smart $CONTRACT '{}' $NODE
# (since we didn't implement any valid QueryMsg, we just get a parse error back)
```

Once we have the funds in the escrow, let us try to release them. First, failing to do so with a key
that is not the verifier, then using the proper key to release.

```shell
# execute fails if wrong person
APPROVE='{"approve":{"quantity":[{"amount":"50000","denom":"umayo"}]}}'
wasmd tx wasm execute $CONTRACT "$APPROVE" \
    --from thief $TXFLAG -y

# looking at the logs should show: "execute wasm contract failed: Unauthorized"
# and bob should still be broke (and broken showing the account does not exist Error)
wasmd query account $(wasmd keys show bob -a) $NODE

# but succeeds when fred tries
wasmd tx wasm execute $CONTRACT "$APPROVE" \
    --from fred $TXFLAG -y

wasmd query account $(wasmd keys show bob -a) $NODE

# contract coins must be empty
wasmd query account $CONTRACT $NODE
```

## 节点控制台

如果您在[客户端设置部分](./setting-env#setup-node-repl) 中设置了节点控制台/REPL，则可以使用
部署和执行你的合同. 我想你会发现 JSON 操作和解析
在 JavaScript 中比在 Shell 脚本中好一点.

首先，进入 cli 目录并启动你的控制台:

::: 警告
下面的命令已过时并很快更新.
:::

```shell
npx @cosmjs/cli@^0.25 --init https://raw.githubusercontent.com/CosmWasm/testnets/master/heldernet/cli_helper.ts
```

Now, we make all the keys and initialize clients:

```js
const fredSeed = loadOrCreateMnemonic("fred.key");
const {address: fredAddr, client: fredClient} = await connect(fredSeed, {});

// bob doesn't have a client here as we will not
// submit any tx with this account, just query balance
const bobSeed = loadOrCreateMnemonic("bob.key");
const bobAddr = await mnemonicToAddress("muffin fix provide project obtain......", bobSeed);

const thiefSeed = loadOrCreateMnemonic("thief.key");

const {address: thiefAddr, client: thiefClient} = await connect(thiefSeed, {});

console.log(fredAddr, bobAddr, thiefAddr);
```

Hit the faucet it needed for fred, so he has tokens to submit transactions:

```js
fredClient.getAccount();
// if "undefined", do the following
hitFaucet(defaultFaucetUrl, fredAddr, "umayo")
fredClient.getAccount();

thiefClient.getAccount();
// if "undefined", do the following
hitFaucet(defaultFaucetUrl, thiefAddr, "umayo")
thiefClient.getAccount();

// check bobAddr has no funds
fredClient.getAccount(bobAddr);

// get the working directory (needed later)
process.cwd()
```

### 使用 JS 上传

现在，我们回到 Node 控制台并上传合约并实例化它:

```js
const wasm = fs.readFileSync('contract.wasm');
// you can add extra information to contract details such as source and builder.
const up = await fredClient.upload(wasm, { source: "https://crates.io/api/v1/crates/cw-escrow/0.10.0/download", builder: "cosmwasm/rust-optimizer:0.10.7"});

console.log(up);
const { codeId } = up;

const initMsg = {arbiter: fredAddr, recipient: bobAddr};
const { contractAddress } = await fredClient.instantiate(codeId, initMsg, "Escrow 1", { memo: "memo", transferAmount: [{denom: "umayo", amount: "50000"}]});

// check the contract is set up properly
console.log(contractAddress);
fredClient.getContract(contractAddress);
fredClient.getAccount(contractAddress);

// make a raw query - key length prefixed "config"
const key = new Uint8Array([0, 6, ...toAscii("config")]);
const raw = await fredClient.queryContractRaw(contractAddress, key);
JSON.parse(fromUtf8(raw))
// note the addresses are stored in base64 internally, not bech32, but the data is there... this is why we often implement smart queries on real contracts
```

### 与 JS 执行合约

一旦我们正确配置了合约，让我们展示如何使用它，正确的“批准”
命令:

```js
const approve = {approve: {quantity: [{amount: "50000", denom: "umayo"}]}};

// thief cannot approve
thiefClient.execute(contractAddress, approve)

// but fred can (and moves money to bob)
fredClient.execute(contractAddress, approve);
// verify bob got the tokens
fredClient.getAccount(bobAddr);
// verify contract lost
fredClient.getAccount(contractAddress);
```
