# やるべきことリスト

## 1. microCMS セットアップ

### 1-1. アカウント作成
- [ ] https://microcms.io/ でアカウント作成（Hobbyプランで OK）
- [ ] サービスを作成（例: `ryugaku-wh`）
- [ ] サービスドメインをメモ

### 1-2. API作成（5つ）

作成順序が重要（参照関係があるため、上から順に作成）

#### API 1: `countries`（リスト形式）
- [ ] API作成（エンドポイント: `countries`）
- [ ] フィールド設定:

| フィールド名 | フィールドID | 種類 | 必須 |
|---|---|---|---|
| 国名(日本語) | `nameJp` | テキストフィールド | ✅ |
| 国名(英語) | `nameEn` | テキストフィールド | ✅ |
| 国旗絵文字 | `flagEmoji` | テキストフィールド | |
| 地域 | `region` | セレクトフィールド | ✅ |
| ヒーロー画像 | `heroImage` | 画像 | |
| 説明 | `description` | リッチエディタ | |
| 首都 | `capital` | テキストフィールド | |
| 公用語 | `officialLanguage` | テキストフィールド | |
| 通貨名 | `currency` | テキストフィールド | |
| 通貨コード | `currencyCode` | テキストフィールド | |
| 日本との時差 | `timeDifferenceJapan` | テキストフィールド | |
| フライト時間(h) | `flightTimeHours` | 数値 | |
| ベストシーズン | `bestSeason` | テキストフィールド | |
| プログラム状態 | `programStatus` | セレクトフィールド | ✅ |
| ビザ年齢下限 | `visaAgeMin` | 数値 | |
| ビザ年齢上限 | `visaAgeMax` | 数値 | |
| ビザ期間(月) | `visaDurationMonths` | 数値 | |
| ビザ費用(円) | `visaCostJpy` | 数値 | |
| 就労制限 | `visaWorkLimit` | テキストフィールド | |
| 就学制限 | `visaStudyLimit` | テキストフィールド | |
| ビザ更新可 | `visaRenewable` | 真偽値 | |
| ビザ定員 | `visaQuota` | テキストフィールド | |
| 月間生活費(円) | `livingCostMonthJpy` | 数値 | |
| 月間家賃(円) | `avgRentMonthlyJpy` | 数値 | |
| 最低賃金 | `minimumWageLocal` | テキストフィールド | |
| 費用水準 | `costLevel` | セレクトフィールド | |
| 申請ステップ | `applicationSteps` | 繰り返し | |
| 必要書類 | `requiredDocuments` | 繰り返し | |
| 申請URL | `applicationUrl` | テキストフィールド | |
| 大使館URL | `embassyUrl` | テキストフィールド | |
| 人気都市 | `popularCities` | 繰り返し | |
| 出典URL | `sourceUrls` | 繰り返し | |

- `region` の選択肢: `オセアニア` / `ヨーロッパ` / `北米` / `アジア` / `南米` / `中東`
- `programStatus` の選択肢: `open` / `suspended` / `limited` / `closed`
- `costLevel` の選択肢: `low` / `medium` / `high` / `very-high`

繰り返しフィールド用のカスタムフィールド:
- `applicationStep`: `stepTitle`(テキスト), `stepDescription`(テキストエリア)
- `requiredDocument`: `docName`(テキスト), `docNote`(テキストエリア)
- `popularCity`: `cityName`(テキスト), `cityDescription`(テキストエリア)
- `sourceUrl`: `label`(テキスト), `url`(テキスト)

#### API 2: `schools`（リスト形式）
- [ ] API作成（エンドポイント: `schools`）
- [ ] フィールド設定:

| フィールド名 | フィールドID | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| 学校名 | `name` | テキストフィールド | ✅ | |
| 国 | `country` | コンテンツ参照 | ✅ | → `countries` |
| 都市 | `city` | テキストフィールド | ✅ | |
| 説明 | `description` | リッチエディタ | | |
| ヒーロー画像 | `heroImage` | 画像 | | |
| ギャラリー | `gallery` | 複数画像 | | |
| コースタイプ | `courseTypes` | 複数選択 | | general/business/exam-prep/conversation/intensive |
| 費用帯 | `costRange` | セレクトフィールド | | budget/standard/premium |
| 週額下限(円) | `weeklyFeeLow` | 数値 | | |
| 週額上限(円) | `weeklyFeeHigh` | 数値 | | |
| 特徴 | `features` | 複数選択 | | small-class/online-support/japanese-staff/certificate/activities/accommodation |
| ウェブサイト | `website` | テキストフィールド | | |
| 住所 | `address` | テキストフィールド | | |
| おすすめ | `isFeatured` | 真偽値 | | |

