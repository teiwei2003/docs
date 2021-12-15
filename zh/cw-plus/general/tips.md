# 高级 REPL 技巧

::: 危险
你必须先阅读【cw20教程】(../cw20/03-cw20-base-tutorial.md)。 本节建立在
最重要的。
:::

使用 Node REPL 弄脏了你的手。 现在让我们深入挖掘一些
您可以使用的高级功能。

##交互式发现

到目前为止，您已经在使用时对教程中的命令进行了剪切和粘贴
节点复制 但是你还能用这份合同做什么？ 幸运的是 Javascript
有一些很好的内省。 而且，我们在那里添加了一些额外的奖励。 只需输入
REPL 中的 `mine` 并查看方法列表:

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

但是我怎么称呼他们呢？ 他们采取什么论据？
你可以随时去查
[网络原始帮助文件](https://github.com/CosmWasm/cosmwasm-plus/blob/master/contracts/cw20-base/helpers.ts#L151-L167)
并查看那里定义的所有类型。

但是为什么切换到浏览器并被其他东西分心呢？
有一个很棒的 `.type` 操作符可以在不离开 REPL 的情况下向你展示这一点:

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

有了这些知识，让我们尝试添加一个津贴并查询它

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
// this gives:
const setup: (password: string, filename?: string) => Promise<SigningCosmWasmClient>
```

是的......它需要第二个参数。 您不必将密钥存储在`~/.coral.key` 中。 那只是
默认值。 这也意味着我们可以使用不同的密钥文件创建 2 个客户端。

```js
const client = await setup(YOUR_PASSWORD_HERE)
const partner = await setup(OTHER_PASSWORD, "/home/user/.test2.key")

// let's make sure they are unique
client.getAccount()
partner.getAccount()

// and move some tokens around
partner.sendTokens(client.senderAddress, [ { denom: 'ucosm', amount: '200000' }])

client.getAccount()
partner.getAccount()
```

这让我们然后使用 CW20 合约尝试更复杂的用例。
来回发送、`transferFrom`、`burnFrom`等

从我这里得到的提示就足够了。
是时候让你自己去玩合同了……
