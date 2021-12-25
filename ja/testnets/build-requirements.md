# インストール

ノード実行可能ファイルは、ネットワークによって異なる場合があります。[オプション1](#option-1-preferred-build-static-binary-using-docker-linux-only)
古くなっている可能性があります。ネットワークの詳細、構成、および情報は、[CosmWasm/testnets](https://github.com/CosmWasm/testnets)にあります。ノードの設定を開始する前に、リポジトリに移動して探索してください。

## 最も簡単

Dockerイメージを使用するか、ローカルでビルドします: `https://github.com/CosmWasm/wasmd/#dockerized`。

## ベアメタル

### オプション1(推奨-dockerを使用して静的バイナリを構築する-Linuxのみ)

`wasmd`のビルドは、ビルド環境としてAlpine Linuxを使用し、Rustの依存関係を静的ライブラリに再コンパイルするというトリッキーなプロセスです。
Dockerfileを使用することをお勧めします。

1.プロジェクトのクローンを作成します `git clone https://github.com/CosmWasm/wasmd.git && cd wasmd`
2.テストネットバージョン `git checkoutvx.x.x`へのチェックアウト
3.dockerイメージ `docker build .-twasmd-docker`をビルドします
4.ビルド環境から特定のバイナリファイルを抽出します。

   ```shell
   id=$(docker create wasmd-docker)
   docker cp $id:/usr/bin/wasmd .
   docker rm -v $id
   ```

5.ベアメタルLinuxマシンで静的バイナリを使用する

### オプション2 :(開発スタイル:動的バイナリファイル-LinuxおよびOSX用)

1.`git clone https://github.com/CosmWasm/wasmd.git && cd wasmd`
2.テストネットバージョン `git checkoutvx.x.x`へのチェックアウト
3.開発ビルドをコンパイルします: `make build`
4.バイナリに移動して目的の位置に移動します
