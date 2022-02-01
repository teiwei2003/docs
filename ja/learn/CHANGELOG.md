# 変更積历
## [0.14.0] -2021-05-03

### 追加した

--cosmwasm-crypto: `ed25519_batch_verify`、EdDSAed25519バッチ署名を追加
  Tendermint署名と公開鍵形式の検証スキーム.
  ([#788])
--cosmwasm-crypto: `ed25519_verify`、EdDSAed25519署名検証を追加
  Tendermint署名および公開鍵形式のスキーム. ([#771])
--cosmwasm-crypto:新しい暗号関連のクレート. `secp256k1_verify`、ECDSAを追加します
  Cosmos署名と公開鍵のsecp256k1署名検証スキーム
  フォーマット. ([#780])
--cosmwasm-vm:PinnedMemoryCacheを追加します. ([#696])
--cosmwasm-vm:新しい `Cache :: analyze`はWasmの静的分析を提供します
  バイトコード.これは、コントラクトがIBCエントリを公開しているかどうかを発信者に通知するために使用されます
  ポイント. ([#736])
--cosmwasm-vm:新しいスターゲイトとibcを有効にするための新しい「スターゲイト」機能フラグを追加しました
  機能([#692]、[#716])
--cosmwasm-vm :( `stargate`が必要)公開されている場合、6つの新しいibcエントリポイントを呼び出す
  契約による([#692]、[#716])
--cosmwasm-std:新しいスターゲイトとibcを有効にするための新しい「スターゲイト」機能フラグを追加しました
  機能([#692]、[#706])
--cosmwasm-std :( `stargate`が必要)新しい` CosmosMsg :: Stargate`メッセージを追加
  protobufでエンコードされたメッセージをディスパッチするタイプ(契約はprotoスキーマを知っている必要があります)
  ([#706])
--cosmwasm-std :( `stargate`が必要)新しい` QueryRequest :: Stargate`メッセージを追加
  protobufでエンコードされたクエリをディスパッチするためのタイプ(契約はprotoスキーマを知っている必要があります
  要求と応答)([#706])
--cosmwasm-std :( `stargate`が必要)新しい` CosmosMsg :: Ibc(IbcMsg) `メッセージを追加
  ibctransferアプリを使用するか、生のicsパケットを送信するかを入力します(契約にibcエントリがある場合)
  ポイント)([#692]、[#710])
--cosmwasm-std:可変ヘルパーメソッドを `InitResponse`、` MigrateResponse`に追加します
  と `HandleResponse`は` Context`を時代遅れにします.
-コントラクト:チャネルを受信して​​割り当てる新しい `ibc-reflect`コントラクトを追加しました
  再ディスパッチする各アカウント. ICS27/チェーン間アカウントと同様のアイデア(ただし
  別の実装)([#692]、[#711]、[#714])
--cosmwasm-std:1つのコントラクトを許可する新しい `WasmMsg :: Migrate`バリアントを追加しました
  (例:multisig)管理者になり、別の契約を移行します([#768])
--cosmwasm-std:によってのみ呼び出すことができるオプションの `system`エントリポイントを追加しました
  必要に応じて管理機能を公開するためのネイティブ(ブロックチェーン)モジュール. ([#793])
--cosmwasm-std:フィールド `submessages`を` Response`に追加して、次のことができるようにします
  実行後(成功または失敗)、これらのメッセージからコールバックを取得します.
  ([#796])
--cosmwasm-std:からのすべてのコールバックを受信する `reply`エントリポイントを追加しました
  このコントラクトによってディスパッチされたサブメッセージ.これは、契約の場合にのみ必要です
  「サブメッセージ」(上記)を返します. ([#796])
--cosmwasm-std:文字列の場合は `From <Uint128>、u128の場合は` From <Uint128>を実装します `
  Uint128の場合は `From <u {32,16,8}>も同様です.
--cosmwasm-std:新しいアドレスタイプ `Addr`を作成します.これは人間が読める形式です(
  `HumanAddr`)ですが、不変であり、常に有効なアドレス([#802])が含まれています.
--cosmwasm-vm:import `addr_validate`([#802])を追加します.
--cosmwasm-std:トークンを追加する場合は、 `BankMsg :: Burn`バリアントを追加します
  消える([#860])
--cosmwasm-std:分数 `p`/` q`を表す `Fraction <T>`トレイトを作成します.
  整数 `p`と` q`. `Decimal`は` Fraction <u128> `を実装するようになりました.
  パブリックゲッター `:: numerator()`と `:: denominator()`を提供します.
--cosmwasm-std:10進数の `d`に対して` 1/d`を返す `Decimal :: inv`を追加します.
--cosmwasm-vm:監視用の内部データを公開するための `Cache :: metrics`を追加
  目的([#763]).
--cosmwasm-std:同じものを使用して `Binary`に` PartialOrd`と `Ord`を実装します
  `Vec <u8>`によって実装される辞書式順序.
--cosmwasm-std:同じものを使用して `Addr`に` PartialOrd`と `Ord`を実装します
  `String`によって実装される辞書式順序.
--cosmwasm-std:管理者を許可する新しい `WasmMsg :: UpdateAdmin`バリアントを追加しました
  別の管理者を設定するための契約(例:multisig)([#900])
--cosmwasm-std:管理者を許可する新しい `WasmMsg :: ClearAdmin`バリアントを追加しました
  将来の移行を防ぐために、管理者をクリアするための契約(例:multisig)
  ([#900])
--cosmwasm-std: `Display for Coin`を実装します([#901]).
--cosmwasm-std:文字列を使用して `Uint128`と同様に` Uint64`を作成します
  シリアル化により、JSONクライアントでuint64の全範囲を使用できるようになります.
  JavaScriptやjqなどの浮動小数点数を使用します.
--cosmwasm-std:const関数 `Uint64 :: new`および` Uint128 :: new`を作成します
  constコンテキストでインスタンスを作成します.

[#692]: https://github.com/CosmWasm/cosmwasm/issues/692
[#706]: https://github.com/CosmWasm/cosmwasm/pull/706
[#710]: https://github.com/CosmWasm/cosmwasm/pull/710
[#711]: https://github.com/CosmWasm/cosmwasm/pull/711
[#714]: https://github.com/CosmWasm/cosmwasm/pull/714
[#716]: https://github.com/CosmWasm/cosmwasm/pull/716
[#763]: https://github.com/CosmWasm/cosmwasm/issues/763
[#768]: https://github.com/CosmWasm/cosmwasm/pull/768
[#793]: https://github.com/CosmWasm/cosmwasm/pull/793
[#796]: https://github.com/CosmWasm/cosmwasm/pull/796
[#802]: https://github.com/CosmWasm/cosmwasm/pull/802
[#860]: https://github.com/CosmWasm/cosmwasm/pull/860
[#900]: https://github.com/CosmWasm/cosmwasm/pull/900
[#901]: https://github.com/CosmWasm/cosmwasm/pull/901

### かわった

-コントラクト: `HandleMsg`の名前を` ExecuteMsg`に変更します.
--all: `handle`エントリポイントの名前を` execute`に変更します.
--all: `init`エントリポイントの名前を` instantiate`に変更します.
--all: `system`エントリポイントの名前を` sudo`に変更します.
--all:1.51.0より前のRustバージョンのサポートを終了します.
--all: `query`および` execute`エントリポイントはオプションになりました.まだです
  ただし、ほとんどすべてのユースケースでそれらを実装して公開することを強くお勧めします.
--all: `db_next`インポートのキー/値領域のエンコーディングをに変更します
  任意の数のセクションをサポートする、より一般的なエンコーディング.この
  その後、エンコーディングを他の複数値領域で再利用できます.
--all: `migrate`エントリポイントから` info:MessageInfo`引数を削除します
  ([#690]).
--cosmwasm-std:常に送信するため、 `BankMsg :: Send`から` from_address`を削除します
  契約アドレスから、これは他の `CosmosMsg`と一致しています
  バリアント.
--cosmwasm-std:以前に非推奨になった `InitResult`、` HandleResult`、
  エラータイプを明示的にするための `MigrateResult`と` QueryResult`
  カスタムエラーへの移行を推奨します.
--cosmwasm-std:と同じ方法で、 `data`フィールドを` InitResponse`に追加します
  `MigrateResponse`と` HandleResponse`.
--cosmwasm-std: `MessageInfo :: sent_funds`の名前を` MessageInfo :: funds`に変更します.
--cosmwasm-std:応答タイプ `InitResponse`、` HandleResponse`、および
  `MigrateResponse`を新しい` Response`に.
--cosmwasm-std: `HumanAddr`から` Default`実装を削除します.
  `CanonicalAddr`、` ContractInfo`、 `MessageInfo`、` BlockInfo`、 `Env`.もし、あんたが
  それらの1つが必要です、あなたはおそらく何か間違ったことをしています.
--cosmwasm-std: `WasmMsg :: Instantiate`の` label`を非オプションにしてより良いものにする
  Go/データベース形式と一致します.
--cosmwasm-std:新しいフィールド `admin`を` WasmMsg :: Instantiate`に追加して完全にサポートします
  `x/wasm`からの` MsgInstantiateContract`([#861]).
--cosmwasm-std: `Binary :: to_array`は、代わりに配列の長さ全体で汎用になりました
  出力タイプの.結果として、廃止されたタイプの `ByteArray`は
  削除されました.配列の長さは0〜64に​​制限されなくなりました.
--cosmwasm-std:constジェネリックを使用して `From <＆[u8; LENGTH]> Binary`の場合
  および `From <[u8; LENGTH]> Binary`の場合、配列の長さが
  もう0-64に制限されています.
--cosmwasm-vm: `InMemoryCache`内のモジュールのシリアル化を回避します.
  パフォーマンス.また、 `InstanceOptions`から` memory_limit`を削除して定義します
  代わりに `Cache`レベルで(すべてのキャッシュされたインスタンスに対して同じメモリ制限).
  ([#697])
--cosmwasm-std:命名に準拠するために、タイプ `KV`の名前を` Pair`に変更します
  Rust1.51.0のclippyルール `upper_case_acronyms`によって適用される規則
  の上.
--cosmwasm-std: `ContractInfo :: address`と` MessageInfo :: sender`は
  `Addr`と入力します.これらのフィールドの値はホストによって作成されるため、有効です.
--cosmwasm-vm:バンプが必要なマーカーのエクスポート `cosmwasm_vm_version_4`を
  `interface_version_5`.
--cosmwasm-vm:トレイト `Api`の名前を` BackendApi`に変更して、これをより適切に表現します.
  VMのバックエンド(つまり、ブロックチェーン)によって提供されるAPI.
--cosmwasm-vm:インポートの名前を `addr_canonicalize`と` addr_humanize`に変更します
  ([#802]).
--cosmwasm-vm:タイプ `HumanAddr`/` CanonicalAddr`を次のように置き換えます
  `BackendApi`のメソッドの`＆str`/`String`/`＆[u8] `/` Vec <u8> `.住所・アドレス
  タイプはコントラクト開発に属し、バックエンドはrawで動作します
  とにかく文字列とバイナリ.
-コントラクト: `reflect`コントラクトには` stargate`機能が必要であり、
  `Stargate`および` IbcMsg :: Transfer`メッセージの再ディスパッチ([#692])
--cosmwasm-std: `Uint128`の算術演算が大幅に見直され、
  それらは、Rustプリミティブ型の動作とより一致しています.ありがとう
  [@yihuang]これを持ち出し、素晴らしい実装をしてくれて. ([#853])
1.`Uint128`は新しい関数 `checked_add`、` checked_sub`、
      `checked_mul`、` checked_div`、 `checked_div_euclid`、` checked_rem`、
      `wrapping_add`、` wrapping_sub`、 `wrapping_mul`、` wrapping_pow`、
      `saturating_add`、` saturating_sub`、 `saturating_mul`、` saturating_pow`
      これは[u128]の同等のものと一致しますが、 `Option`の代わりに
      チェックされたメソッドは、 `OverflowError`または
      いくつかのデバッグ情報を伝達し、直接実行できる `DivideByZeroError`
      `？`演算子を使用して `StdError`/` StdResult`に変換されます.
  2. `StdError :: Underflow`と` StdError :: underflow`が削除されました.
      `StdError :: Overflow`. `StdError :: DivideByZeroError`が追加されました.
  3. `-`演算子(Uint128`の場合は` impl ops :: Sub <Uint128>)が削除されました
      の場合にパニックになる代わりに `StdResult`を返したため
      オーバーフロー.この動作は、 `+`およびRust標準と矛盾していました
      図書館.上記で紹介した明示的な `* _sub`メソッドを使用してください.で
      これからのいくつかのリリースでは、オペレーターをもう一度紹介したいと思います
      パニックオーバーフロー動作([#858]).
--cosmwasm-std: `BankQuery`、` StakingQuery`の `HumanAddr`を` String`に置き換えます
  および `WasmQuery`クエリリクエスト([#802]).
--cosmwasm-std:クエリ応答タイプ `Delegation`、` FullDelegation`をステーキングする場合
  および `Validator`バリデーターアドレスフィールドが` HumanAddr`から
  `文字列`.新しい `Addr`タイプは、サポートしているだけなので、ここでは使用できません
  `Api :: addr _ *`([#871])を介した標準アカウントアドレス.
--cosmwasm-std: `BankMsg`、` IbcMsg`、 `WasmMsg`のアドレスタイプを
  `HumanAddr`から` String`([#802]).
--cosmwasm-std: `Api :: addr_humanize`が` HumanAddr`ではなく `Addr`を返すようになりました
  ([#802]).
--cosmwasm-std: `StakingMsg`、` CosmosMsg :: Staking`、
  `AllDelegationsResponse`、` BondedDenomResponse`、 `Delegation`、
  `FullDelegation`、` StakingQuery`、 `Validator`、` ValidatorsResponse`、
  これらのみを作成するための `stakeing`機能フラグの背後にある` testing :: StakingQuerier`
  PoSチェーン用に構築された契約で利用できます.
--cosmwasm-std: `StakingMsg :: Withdraw`を削除して
  `DistributionMsg :: SetWithdrawAddress`と
  `DistributionMsg :: WithdrawDelegatorReward`([#848]).
--cosmwasm-std: `StakingQuery :: Validators`、` ValidatorsResponse`の名前を変更し、
  `QuerierWrapper :: query_validators`から` StakingQuery :: AllValidators`、
  `AllValidatorsResponse`と` QuerierWrapper.query_all_validators`.追加
  `StakingQuery :: Validator`、` ValidatorResponse`、
  `QuerierWrapper :: query_validator`は、単一のバリデーターのクエリを可能にします.
  ([#879])
--cosmwasm-schema: `export_schema_with_title`の最初の引数を変更不可にします
  `export_schema`との一貫性のため.
--cosmwasm-std: `BlockInfo :: time`のブロック時間が` Timestamp`になりました.
  `BlockInfo :: time_nanos`が削除されました.

[#696]: https://github.com/CosmWasm/cosmwasm/issues/696
[#697]: https://github.com/CosmWasm/cosmwasm/issues/697
[#736]: https://github.com/CosmWasm/cosmwasm/pull/736
[#690]: https://github.com/CosmWasm/cosmwasm/issues/690
[@yihuang]: https://github.com/yihuang
[#853]: https://github.com/CosmWasm/cosmwasm/pull/853
[#858]: https://github.com/CosmWasm/cosmwasm/issues/858
[u128]: https://doc.rust-lang.org/std/primitive.u128.html
[#802]: https://github.com/CosmWasm/cosmwasm/pull/802
[#871]: https://github.com/CosmWasm/cosmwasm/issues/871
[#861]: https://github.com/CosmWasm/cosmwasm/issues/861
[#848]: https://github.com/CosmWasm/cosmwasm/issues/848
[#879]: https://github.com/CosmWasm/cosmwasm/pull/879

###非推奨

--cosmwasm-std: `InitResponse`、` MigrationResponse`、 `HandleResponse`は
  新しい `Response`を支持して非推奨になりました.
--cosmwasm-std: `Context`は非推奨になり、の新しい可変ヘルパーが採用されました.
  `応答`.
--cosmwasm-std: `HumanAddr`は` String`のエイリアスにすぎません.
  重大な安全上の利点はありません. CosmWasm 0.14では、現在
  以前に `HumanAddr`があったときの` String`.新しい `Addr`もあります.
  これは、検証済みの不変の人間が読める形式のアドレスを保持します. ([#802])

[#802]:https://github.com/CosmWasm/cosmwasm/pull/802

## [0.13.2] -2021-01-14

## かわった

--cosmwasm-vm:Wasmerを1.0.1に更新します.

## [0.13.1] -2021-01-12

### 追加した

--cosmwasm-std:新しい `#[entry_point]`マクロ属性を追加します.
  `cosmwasm_std :: create_entry_points!(contract)`の代替実装
  および `cosmwasm_std :: create_entry_points_with_migration!(contract)`.両方
  0.13シリーズでサポートされています.

## [0.13.0] – 2021-01-06

## 追加した

--cosmwasm-std:バイナリを配列サポートに64バイトに拡張します.

## かわった

--all:1.47.0より前のRustバージョンのサポートを終了します.
--cosmwasm-std: `cosmwasm_std :: tests :: MockApi :: new`を削除します.つかいます
  代わりに `MockApi :: default`.
--cosmwasm-vm:Wasmerを1.0にアップグレードし、すべての内部動作を適応させます
  によると.
--cosmwasm-vm:エクスポートメソッド `cosmwasm_vm :: Cache :: stats`と応答タイプ
  `統計`.
--cosmwasm-vm: `cosmwasm_vm :: tests :: MockApi :: new`を削除します.つかいます
  代わりに `MockApi :: default`.
--cosmwasm-vm:フィールド `Instance :: api`をメソッドに変換します.
--cosmwasm-vm: `Instance`の一貫性のためにジェネリック引数の順序を変更します.
  `Cache`と` Backend`は常に `<A:Api、S:Storage、Q:Querier>`と一致します.
--cosmwasm-vm: `Instance :: get_memory_size`を削除します. `Instance :: memory_pages`を使用します
  代わりは.

## 0.12.1(2020-12-09)

** cosmwasm-std **

-`InitResult`、 `HandleResult`、` MigrateResult`、および `QueryResult`を非推奨にします
  エラータイプを明示的にするために、カスタムエラーへの移行を促します.
-`QuerierWrapper`が動作するように `QuerierWrapper`に` Deref`を実装します
  `Querier`へのスマートポインタのように、` Querier`メソッドにアクセスできます
  直接.

## 0.12.0 (2020-11-19)

** cosmwasm-std **

-以前に非推奨になった `StdError :: Unauthorized`を削除します.契約固有
  エラーは、カスタムエラータイプを使用して実装する必要があります(を参照)
  [移行ガイド](./MIGRATING.md)0.10-> 0.11).
-`StdError`を実装するには、 `snafu`の代わりに依存関係` thiserror`を使用します.平行
  この変更により、 `backtraces`機能は毎晩Rustを必要とします.
-`StdError :: ParseErr :: source`の名前を `StdError :: ParseErr :: source_type`に変更し、
  `StdError :: SerializeErr :: target` to` StdError :: SerializeErr :: target_type` to
  thiserrorのフィールド名 `source`の特別な扱いを回避します.
-名前を統一するために、 `Extern`の名前を` Deps`に変更します.
-`Deps`および `DepsMut`構造体を使用して` handle`などを呼び出す所有権を簡素化します
  参照が含まれているだけです( `DepsMut`には`＆mut Storage`があり、それ以外の場合は
  同じ)
-未使用の `Deps :: change_querier`を削除します.これまたは同様のものが必要な場合
  機能、適切なクエリアで新しい構造体を作成します.
-`ReadonlyStorage`を削除します.どこでも「ストレージ」を使用できます.そして使用する
  読み取り専用アクセスを提供する `＆Storage`.これは許可するためだけに必要でした
  `PrefixedStorage`/` ReadonlyPrefixedStorage`は共通のインターフェースを実装します.
  これは私たちが必要としないものです.

** cosmwasm-ストレージ**

--`PrefixedStorage`/`ReadonlyPrefixedStorage`は実装しません
  `Storage`/` ReadonlyStorage`の特性はもうありません.ネストされたプレフィックスが必要な場合は、
  `PrefixedStorage :: multilevel`を介して直接それらを構築する必要があります
  `ReadonlyPrefixedStorage :: multilevel`.
-未使用の `TypedStorage`を削除します.この機能または同様の機能が必要な場合は、
  おそらく `Bucket`または` Singleton`を使用したいと思うでしょう.本当に必要な方はどうぞ
  v0.11コードをプロジェクトにコピーします.
-`transactional`および `RepLog`とともに` StorageTransaction`を削除します.これは持っています
  契約開発に積極的に使用されておらず、現在は
  契約テストフレームワーク.

** cosmwasm-vm **

-`Storage :: range`と `StorageIterator`を削除します.ストレージの実装は
  現在、イテレータを内部で維持し、アクセス可能にする責任があります
  新しい `Storage :: scan`および` Storage :: next`メソッドを介して.
-`FfiError :: IteratorDoesNotExist`を追加します.これを見ると、 `FfiError`は
  おそらく、FFIの前、上、後ろを含む名前に変更されます
  行くための境界.
--`MockStorage`は新しい `Storage`トレイトを実装し、追加の
  テストでイテレータのすべての要素を取得するための `MockStorage :: all`.
-未使用の `Extern :: change_querier`を削除します.これまたは同様のものが必要な場合
  機能、適切なクエリアで新しい構造体を作成します.
--`Instance :: from_code`と `CosmCache :: get_instance`がオプションを
  `InstanceOptions`構造体.今のところ、これには `gas_limit`と` print_debug`が含まれています
  簡単に拡張できます. `cosmwasm_vm :: tests :: mock_instance_options`
  統合テストでそのような構造体を作成するために使用されます.
-`FileSystemCache`クレートを内部にします.これは `CosmCache`を介して使用する必要があります.
-`FileSystemCache :: load`のリターンタイプを `VmResult <Option <Module >>`に修正しました
  欠落しているファイルとエラーを区別するため.
-最近使用したWasmモジュールのメモリ内キャッシュを追加します.
-`CosmCache`の名前を `cosmwasm_vm :: Cache`に変更し、` CacheOptions`をに追加します
  それを構成します.
-`Extern`の名前を `Backend`に変更します.
-`mock_dependencies`の名前を `mock_backend`に変更し、
  `mock_dependencies_with_balances`から` mock_backend_with_balances`へ.
-`FfiError`/`FfiResult`の名前を` BackendError`/`BackendResult`に変更して適応させます
  それに応じて `VmError`.

## 0.11.2(2020-10-26)

** cosmwasm-std **

-`From <std :: str :: Utf8Error> `と` From <std :: string :: FromUtf8Error> `を実装します
  `StdError`の場合.
-denom引数を `＆str`から` S:Into <String> `に一般化します.`coin`、` coins`
  および `Coin :: new`.
-`Binary`と `Vec <u8>`/`/`＆[u8] `の間に` PartialEq`を実装します.
-不足している `PartialEq`実装を` HumanAddr`と `str`/`＆str`の間に追加します.
-`Binary :: to_array`を追加します.これにより、バイナリコンテンツをにコピーできます.
  固定長の `u8`配列.これは、から整数を作成する場合に特に便利です.
  バイナリデータ.

## 0.11.1 (2020-10-12)

* cosmwasm-std **

-`Binary`に `Hash`と` Eq`を実装して、 `HashSet`で` Binary`を使用できるようにします
  および `HashMap`.
-`CanonicalAddr`の使用を許可するために `CanonicalAddr`に` Hash`と `Eq`を実装します
  `HashSet`と` HashMap`で.
-右側に参照を指定して、 `Add`、` AddAssign`、および `Sub`を実装します
  `Uint128`の場合.
-`Uint128`に `Sum <Uint128>`と `Sum <＆ 'aUint128>`を実装します.

## 0.11.0(2020-10-08)

**全て**

-1.45.2より前のバージョンのRustのサポートを終了します.
-`init`/`migrate`/` handle`/`query`からの結果のシリアル化が変更されました
  互換性のない方法で.新しい `ContractResult`および` SystemResult`タイプを参照してください
  およびそのドキュメント.
-`Env`を `query`にも渡します.これには `MessageInfo`がないため、
  `Env`から` MessageInfo`を削除し、それを別の引数としてに渡します
  `init`、` handle`、および `query`.例を参照してください
  [READMEのタイプ定義](https://github.com/CosmWasm/cosmwasm/blob/master/README.md#implementing-the-smart-contract)
  コントラクトエクスポートを更新する方法を参照してください(それぞれ1つの引数を追加するだけです).

** cosmwasm-std **

-`time_nanos`を `BlockInfo`に追加して、高精度のブロック時間にアクセスできるようにします.
-`FullDelegation :: accumulated_rewards`を `Coin`から` Vec <Coin> `に変更します.
-`InitResponse :: log`、 `MigrationResponse :: log`、および` HandleResponse :: log`の名前を変更します
  `InitResponse :: attributes`、` MigrationResponse :: attributes`、および
  `HandleResponse :: attributes`.
-`LogAttribute`の名前を `Attribute`に変更します.
-`log`の名前を `attr`に変更します.
-`Context :: add_log`の名前を `Context :: add_attribute`に変更します.
-開発中にデバッグメッセージを出力するための `Api :: debug`を追加します.
-`ExternalQuerier :: raw_query`の応答解析エラーのエラータイプを修正しました.
  これは、代わりに `Ok(Err(StdError :: ParseErr))`でした
  `Err(SystemError :: InvalidResponse)`、ターゲットで作成されたエラーを意味します
  契約する.
-`StdError :: Unauthorized`と `StdError :: unauthorized`を廃止し、
  カスタムエラー.今後、 `StdError`は標準でのみ作成する必要があります
  ライブラリであり、標準ライブラリが必要とするケースのみを含める必要があります.
--`impl Display for CanonicalAddr`で、base64ではなく大文字の16進数を使用します.
  これは `CanonicalAddr :: to_string`にも影響します.
-で一般的な引数のトレイト `CustomQuery`を作成します
  `QueryRequest <C:CustomQuery>`.これにより、
  `impl <C:CustomQuery> From <C> for QueryRequest <C>`任意のカスタムクエリ.
-Vec <u8> `の` From <Binary>を実装します.
-`From <CanonicalAddr> for Vec <u8> `を実装します.
-`Binary :: into_vec`と `CanonicalAddr :: into_vec`を追加します.
-`canonical_length`引数が `mock_dependencies`から削除されました.
  `mock_dependencies_with_balances`.現在非推奨となっている `MockApi :: new`では、
  引数は未使用です.契約はこの値を設定する必要はなく、通常は
  値についての仮定をするべきではありません.
-`MockApi :: canonical_address`の正規アドレスエンコーディングと
  `MockApi :: human_address`は予測不可能な表現に変更されました
  入力構造のほとんどを破壊することを目的とした非標準の長さ.

** cosmwasm-ストレージ**

-引数の順序を変更して、 `storage`の後に常に最初に続くようにします
  `Bucket :: new`、` Bucket :: multilevel`、 `ReadonlyBucket :: new`の名前空間、
  `ReadonlyBucket :: multilevel`、` bucket`および `bucket_read`.
-引数の順序を変更して、 `storage`の後に常に最初に続くようにします
  `PrefixedStorage :: new`の名前空間、` PrefixedStorage :: multilevel`、
  `ReadonlyPrefixedStorage :: new`、` ReadonlyPrefixedStorage :: multilevel`、
  `prefixed`と` prefixed_read`.

** cosmwasm-vm **

--`CosmCache :: new`、 `Instance :: from_code`、および` Instance :: from_module`が取得するようになりました
  コントラクトからのデバッグログの印刷を有効/無効にするための追加の引数.
-バンプには、 `cosmwasm_vm_version_3`を` cosmwasm_vm_version_4`にエクスポートする必要があります.
-`canonical_length`引数が `mock_dependencies`から削除されました.
  `mock_dependencies_with_balances`と` MockApi :: new_failing`.今では
  非推奨の `MockApi :: new`、引数は使用されていません.契約は必要ありません
  この値を設定し、通常は値について仮定するべきではありません.
-`MockApi :: canonical_address`の正規アドレスエンコーディングと
  `MockApi :: human_address`は予測不可能な表現に変更されました
  入力構造のほとんどを破壊することを目的とした非標準の長さ.

## 0.10.1 (2020-08-25)

** cosmwasm-std **

-`ExternalStorage.range() `がどちらか低い場合にVMエラーを引き起こすバグを修正
  または上限が設定されました
  ([#508](https://github.com/CosmWasm/cosmwasm/issues/508))

## 0.10.0(2020-07-30)

**全て**

-1.44.1より前のバージョンのRustのサポートを終了します.

** cosmwasm-std **

-エラーヘルパー `generic_err`、` invalid_base64`、 `invalid_utf8`、
  `not_found`、` parse_err`、 `serialize_err`、` underflow`、 `unauthorized` in
  `StdError :: generic_err`とその仲間たちのおかげです.
-`From <＆[u8;を実装しますBinary`および `From <[u8; $ N]>すべてのBinary`の場合
  `$ N <= 32`.
-Init/Handle/Migrate応答の構築に使用できる `Context`オブジェクトを追加します
  `add_log`、` add_message`、 `set_data`を介して、適切なタイプに変換します
  `into`または` try_into`を介して.応答の構築を簡素化するオプション.
--Envは `message.sender`と` contract_address`に `HumanAddr`を使用します
-`mock_env`から `Api`引数を削除します
-`CanonicalAddr`に `From <＆[u8]>`と `From <Vec <u8 >>`を実装します

** cosmwasm-vm **

-未使用のキャッシュサイズ引数を `CosmCache`から削除します.
-指定されたガス制限が最大値を超えると、 `set_gas_limit`がパニックになります.サポートされています
  価値.
-最大値を増やします. 10_000_000_000からまでのガス制限のサポート値
  0x7FFFFFFFFFFFFFFF.
-コントラクトがリージョンを送信するときに早期に失敗するチェックを `get_region`に追加します
  もっともらしいリージョンに支えられていないVMへのポインター.これは役立ちます
  標準ライブラリの開発.
-専用の `RegionValidationError`と` RegionValidationResult`を作成します.
-`Api :: human_address`と `Api :: canonical_address`はペアのreturnを返すようになりました
  データとガスの使用量.
-使用されるより高度な `FfiResult <T>`を優先して、 `NextItem`を削除します
  返品結果とガス情報をすべてにわたって一貫して保存する
  API. `FfiResult <T>`は `(Result <T、FfiError>、GasInfo)`に変更されました.
-バックエンドの場合のエラータイプ `FfiError :: InvalidUtf8`を作成します
  文字列が必要な場所に無効なUTF-8を送信します.
-`FfiError :: Other`を削除して、 `FfiError :: UserErr`と
  `FfiError :: Unknown`.
-`canonicalize_address`と `humanize_address`のインポートでユーザーがレポートされるようになりました
  契約の誤り.
-`cosmwasm_vm_version_2`を `cosmwasm_vm_version_3`にバンプします.
-`Querier :: raw_query`と `QuerierResult`が削除され、新しい
  `Querier :: query_raw`.これには、クエリのガス制限パラメータが含まれます.

## 0.9.4(2020-07-16)

** cosmwasm-vm **

-`Instance :: create_gas_report`を追加して、ガスレポートを返します.
  元の制限、残りのガス、および内部/外部で使用されるガス.

## 0.9.3(2020-07-08)

** cosmwasm-ストレージ**

-`.remove() `メソッドを` Bucket`と `Singleton`に追加します.

## 0.9.2(2020-06-29)

-wasmerを0.17.0にダウングレードします.

## 0.9.1(2020-06-25)

** cosmwasm-std **

-大文字と小文字を区別しない列挙型はできないため、型 `Never`を` Empty`に置き換えます
  有効なJSONスキーマで表現されます.

## 0.9.0(2020-06-25)

注:このバージョンにはAPIバグが含まれているため、使用しないでください(を参照).
https://github.com/CosmWasm/cosmwasm/issues/451).

**全て**

-wasmerを0.17.1にアップグレードします.
-1.43.1より前のバージョンのRustのサポートを終了します

** cosmwasm-std **

--`ReadonlyStorage :: get`とそのすべての実装が返されるようになりました
  `Option <Vec <u8 >>`.
--`ReadonlyStorage :: range`とそのすべての実装が常に成功し
  結果の代わりにイテレータを返します.これはイテレータになりました
  `Option <StdResult <KV >>`の代わりに `Option <KV>`.
--`Storage :: {set、remove} `とそのすべての実装にはもう戻り値がありません
  価値.以前は、 `StdResult <()>`を返していました.
-トレイト `Querier`は` Clone`と `Send`ではなくなりました.
--`consume_region`はnullポインタでパニックになり、代わりに `Vec <u8>`を返します
  `StdResult <Vec <u8 >>`.
-契約移行メカニズムを追加しました.契約はオプションでエクスポートできるようになりました
  次の定義を持つ `migrate`関数:
  `` `錆
  extern "C" fn merge(env_ptr:u32、msg_ptr:u32)-> u32;
  `` `
-InitResponseにはデータフィールドがなくなりました.私たちは常に契約住所を返します
  ブロックチェーンのデータフィールドにあり、オーバーライドすることはできません. `ハンドル`
  まだフィールドを利用することができます.
-`MockQuerier :: with_staking`の名前を `MockQuerier :: update_staking`に変更して一致させます
  `:: update_balance`.
-廃止された `StdError :: NullPointer`と` null_pointer`が削除されました.
-エラー作成関数は、タイプ自体に含まれるようになりました.
  `invalid_base64`の代わりに` StdError :: invalid_base64`.無料の機能は
  非推奨であり、1.0より前に削除されます.

** cosmwasm-ストレージ**

-`transactional_deps`を削除します.を提供するだけの `transactional`を使用します
  代わりにトランザクションストレージ.
-`get_with_prefix`は、代わりに `Option <Vec <u8 >>`を返します
  `StdResult <Option <Vec <u8 >>>`.
--`set_with_prefix`と `remove_with_prefix`は代わりに何も返しません
  `StdResult <()>`.
--`RepLog :: commit`は値を返さなくなりました(常に成功します).
--`Op :: apply`は値を返さなくなりました(常に成功します).

** cosmwasm-vm **

-エクスポート `allocate`は、有効なアドレスとして0を返さないようにする必要があります.契約は
  リニアメモリでこのオフセットを回避する責任があります.
-インポート `db_read`は、戻り値の一部としてメモリを割り当てるようになりました.
  呼び出して、値へのポインタを `u32`として返します.戻り値0は、
  _キーが存在しません_.
-インポート `db_next`は、リターンキーと
  呼び出しの一部として値を返し、領域へのポインタを `u32`として返します. The
  リージョン内のデータは `value ||の形式で保存されますキー|| keylen`.として
  以前は、空のキーは_これ以上の値がない_ことを意味します.
-`Instance :: get_gas`を削除して、 `Instance :: get_gas_left`を優先します.
-VMレイヤーからチェーンレイヤーへのすべての呼び出しも、ガスの量を返します
  成功に使用されます. (これは、戻り値を次のように置き換えることで表されます.
  `(value、used_gas)`).次に、システム全体のガス使用量がVMで追跡されます
  レイヤー.インポート中に契約を停止できるようになります.
  割り当てられたすべてのガスを使用したことを証明できます.
-インスタンスのキャッシュを削除します.これは、安定していないため、0.8.1以降無効になっています.
  `CosmCache :: store_instance`を削除します; `Instance :: recylce`を呼び出すことはできません
  外部依存関係を取り戻すために直接.
-`MockQuerier :: with_staking`の名前を `MockQuerier :: update_staking`に変更して一致させます
  `:: update_balance`.
-慌てる代わりに、 `read_region`/` write_region`/`get_region`/` set_region`
  ポインタを逆参照するときに、新しい `CommunicationError :: DerefErr`を返すようになりました
  契約によって提供されたものは失敗します.
-エラーは不変である必要があるため、 `FfiError :: set_message`は削除されました.つかいます
  `FfiError :: other`は、目的のエラーメッセージでエラーを作成します.
-`db_scan`のインポート実装は、を返す代わりにエラーになるようになりました
  無効な注文値のエラーコード.戻りタイプが `u32`に変更されました.
-新しいタイプの `StorageIterator`を優先して、` StorageIteratorItem`を削除します.
  `NextItem`. `StorageIterator`は、カスタムイテレータタイプではありません.
  Rustの `Iterator`トレイトを実装し、使用済みガスを伝達できるようにします
  VMへの最後の `next`呼び出しの値.
-`VmError`を `canonicalize_address`のコントラクトに報告しないでください.
  `humanize_address`.無効な入力のみを報告する必要があります.
-エラーケース `VmError :: RegionLengthTooBig`と` VmError :: RegionTooSmall`を移動します
  `CommunicationError`に.
-`canonicalize_address`の実装で、無効なUTF-8入力が発生するようになりました
  `CommunicationError :: InvalidUtf8`で、これはに報告されません
  契約する.標準ライブラリは、これが正しく行われないようにする必要があります
  文字列入力値のエンコード.
-トレイト `ReadonlyStorage`を` Storage`にマージします.
-インポートされた `canonicalize_address`と` humanize_address`がメモリを返すようになりました
  エラー `Region`へのアドレス.このアドレスが0の場合、呼び出しは成功しました.
-`cosmwasm_vm_version_1`を `cosmwasm_vm_version_2`にバンプします.

## 0.8.1(2020-06-08)

** cosmwasm-std **

-`log`の引数が `＆str`から` ToString`に変更され、渡すことができるようになりました
  `String`、` HumanAddr`、 `Uint128`またはプリミティブ整数などのさまざまなタイプ
  直接.
-`Binary`の `From <Vec <u8 >>`および `Into <Vec <u8 >>`実装を追加します.
  ゼロコピー変換.

** cosmwasm-vm **

-`Instance :: get_gas`を廃止し、 `Instance :: get_gas_left`を採用しました.老人
  メソッドはしばらく利用できますが、非推奨の警告を発行します
  使用する場合.
-すべてのキャッシュサイズを0として扱うことにより、インスタンスキャッシュを無効にします.インスタンスキャッシュ
  同じWasmメモリが複数の実行で再利用されるため、安全ではありません.
-`インスタンス `のストレージを読み取り専用モードに設定できるようになりました.
  書き込みストレージによってチェックされると、 `db_write`と` db_remove`がインポートされます.読み取り専用
  下位互換性のために、モードはデフォルトでオフになっています. `call_query_raw`が設定されるようになりました
  インスタンスのストレージを読み取り専用にします.
-契約時に新しいエラーケース `VmError :: WriteAccessDenied`が返されます
  クエリ中にストレージに書き込む可能性のあるインポートを呼び出します.

## 0.8.0(2020-05-25)

**全て**

-スキーマを0.7にアップグレードします.
-wasmerを0.17にアップグレードします.
-snafuを0.6に更新します.
-サポートされる最小のRustバージョンは1.41です.
-`Region.len`を `Region.capacity`と` Region.length`に分割します.
  容量は使用可能なバイト数であり、 `length`はバイト数です
  使用済み.これはcontract-vmインターフェースの重大な変更であり、
  両側の `Region`構造体と同じメモリレイアウト.
-`remove`メソッドを `Storage`トレイトに追加します.
-(機能フラグ付き) `range`メソッドを` ReadonlyStorage`トレイトに追加します.これは
  順序付けられたデータベース内のアイテムのすべてまたはサブセットをカバーするイテレータ
  キーによる昇順または降順.
-両方のパッケージに新機能フラグ `iterator`を追加して、` range`を有効にします
  機能.これは、を使用するチェーンへの潜在的な移植を可能にするために使用されます
  Merkle Tries(範囲を反復することはできません).
-シリアル化されたすべてのJSONタイプは、名前にsnake_caseマッピングを使用するようになりました.これの意味は
  `ChangeOwner`のような列挙型フィールドは、基になる` change_owner`にマップされます
  `changeowner`ではなくJSON.これは、クライアントにとって重大な変更です.
-コントラクトとランタイム間のパブリックインターフェイスは、 `String`を使用しなくなりました
  エラーを表しますが、 `ApiError`をリッチJSONエラーとしてシリアル化します.
-エラー報告を可能にするために、 `env.write_db`および` env.remove_db`から値を返します.
-クエリ応答には、有効なJSONが含まれている必要があります.
-すべての `* _db`wasmインポートの名前を` db_ * `に変更しました
-`cw-storage`リポジトリをサブパッケージとしてマージします.現在は `cosmwasm-storage`です.
-`cosmwasm-storage`にイテレータサポートを追加します
--`Coin.amount`は `String`ではなく` Uint128`になりました. Uint128は次のようにシリアル化します
  JSONの文字列ですが、メモリ内のu128データに解析されます.それはまたいくつかを持っています
  演算子のオーバーロードにより、 `Coin`タイプでの簡単な数学演算、および
  有効な金額を強制します.
-`Env`には `contract.balance`要素がなくなりました.この情報が必要な場合は、
  この情報を取得するには、 `Querier`を使用してください. Cosmos-SDK 0.39の時点で、これには必要があります
  バランスを取るために追加のストレージクエリを実行するため、これらのクエリは次の場合にのみ実行します.
  必要です.
--`Env.message.sent_funds`は `Vec <Coin>`であり `Option <Vec <Coin >>`ではありません.私達はします
  コントラクトに送信する前に、 `go-cosmwasm`のgo応答を正規化します.
--`Env.message.signer`は `Env.message.sender`に名前が変更されました.
--`Env.block.{height、time} `は` i64`ではなく `u64`になりました.

** cosmwasm-スキーマ**

-この新しいクレートには、JSONスキーマを生成するための実装が含まれています
  インターフェイスタイプのファイル.関数 `export_schema`を公開します.
  `export_schema_with_title`、および` schema_for`.

** cosmwasm-std **

-`cosmwasm :: memory`クレートのすべてのシンボルを内部に作成します.これらのシンボルは、
  ライブラリのユーザーは必要ありません.
-`cosmwasm :: mock :: dependencies`の名前を変更します-> `cosmwasm :: mock :: mock_dependencies`
  テストと本番の `外部`を区別するため.
-`cosmwasm :: mock`からすべてのシンボルを新しい非wasm32モジュールとしてエクスポートします
  `cosmwasm :: testing`.残りのすべてのシンボルをトップレベルでエクスポートします(例:
  `use cosmwasm :: traits :: {Api、Storage};` + `use cosmwasm :: encoding :: Binary;`
  `use cosmwasm :: {Api、Binary、Storage};`になります).
-パッケージの名前を `cosmwasm`から` cosmwasm-std`に変更します.
-エクスポート `allocate`は、割り当てられたメモリをゼロで埋めなくなりました.
-契約の必要なインポートに `remove_db`を追加します.
-(機能フラグ付き)wasmコントラクトから `scan_db`および` next_db`コールバックを追加します
  VM.
--`serde :: {from_slice、to_vec} `は` cosmwasm_std :: Result`を返します.
  これらの関数を呼び出すときは、 `.context(...)`を使用します
-`Response`を `InitResponse`と` HandleResponse`に分割します.スプリット
  `ContractResult`を` InitResult`と `HandleResult`に変換します.
-明示的な `QueryResponse`を作成します.これは、` InitResponse`と類似しています.
  `HandleResponse`.
-エクスポート `cosmwasm_vm_version_1`、` alllocate`、および `deallocate`が
  プライベートであり、Wasmエクスポートを介してのみ呼び出すことができます.必ず `使用`してください
  Cエクスポートをプルする契約で少なくとも1回は `cosmwasm_std`.
-コントラクトからのクエリコールバックに `Querier`トレイトと` QueryRequest`を追加します.
  メッセージを拒否するランタイムの `SystemError`タイプとともに.
-`QueryRequest`は、不透明に渡される一般的な `Custom(T)`型を取ります
  エンドコンシューマー( `wasmd`または統合テストスタブ)、カスタムクエリを可能にする
  ネイティブコード.
-` {Init、Handle、Query} Result`は、具体的な `ApiResult`の単なるエイリアスになりました
  タイプ.
-`ExternalStorage.get`で最大128KiBの結果をサポートします.
-`Storage`トレイトの `.get`、` .set`、および `.remove`は、` Result`をに返すようになりました.
  エラーの伝播を許可します.
-`transactional`、 `transactional_deps`、` RepLog`、 `StorageTransaction`を移動します
  クレート `cosmwasm-storage`に.
-自動 `use`dを区別するために、` Result`の名前を `StdResult`に変更します
  `core :: result :: Result`.エラー引数を `Error`に修正しました.
-`Error`の `StdError`への完全なオーバーホール:
  -`StdError`列挙型をシリアル化および逆シリアル化できるようになりました(
    backtrace)、これにより、Wasm/VMの境界を越えてそれらを渡すことができます.この
    たとえば、完全に構造化されたエラーを使用できます.統合テスト.
  -自動生成されたsnafuエラーコンストラクターは `NotFound`/` ParseErr`/…のような構造体です.
    のようなエラー生成ヘルパーを支持して統合​​されています
    `not_found`/` parse_err`/…
  -すべてのエラージェネレータ関数は、結果ではなくエラーを返すようになりました.
  -エラーケースには、 `source`フィールドが含まれなくなりました.代わりに、ソースエラーは
    `String`のような標準型に変換されます.このため、両方
    `snafu :: ResultExt`と` snafu :: OptionExt`は使用できなくなりました.
  -バックトレースはオプションになりました.それらを有効にするには、 `RUST_BACKTRACE = 1`を使用します.
  --`Utf8Err`/`Utf8StringErr`が` StdError :: InvalidUtf8`にマージされました
  --`Base64Err`は `StdError :: InvalidBase64`に名前が変更されました
  --`ContractErr`/`DynContractErr`が` StdError :: GeneralErr`にマージされました
  -未使用の `ValidationErr`が削除されました
  --`StdError`が
    [non_exhaustive](https://doc.rust-lang.org/1.35.0/unstable-book/language-features/non-exhaustive.html)、
    新しいエラーケースを壊さない変更にする.
-ストレージエントリが存在する場合、 `ExternalStorage.get`は空のベクトルを返すようになりました
  しかし、空の値があります.以前は、これは「なし」に正規化されていました.
-`CosmosMsg`列挙型を再編成します.これらはモジュールごとに分割されています.
  `CosmosMsg :: Bank(BankMsg)`、 `CosmosMsg :: Custom(T)`、 `CosmosMsg :: Wasm(WasmMsg)`
--CosmosMsgは、 `Custom`バリアントのコンテンツに対して汎用的になりました.これにより、
  Cosmos-SDKアプリでカスタムネイティブコールをサポートするブロックチェーンと
  開発者は、フォークせずにCosmWasmアプリでそれらを利用できます
  `cosmwasm-vm`および` go-cosmwasm`ランタイム.
-`CosmosMsg`の下に新しい `StakingMsg`タイプを公開するために、` stakeing`機能フラグを追加します
  `QueryRequest`の下の新しい` StakingRequest`タイプ.
-`MockQuerier.with_staking`を介してステーキングクエリをモックアウトするためのサポートを追加します
--`from_slice`/`from_binary`では結果タイプを` DeserializeOwned`にする必要があります.
  つまり、結果に `＆str`などの参照を含めることはできません.

** cosmwasm-vm **

-`Instance.memory`/`.allocate`/` .deallocate`/`.func`クレートを内部にします. A
  VMのユーザーは、インスタンスのメモリに直接アクセスしてはなりません.
-`env.canonicalize_address`、 `env.humanize_address`、および
  `env.read_db`は、書き込まれたバイト数を返しません.この値は
  結果のリージョンで利用できるようになりました.負の戻り値はエラー、0
  は成功であり、0より大きい値は将来の使用のために予約されています.
-必要なインターフェースバージョンガードのエクスポートを `cosmwasm_api_0_6`からに変更します
  `cosmwasm_vm_version_1`.
-`remove_db`および(機能フラグ付き) `scan_db`および
  `next_db`
-カスタムの `serde :: {from_slice、to_vec}`実装を
  `cosmwasm_std`なので、cosmwasm-vm固有の` Result`を返すことができます(使用のみ
  初めの).
--`call_ {init、handle、query} `と` cosmwasm_vm :: testing`ラッパーは
  現在、標準の `Result`タイプ. `Result <HandleResponse、ApiError>`.
-インスタンスからメモリを読み取るときに長さ制限を追加して、保護します
  悪意のある契約により、過度に大きな「リージョン」が作成されます.
-`Instance.get_memory_size`を追加して、
  実例.
-`cosmwasm_vm :: errors :: CacheExt`を削除します.
-`cosmwasm_vm :: errors :: {Error、Result} `をに移動します
  `cosmwasm_vm :: {VmError、VmResult}`そして結果から一般的なエラータイプを削除します.
-インポート `db_read`は、ストレージキーが返さない場合にエラーコードを返すようになりました
  存在.最新の標準ライブラリは、このエラーコードを「なし」に変換し直します
  価値.これにより、存在しないストレージエントリと空のストレージエントリを区別できます.
-`Instance :: from_module`、 `:: from_wasmer`、および` :: recycle`をcrate-internalにします.
-明示的なパブリック `Checksum`タイプを作成して、Wasmblobを識別します.
--`CosmCache :: new`は、サポートされている機能を引数として使用するようになりました.
-`VmError :: RegionTooSmallErr`の名前を `VmError :: RegionTooSmall`に変更します.
-`VmError :: RegionLengthTooBigErr`の名前を `VmError :: RegionLengthTooBig`に変更します.
-`VmError :: UninitializedContextData`のプロパティタイプを所有文字列に変更します.
  `VmError :: ConversionErr`、` VmError :: ParseErr`、および `VmError :: SerializeErr`.
-`VmError :: IoErr`を削除して、 `VmError :: CacheErr`を優先します.
-`VmError :: ComputeErr`、 `VmError :: ResolveErr`を簡略化します.
  `VmError :: WasmerRuntimeErr`は、代わりに詳細を含む文字列を保持します
  ソースエラー.
-新しい `VmError :: InstantiationErr`を優先して` VmError :: WasmerErr`を削除します.
-`VmError`のsnafuエラービルダーはプライベートになりました.つまり、呼び出し元はプライベートになります.
  エラーを作成するのではなく、使用してください.
--`VmError`は `#[non_exhaustive]`になりました.
-`VmError :: RuntimeErr`を `VmError :: BackendErr`に分割し、
  `VmError :: GenericErr`; `VmError :: WasmerRuntimeErr`の名前を
  `VmError :: RuntimeErr`.
-`Instance.with_querier`アナログを `Instance.with_storage`に追加します.

## 0.7.2(2020-03-23)

** cosmwasm **

-`Binary`のJSONスキーマタイプをint配列(間違った)から文字列(右)に修正しました.
-`Extern`を `Clone`可能ではなくなりました.クローンを作成する前に、データをコピーしました
  モックストレージおよび外部ストレージ用のステートレスブリッジのコピー用、
  これは異なるセマンティクスです.
-パブリック `cosmwasm :: imports :: dependencies`を削除します.このライブラリのユーザーは
  これを明示的に呼び出す必要はありません.依存関係は内部で作成され、
  `exports :: do_init`、` exports :: do_handle`、および
  `exports :: do_query`.
-`ExternalStorage`を `Clone`可能ではなくなりました.これはデータをコピーしません、
  そのため、クローンは予期しない結果につながる可能性があります.

## 0.7.1(2020-03-11)

** cosmwasm_vm **

-破損したwasmファイルをチェックするときに不要なパニックを回避します.
-同じwasmを保存して複数回キャッシュすることをサポートします.

## 0.7.0(2020-02-26)

** cosmwasm **

-Wasmメモリ間の区別を簡素化するために、 `Slice`の名前を` Region`に変更します
  リージョンとserdeの `from_slice`
-名前を明確にするために、 `Params`の名前を` Env`に、 `mock_params`の名前を` mock_env`に変更します(これは
  実行環境に関する情報です)
-`Response.log`は、後でインデックスを作成できるキーと値のペアのベクトルではありません
  テンダーミント.

** cosmwasm_vm **

-エクスポート `cosmwasm_vm :: read_memory`を削除します.これを使用すると、
  これはホストからゲストへの通信方法であるため、アーキテクチャ上の欠陥
  VM内であり、VMのユーザーには必要ありません.
-新しいタイプ `cosmwasm_vm:errors :: Error :: RegionTooSmallErr`を作成します.
-`cosmwasm_vm :: write_memory`のリターンタイプを `Result <usize、Error>`に変更します
  エラーの処理を忘れにくくします.
-`do_canonical_address`、 `do_human_address`で欠落していたエラー伝播を修正
  および `allocate`.
-インポート `c_read`のエラーリターンコードを更新します.
-名前を変更すると、インポートされた `c_read`/` c_write`が `read_db`/` write_db`に変更されます.
-名前を変更すると、インポートされた `c_canonical_address`/` c_human_address`が
  `canonicalize_address`/` humanize_address`.
-基本的なメモリの割り当て/割り当て解除に `cosmwasm_vm :: tests :: test_io`を追加します
  ホストとゲスト間のテスト.
-`ValidationErr.msg`を関連するランタイムを含む動的な `String`にします
  情報.
-エクスポート `check_api_compatibility`を削除します. VMがそれを呼び出します.
-`check_api_compatibility`に完全修飾識別子でインポートをチェックさせます
  `<モジュール>.<名前>`.
-`cosmwasm_vm :: instance :: Instance`でガス制限を不変にします.合格
  建設時に一度であり、もはや公に操作することはできません.
-`cosmwasm_vm :: Instance`から `take_storage`/` leave_storage`を削除します.

## 0.6

[正規のアドレスコールバックを定義する](https://github.com/confio/cosmwasm/issues/73)

-パラメータのアドレスには `＆[u8]`を使用します
-コントラクトがjson内の人間が読める形式のアドレス( `＆str`)を解決できるようにする
   固定サイズのバイナリ表現に
-単体テストと統合テスト用のモックを提供します

-`Storage`を `ReadOnlyStorage`から個別の特性として分離する

## 0.5

### 0.5.2

これは、最初に文書化され、サポートされている実装です. 基本的なものが含まれています
機能セット. モジュールでサポートされている `init`と` handle`は、メッセージを返すことができます.
`query`のスタブ実装が実行されますが、間もなく非推奨になる可能性があります.
いくつかの要点:

-ビルドシステムとユニット/統合テストのセットアップはすべて安定しています.
-Cosmwasm-vmは、シングルパスとクレーンリフトのバックエンドをサポートし、モジュールをキャッシュします
   ディスクとメモリ内のインスタンス(lruキャッシュ).
-JSONスキーマ出力は機能します

今後のすべての変更ログエントリは、このベースを参照します
