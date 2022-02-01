# 栄誉殿堂

_ **ここでは、CosmWasmの殿堂を紹介します.これらの素晴らしいプロジェクトの作成に尽力してくれた貢献者に感謝します! ** _
彼らにふさわしい人気と評判を与えましょう:

## BlockScapeによるNFTマーケットプレイス

記事:[https://devpost.com/software/nft-marketplace](https://devpost.com/software/nft-marketplace)

ガリレオアワード(Cosmos SDKとTendermintを使用した最もクリエイティブなdAppchain、IBCの使用を選択できます)で1位、Gringottsアワードで3位を獲得しました.
![](../../.vuepress/public/assets/nft_marketplace.jpeg)
NFT市場は、CW20トークンを使用してCW721トークンを売買するための共通のプラットフォームを提供します.人々は自分のトークンを販売し、他の売り手からトークンを購入することができます.
2つのアカウント間でNFTを取引する実装例をいくつか見てきましたが、それらはすべて各契約に基づいています.つまり、トランザクションごとに個別の契約があり、実際に販売されているトークンと使用されているトークンを知ることが困難になります.これにより、トークン販売の可視性を最大化するために、トークンを販売するための中央の場所を提供することを考えました.
このプロジェクトは、チェーンにデプロイされた3つのコントラクトを使用して、CosmWasmコントラクトの相互作用をうまく示しています.チームがカスタムcw721コントラクトをどのように実装したかをここで確認できます.チームは、typescriptアシスタントクライアントを開発することにより、NFT契約に貢献しました.さらに、このプロジェクトではKeplrウォレットも統合されています.

デモ:[https://hackatom.blockscape.network/home](https://hackatom.blockscape.network/home)

再購入:[https://github.com/BlockscapeNetwork/hackatom_v](https://github.com/BlockscapeNetwork/hackatom_v)

## リベートアカウント

記事:[https://devpost.com/software/clawback-account-in-cosmwasm](https://devpost.com/software/clawback-account-in-cosmwasm)

**ガイア賞**(コスモスハブのベストリストプロジェクト)の最優秀賞を受賞
ビットコインボールトに触発されました.
このプロジェクトのコード品質は一流です.非常に広範な契約単体テストがこれを証明しています.
これは、ネイティブトークンとCW20トークンの「リベート」のプロトタイプコントラクトコードです.コールバックの動作原理は次のとおりです.
「所有者」キー/アカウント、「バックアップ」キー/アカウント、および「コールバック期間」(コールバックの有効期限を決定する)があります.
「リベート期間」内で、「保有者」は「保有者」/他のリベートに移すことができます(条件が発信契約と一致する場合:それらは同じ「リベート」を持ち、「リベート期間」は少なくとも同じLong、それらは同じトークンをサポートします)またはコールバック期間を更新します.リベート期間が終了すると、「所有者」はトークンを引き出すことができます.
「リベート期間」中に、「バックアップ」を別の所有者に転送したり、リベート期間を更新したり、トークンを破棄したり、契約を破棄したりできます.

プレゼンテーション:[https://docs.google.com/presentation/d/13aEcVFhjQFKo9bGjHe0V9HiHnqbM7eGSHbDB27Psa24/edit?usp=sharing](https://docs.google.com/presentation/d/13aEcVFhjQFKo97bHjp2HjpHypFhjQ

再購入:[https://github.com/tomtau/hackatom](https://docs.google.com/presentation/d/13aEcVFhjQFKo9bGjHe0V9HiHnqbM7eGSHbDB27Psa24/edit?usp=sharing)

## ランダムビーコン

記事:[https://medium.com/confio/when-your-blockchain-needs-to-roll-the-dice-ed9da121f590](https://medium.com/confio/when-your-blockchain-needs-サイコロを振るed9da121f590)

SimonWartaの分散乱数ジェネレーター.

drandでは、ランダムビーコンは、HTTP、Gossipsub、Tor、またはTwitterを介して配信されます.ブロックチェーンは、そのようなネットワークリソースに直接アクセスすることはできません.ただし、ランダムビーコンをチェーンに保存できるCosmWasmスマートコントラクトを作成できます.クロスコントラクトクエリを使用すると、他のコントラクトはこれらのランダムな値を読み取り、ロジックで使用できます.

買い戻し:[https://github.com/confio/rand](https://github.com/confio/rand)

## 友子

記事:[https://devpost.com/software/sophon](https://devpost.com/software/sophon)

**ガイア賞で3位を獲得しました. ****
イーサリアムの[yearn.finance](https://yearn.finance/)がDeFiの運用を最適化できるように、チームはCosmWasmのスマートコントラクトがステーキングの運用を最適化できると信じています.
資金が契約に預け入れられると、再委任金利が最も高い各バリデーターに資金が委任されます.

買い戻し:[https://github.com/Ninja-Chain/sophon](https://github.com/Ninja-Chain/sophon)
