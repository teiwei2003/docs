# 大まかなロードマップ

これまでのところ、CosmWasmは、[ICF Grants](https://interchain.io)によって資金提供された[Small Team](http://confio.tech)の結果です. Cosmosエコシステムのさまざまなブロックチェーンをサポートするコアテクノロジーを構築してきました.以下は、主にICF助成金の残りの資金に基づいて、現在計画されているロードマップです.本番環境にデプロイするプロジェクトに強い関心(および資金提供)がある場合は、ロードマップの優先度を変更できます.

最新のステータスは、[Githubプロジェクトページ](https://github.com/orgs/CosmWasm/projects/1)で確認できます.

## 過去の成果

** 2019年8月から10月**:

* CosmWasm環境のコアワークを構築し、システム、サンプルコード、およびCosmosSDK統合を構築します.

** 2019年11月**:

*スタック統合全体をテストし、チュートリアルとドキュメントを作成し、多くの大まかな領域を磨きました.

** 2019年12月**:

* [CosmWasmドキュメント](https://www.cosmwasm.com)は、[チュートリアル](../getting-started/intro)を含めてオンラインです.
* [CosmWasm v0.5.2](https://github.com/CosmWasm/cosmwasm/tree/v0.5.2)、 `init`を完全にサポートし、` handle`は最初の安定バージョンです.
* [`wasmd`](https://github.com/CosmWasm/wasmd)サンプルのブロックチェーンがリリースされ、テストされました.

** 2020年1月**:

* [CosmWasm v0.6.0がリリースされました](https://medium.com/confio/annoucing-wasmd-release-d865abf381b) `query`と多くの拡張機能をサポートして、契約開発をより人間工学的にします.
* [cosmwasm-examples](https://github.com/CosmWasm/cosmwasm-examples)「エスクロー」および「erc20」コントラクトを使用する
*再現可能なビルドには[cosmwasm-opt](https://github.com/CosmWasm/cosmwasm-opt)を使用します
* [AssemblyScriptで契約書を書く](https://github.com/CosmWasm/cosmwasm/pull/118)とRustの実現可能性を調査する
* JSインターフェースに関する多くの作業

** 2020年2月**:

*最初の[wasmd安定バージョン](https://medium.com/confio/annoucing-wasmd-release-d865abf381b)は、他のプロジェクトで簡単にインポートできるようにCosmosSDKの依存関係をマークしました
*最初の[CosmWasmJSリリース](https://medium.com/confio/introduction-to-cosmwasm-js-548f58d9f6af). [`cosmwasm-js`](https://github.com/CosmWasm/cosmwasm-js)は、CosmWasmコントラクトと対話するための使いやすいTypeScriptSDKです.
* [Chrome拡張機能がCosmWasmトークン契約に署名](https://medium.com/confio/adding-cosmwasm-to-the-neuma-multichain-wallet-ec657d893268)デモ統合.この場合、ERC20と同様の契約はネイティブトークンで取引することができます.
* [nameservice契約](https://github.com/CosmWasm/cosmwasm-examples/tree/master/nameservice)は、並列CosmosSDKチュートリアルの例として公開されています

** 2020年3月**:

* [CosmWasm v0.7.0がリリースされました](https://medium.com/confio/cosmwasm-0-7-released-6db5a037f943)は、多数の内部契約のクリーンアップをリリースしましたが、特に、より強力でクリーンな `wasmd` REST API (進行中の「cosmwasm-js」作業に触発されました)
* [デモネットの起動](https://medium.com/confio/cosmwasm-demo-net-launched-4c604674f3e0)ローカルブロックチェーンなしで契約をアップロードして実行します
* [`code-explorer`](https://github.com/CosmWasm/code-explorer)がリリースされました.チェーン上のすべてのコードとコントラクトを確認してください
* [EnigmaテストネットはCosmWasmで実行されます](https://forum.enigma.co/t/testnet-is-live-with-smart-contracts/1386)スマートコントラクトのサポート
*アップロードされたCosmWasm契約の背後にある[Rustソースの確認](https://medium.com/confio/dont-trust-cosmwasm-verify-db1caac2d335)
*大幅に強化された `cosmwasm-js`:[読み取り](https://medium.com/confio/cosmwasmclient-part-1-reading-e0313472a158)および書き込み
* NameService Reactアプリケーションは、フルスタックソリューション(コントラクトからUIまで)を示します

** 2020年4月/5月**:

* CosmWasm0.8がリリースされました
* [クロスコントラクトクエリ](../architecture/composition.md)
*ストレージレイヤーにイテレータを追加します
* [カスタマイズ可能なメッセージとクエリ](https://github.com/CosmWasm/wasmd/blob/v0.8.0/INTEGRATION.md#adding-custom-hooks)
*ステーキングモジュールとの統合

** 2020年6月**:

* CosmWasm 1年(このアイデアは2019年6月のハッカトムベルリンで生まれました)
*第1回ライブワークショップ(カスタムトークン)-私たちと一緒にコードを書く
* CosmJSプロジェクトは、Cosmosの他のプロジェクトから開始されました

** 2020年7月**:

* Cosmwasm0.9および0.10がリリースされました
  *契約の移行は所有者によって有効にされます
  *契約のライフサイクル全体にわたるガバナンス制御を実現する
  *バイナリファイルをコンパイルする際のオプトイン、ライセンスのないシステムとライセンスのあるシステムのサポートを提供します
*フルフィル[コスモスハブ提案](https://hubble.figment.network/cosmos/chains/cosmoshub-3/governance/proposals/25):
* Launchpadプロジェクトを主導して貢献する
* ConfioとCosmWasmのブランド変更
* Fetch.aiはCosmWasmを統合します

** 2020年8月**:

* CosmJS0.22.0がリリースされました
*長生きするスマートコントラクトテストサイト[CoralNetwork](https://github.com/CosmWasm/testnets/tree/master/coral)がリリースされました
*チームの成長(Dev Relations/Orkun、フロントエンド/Abel、COO/製品担当副社長/Martin)
* CosmWasmDiscordサーバーを起動しました
* ConfioとCosmWasmの新しいウェブサイト

## 計画作業

IBCサポートを追加します(ICF許可に基づく):

* IBCを契約に公開するためのシンプルなインターフェース
* `wasmd`での完全なIBC統合

## 超えた

* * AssemblyScript *または* TinyGo *でのCosmWasmコントラクトの記述をサポート
*よりタイトでより構成可能なガスメータリング
*より多くのホストプラットフォームをサポート(i686/Amd64でLinuxおよびOSXを超える)
* CosmWasm上に構築されたプロジェクトに必要なその他の機能.
※「コンセプトチェーン」のさらなる展開
