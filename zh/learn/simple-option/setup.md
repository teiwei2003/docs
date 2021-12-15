# 设置

<iframe src="https://player.vimeo.com/video/457712351" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

## 编码环境

### Rust 和 IDE
本节是[入门/安装和设置环境](../../getting-started/installation.md)的总结。
您可以转到文档，设置 rust 和首选 IDE，然后返回此处。我们推荐使用 Intellij IDEA。

## 项目启动器

项目启动模板 repo 可用于快速旋转新的智能合约。
使用一个命令，项目布局、样板、git，甚至用于自动测试/格式化/linting 的 Circle CI 都将被设置。很酷吧。
这是 repo:[cosmwasm-template](https://github.com/CosmWasm/cosmwasm-template)

假设您有上面的后续部分，那么以下内容应该会为您提供一个新的存储库来启动合同:

首先，安装**cargo-generate**。除非你以前这样做过，否则现在运行这一行:

`cargo install cargo-generate --features vendored-openssl`

现在，使用它来创建您的新合同。转到要放置它的文件夹并运行:

`货物生成 --git https://github.com/CosmWasm/cosmwasm-template.git --name simple-option`

初始化 git 仓库:

```shell
git add .
git commit -m "Initial generation from cosmwasm-template"
```

Great, workstation is ready.
