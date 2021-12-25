# CosmWasmドキュメント

CosmWasmは、コスモスエコシステム向けに構築された新しいスマートコントラクトプラットフォームです。まだ聞いたことがない場合は、[このイントロをチェックしてください](https://blog.cosmos.network/announcing-the-launch-of-cosmwasm -cc426ab88e12)このドキュメントの目的は、テクノロジーを試してみたり、製品に統合したりする開発者向けに、テクノロジーを深く掘り下げることです。特に、CosmosSDKの経験を持つGo開発者を対象としています。ブロックチェーンプラットフォームを探しているRust開発者として。{synopsis}

## CosmWasmの使用方法

CosmWasmは、Cosmos SDKにプラグインできるモジュールとして記述されています。つまり、Cosmos SDKを使用して現在ブロックチェーンを構築している人は、既存のロジックを調整することなく、CosmWasmスマートコントラクトサポートをチェーンにすばやく簡単に追加できます。サンプルバイナリも提供しています。 [`wasmd`](https://github.com/CosmWasm/wasmd)と呼ばれる` gaiad`バイナリに統合されたCosmWasmのツールとCosmosハブと同じセキュリティモデル。

コントラクトをホストしてアプリから使用するには、実行中のブロックチェーンが必要です。[テストネットに接続](/getting-started/setting-env.md#setting-up-environment)または[セットアップする方法を説明します後のセクションでローカルの「devnet」](/getting-started/settings-env.md#run-local-node-optional)。そ​​して、すべての開発者が簡単にコントラクトをアップロードできるホストされたテストネットをまもなくリリースする予定です。 、デモを簡単に実行し、他の人と契約を共有するため。

## セクション

* [はじめに](/getting-started/intro.md)は、実践的なトレーニングにあなたを導きます。それはあなたを優しく導きます
ローカルブロックチェーンでのスマートコントラクトの変更、展開、実行。これは、コーディングに手間をかけずに、システムのすべての側面を確認して理解するのに理想的な場所です。

* [Architecture](/architecture/multichain.md)は、CosmWasmの高レベルの設計とアーキテクチャの多くを説明しています。
システムの設計を始める前に、システムのメンタルモデルと機能を理解しておくとよいでしょう。作業中のコードで手を汚したいだけの場合は、このセクションをスキップして、後で熟考する準備ができたら戻ってください。設計。

* [Testnets](/testnets/build-requirements.md)は、ライブを検索する場合の最初のポイントとして適しています。
安定した使いやすいテスト環境でスマートコントラクトをテストおよびハッキングするためのネットワーク。また、「**十分な数のバリデーターがテストネットに参加しています**」と誰も言いませんでした😉

* [Learn](/learn/README.md)は、ゼロから本番環境までのスマートコントラクトの開発を段階的に示します
説明、コードスニペット、スクリプトなど。

* [ワークショップ](/learn/videos-workshops.md)には、デモンストレーションと口頭での説明の素晴らしいコレクションがあります
  さまざまなイベントや組織で私たちのチームによって記録されたCosmWasm技術スタック。

*コミュニティの相互作用のための[コミュニティ](/community/hall-of-fame.md)。

* [Plus](/cw-plus/general/overview.md)は、最先端のCosmWasmスマートコントラクト用です。

* [IBC](/ibc/01-overview.md)は、CosmWasmおよびIBCに関連するすべてのもの用です。リレー、アクティブネットワーク接続、IBC対応
  スマートコントラクトなど。

## さらなる研究

あなたは私たちのコードを掘り下げて、あなた自身の契約を書き始めることができます:

* [契約例のセット](https://github.com/CosmWasm/cosmwasm-examples)フォークして実験する
* [コアコントラクトライブラリ]のRustdoc(https://docs.rs/cosmwasm-std/0.13.1/cosmwasm_std/)
* [ストレージヘルパー]のRustdoc(https://docs.rs/cosmwasm-storage/0.13.1/cosmwasm_storage/)

のさまざまなコンポーネントを説明するかなりの数の[中程度の高レベルの記事](https://medium.com/confio)があります
私たちのスタックと私たちが行くところ。

もたらす開発作業のほとんどに資金を提供してくれた[InterchainFoundation](https://interchain.io/)に感謝します
CosmWasmから本番環境へ。
