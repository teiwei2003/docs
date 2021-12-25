# 設定

<iframe src = "https://player.vimeo.com/video/457712351" width = "640" height = "360" frameborder = "0" allow = "autoplay; fullscreen" allowfullscreen> </iframe>

## コーディング環境

### RustとIDE
このセクションは、[はじめに/インストールおよびセットアップ環境](../../getting-started/installation.md)の概要です。
ドキュメントに移動し、rustと優先IDEを設定して、ここに戻ることができます。 IntellijIDEAの使用をお勧めします。

## プロジェクトランチャー

プロジェクト起動テンプレートリポジトリを使用して、新しいスマートコントラクトをすばやく起動できます。
1つのコマンドで、プロジェクトレイアウト、ボイラープレート、git、さらには自動テスト/フォーマット/リンティング用のCircleCIがセットアップされます。かっこいいじゃないですか。
これはリポジトリです:[cosmwasm-template](https://github.com/CosmWasm/cosmwasm-template)

上記のフォローアップセクションがあると仮定すると、以下は契約を開始するための新しいリポジトリを提供するはずです。

まず、** cargo-generate **をインストールします。以前にこれを行ったことがない限り、今すぐこの行を実行してください。

`cargo installcargo-generate --featuresvendored-openssl`

次に、これを使用して新しい契約を作成します。配置するフォルダーに移動して実行します。

`貨物の生成--githttps://github.com/CosmWasm/cosmwasm-template.git --name simple-option`

gitリポジトリを初期化します:

```shell
git add .
git commit -m "Initial generation from cosmwasm-template"
```

すばらしい、ワークステーションの準備ができています。
