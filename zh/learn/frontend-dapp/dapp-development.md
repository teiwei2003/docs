# 开发dApp

为了展示之前解释的实用程序，我们将从模板创建余额检查器 dApp.

## 自定义模板

要使应用程序成为您自己的应用程序，请随时修改“package.json”中的“name”字段和/或更新“README.md”文件.

还要修改 `routes/Login/index.tsx` 文件，如下所示:

```jsx
import { Login as LoginDesign } from "@cosmicdapp/design";
import React from "react";
import { config } from "../../../config";
import { pathBalance } from "../../paths";
import cosmWasmLogo from "./assets/cosmWasmLogo.svg";

export function Login(): JSX.Element {
  return (
    <LoginDesign
      pathAfterLogin={pathBalance}
      appName="Balance checker"
      appLogo={cosmWasmLogo}
      config={config}
    />
  );
}

```

## 添加平衡路由

### 平衡路径

将以下内容添加到 `paths.ts` 文件中:

```typescript
export const pathBalance = "/ balance";
```

### 反应组件

在 `routes/` 中，添加一个包含以下文件的 `Balance` 目录:

- `index.tsx`

```jsx
import { PageLayout, YourAccount } from "@cosmicdapp/design";
import { useError } from "@cosmicdapp/logic";
import { Typography } from "antd";
import React, { useState } from "react";
import { FormCheckBalance } from "./components/FormCheckBalance";
import { TokenList } from "./components/TokenList";
import { ErrorText, MainStack } from "./style";

const { Title } = Typography;

export function Balance(): JSX.Element {
  const { error } = useError();
  const [contractAddress, setContractAddress] = useState();

  return (
    <PageLayout>
      <MainStack>
        <Title>Balance</Title>
        <YourAccount hideTitle hideBalance />
        <FormCheckBalance setContractAddress={setContractAddress} />
        {error && <ErrorText>{error}</ErrorText>}
        <TokenList contractAddress={contractAddress} />
      </MainStack>
    </PageLayout>
  );
}
```

- `style.ts`

```typescript
import { Stack } from "@cosmicdapp/design";
import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s4);
  }

  h1 {
    margin: 0;
  }

  .ant-form {
    margin-top: var(--gap);
  }
`;

export const ErrorText = styled(Text)`
  color: var(--color-red);
`;
```

如您所见，这两个文件使用了`@cosmicdapp/logic` 的`useError` 钩子，以及`@cosmicdapp/design` 的`Stack`、`PageLayout` 和`YourAccount` 组件，因此它们 你应该很熟悉.

`index.tsx` 组件的布局利用了 `MainStack` 和 `ErrorText`，它们是在 `style.ts` 中定义的样式化组件，以及尚未定义的 `FormCheckBalance` 和 `TokenList` 组件.

逻辑将这样工作:`TokenList` 组件将显示用户的原生代币，除非在`FormCheckBalance` 中输入合约地址，这将使 `TokenList` 显示该 CW20 合约的余额，或者显示错误 如果该地址没有关联的合同.

### 添加到 ProtectedSwitch

你在“App/index.tsx”中的“ProtectedSwitch”应该是这样的:

```jsx
<ProtectedSwitch authPath={pathLogin}>
  <Route exact path={pathBalance} component={Balance} />
</ProtectedSwitch>
```

请注意，我们删除了“OperationResult”，包括路由和组件，因为我们不会在这个 dApp 中进行交易.

## 添加 FormCheckBalance 组件

### 添加搜索组件

为了输入地址，我们将使用自定义的`Search` 组件，它可能看起来很笨拙，但是很好地集成了 `formik` 和 `antd`，并且实际上受到了 `formik-antd` 的启发(但它在那里缺失，因为 现在).
`App/forms/Search.tsx`

```jsx
// Search form not present in form-antd: https://github.com/jannikbuschke/formik-antd/blob/master/src/input/index.tsx
import { Input as BaseInput } from "antd";
import { InputProps as BaseInputProps, SearchProps as BaseSearchProps } from "antd/lib/input";
import { FieldProps } from "formik";
import { Field } from "formik-antd";
import * as React from "react";
import Search from "antd/lib/input/Search";

interface FormikFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (value: any) => undefined | string | Promise<any>;
  fast?: boolean;
}

type InputProps = FormikFieldProps & BaseInputProps;

