# 安装

在本节中，我们将为您的开发、部署和享受智能
Cosmos SDK 上的合约.

## 去

您可以按照 [official] 设置 golang
文档](https://github.com/golang/go/wiki#working-with-go). `wasmd` 的最新版本
需要版本`v1.15`.

## 锈

假设您从未使用过 Rust，您首先需要安装一些工具. 标准
方法是使用 `rustup` 来维护依赖关系并处理更新多个版本的
你将使用的 `cargo` 和 `rustc`.

### 在 Linux 和 Mac 上安装 Rust

首先，[安装 rustup](https://rustup.rs/). 安装后，请确保您拥有 wasm32 目标:

```shell
rustup default stable
cargo version
# If this is lower than 1.50.0+, update
rustup update stable

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

### 在 Windows 10 中安装 Rust

首先，从[rustup.rs](https://rustup.rs/)下载并执行`rustup-init.exe`
或 [rust-lang.org](https://www.rust-lang.org/tools/install).

如果需要，请手动下载并安装 Visual C++ Build Tools 2019，
来自 https://visualstudio.microsoft.com/visual-cpp-build-tools/ .
确保选择了“Windows 10 SDK”和“英语语言包”.

继续运行`rustup-init.exe`，继续安装.

可选:
- 下载安装[gvim](https://www.vim.org/download.php#pc)，修改Env vars添加\<gvim folder\>
到路径.
- 下载并安装 [git for windows](https://git-scm.com/download/win).修改 Env vars 以添加 \<git folder\>\bin
到路径.
- 打开开发者模式(设置 -> 更新和安全:对于开发者)并启用设备发现，以便能够
通过 ssh 访问 Windows 10 服务器(https://www.ctrl.blog/entry/how-to-win10-ssh-service.html#section-mssshserv-enable).

安装 wasm32 目标:
```shell
rustup default stable
cargo version
# If this is lower than 1.51.0, update
rustup update stable

rustup target list --installed
rustup target add wasm32-unknown-unknown
```

对于那些刚接触 Rust 的人，“稳定”频道每 6 周推出一次稳定版本.
  “每晚”频道是最前沿的频道，而不是
它只是提前一两个版本(用于测试)，但它允许一些额外的不稳定功能，其
API 可能会更改. 为了编译`wasm`，你需要使用`stable`. 我们使用 `nightly` 来编译
`wasmd` 的运行时，它需要它用于具有气体计量等的单通道编译器.

##wasmd

`wasmd` 是 CosmWasm 平台的支柱. 这是一个 Cosmoszone with wasm 的实现
启用智能合约.

这段代码是从`cosmos/gaia`存储库中分叉出来的作为基础，然后添加了x/wasm并进行了清理
上许多特定于 gaia 的文件. 但是，wasmd 二进制文件应该像 gaiad 一样运行，除了
添加 x/wasm 模块.

如果您打算开发或编辑合同，则需要 wasmd.

```shell
git clone https://github.com/CosmWasm/wasmd.git
cd wasmd
# replace the v0.16.0 with the most stable version on https://github.com/CosmWasm/wasmd/releases
git checkout v0.16.0
make install

# verify the installation
wasmd version
```

::: 小费
如果您在这里遇到任何问题，请检查您的“PATH”. `make install` 会将 `wasmd` 复制到
`$HOME/go/bin` 默认情况下，请确保在你的 `PATH` 中也设置了它，应该是
从源代码构建 Go 代码的一般情况.
:::

## 使用测试网

测试网[Musselnet](https://github.com/CosmWasm/testnets/tree/master/musselnet)上线
省去运行本地网络的麻烦并加快开发速度.

::: 警告
使用 go 1.15+ 编译 `wasmd` 可执行文件
:::

```shell
# clone wasmd repo
git clone https://github.com/CosmWasm/wasmd.git && cd wasmd

# oysternet runs on wasmd v0.16.0
git checkout v0.16.0

# build wasmd executable
make install
```

## 有关 Cosmos SDK 的更多信息

这些代表区块链的一个实例，
利用 [Cosmos SDK](https://github.com/cosmos/cosmos-sdk) 的所有稳定功能.作为
这样，`wasmd` 具有所有相同的功能(显然还有 WASM 智能合约).如果
您想了解有关访问这些功能的更多信息，请查看 [Gaia
文档](https://github.com/cosmos/gaia/tree/main/docs/gaia-tutorials).如果您想了解更多关于
Cosmos SDK 入门，看一看系列
[教程](https://tutorials.cosmos.network/) 展示了如何构建自定义模块
特定于应用程序的区块链.

##设置你的IDE

我们需要一位优秀的编辑来指导我们完成整个体验.我们强烈推荐有帮助的插件
你学习语法，尤其是刚开始生锈的时候.我们有两个免费的编辑器环境
推荐，选择一个你比较熟悉的.

如果您使用 VSCode ([下载链接](https://code.visualstudio.com/download))，您只需要添加
锈插件.这是 RLS(Rust 语言服务器)的最佳支持环境，并使用 rust
编译器在保存时对所有代码进行类型检查.这给出了与实际相同的错误消息
编译器会沿着代码行突出显示，但响应可能有点慢
有时(因为它运行编译器).相当不错，如果你习惯了 VSCode，我高度
推荐它:

[VSCode 的 RLS](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)

我可以推荐的另一个选项 Intellij IDEA 社区版([下载
链接](https://www.jetbrains.com/idea/download/))，以及 Rust 插件.这有非常好的和
直接内联快速支持许多语言功能.特别是，它显示了推断的类型
沿着变量，这可能非常有用，尤其是在使用(嵌套)泛型时.它
非常快速地捕获大多数语法错误，但不是全部.这意味着有时你必须看
在编译失败时找到错误.如果您来自其他 Intellij 产品(例如
Goland)，我推荐这种方法:

[Intellij 的 RUST](https://intellij-rust.github.io/)

还有更多的编辑器，有些编辑器有不同程度的 Rust 支持，至少是语法
突出显示，但我建议您尝试上述两种方法中的一种，特别是如果您不熟悉 Rust.
一旦您对该语言有信心，您就可以随时使用其他编辑器并根据您的需要对其进行自定义
喜欢.
