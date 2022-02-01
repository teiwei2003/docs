# 導入する

Cosmos SDKには[優れた標準チュートリアル](https://tutorials.cosmos.network/nameservice/tutorial/00-intro.html)があり、サンプルのネームサービスアプリケーションを構築します.既存のSDK開発者に適切な移行を提供するために、CosmWasmを使用して同じアプリケーションを実装する方法を示します.これは、基本的な概念を示し、導入部で学習したスキルを適用するための便利なチュートリアルです.また、ERC20コントラクトを展開して使用するための別のチュートリアルを作成します.これは、イーサリアムのバックグラウンドを持つ人々にとってより馴染みのあるものです.

## 目標

[オリジナルチュートリアル](https://tutorials.cosmos.network/nameservice/tutorial/00-intro.html)と同様に、Universe-sdk/を構築します.この場合、ネイティブのgoモジュールを開発する代わりに、[`cosmwasm`](https://github.com/CosmWasm/cosmwasm)を使用してRustコントラクトをデプロイします.この過程で、CosmWasmの基本的な概念と構造を学びました.この例では、CosmWasmスマートコントラクトを使用して[デフォルトのCosmos SDKアプリケーション](https://github.com/CosmWasm/wasmd)をすばやく簡単にカスタマイズする方法を示します.

このチュートリアルの最後に、文字列を他の文字列にマッピングする機能的な「nameservice」アプリケーション(「map [string] string」)があります.これは、[Namecoin](https://namecoin.org/)、[ENS](https://ens.domains/)、[IOV](https://iov.one)、または[Handshake](https ://handshake.org/)、これらはすべて従来のDNSシステム( `map [domain] zonefile`)をシミュレートします.ユーザーは未使用の名前を購入したり、名前を販売/取引したりできるようになります.

**近日公開**