#### API 3: `experiences`（リスト形式）
- [ ] API作成（エンドポイント: `experiences`）
- [ ] フィールド設定:

| フィールド名 | フィールドID | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| タイトル | `title` | テキストフィールド | ✅ | |
| 国 | `country` | コンテンツ参照 | ✅ | → `countries` |
| 学校 | `school` | コンテンツ参照 | | → `schools` |
| 主要都市 | `cityPrimary` | テキストフィールド | ✅ | |
| 期間(月) | `durationMonths` | 数値 | | |
| 本文 | `content` | リッチエディタ | ✅ | |
| 月間生活費(円) | `monthlyLivingJpy` | 数値 | | |
| 月間家賃(円) | `monthlyRentJpy` | 数値 | | |
| 月間食費(円) | `monthlyFoodJpy` | 数値 | | |
| 月間収入(円) | `monthlyIncomeJpy` | 数値 | | |
| 総合評価 | `ratingOverall` | 数値 | ✅ | 1〜5 |
| 安全性 | `ratingSafety` | 数値 | | 1〜5 |
| 仕事 | `ratingJob` | 数値 | | 1〜5 |
| 費用 | `ratingCost` | 数値 | | 1〜5 |
| 生活 | `ratingLifestyle` | 数値 | | 1〜5 |
| 語学 | `ratingLanguage` | 数値 | | 1〜5 |
| 良かった点 | `pros` | 繰り返し | | カスタムフィールド `proConItem`: `text`(テキスト) |
| 大変だった点 | `cons` | 繰り返し | | 同上 |
| アドバイス | `advice` | テキストエリア | | |
| おすすめ? | `wouldRecommend` | 真偽値 | | |
| 出発時年齢 | `ageAtDeparture` | 数値 | | |
| 性別 | `gender` | セレクトフィールド | | male/female/other/prefer-not-to-say |
| 語学力(前) | `languageBefore` | セレクトフィールド | | beginner/elementary/intermediate/upper-intermediate/advanced |
| 語学力(後) | `languageAfter` | セレクトフィールド | | 同上 |

#### API 4: `reviews`（リスト形式）
- [ ] API作成（エンドポイント: `reviews`）
- [ ] フィールド設定:

| フィールド名 | フィールドID | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| 学校 | `school` | コンテンツ参照 | ✅ | → `schools` |
| 国 | `country` | コンテンツ参照 | | → `countries` |
| ニックネーム | `nickname` | テキストフィールド | ✅ | |
| 通学年 | `attendedYear` | 数値 | ✅ | |
| 総合評価 | `ratingOverall` | 数値 | ✅ | 1〜5 |
| 授業 | `ratingTeaching` | 数値 | | 1〜5 |
| 設備 | `ratingFacilities` | 数値 | | 1〜5 |
| 立地 | `ratingLocation` | 数値 | | 1〜5 |
| コスパ | `ratingCostPerf` | 数値 | | 1〜5 |
| タイトル | `title` | テキストフィールド | ✅ | |
| 本文 | `body` | テキストエリア | ✅ | |
| 良かった点 | `pros` | テキストエリア | | |
| 大変だった点 | `cons` | テキストエリア | | |

#### API 5: `articles`（リスト形式）
- [ ] API作成（エンドポイント: `articles`）
- [ ] フィールド設定:

| フィールド名 | フィールドID | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| タイトル | `title` | テキストフィールド | ✅ | |
| 概要 | `description` | テキストエリア | | |
| ヒーロー画像 | `heroImage` | 画像 | | |
| 本文 | `body` | リッチエディタ | ✅ | |
| カテゴリ | `category` | セレクトフィールド | | visa/cost/preparation/job/language/insurance/housing/culture/other |
| 関連国 | `relatedCountries` | コンテンツ参照(複数) | | → `countries` |
| 関連学校 | `relatedSchools` | コンテンツ参照(複数) | | → `schools` |
| おすすめ | `isFeatured` | 真偽値 | | |

