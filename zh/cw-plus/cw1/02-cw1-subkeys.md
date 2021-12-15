# CW1 子键

[CW1 子密钥](https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw1-subkeys)
灵感来自 [Cosmos SDK 功能提案](https://forum.cosmos.network/t/proposal-adding-subkey-feature-to-cosmos-sdk-and-apply-it-to-the-hub/2358) .

这是一个基本的代理合约。用内部的一些代币发起合约，
允许的帐户可以在
津贴(`spender, denom`) 每个账户的限制。津贴逻辑类似
到 [CW20](../cw20/01-spec.md)。授权后，他们的津贴将减少，并且
发送消息将被中继。如果他们没有足够的授权，
或者，如果他们尝试代理任何其他消息类型，则尝试将被拒绝。
管理员可以在 init msg 广播期间或之后为帐户添加限额
在里面。

合约包含允许和禁止指定密钥执行的许可逻辑
具体消息。目前，这些消息是 staking 消息(目前涵盖 _Delegate、Undelegate、Redelegate、Withdraw_)，
但只需几行代码即可添加新的消息类型。津贴和权限检查是分开进行的，这意味着一个子密钥可以有消费代币的津贴，
但没有许可的消息执行，反之亦然。

##合约演示

首先，初始化节点repl:

```shell
npx @cosmjs/cli@^0.23 --init https://raw.githubusercontent.com/CosmWasm/cosmwasm-plus/v0.3.2/contracts/cw1-subkeys/helpers.ts
```

::: warning
Helper代码兼容cw1-subkeys智能合约版本**v0.3.2**
:::

Load wallet:

```ts
const client = await useOptions(hackatomOptions).setup(PASSWORD);
const factory = CW1(client);
```

上传代码和合约:

```ts
// upload using code below
// if the code is already uploaded use code id to initiate
const codeId = await factory.upload()
// contract is already uploaded on heldernet: codeId -> 430
const { address } = await client.getAccount()
const contract = await factory.instantiate(430, { admins: [address], mutable: true}, "My Gift to a Friend")

// print out contract.contractAddress for later
contract.contractAddress
// address -> 'cosmos1q7kc6y94zuvr7wsekg45e6pr8nhef6ku9ugw8r'
```

我们从一个只有“地址”作为管理员的代码创建了一个合同。 更新管理员
用于演示。

```ts
// Use a key you control to test out execute with subkey
const friendAddr = "cosmos1ve2n9dd4uy48hzjgx8wamkc7dp7sfdv82u585d"

// generate second address if you don't have one:
// const friendClient = await useOptions(hackatomOptions).setup(PASSWORD, KEY_FILE);
// const friendAddr = await friendClient.getAccount().then(x => x.address);

contract.updateAdmins([address, friendAddr]);
```

在最后一行之后，两个管理员可以控制子密钥主合约。
您可以通过运行 `contract.admins()` 看到添加的新管理员
让我们从管理员那里删除朋友地址，你不会希望他
带着资金逃跑。 从管理员中删除他的地址并冻结合同。
冻结意味着管理员之后无法修改。

```ts
contract.updateAdmins([address])
contract.freeze()
```

### Allowance

Let's give some allowance to your friends account, so he can buy a lambo:

```ts
// lets pour some money to the account
client.sendTokens(contractAddress, [{denom: "ucosm", amount: "1000000"}])
// verify tokens are transferred
client.getAccount(contractAddress)

contract.increaseAllowance(friendAddr, {denom: "ucosm", amount: "90000"})
contract.allowance(friendAddr)
```

现在测试他是否可以执行消息。 打开另一个终端屏幕:

```ts
const friendClient = await useOptions(hackatomOptions).setup(PASSWORD, KEY_FILE);
const factory = CW1(friendClient)
const contract = factory.use('cosmos1q7kc6y94zuvr7wsekg45e6pr8nhef6ku9ugw8r')

contract.execute([{bank: {send: {from_address: contractAddress, to_address: address, amount: [{denom: "ucosm", amount: "20000"}]}}}])
```

Allowed account can spend the tokens. Lets prank your friend with decreasing
his allowance on admin terminal:

```ts
contract.decreaseAllowance(randomAddress, {denom: "ucosm", amount: "69999"}, { at_height: { height: 40000}})
```

在这些操作之后，他将只有 _1 ucosm_ 可以花费。 恶作剧的
最好的部分是 `at_height` 字段。 身高 40000 后，他的津贴将变为
不活动意味着他不能再花费代币了。

### Permissions

Initially keys do not have any permission to send permissioned messages and needs to be set key basis:

```ts
let permissions: Permissions = { delegate: true, undelegate: false, redelegate: true, withdraw: true}

contract.setStakingPermissions(randomAddress, permissions)

let dmsg: DelegateMsg = {staking: {delegate: {validator:"cosmosvaloper1ez03me7uljk7qerswdp935vlaa4dlu487syyhn", amount:{denom:"ureef",amount:"999"}}}}
contract.execute([dmsg])
// will be approved

let unmsg: UndelegateMsg = {staking: {undelegate: {validator:"cosmosvaloper1ez03me7uljk7qerswdp935vlaa4dlu487syyhn", amount:{denom:"ureef",amount:"999"}}}}
contract.execute([unmsg])
// will be rejected

```

## 贡献

可以通过添加不同的消息类型来改进此合约逻辑，
消息类型、每日可消费金额等的各种权限。检查
[cosmos sdk 提案](https://forum.cosmos.network/t/proposal-adding-subkey-feature-to-cosmos-sdk-and-apply-it-to-the-hub/2358)
更多的想法。
