# cw20-base 教程

:::警告
本教程不适用于 cosmjs 0.23.当 0.24 出来时它会被修复.
:::

这是一个简单的教程，向您展示如何使用强大的节点 REPL 进行交互
[musselnet](https://github.com/CosmWasm/testnets/tree/master/musselnet) 上的 CW20 代币合约(可替代代币，如 ERC20).

我将引导您完成上传合约代码并创建一个具体实例(相同的`cw20-base`
wasm 代码可以重用以创建数十个具有不同符号和分布的代币合约).
然后我将向您展示如何轻松地与该合约进行交互.作为 JSON 操作和局部变量
在 BASH 中没有那么多乐趣，我们使用 [`@cosmjs/cli`](https://github.com/CosmWasm/cosmjs/tree/master/packages/cli)
工具而不是 `wasmd` CLI 工具.

但是，在我们进入玩智能合约的有趣部分之前，我想确保
你知道如何使用你的工具而不是丢失你的私钥.

您必须在本地安装 Node 10+ 才能运行它.它已经在 Ubuntu 上测试过，可能没有
在 Windows 上正常工作(我们假设一个 HOME 环境变量).欢迎 PR.

##连接到链

做任何事情之前的第一步是确保我们可以创建一个帐户并连接到链.
您将始终使用以下命令来启动 `@cosmjs/cli` 并预加载一些特定于 cw20 的帮助程序
(除了它拥有的所有一般助手).

```shell
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/cosmwasm-plus/master/contracts/cw20-base/helpers.ts
```

下载源代码并启动后，您应该会看到一堆黄色文本(说明预加载了哪些代码)，
接着是一个熟悉的节点提示:`>>`. 请注意这是一个超级充电的 REPL，它允许使用 `await`
轻松使用`Promises`，并在执行代码之前进行类型检查. 你不需要定义类型，
但是如果你输入`client.getCodez()`，你会得到有用的信息:
'SigningCosmWasmClient' 类型不存在属性 'getCodez'. 你的意思是 'getCodes' 吗？`,
比典型的“TypeError: client.getCodez is not a function”好得多
或更糟的是`不能调用未定义`.

事不宜迟，让我们开始使用它，并请阅读错误消息:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
client.getAccount();
```

这将需要几秒钟的时间，因为我们第一次按下水龙头以确保您
您帐户中的一些代币以支付费用. 当它返回时，您应该看到如下内容:

```js
{ address: 'cosmos16hn7q0yhfrm28ta9zlk7fu46a98wss33xwfxys',
  balance: [ { denom: 'ucosm', amount: '1000000' } ],
  pubkey: undefined,
  accountNumber: 31,
  sequence: 0 }
```

## 重新加载你的钱包

您可以继续在 shell 中输入，或者关闭它并稍后运行一些部分.
始终从以下开始:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
```

设置您的客户端. `useOptions` 从所有内容中获取 musselnet 配置
指向 bech32prefix 的令牌的 URL. 当您使用密码调用 `setup` 时，它会检查
`~/.helder.key` 并在它不存在时创建一个新密钥，否则它从文件中加载密钥.
您的私钥(实际上是助记符)是加密存储的，您需要相同的密码才能再次使用它.
尝试使用 `cat ~/.helder.key` 来向自己证明它确实是加密的，或者尝试使用不同的重新加载
密码.

如果你想要助记词，你可以随时恢复，只要你还有文件和密码.
您可以稍后使用它来恢复，或者使用相同的助记符将密钥导入到 `helder` cli 工具中.

```js
useOptions(hackatomOptions).recoverMnemonic(YOUR_PASSWORD_HERE)
```

::: warning
此命令将密钥保存到加密的`~/.helder.key`. 如果您忘记密码，请将其删除或通过
`filename` 和密码一起创建一个新的密钥.
:::

另外，用无效的密码试试这个，看看它是如何失败的.

现在您对自己的密钥(以及以后加载它们的能力)感到更加安全，让我们开始使用
一些合同.

## 发送 CW20 代币

现在您已经设置了客户端，让我们开始尝试
[`cw20-base`](https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw20-base)
代币合约，它实现了
[`cw20` 规范](https://github.com/CosmWasm/cosmwasm-plus/blob/master/packages/cw20/README.md).

我们将展示如何上传编译好的 wasm 代码，实例化你自己的合约(可能
重用代码)，然后在该合约上铸造和转移代币.

## 上传并实例化合约

我将带您了解如何在 Heldernet 上设置示例 CW20 合同.

### 示例:星

我上传的第一个合约是 STAR 代币，或“金星”，分发给
[前 3 个验证器](https://bigdipper.musselnet.cosmwasm.com/validators) 在网络上.

请不要复制这个逐字逐句，而是看看第一次如何设置和部署这样的合同.

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);

const cw20 = CW20(client);
const codeId = await cw20.upload();
console.log(`CodeId: ${codeId}`);
// output: 429

// enable REPL editor mode to edit multiline code then execute
.editor
const initMsg = {
  name: "Golden Stars",
  symbol: "STAR",
  decimals: 2,
  // list of all validator self-delegate addresses - 100 STARs each!
  initial_balances: [
    { address: "cosmos1ez03me7uljk7qerswdp935vlaa4dlu48mys3mq", amount: "10000"},
    { address: "cosmos1tx7ga0lsnumd5hfsh2py0404sztnshwqaqjwy8", amount: "10000"},
    { address: "cosmos1mvjtezrn8dpateu0435trlw5062qy76gf738n0", amount: "10000"},
  ],
  mint: {
    minter: client.senderAddress,
  },
};
// exit editor using `^D` and execute entered code
^D

const contract = await cw20.instantiate(codeId, initMsg, "STAR");
console.log(`Contract: ${contract.contractAddress}`);
// Contract: cosmos1hjzk8wr2gy9f3xnzdrtv5m9735jcxeljhm0f8u

console.log(await contract.balance("cosmos1ez03me7uljk7qerswdp935vlaa4dlu48mys3mq"));
// 10000
console.log(await contract.balance());
// 0
```

### 在家里试试这个:我的

现在我们已经上传了，我们可以轻松地签订第二份合同. 这个请
在输入字段名称和令牌数量之前，请务必运行并自定义它们.

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
const address = client.senderAddress;

const cw20 = CW20(client);

.editor
const initMsg = {
  name: "My Coin",
  symbol: "MINE",
  decimals: 6,
  // list of all validator self-delegate addresses - 100 STARs each!
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
// Contract:  cosmos10ajume5hphs9gcrpl9mw2m96fv7qu0q7esznj2

// now, check the configuration
mine.balance();
mine.tokenInfo()
mine.minter()
```

看，你现在有钱了! 是时候分享财富了.

## 使用合约

在本节中，我们将向您展示如何使用您新构建的令牌.
您可以继续输入用于创建“MINE”的相同 REPL
令牌(或任何你发明的更好的名字)，但如果你关闭它并
回来，这是重新连接的方法:

```js
const client = await useOptions(hackatomOptions).setup(YOUR_PASSWORD_HERE);
const cw20 = CW20(client);

// if you forgot your address, but remember your label, you can find it again
const contracts = await client.getContracts(4)
contracts
const contractAddress = contracts.filter(x => x.label === 'MINE')[0].address;

// otherwise, you can just cut and paste from before
const contractAddress = "cosmos10ajume5hphs9gcrpl9mw2m96fv7qu0q7esznj2"

// now, connect to that contract and make sure it is yours
const mine = cw20.use(contractAddress);
mine.tokenInfo()
mine.minter()
mine.balance()
```

好的，您已连接到您的合同. 让我们看看 cw20 有什么能力.
在这里，我将向您展示如何铸造代币(您确实给了自己
init 的特殊权限，对吧？)并将令牌转移给其他人
用户.

```js
const someone = "cosmos13nt9rxj7v2ly096hm8qsyfjzg5pr7vn56p3cay";
const other = "cosmos1ve2n9dd4uy48hzjgx8wamkc7dp7sfdv82u585d";

// right now, only you have tokens
mine.balance()
mine.balance(someone)
mine.balance(other)
// and watch the total
mine.tokenInfo()

// let's mint some tokens for someone
mine.mint(someone, "999888000")
// Bonus, take the tx hash printed out and cut-paste that into https://bigdipper.wasmnet.cosmwasm.com
// eg 26D5514CF437EE584793768B56CB4E605F1F6E61FC0123030DC64E08E2EE97FA

// See balances updated
mine.balance(someone)
mine.balance()
// and the supply goes up
mine.tokenInfo()

// Okay, now let's transfer some tokens... that is the more normal one, right?
mine.transfer(other, "4567000");
// eg. 4A76EFFEB09C82D0FEB97C3B5A9D5BADB6E9BD71F4EF248A3EF8B232C2F7262A
mine.balance(other)
mine.balance()
```

太好了，您正在四处移动内容并在您的查询和块浏览器中看到它.
是时候表现得像个专业人士了.
