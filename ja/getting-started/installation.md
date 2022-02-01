# インストール

このセクションでは、スマートな開発、展開、および楽しみを提供します
CosmosSDKの契約.

## と一緒に行きます

[公式]をフォローしてgolangを設定できます
ドキュメント](https://github.com/golang/go/wiki#working-with-go). `wasmd`の最新バージョン
バージョン `v1.15`が必要です.

## さび

Rustを使用したことがないと仮定すると、最初にいくつかのツールをインストールする必要があります. 標準
この方法は、 `rustup`を使用して依存関係を維持し、複数のバージョンの更新を処理することです.
`cargo`と` rustc`を使用します.

### LinuxとMacにRustをインストールする

まず、[rustupをインストール](https://rustup.rs/). インストール後、wasm32ターゲットがあることを確認してください.

```shell
rustup default stable
cargo version
# If this is lower than 1.50.0+, update
rustup update stable

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

### Windows10にRustをインストールする

まず、[rustup.rs](https://rustup.rs/)から `rustup-init.exe`をダウンロードして実行します.
または[rust-lang.org](https://www.rust-lang.org/tools/install).

必要に応じて、Visual C ++ビルドツール2019を手動でダウンロードしてインストールしてください.
https://visualstudio.microsoft.com/visual-cpp-build-tools/から.
「Windows10SDK」と「EnglishLanguagePack」が選択されていることを確認してください.

引き続き `rustup-init.exe`を実行して、インストールを続行します.

オプション:
-[gvim](https://www.vim.org/download.php#pc)をダウンロードしてインストールし、Env変数を変更して、\ <gvimフォルダー\>を追加します.
パスへ.
-[git for windows](https://git-scm.com/download/win)をダウンロードしてインストールします. Env変数を変更して\ <git folder \> \ binを追加します
パスへ.
-開発者モードをオンにし([設定]-> [更新とセキュリティ:開発者向け])、デバイス検出を有効にして、次のことができるようにします.
ssh(https://www.ctrl.blog/entry/how-to-win10-ssh-service.html#section-mssshserv-enable)を介してWindows10サーバーにアクセスします.

wasm32ターゲットをインストールします.
```shell
rustup default stable
cargo version
# If this is lower than 1.51.0, update
rustup update stable

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

Rustを初めて使用する場合は、「安定版」チャネルで6週間ごとに安定版がリリースされます.
   「Nightly」チャンネルは最先端のチャンネルであり、
事前に(テスト用に)1つまたは2つのバージョンしかありませんが、いくつかの追加の不安定な機能を許可します.
APIは変更される可能性があります. `wasm`をコンパイルするには、` stable`を使用する必要があります. コンパイルには `nightly`を使用します
`wasmd`を実行しているときは、ガスメータリングなどを備えたシングルチャネルコンパイラで使用する必要があります.

## wasmd

`wasmd`はCosmWasmプラットフォームのバックボーンです. これは、wasmを使用したCosmoszoneの実装です.
スマートコントラクトを有効にします.

このコードは、基本として `cosmos/gaia`リポジトリからフォークされ、x/wasmが追加され、クリーンアップされました.
その上に多くのgaia固有のファイルがあります. ただし、wasmdバイナリはgaiadのように動作する必要がありますが、
x/wasmモジュールを追加します.

コントラクトを開発または編集する場合は、wasmdが必要です.

```shell
git clone https://github.com/CosmWasm/wasmd.git
cd wasmd
# replace the v0.16.0 with the most stable version on https://github.com/CosmWasm/wasmd/releases
git checkout v0.16.0
make install

# verify the installation
wasmd version
```

::: ヒント
ここで問題が発生した場合は、「パス」を確認してください. `makeinstall`は` wasmd`をにコピーします
`$ HOME/go/bin`デフォルトでは、必ず` PATH`にも設定してください.
ソースコードからGoコードを構築する一般的なケース.
:::

## テストネットを使用する

Testnet [Musselnet](https://github.com/CosmWasm/testnets/tree/master/musselnet)はオンラインです
ローカルネットワークを実行する手間を省き、開発をスピードアップします.

::: 暖かい
go 1.15+を使用して、 `wasmd`実行可能ファイルをコンパイルします
:::

```shell
# clone wasmd repo
git clone https://github.com/CosmWasm/wasmd.git && cd wasmd

# oysternet runs on wasmd v0.16.0
git checkout v0.16.0

# build wasmd executable
make install
```

## CosmosSDKに関する詳細情報

これらはブロックチェーンの例を表しています.
[Cosmos SDK](https://github.com/cosmos/cosmos-sdk)のすべての安定した機能を利用してください.として
このように、 `wasmd`はすべて同じ機能を持っています(そして明らかにWASMスマートコントラクト).もしも
これらの機能へのアクセスについて詳しく知りたい場合は、[Gaia
ドキュメント](https://github.com/cosmos/gaia/tree/main/docs/gaia-tutorials).あなたがもっと知りたいなら
Cosmos SDKの使用を開始し、シリーズをご覧ください
[チュートリアル](https://tutorials.cosmos.network/)は、カスタムモジュールの作成方法を示しています
アプリケーション固有のブロックチェーン.

## IDEをセットアップする

経験全体を通して私たちを導くための優れた編集者が必要です.役立つプラグインを強くお勧めします
特にさびたばかりのときは、文法を学びます. 2つの無料のエディタ環境があります
お勧めします、あなたがより精通しているものを選択してください.

VSCode([ダウンロードリンク](https://code.visualstudio.com/download))を使用する場合は、追加するだけで済みます
Rustプラグイン.これはRLS(Rust Language Server)の最適なサポート環境であり、rustを使用します
コンパイラは、保存時にすべてのコードに対して型チェックを実行します.これにより、実際のエラーメッセージと同じエラーメッセージが表示されます
コンパイラはコード行に沿って強調表示しますが、応答が少し遅い場合があります
時々(コンパイラを実行するため).かなり良いです、あなたがVSCodeに慣れているなら、私は非常に
それをお勧めします:

[VSCodeのRLS](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)

Intellij IDEA Community Editionをお勧めできるもう1つのオプション([ダウンロード
リンク](https://www.jetbrains.com/idea/download/))、およびRustプラグイン.これはとても良いです
直接インライン化は、多くの言語機能をすばやくサポートします.特に、推測されたタイプを示しています
変数とともに、これは特に(ネストされた)ジェネリックを使用する場合に非常に役立ちます.それ
ほとんどの文法エラーは非常に迅速に検出されますが、すべてではありません.これは時々あなたが見なければならないことを意味します
コンパイルが失敗したときにエラーが見つかりました.別のIntellij製品(例:
Goland)、私はこの方法をお勧めします:

[IntellijのRUST](https://intellij-rust.github.io/)

より多くのエディターがあり、そのうちのいくつかはRustのサポートの程度が異なり、少なくとも構文は
強調表示されていますが、特にRustに慣れていない場合は、上記の2つの方法のいずれかを試してみることをお勧めします.
言語に自信が持てれば、いつでも他のエディターを使用して、ニーズに合わせてカスタマイズできます.
お気に入り.
