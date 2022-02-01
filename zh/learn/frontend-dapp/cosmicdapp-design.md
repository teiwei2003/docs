# Cosmic dApp 设计

[`@cosmicdapp/design`](https://github.com/CosmWasm/dApps/tree/master/packages/design) 包提供了两种资源:主题和组件. 主题提供全局样式以实现跨 dApp 的视觉一致性，而组件将为我们提供布局原语和具有内部逻辑的可重用 React 组件.

示例余额检查器 dApp 将使用此包中的一些资源，让我们来看看它们.

## 主题

我们将使用导出的“GlobalStyle”，以便与其余 dApp 保持视觉一致性. 这个 React 组件包括一个 CSS 重置； 间距、颜色和字体 CSS 自定义属性； 以及一些 Ant Design 类的覆盖. 如果您查看 `GlobalStyle` 代码，第一眼就会看到这一点:

```jsx
export function GlobalStyle(): JSX.Element {
  return (
    <>
      <GlobalReset />
      <GlobalSpacing />
      <GlobalColors />
      <GlobalFonts />
      <GlobalAntOverride />
    </>
  );
}
```

## 组件

### 布局原语

该资源提供了一些基于 [Every Layout](https://every-layout.dev) 一书的原语.

#### 堆

这个 React 组件将其子组件显示为一个堆栈，它们之间有一个可配置的间隙.

#### 页面布局

这个 React 组件用作每个视图的包装器. 它建立页面的最大宽度并将堆叠的子项居中放置.

### 具有逻辑的组件

#### 登录

余额检查器应用程序的第一个视图. 它提供了三种登录选项:localStorage 燃烧器钱包、账本钱包或 Keplr 钱包.

#### 您的帐户

一个有用的组件，允许用户将他们自己的地址复制到剪贴板，并可选择显示他们当前的本机余额.
