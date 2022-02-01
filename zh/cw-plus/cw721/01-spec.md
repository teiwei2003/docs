# CW721 规范:不可替代的代币

cw721 包源代码:[https://github.com/CosmWasm/cosmwasm-plus/blob/master/packages/cw721/README.md](https://github.com/CosmWasm/cosmwasm-plus/blob/master /packages/cw721/README.md)

CW721 是基于 CosmWasm 的非同质代币规范.
名称和设计基于以太坊的 ERC721 标准，
有一些改进.这里的类型可以通过
希望实现此规范的合约，或通过调用的合约
任何标准的 cw721 合同.

规范分为多个部分，一个合同只能
实现其中一些功能，但必须实现基础.

## 根据

这处理所有权、转让和配额.这些必须支持
就像所有 CW721 合同一样.请注意，所有令牌都必须有一个所有者，
以及身份证. ID 是一个任意字符串，在合约中是唯一的.

### 消息

`TransferNft{recipient, token_id}` -
这会将令牌的所有权转移到“接收者”帐户.这是
旨在发送到由私钥控制的地址，并且*不*
如果是合同，则触发对接收方的任何操作.

需要 `token_id` 指向一个有效的令牌，并且 `env.sender` 是
它的所有者，或有转让它的津贴.

`SendNft{contract, token_id, msg}` -
这将令牌的所有权转移到“合同”帐户. `合同`
必须是由智能合约控制的地址，它实现
CW721接收器接口. `msg` 将被传递给接收者
合同，以及 token_id.

需要 `token_id` 指向一个有效的令牌，并且 `env.sender` 是
它的所有者，或有转让它的津贴.

`Approve{spender, token_id, expires}` - 授予 `spender` 权限
转移或发送给定的令牌.这只能在以下情况下执行
`env.sender` 是给定的 `token_id` 或一个 `operator` 的所有者.
每个代币可以有多个花费者账户，并且它们被清除一次
令牌被转移或发送.

`Revoke{spender, token_id}` - 这会撤销之前授予的权限
转移给定的`token_id`.这只能在以下情况下授予
`env.sender` 是给定的 `token_id` 或一个 `operator` 的所有者.

`ApproveAll{operator, expires}` - 授予 `operator` 传输或发送权限
`env.sender` 拥有的所有代币.此批准与所有者有关，而不是与
代币并适用于所有者未来收到的任何代币.

`RevokeAll{operator}` - 撤销之前授予的 `ApproveAll` 权限
到给定的`operator`.

### 查询

`OwnerOf{token_id}` - 返回给定令牌的所有者，
以及任何获得此特定令牌批准的人.
如果令牌未知，则返回错误.返回类型是
`所有者响应{所有者}`.

`ApprovedForAll{owner, include_expired}` - 列出所有可以
访问所有所有者的令牌.返回类型是“ApprovedForAllResponse”.
如果设置了`include_expired`，则在结果中显示过期的所有者，否则，
别理他们.

`NumTokens{}` - 发行的令牌总数

### 接收者

`SendNft` 的对应部分是 `ReceiveNft`，它必须由
任何希望管理 CW721 代币的合约.这通常是*不是*
由任何 CW721 合同实施.

`ReceiveNft{sender, token_id, msg}` - 旨在处理 `SendNft`
消息.合约地址存储在`env.sender`中
所以它不能被伪造.合同应确保发件人匹配
它期望处理的代币合约，并且不允许任意地址.

`sender` 是请求移动令牌的原始帐户
和 `msg` 是一个 `Binary` 数据，可以解码为特定于合约的数据
信息.如果我们只有一个默认操作，这可以为空，
或者它可能是一个 `ReceiveMsg` 变体来阐明意图.例如，
如果我发送到交易所，我可以指定我想列出代币的价格
为了.

## Metadata

### Queries

`ContractInfo{}` - 返回关于合约的顶级元数据.
即，`name` 和`symbol`.

`NftInfo{token_id}` - 返回关于一个特定令牌的元数据.
返回值基于 *ERC721 Metadata JSON Schema*，但直接
从合同，而不是作为一个 Uri.只有图像链接是 Uri.

`AllNftInfo{token_id}` - 返回 `NftInfo` 的结果
和 `OwnerOf` 作为一个查询作为对客户端的优化，这可能
希望两个信息都显示一个 NFT.

## 可枚举

### 查询

分页是通过 `start_after` 和 `limit` 实现的.限制是一个请求
由客户端设置，如果未设置，合约会自动设置为
`DefaultLimit`(建议为 10).如果设置，它将被使用到`MaxLimit`
值(建议 30).合约可以定义其他 `DefaultLimit` 和 `MaxLimit`
值不违反 CW721 规范，并且客户不应依赖
任何特定的值.

如果未设置`start_after`，则查询返回第一个结果，按顺序排列
由`token_id`按词法排序.如果设置了`start_after`，则返回
第一个`limit`令牌*在给定的之后.这允许直接
通过获取返回的最后一个结果(一个`token_id`)并使用它进行分页
作为未来查询中的“start_after”值.

`Tokens{owner, start_after, limit}` - 列出属于给定所有者的所有 token_id.
返回类型是`TokensResponse{tokens: Vec<token_id>}`.

`AllTokens{start_after, limit}` - 需要分页.列出所有受控制的 token_ids
合约.
