# CW20 粘合曲线

cw20-bonding-curve 源代码:[https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw20-bonding](https://github.com/CosmWasm/cosmwasm-plus/tree/主/合同/cw20-bonding)

这建立在 [Basic CW20 interface](01-spec.md)
在 [`cw20-base`](02-cw20-base-spec.md) 中实现

这有三个目的:

* 适用于任意键合曲线的可用且可扩展的合约
* 演示如何扩展 `cw20-base` 以添加额外功能
* [接收器接口](01-spec.md#receiver) 的演示

## 设计

有两种变体 - 接受本机令牌和接受 cw20 令牌
作为 *reserve* 令牌(这是输入到绑定曲线的令牌)。

Minting:当输入发送到合约时(通过`HandleMsg::Buy{}`
使用本机令牌，或通过 `HandleMsg::Receive{}` 使用 cw20 令牌)，
这些代币保留在合约中，并且它向合约发行自己的代币
发件人的帐户(称为*供应*令牌)。

燃烧:我们覆盖了燃烧功能，不仅燃烧所请求的代币，
但也要向烧毁的账户释放适当数量的输入代币
自定义令牌

Curves:`handle`指定了一个bonding函数，发送给参数化
`handle_fn`(完成所有工作)。编译时设置曲线
合约。事实上，许多合约可以只包装 `cw20-bonding` 和
指定自定义曲线参数。

阅读更多关于[此处的粘合曲线数学](https://yos.io/2018/11/10/bonding-curves/)

注意:第一个版本只接受本机令牌作为

### 数学

给定价格曲线 f(x) = 第 x 个代币的价格，我们想弄清楚
如何从债券曲线买入和卖出。其实我们可以看看
发行的总供应量。让`F(x)` 是`f(x)` 的积分。我们已经发出
发送到合约的“F(x)”的“x”代币。或者，反过来，如果我们发送
`x` 代币到合约，它将铸造 `F^-1(x)` 代币。

由此我们可以创建一些公式。假设我们目前已经发布了`S`
令牌以换取“N = F(S)”输入令牌。如果有人向我们发送 `x` 代币，
我们将发行多少？

`F^-1(N+x) - F^-1(N)` = `F^-1(N+x) - S`

如果我们出售 `x` 代币，我们会得到多少:

`F(S) - F(S-x)` = `N - F(S-x)`

每边只计算一个。为安全起见，请确保四舍五入并
使用`F^-1(S)`来估计多少时，总是检查`F(S)`
应该发出。这也将安全地给我们返回多少代币。

内置支持安全地[将 i128 提升到整数幂](https://doc.rust-lang.org/std/primitive.i128.html#method.checked_pow)。
还有一个板条箱[为所有整数提供 n 次根](https://docs.rs/num-integer/0.1.43/num_integer/trait.Roots.html)。
有了这两个，我们可以处理除对数/指数之外的大多数数学。

将此与[以可靠方式编写所有内容](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/7b7ff729b82ea73ea168e495d9c94cb901ae95ce/contracts/math/Power.sol)进行比较

例子:

价格常数:`f(x) = k` 和 `F(x) = kx` 和 `F^-1(x) = x/k`

价格线性:`f(x) = kx` 和 `F(x) = kx^2/2` 和 `F^-1(x) = (2x/k)^(0.5)`

价格平方根:`f(x) = x^0.5` 和 `F(x) = x^1.5/1.5` 和 `F^-1(x) = (1.5*x)^(2/3)`

我们只会在开始时实现这些曲线，而让其他人使用更复杂的曲线来导入它，