interface InputType
  extends React.ForwardRefExoticComponent<
    FormikFieldProps & BaseInputProps & React.RefAttributes<BaseInput>
  > {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  Search: React.ForwardRefExoticComponent<FormikFieldProps & BaseSearchProps & React.RefAttributes<Search>>;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef((
  { name, validate, fast, onChange: $onChange, onBlur: $onBlur, ...restProps }: InputProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  ref: React.Ref<Search>,
) => (
  <Field name={name} validate={validate} fast={fast}>
    {({ field: { value, onChange, onBlur } }: FieldProps) => (
      <BaseInput
        ref={ref}
        name={name}
        value={value}
        onChange={(event) => {
          onChange(event);
          $onChange && $onChange(event);
        }}
        onBlur={(event) => {
          onBlur(event);
          $onBlur && $onBlur(event);
        }}
        {...restProps}
      />
    )}
  </Field>
));

const TypedInput = (Input as unknown) as InputType;
type SearchProps = FormikFieldProps & BaseSearchProps;

// eslint-disable-next-line react/display-name
TypedInput.Search = React.forwardRef(
  (
    { name, validate, fast, onChange: $onChange, onBlur: $onBlur, ...restProps }: SearchProps,
    ref: React.Ref<BaseInput>,
  ) => (
    <Field name={name} validate={validate} fast={fast}>
      {({ field: { value, onChange, onBlur } }: FieldProps) => (
        <BaseInput.Search
          ref={ref}
          name={name}
          value={value}
          onChange={(event) => {
            onChange(event);
            $onChange && $onChange(event);
          }}
          onBlur={(event) => {
            onBlur(event);
            $onBlur && $onBlur(event);
          }}
          {...restProps}
        />
      )}
    </Field>
  ),
);

export default TypedInput.Search;
```

### 添加合约地址验证架构

我们将用于构建 `FormCheckBalance` 的 `formik` 包与 `yup` 有很好的集成，这允许我们使用它来构建验证模式，就像我们需要的合约地址一样:

`App/forms/validationSchemas.ts`

```typescript
import * as Yup from "yup";
import { config } from "../../config";

const regexStartsWithPrefix = new RegExp(`^${config.addressPrefix}`);

const addressShape = {
  address: Yup.string()
    .matches(regexStartsWithPrefix, `"${config.addressPrefix}" prefix required`)
    .length(39 + config.addressPrefix.length, "Address invalid"),
};

export const searchValidationSchema = Yup.object().shape(addressShape);
```

### FormCheckBalance implementation

The `routes/Balance/components/FormCheckBalance.tsx` file would be this:

```jsx
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import React from "react";
import Search from "../../../forms/Search";
import { searchValidationSchema } from "../../../forms/validationSchemas";

interface FormCheckBalanceProps {
  readonly setContractAddress: (value: React.SetStateAction<string>) => void;
}

export function FormCheckBalance({ setContractAddress }: FormCheckBalanceProps): JSX.Element {
  return (
    <Formik
      initialValues={{ address: "" }}
      validationSchema={searchValidationSchema}
      onSubmit={(values) => {
        setContractAddress(values.address);
      }}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              name="address"
              placeholder="Enter contract address"
              enterButton
              onSearch={formikProps.submitForm}
            />
          </FormItem>
        </Form>
      )}
    </Formik>
  );
}
```

它使用之前定义的地址验证模式，并有一个 `setContractAddress` 参数来更新 `Balance` 路由的状态.

## 添加TokenList组件

随着 `FormCheckBalance` 工作，我们只需要实现 `TokenList`.

该组件将:

1.检查是否有合约地址:
- 如果没有，从 `useAccount` 钩子中获取本机余额.
- 如果是，加载 CW20 合约代币的余额和小数位数.
- 如果地址没有合同，显示错误.
2.显示余额:
- 使用本地 `getCoinToDisplay()` 实用程序获取用户友好的余额格式，无论是原生格式还是 CW20.
- 使用`showTokens` 标志进行条件渲染以避免在等待异步数据加载时出现显示问题.

实现这一点的 `TokenList` 实现将是:
`routes/Balance/components/TokenList/index.tsx`

```jsx
import { CW20, nativeCoinToDisplay, useAccount, useError, useSdk } from "@cosmicdapp/logic";
import { Coin, coins } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { Divider, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { config } from "../../../../../config";
import { TokenItem, TokenStack } from "./style";

const { Text } = Typography;

interface TokenListProps {
  readonly contractAddress: string;
}

export function TokenList({ contractAddress }: TokenListProps): JSX.Element {
  const { setError, clearError } = useError();
  const { getClient } = useSdk();
  const { account } = useAccount();

  const [balance, setBalance] = useState<readonly Coin[]>([]);
  const [decimals, setDecimals] = useState<number>();

  useEffect(() => {
    if (!contractAddress) {
      setBalance(account.balance);
      setDecimals(undefined);
      clearError();
      return;
    }

    const client = getClient();

    (async function updateBalance() {
      try {
        const contract = await client.getContract(contractAddress);
        const cw20Contract = CW20(client).use(contract.address);
        const [{ symbol: denom, decimals }, balance] = await Promise.all([
          cw20Contract.tokenInfo(),
          cw20Contract.balance(),
        ]);
        const amount = parseInt(balance, 10);

        setBalance(coins(amount, denom));
        setDecimals(decimals);
        clearError();
      } catch {
        setError("No contract found in that address");
        setBalance([]);
        setDecimals(undefined);
      }
    })();
  }, [account.balance, getClient, contractAddress, clearError, setError]);

  function getCoinToDisplay(coin: Coin): Coin {
    if (contractAddress && decimals) {
      const amountFromDecimal = Decimal.fromAtomics(coin.amount, decimals).toString();
      return { denom: coin.denom, amount: amountFromDecimal };
    }

    return nativeCoinToDisplay(coin, config.coinMap);
  }

  const isCw20Token = contractAddress && decimals !== undefined;
  const isNativeToken = !contractAddress && decimals === undefined;
  const showTokens = isCw20Token || isNativeToken;

  return (
    showTokens && (
      <TokenStack>
        {balance.map((token, index) => {
          const { denom, amount } = getCoinToDisplay(token);

          return (
            <React.Fragment key={token.denom}>
              {index > 0 && <Divider />}
              <TokenItem>
                <Text>{denom}</Text>
                <Text>{amount !== "0" ? amount : "No tokens"}</Text>
              </TokenItem>
            </React.Fragment>
          );
        })}
      </TokenStack>
    )
  );
}
```

`routes/Balance/components/TokenList/style.ts`

```jsx
import { Stack } from "@cosmicdapp/design";
import styled from "styled-components";

export const TokenStack = styled(Stack)`
  & > * {
    --gap: 0;
  }
`;

export const TokenItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  span {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
  }

  span + span {
    font-weight: bolder;
    font-family: var(--ff-montserrat);
    font-size: var(--s1);
  }
`;
```

## 完成的!

现在您可以检查您的本机余额和任何 CW20 合约的余额，最重要的是，您现在知道如何构建基于 CosmJS 的 dApp!
