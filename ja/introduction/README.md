# CosmWasmドキュメント

CosmWasmは、Cosmosエコシステム用に構築された新しいスマートコントラクトプラットフォームです.聞いたことがない場合は、[この紹介をチェックしてください](https://blog.cosmos.network/annoucing-the-launch-of-cosmwasm-cc426ab88e12).このドキュメントの目的は、このドキュメントを試してみたり、製品に統合したりして、テクノロジに関する洞察を得たい開発者に提供することです.特に、Cosmos SDKの経験があるGo開発者、およびブロックチェーンプラットフォームを探しているRust開発者を対象としています. {まとめ}

## CosmWasmの使用方法

CosmWasmは、CosmosSDKにプラグインできるモジュールとして記述されています.つまり、現在Cosmos SDKを使用してブロックチェーンを構築している人は誰でも、既存のロジックを調整することなく、CosmWasmスマートコントラクトサポートをチェーンにすばやく簡単に追加できます.また、[`wasmd`](https://github.com/CosmWasm/wasmd)と呼ばれる` gaiad`バイナリファイルに統合されたCosmWasmサンプルバイナリファイルも提供しているため、ボックスからレコードとテストを使用できます.ツールコスモスハブと同じセキュリティモデル.

コントラクトをホストし、アプリケーションからそれらを使用するには、実行中のブロックチェーンが必要になります. [テストネットに接続する](/getting-started/setting-env.md#setting-up-environment)または[ローカルの「開発ネットワーク」を設定する](/getting-started/setting-env.md)方法を説明します.後半の#run-local-node-optional).また、ホストされたテストネットを間もなくリリースする予定です.すべての開発者は、契約をテストネットにアップロードするだけで、デモを簡単に実行したり、契約を他の人と共有したりできます.

## 部

* [はじめに](/getting-started/intro.md)を使用すると、実践的なトレーニングに参加できます.優しくご案内します
ローカルブロックチェーンでスマートコントラクトを変更、デプロイ、実行します.コーディング作業をあまり行わずに、システムのすべての側面を理解し、理解するのに理想的な場所です.

* [Architecture](/architecture/multichain.md)は、CosmWasmの多くの高レベルの設計とアーキテクチャについて説明しています.
システムの設計を開始する前に、システムのメンタルモデルと機能を理解するのが最善です.動作するコードに触れたいだけの場合は、このセクションをスキップして、設計について考える準備ができたら戻ってください.

* [Testnets](/testnets/build-requirements.md)リアルタイムを探している場合
ネットワークは、安定した使いやすいテスト環境でスマートコントラクトをテストしてクラックします.さらに、「**テストネットに参加するのに十分なバリデーターがあります**」、誰もそれを言ったことがありません😉

* [Learn](/learn/README.md)は、ゼロから本番環境へのスマートコントラクトの開発を徐々に示します
説明、コードスニペット、スクリプトなど.

* [ワークショップ](/learn/videos-workshops.md)は多くのデモと口頭での説明を集めました
  CosmWasmテクノロジースタックは、さまざまな活動や組織で私たちのチームによって記録されました.

* [Community](/community/hall-of-fame.md)は、コミュニティの相互作用に使用されます.

* [Plus](/cw-plus/general/overview.md)は、最も高度なCosmWasmスマートコントラクトに適しています.

* [IBC](/ibc/01-overview.md)は、CosmWasmとIBCに関連するすべてのものです.リピーター、アクティブなネットワーク接続、IBC対応
  スマートコントラクトなど.

## ディープラーニング

あなたは私たちのコードを掘り下げて、あなた自身の契約を書き始めることができます:

* [契約例のセット](https://github.com/CosmWasm/cosmwasm-examples)フォークして実験する
* [コアコントラクトライブラリ] Rustdoc(https://docs.rs/cosmwasm-std/0.13.1/cosmwasm_std/)
* [ストレージアシスタント]のRustdoc(https://docs.rs/cosmwasm-storage/0.13.1/cosmwasm_storage/)

[メディアに関する高度な記事](https://medium.com/confio)の説明がたくさんあります
私たちのスタックと私たちが行くところ.

開発作業のほとんどに資金を提供してくれた[InterchainFoundation](https://interchain.io/)に感謝します
CosmWasmから本番環境へ.
