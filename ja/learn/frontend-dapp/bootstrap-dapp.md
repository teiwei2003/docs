# ブートストラップdApp

新しいdAppをブートストラップする方法は2つあります。monorepoのlernaパッケージとして、またはスタンドアロンアプリケーションとしてです。

## モノレポテンプレート

このようにして、 `packages/`ディレクトリに別のlernaパッケージを作成します。このパッケージは、ローカルの `logic`パッケージと` design`パッケージを依存関係として使用します。

これを行うには、 `_template`ディレクトリを` packages/`にコピーし、名前を` balance-checker`に変更するだけです。

```shell
git clone https://github.com/CosmWasm/dApps.git
cd dApps
cp -r _template packages/balance-checker
```

次のセクションでは、ニーズに合わせてカスタマイズすることから始めます。

## スタンドアロンテンプレート

👷近日公開！
