# 契約書をダウンロードしてコンパイルする

このセクションでは、サンプルコントラクトをダウンロードし、wasmバイナリ実行可能ファイルにコンパイルします。

まず、[クライアント設定手順](./setting-env.md)を確認し、設定して確認してください。
クライアント、GoCLIまたはNode.jsコンソール。

## コントラクトをコンパイルしてテストします

収集したリポジトリをダウンロードしましょう
[`cosmwasm-examples`](https://github.com/CosmWasm/cosmwasm-examples)そして既存のシンプルなものを試してみてください
いくつかのネイティブトークンを保持し、仲裁人にそれらを解放する権限を与えることができるエスクロー契約
所定の受益者へ。 まず、リポジトリのクローンを作成し、wasmパッケージのビルドを試みます。

```shell
# get the code
git clone https://github.com/CosmWasm/cosmwasm-examples
cd cosmwasm-examples
git fetch --tags
git checkout escrow-0.10.0
cd escrow

# compile the wasm contract with stable toolchain
rustup default stable
cargo wasm
```

コンパイル後、
`target/wasm32-unknown-unknown/release/cw_escrow.wasm`。 高速の `ls-l`は約2MBを表示するはずです。 この
これはリリースバージョンですが、不要なコードがすべて削除されるわけではありません。 小さいバージョンを作成するには、
これを実行して、未使用のコードをすべて削除するようコンパイラーに指示できます。

```shell
RUSTFLAGS='-C link-arg=-s' cargo wasm
```

これにより、約174kBのファイルが生成されます。 次の[最後のセクション](#Optimized-Compilation)でこれと別のオプティマイザーを使用して、ブロックチェーンにアップロードされた最終製品を生成します。 これを自分で実行することを心配する必要はありません(
好奇心が強い)、しかしあなたはこのように契約の最終的なサイズを理解する必要があります。

## Unit Tests

Let's try running the unit tests:

```shell
RUST_BACKTRACE=1 cargo unit-test
```

After some compilation steps, you should see:

```text
running 5 tests
test contract::tests::cannot_initialize_expired ... ok
test contract::tests::proper_initialization ... ok
test contract::tests::init_and_query ... ok
test contract::tests::handle_refund ... ok
test contract::tests::handle_approve ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

`RUST_BACKTRACE = 1`は、エラーの完全なスタックトレースを提供します。これは非常に便利です。 この
単体テストにのみ適しています(コンパイルされたwasmではなくネイティブのRustコードをテストします)。 また、必要に応じて
`cargowasm`と` cargounit-test`がどこから来たのかを知ってください。
`.cargo/config`。 貨物標識の詳細については、こちらをご覧ください。

## 最適化されたコンパイル

スマートコントラクトのバイナリサイズは、ガスコストを削減するために可能な限り小さくする必要があります。 これは費用がかかるだけではありません
展開を減らし、すべての対話にも適用されます。 簡単に言うと、[cosmwasm/rust-optimizer](https://github.com/CosmWasm/rust-optimizer)**本番コードを最適化**を使用します。
** rust-optimizer **は、繰り返し可能なcosmwasmスマートコントラクト構築も生成します。
これは、サードパーティが契約が実際に要求されたコードであることを確認できることを意味します。

```shell
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.10.7
```
