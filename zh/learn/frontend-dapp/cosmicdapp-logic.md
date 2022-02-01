# Cosmic dApp 逻辑

[`@cosmicdapp/logic`](https://github.com/CosmWasm/dApps/tree/master/packages/logic) 包提供了三种资源，可以更轻松地开发基于 CosmJS 的 dApp:config、utils ，和服务. 为了更好地理解我们将要开发的示例余额检查器 dApp，我们将介绍将在应用程序中使用的那些实用程序.

## 配置

将应用程序配置为适用于给定链的 AppConfig 定义:

```typescript
export interface AppConfig {
  readonly chainId: string;
  readonly chainName: string;
  readonly addressPrefix: string;
  readonly rpcUrl: string;
  readonly httpUrl: string;
  readonly faucetUrl: string;
  readonly feeToken: string;
  readonly stakingToken: string;
  readonly faucetToken: string;
  readonly coinMap: CoinMap;
  readonly gasPrice: number;
  readonly codeId?: number;
}
```

在本教程中，我们将使用 Heldernet 的配置.

除了 coinMap 之外，这些字段是不言自明的，它是一个原生硬币名称的映射，它允许我们使用 nativeCoinToDisplay() 来漂亮地打印代币数量. 它看起来像这样:

```typescript
{
  ucosm: { denom: "COSM", fractionalDigits: 6 },
  ustake: { denom: "STAKE", fractionalDigits: 6 },
}
```

## 实用程序

在这里你可以找到类似上面的“CoinMap”的定义，在你的配置文件中定义它时会派上用场.

还有几个用于处理错误和货币的实用函数.在本教程中，我们将只使用 `nativeCoinToDisplay()`，它有两个参数:一个 `@cosmjs/launchpad`、`Coin` 和一个 `CoinMap`.

它利用这些参数和来自 `@cosmjs/math` 的 `Decimal` 类返回一个带有更用户友好的 `amount` 字段的 `Coin`，该字段将用于在余额检查器中打印原生硬币.

## 服务

该资源提供了几个 React 上下文提供程序、一些实用函数和一个 `ProtectedSwitch` React 组件.

### SDK 提供者

我们将能够使用 `useSdk` 钩子与这个 React 上下文提供者交互，这将使我们能够访问 `SigningCosmWasmClient` 以查询链.

### 帐户提供商

`useAccount` 挂钩将公开此提供者的状态，这对于获取用户地址和余额非常有用.

### 错误提供者

通过使用 `useError` 钩子，我们将能够查询和更改全局错误的值.

### CW20

这是一个实用程序，它将提供多种与 CW20 合约交互的方法.对于余额检查器，我们将查询给定 CW20 合约代币的余额.

### ProtectedSwitch

`react-router-dom``Switch` 的包装器，只有在用户完成登录过程后才允许用户访问内部的路由.
