# 构建要求

对于最低系统要求，建议使用 2 个处理器 CPU 和 4GB 内存的实例.
构建代码可能需要更大的实例，特别是如果你想构建一个静态实例(重新编译 Rust 代码).

# 安装

节点可执行文件可能因网络而异，[选项 1](#option-1-preferred-build-static-binary-using-docker-linux-only)
可能会过时.网络详细信息、配置和信息可以在 [CosmWasm/testnets](https://github.com/CosmWasm/testnets) 上找到.在开始设置节点之前，请前往 repo 并进行探索.

## 最简单

使用 docker 镜像，或在本地构建:`https://github.com/CosmWasm/wasmd/#dockerized`.

## 裸机

### 选项 1(首选 - 使用 docker 构建静态二进制文件 - 仅限 Linux)

构建 `wasmd` 是一个棘手的过程，涉及使用 Alpine Linux 作为构建环境并将 Rust 依赖项重新编译为静态库.
建议使用 Dockerfile.

1.克隆项目`git clone https://github.com/CosmWasm/wasmd.git && cd wasmd`
2. 结帐到测试网版本`git checkout vx.x.x`
3. 构建docker镜像`docker build . -t wasmd-docker`
4. 从构建环境中提取特定的二进制文件:

   ```shell
   id=$(docker create wasmd-docker)
   docker cp $id:/usr/bin/wasmd .
   docker rm -v $id
   ```

5. 在任何裸机 Linux 机器上使用静态二进制文件

### 选项 2:(开发风格:动态二进制文件 - 适用于 Linux 和 OSX)

1.`git clone https://github.com/CosmWasm/wasmd.git && cd wasmd`
2. 结帐到测试网版本`git checkout vx.x.x`
3.编译dev build:`make build`
4. 移动到二进制到想要的位置
