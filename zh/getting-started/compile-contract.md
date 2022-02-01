# 下载和编译合约

在本节中，我们将下载一个示例合约，将其编译为 wasm 二进制可执行文件.

请首先查看[客户端设置说明](./setting-env.md)，并配置并验证一个
客户端，Go CLI 或 Node.js 控制台.

## 编译和测试合约

让我们下载我们收集的 repo
[`cosmwasm-examples`](https://github.com/CosmWasm/cosmwasm-examples) 并尝试现有的简单
托管合约，可以持有一些原生代币，并赋予仲裁者释放它们的权力
给预先确定的受益人. 首先，克隆 repo 并尝试构建 wasm 包:

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

编译后，它应该在
`target/wasm32-unknown-unknown/release/cw_escrow.wasm`. 快速的 `ls -l` 应该显示大约 2MB. 这
是一个发布版本，但没有删除所有不需要的代码. 要生产更小的版本，您
可以运行它告诉编译器去除所有未使用的代码:

```shell
RUSTFLAGS='-C link-arg=-s' cargo wasm
```

这会产生一个大约 174kB 的文件. 我们在下一个 [最后一节](#Optimized-Compilation) 中使用这个和另一个优化器来生成上传到区块链的最终产品. 你不需要担心自己运行这个(除非你是
好奇)，但您应该以这种方式了解合同的最终规模.

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

`RUST_BACKTRACE=1` 将为您提供任何错误的完整堆栈跟踪，这非常有用. 这
仅适用于单元测试(测试本机 Rust 代码，而不是编译后的 wasm). 另外，如果你想
知道 `cargo wasm` 和 `cargo unit-test` 来自哪里，它们只是定义在
`.cargo/config`. 看一看那里以更多地了解货物标志.

## 优化编译

智能合约二进制大小必须尽可能小以降低 gas 成本. 这不仅会花费
减少部署，也适用于每一次交互. 简单地说，使用 [cosmwasm/rust-optimizer](https://github.com/CosmWasm/rust-optimizer) **优化生产代码**.
**rust-optimizer** 还生成可重复的 cosmwasm 智能合约构建.
这意味着第三方可以验证合同是实际声称的代码.

```shell
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.10.7
```
