# 介绍

在[入门部分](../../getting-started/intro.md) 中，我们演示了使用 CosmWasm 智能合约所需的基本过程:设置、编译、开发和交互.我们将更进一步，以一种使窃贼能够劫持合同中保存的资金的方式编辑托管合同.在开始之前，请确保您已阅读并遵循 [入门](../../getting-started/intro.md) 中的步骤.

##设置你的IDE

现在您可以编译和测试代码，是时候编辑它了.但在此之前，我们需要一个好的编辑器来进行这些更改.我强烈推荐可以帮助您学习语法的插件，尤其是在刚开始使用 Rust 时.我可以推荐两种免费的编辑器环境，选择你更熟悉的一种.

如果您使用 VSCode([下载链接](https://code.visualstudio.com/download))，您只需要添加 rust 插件.这是 RLS(Rust 语言服务器)的最佳支持环境，并使用 rust 编译器在保存时对所有代码进行类型检查.这给出了与实际编译器相同的错误消息，并沿着代码行突出显示，但有时响应可能有点慢(因为它运行编译器).相当不错，如果你习惯了VSCode，我强烈推荐它:

[VSCode 的 RLS](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)

我可以推荐另一个选项 Intellij IDEA 社区版([下载链接](https://www.jetbrains.com/idea/download/))，以及 Rust 插件.这对直接内联的许多语言功能有非常好的和快速的支持.特别是，它显示了沿变量推断的类型，这非常有用，尤其是在使用(嵌套)泛型时.它非常快速地捕获大多数语法错误，但不是全部.这意味着有时您必须查看编译失败才能找到错误.如果您来自另一个 Intellij 产品(例如 Goland)，我推荐这种方法:

[Intellij 的 RUST](https://intellij-rust.github.io/)

那里有更多的编辑器，有些编辑器具有不同程度的 Rust 支持，至少是语法高亮显示，但我建议您尝试上述两个中的一个，特别是如果您不熟悉 Rust.一旦您对该语言充满信心，您就可以随时使用其他编辑器并根据自己的喜好对其进行自定义.

### 设置根目录

以上两个扩展都在你的工作空间的根目录中寻找 Cargo.toml 文件，并且只解析这个 Cargo.toml 文件(列为工作空间，或由 `src/lib.rs` 导入)引用的 rust 代码. [`cosmwasm-examples`](https://github.com/CosmWasm/cosmwasm-examples) 存储库没有 `Cargo.toml` 文件，而是在每个示例子目录中都有一个.为确保在处理此示例时获得适当的 IDE 支持，您应该只打开 `escrow` 目录.通常，为一个 rust 项目打开一个窗口，其根目录与它的 `Cargo.toml` 文件相同.