### 1-3. APIキー取得
- [ ] サービス設定 → APIキー → デフォルトキー（GET用）をコピー
- [ ] 書き込み用キーを追加作成（POST/PUT/PATCH権限を付与）

---

## 2. 環境変数の設定

- [ ] `.env.local` を編集して実際の値を入力:

```
MICROCMS_SERVICE_DOMAIN=実際のサービスドメイン
MICROCMS_API_KEY=GET用APIキー
MICROCMS_WRITE_API_KEY=書き込み用APIキー
REVALIDATE_SECRET=任意のランダム文字列
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. テストデータ投入

以下の順で最低1件ずつ投入（参照関係があるため順番厳守）:

- [ ] **countries** に1件追加（例: オーストラリア、コンテンツID: `australia`）
- [ ] **schools** に1件追加（countryで↑を参照）
- [ ] **experiences** に1件追加（countryで↑を参照）
- [ ] **reviews** に1件追加（schoolで↑を参照）
- [ ] **articles** に1件追加

> **ポイント**: コンテンツIDはURLのスラッグになるので、countriesは `australia`、`canada` のように英語で手動設定するのがおすすめ

---

## 4. 動作確認

### 4-1. 開発サーバー
- [ ] `npm run dev` でエラーなく起動
- [ ] http://localhost:3000 でホームページが表示される
- [ ] 各ページが正常に表示される:
  - [ ] `/countries` — 国一覧
  - [ ] `/countries/australia` — 国詳細
  - [ ] `/schools` — 学校一覧（フィルター・ソート動作）
  - [ ] `/experiences` — 体験談一覧
  - [ ] `/articles` — 記事一覧
  - [ ] `/compare` — 国比較

### 4-2. 機能確認
- [ ] 検索バー（ヒーロー内）でキーワード検索 → 結果表示
- [ ] 学校フィルター（国・語学・費用帯）が動作
- [ ] ソート（新しい順・名前順）が動作
- [ ] ShareButtons（X/LINE/URLコピー）が動作
- [ ] スター評価入力（フォームページ）が動作

### 4-3. モバイル確認（Chrome DevTools 375px幅）
- [ ] スティッキーCTAバー（画面下部固定）が表示
- [ ] ハンバーガーメニュー → スライドアウトメニュー
- [ ] 学校フィルターが「絞り込み」ボタン → ボトムシートで開く

### 4-4. フォーム投稿テスト
- [ ] `/submit/experience` — 体験談投稿フォーム送信
- [ ] `/submit/review` — 口コミ投稿フォーム送信
- [ ] 送信後に microCMS にデータが入っているか確認

---

## 5. ビルド確認

- [ ] `npm run build` が成功する
- [ ] ビルドエラーがない

---

## 6. 本番デプロイ

### 6-1. Vercel デプロイ（推奨）
- [ ] https://vercel.com/ でアカウント作成
- [ ] GitHubリポジトリを連携（先にGitHubにpushが必要）
- [ ] 環境変数を Vercel の Settings → Environment Variables に設定
- [ ] デプロイ実行
- [ ] 本番URLを取得

### 6-2. 独自ドメイン（任意）
- [ ] ドメインを取得
- [ ] Vercel の Settings → Domains でドメインを追加
- [ ] DNS設定

### 6-3. microCMS Webhook 設定
- [ ] microCMS管理画面 → サービス設定 → Webhook
- [ ] コンテンツ更新時に `https://あなたのドメイン/api/revalidate?secret=REVALIDATE_SECRETの値` を呼ぶよう設定
- [ ] これにより、microCMS でコンテンツ更新時にサイトが自動で再生成される

---

## 7. コンテンツ充実（運用フェーズ）

- [ ] 主要国のデータを投入（オーストラリア、カナダ、イギリス、ニュージーランド、アイルランド等）
- [ ] 学校データを投入（各国2〜3校以上）
- [ ] お役立ち記事を作成（ビザ情報、費用ガイド、準備チェックリスト等）
- [ ] OGP用画像の準備（各国ヒーロー画像、学校画像）

---

## 8. 追加改善（任意）

- [ ] Google Analytics / Google Search Console 設定
- [ ] OGP画像の動的生成（`/api/og` エンドポイント）
- [ ] パフォーマンス最適化（Lighthouse スコア確認）
- [ ] E2Eテスト追加（Playwright等）
- [ ] SEO改善（構造化データの追加、内部リンク最適化）
