# CosmicdAppロジック

[`@ cosmicdapp/logic`](https://github.com/CosmWasm/dApps/tree/master/packages/logic)パッケージは、CosmJSベースのdAppの開発を容易にする3つのリソース、config、utils、およびサービス。 開発するサンプルバランスチェッカーdAppをよりよく理解するために、アプリケーションで使用されるユーティリティを紹介します。

## 構成

特定のチェーンのAppConfig定義に適用するようにアプリケーションを構成します。

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

このチュートリアルでは、Heldernetの構成を使用します。

coinMapを除いて、これらのフィールドは一目瞭然です。これはネイティブコイン名のマッピングであり、nativeCoinToDisplay()を使用してコインの数を美しく印刷できます。 次のようになります。

```typescript
{
  ucosm: { denom: "COSM", fractionalDigits: 6 },
  ustake: { denom: "STAKE", fractionalDigits: 6 },
}
```

## ユーティリティ

ここでは、上記の「CoinMap」に似た定義を見つけることができます。これは、構成ファイルで定義するときに役立ちます。

エラーと通貨を処理するためのいくつかの便利な関数もあります。このチュートリアルでは、 `nativeCoinToDisplay()`のみを使用します。これには、 `@ cosmjs/launchpad`、` Coin`、および `CoinMap`の2つのパラメーターがあります。

これらのパラメータと `@ cosmjs/math`の` Decimal`クラスを使用して、よりユーザーフレンドリーな `amount`フィールドを持つ` Coin`を返します。これは、バランスチェッカーでネイティブコインを印刷するために使用されます。

## 仕える

このリソースは、いくつかのReactコンテキストプロバイダー、いくつかのユーティリティ関数、および `ProtectedSwitch`Reactコンポーネントを提供します。

### SDKプロバイダー

`useSdk`フックを使用してこのReactコンテキストプロバイダーと対話できるようになります。これにより、` SigningCosmWasmClient`にアクセスしてチェーンをクエリできます。

### アカウントプロバイダー

`useAccount`フックは、このプロバイダーのステータスを公開します。これは、ユーザーのアドレスと残高を取得するのに非常に役立ちます。

### 間違ったプロバイダー

`useError`フックを使用することで、グローバルエラーの値を照会および変更できます。

### CW20

これは、CW20契約と対話するための複数の方法を提供するユーティリティプログラムです。残高チェッカーについては、特定のCW20契約トークンの残高を照会します。

### ProtectedSwitch

ユーザーがログインプロセスを完了した後にのみユーザーが内部ルーターにアクセスできるようにする `react-router-dom``Switch`のラッパー。
