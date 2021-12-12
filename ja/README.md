---
title: Introduction
description: CosmWasm is a new smart contracting platform built for the cosmos ecosystem.
footer:
  newsletter: false
aside: true
order: 1
---

# CosmWasmドキュメント

CosmWasmは、コスモスエコシステム用に構築された新しいスマートコントラクトプラットフォームです。まだ聞いたことがない場合は、[このイントロをチェックしてください](https://blog.cosmos.network/announcing-the-launch-of-cosmwasm-cc426ab88e12)。このドキュメントの目的は、テクノロジーを試してみたり、製品に統合したりしたい開発者のために、テクノロジーを深く掘り下げることです。特に、Cosmos SDKの経験を持つGo開発者、およびブロックチェーンプラットフォームを探しているRust開発者を対象としています。 {synopsis}

## CosmWasmの使用方法

CosmWasmは、CosmosSDKにプラグインできるモジュールとして記述されています。つまり、現在Cosmos SDKを使用してブロックチェーンを構築している人は誰でも、既存のロジックを調整することなく、CosmWasmスマートコントラクトサポートをチェーンにすばやく簡単に追加できます。また、[`wasmd`](https://github.com/CosmWasm/wasmd)と呼ばれる` gaiad`バイナリに統合されたCosmWasmのサンプルバイナリも提供しているため、スマートコントラクト対応の新しいブロックチェーンをボックス、文書化およびテスト済みのツールとCosmosHubと同じセキュリティモデルを使用します。

コントラクトをホストし、アプリからそれらを使用するには、実行中のブロックチェーンが必要になります。 [テストネットに接続する](/getting-started/setting-env.md#setting-up-environment)または[ローカルの「devnet」を設定する](/getting-started/setting-env)方法を説明します。後のセクションのmd#run-local-node-optional)。また、デモを簡単に実行し、他のユーザーと契約を共有するために、すべての開発者が契約をアップロードするだけのホスト型テストネットを間もなくリリースする予定です。

## セクション

* [はじめに](/getting-started/intro.md)を使用すると、実践的なトレーニングに参加できます。それは優しくあなたを導きます
ローカルブロックチェーンでのスマートコントラクトの変更、展開、および実行。これは、コーディングに手間をかけずに、システムのすべての側面を調べて理解するのに理想的な場所です。

* [Architecture](/architecture/multichain.md)は、CosmWasmの高レベルの設計とアーキテクチャの多くを説明しています。
システムの設計を開始する前に、システムのメンタルモデルと機能を理解しておくことをお勧めします。動作するコードで手を汚したいだけの場合は、今のところこのセクションをスキップして、後で設計について熟考する準備ができたら戻ってください。

* [Testnets](/testnets/build-requirements.md)は、ライブを検索する場合の最初のポイントとして適しています。
安定した使いやすいテスト環境でスマートコントラクトをテストおよびハッキングするためのネットワーク。また、「**十分な数のバリデーターがテストネットに参加しています**」と、誰も言っていません😉

* [Learn](/learn/README.md)は、ゼロから本番環境までのスマートコントラクトの開発を段階的に示します
説明、コードスニペット、スクリプトなど。

* [ワークショップ](/learn/videos-workshops.md)には、デモンストレーションと口頭での説明の素晴らしいコレクションがあります
  さまざまなイベントや組織で私たちのチームによって記録されたCosmWasm技術スタック。

*コミュニティの相互作用のための[コミュニティ](/community/hall-of-fame.md)。

* [Plus](/cw-plus/general/overview.md)は、最先端のCosmWasmスマートコントラクト用です。

* [IBC](/ibc/01-overview.md)は、CosmWasmおよびIBCに関連するすべてのもの用です。リレー、アクティブネットワーク接続、IBC対応
  スマートコントラクトなど。

## さらなる研究

あなたは私たちのコードを掘り下げて、あなた自身の契約を書き始めることができます：

* [契約例のセット](https://github.com/CosmWasm/cosmwasm-examples)フォークして実験する
* [コアコントラクトライブラリ]のRustdoc(https://docs.rs/cosmwasm-std/0.13.1/cosmwasm_std/)
* [ストレージヘルパー]のRustdoc(https://docs.rs/cosmwasm-storage/0.13.1/cosmwasm_storage/)

のさまざまなコンポーネントを説明するかなりの数の[中程度の高レベルの記事](https://medium.com/confio)があります
私たちのスタックと私たちが行くところ。

もたらす開発作業のほとんどに資金を提供してくれた[InterchainFoundation](https://interchain.io/)に感謝します
CosmWasmから本番環境へ。
