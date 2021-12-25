# 介绍

CsomWasm 证明了作为 Cosmos Hub 核心的智能合约容器的潜力。 {概要}

CosmWasm 的承诺之一是在 Cosmos Hub 上实现灵活的智能合约执行。使用集线器上的 CosmWasm，
网络参与者可以提议部署智能合约，在治理中投票以启用它们。

在本节中，您将学习在集线器上体验智能合约所需的所有知识。如果您对智能合约感兴趣
开发，消化 [Getting Started](/getting-started/intro.md) 文档。

## Wasmd 授权设置

CosmWasm 提供了可以通过多种方式配置的链上智能合约部署授权机制:

- 对所有人免费，即完全无需管理员。任何人都可以部署。
- 完全许可，意味着只有管理员可以部署。
- 通过链上治理。合约的部署由治理投票决定。
- 按业主，按合同签订合同。

### 在编译时启用治理建议

当 gov 提案绕过现有的授权策略时，它们被禁用并需要在编译时启用。
```
-X github.com/CosmWasm/wasmd/app.ProposalsEnabled=true - enable all x/wasm governance proposals (default false)
-X github.com/CosmWasm/wasmd/app.EnableSpecificProposals=MigrateContract,UpdateAdmin,ClearAdmin - enable a subset of the x/wasm governance proposal types (overrides ProposalsEnabled)
```

如果您使用的是`gaiaflex` 二进制可执行文件，则不需要使用上面的标志进行构建，因为它已经包含在
二进制构建。

### 通过 Genesis 初始化参数

初始授权配置在 genesis 文件中:

```json
"wasm": {
    "params": {
      "code_upload_access": {
        "permission": "Nobody"
      },
      "instantiate_default_permission": "Nobody"
    }
}
```

gaiaflex 测试网中的这些配置意味着只有治理才能上传和初始化智能合约。

### 可用配置
- `code_upload_access` - 谁可以上传 wasm 二进制文件:`Nobody`、`Everybody`、`OnlyAddress`。需要在创世中定义。
以后可以通过治理投票进行更改。
- `instantiate_default_permission` - 平台默认，当代码所有者没有设置它时，谁可以实例化一个 wasm 二进制文件
在本教程中，我们将向您展示在受管控网络上部署智能合约。

CosmWasm 扩展了 Cosmos SDK 治理模块，以支持在提案后部署智能合约。

## 获取示例 cw-subkeys 合同

获取样本合同有两种选择:

1.下载【源代码】(https://github.com/CosmWasm/cosmwasm-plus/tree/v0.1.1/contracts/cw20-base)，并【编译】(/getting-started/compile-contract.md )它是你的自我。

2.下载【预编译二进制文件】(https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.1.1/cw20_base.wasm)。

## 提交提案

部署命令如下:

```shell
wasmcli tx gov submit-proposal wasm-store cw1-subkeys.wasm \
 --source “https://github.com/CosmWasm/cosmwasm-plus" \
 —-builder “cosmwasm/workspace-optimizer:0.10.3” \
 —-title “Enable cw1-subkeys functionality” \
 —-description “DAO and DSOs need this!” \
 —-instantiate-everybody “true” \
 —-run-as $(wasmcli keys show -a account)
 —-deposit “10000umuon”
 --from account
```

如果你运行 `wasmcli tx gov submit-proposal wasm-store -h`，你会注意到两个更重要的标志:

```shell
--instantiate-everybody string      Everybody can instantiate a contract from the code, optional
--instantiate-only-address string   Only this address can instantiate a contract instance from the code, optional
```

默认情况下，启用第一个标志。 如果你只希望一个地址能够发起合约，
设置“仅实例化地址”标志。

如果设置了这些标志中的任何一个，投票委员会应该决定这对于给定的合同是否可以接受。
实例化每个人可能对多重签名有意义(每个人都有自己的)，但不适用于创建新令牌。

## 投票

提案创建后，需要通过治理投票通过。
```shell
wasmcli tx gov vote [proposal-id] yes --from account
```

## Instantiate

After the proposal passes the code will be deployed. Now you can instantiate the contract.

```shell
INIT=’{“admins”: [“cosmos12at9uplen85jt2vrfc5fs36s9ed4ahgduclk5a”,”cosmos1v7mjgfyxvlqt7tzj2j9fwee82fh6ra0jvhrxyp”,”cosmos18rkzfn65485wq68p3ylv4afhgguq904djepfkk”,”cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u”], “mutable”: true}’
wasmcli tx wasm instantiate [code_id] “$INIT” \
 --label “UP-101 Funding Account”
 —-amount 2000000uatom
 --from account
```

## 相互作用

如果您对合同具有管理员访问权限，则可以通过运行以下命令添加或删除管理员:

```
export UPDATE_ADMINS_MSG=’{“update_admins”: {“admins”:[“cosmos1u3nufc2kjslj2t3pugxhjv4zc8adw5thuwu0tm”, “cosmos1fp9qlazkm8kgq304kalev6e69pyp5kmdd5pcgj”]}}’
wasmcli tx wasm execute $CONTRACT_ADDRESS “$UPDATE_ADMINS_MSG” \
--from account
```

子密钥限额可以使用以下命令执行发送令牌交易:
```
export SEND_MSG=’{“execute”:{“msgs”:[{“bank”:{“send”:{“amount”:[{“denom”:”umuon”,”amount”:”1000"}],”from_address”:”cosmos18vd8fpwxzck93qlwghaj6arh4p7c5n89uzcee5",”to_address”:”cosmos1cs63ehtq6lw86vc87t42cnhcmydtnrffzdjhkz”}}}]}}’
wasmcli tx wasm execute $CONTRACT_ADDRESS “$SEND_MSG” --from account
```
