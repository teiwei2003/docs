# dAppを開発する

前に説明したユーティリティを紹介するために、テンプレートからバランスチェッカーdAppを作成します.

## テンプレートをカスタマイズする

アプリを独自のものにするには、 `package.json`の` name`フィールドを変更するか、 `README.md`ファイルを更新してください.

また、 `routes/Login/index.tsx`ファイルを次のように変更します.

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

## バランスルートを追加

### バランスパス

`paths.ts`ファイルに以下を追加します.

```typescript
export const pathBalance = "/balance";
```

### Reactコンポーネント

`routes/`内に、次のファイルを含む `Balance`ディレクトリを追加します.

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
        <YourAccount hideTitle hideBalance/>
        <FormCheckBalance setContractAddress={setContractAddress}/>
        {error && <ErrorText>{error}</ErrorText>}
        <TokenList contractAddress={contractAddress}/>
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

ご覧のとおり、この2つのファイルは、 `@ cosmicdapp/logic`の` useError`フックと、 `@ cosmicdapp/design`の` Stack`、 `PageLayout`、および` YourAccount`コンポーネントを使用しているためです. あなたに精通している必要があります.

`index.tsx`コンポーネントのレイアウトは、` style.ts`で定義されたスタイル付きコンポーネントである `MainStack`と` ErrorText`、およびまだ定義されていない `FormCheckBalance`と` TokenList`コンポーネントを利用します.

ロジックは次のように機能します.コントラクトアドレスが `FormCheckBalance`に入力されていない限り、` TokenList`コンポーネントはユーザーのネイティブトークンを表示します.これにより、 `TokenList`はそのCW20コントラクトの残高を表示するか、エラーを表示します. そのアドレスに関連する契約がない場合.

### ProtectedSwitchに追加

`App/index.tsx`の` ProtectedSwitch`は次のようになります.

```jsx
<ProtectedSwitch authPath={pathLogin}>
  <Route exact path={pathBalance} component={Balance}/>
</ProtectedSwitch>
```

このdAppではトランザクションを行わないため、ルートとコンポーネントの両方の `OperationResult`を削除することに注意してください.

## FormCheckBalanceコンポーネントを追加します

### 検索コンポーネントを追加

アドレスを入力するために、カスタムの `Search`コンポーネントを使用します.これはハッキーに見えるかもしれませんが、` formik`と `antd`をうまく統合し、実際には` formik-antd`に触発されています(ただし、 今の).

`App/forms/Search.tsx`

```jsx
//Search form not present in form-antd: https://github.com/jannikbuschke/formik-antd/blob/master/src/input/index.tsx
import { Input as BaseInput } from "antd";
import { InputProps as BaseInputProps, SearchProps as BaseSearchProps } from "antd/lib/input";
import { FieldProps } from "formik";
import { Field } from "formik-antd";
import * as React from "react";
import Search from "antd/lib/input/Search";

interface FormikFieldProps {
  name: string;
 //eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (value: any) => undefined | string | Promise<any>;
  fast?: boolean;
}

type InputProps = FormikFieldProps & BaseInputProps;

interface InputType
  extends React.ForwardRefExoticComponent<
    FormikFieldProps & BaseInputProps & React.RefAttributes<BaseInput>
  > {
 //eslint-disable-next-line @typescript-eslint/ban-ts-comment
 //@ts-expect-error
  Search: React.ForwardRefExoticComponent<FormikFieldProps & BaseSearchProps & React.RefAttributes<Search>>;
}

//eslint-disable-next-line react/display-name
const Input = React.forwardRef((
  { name, validate, fast, onChange: $onChange, onBlur: $onBlur, ...restProps }: InputProps,
 //eslint-disable-next-line @typescript-eslint/ban-ts-comment
 //@ts-expect-error
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

//eslint-disable-next-line react/display-name
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

### 契約アドレス検証スキーマを追加する

`FormCheckBalance`の構築に使用する` formik`パッケージは、 `yup`との優れた統合により、契約アドレスに必要なもののような検証スキーマを構築するために使用できます.

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

以前に定義されたアドレス検証スキーマを使用し、 `setContractAddress`パラメータを使用して` Balance`ルートの状態を更新します.

## TokenListコンポーネントを追加します

`FormCheckBalance`が機能しているので、` TokenList`を実装する必要があります.

このコンポーネントは次のようになります.

1.契約アドレスがあるかどうかを確認します.
-そうでない場合は、 `useAccount`フックからネイティブ残高を取得します.
-はいの場合、CW20コントラクトトークンの残高と小数点以下の桁数をロードします.
-住所に契約がない場合は、エラーを表示します.
2.残高を表示します.
-ローカルの `getCoinToDisplay()`ユーティリティを使用して、ネイティブまたはCW20のバランスのためのユーザーフレンドリーなフォーマットを取得します.
-非同期データのロードを待機する際の表示の問題を回避するために、条件付きレンダリングに `showTokens`フラグを使用します.

これを実現するための `TokenList`の実装は次のようになります.

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
              {index > 0 && <Divider/>}
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

## 終了した!

これで、ネイティブ残高とCW20契約の残高を確認できます.最も重要なことは、CosmJSベースのdAppを構築する方法を理解したことです.
