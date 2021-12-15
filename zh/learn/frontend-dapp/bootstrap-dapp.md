# Bootstrap dApp

有两种方法可以引导新的 dApp:作为 monorepo 中的 lerna 包或作为独立应用程序。

## Monorepo 模板

通过这种方法，我们将在 `packages/` 目录中创建另一个 lerna 包，该包将使用本地 `logic` 和 `design` 包作为依赖项。

为此，您只需要将 `_template` 目录复制到 `packages/` 并将其重命名为 `balance-checker`:

```shell
git clone https://github.com/CosmWasm/dApps.git
cd dApps
cp -r _template packages/balance-checker
```

In the next section we'll start by customizing it to our needs.

## Standalone template

👷 Coming soon!
