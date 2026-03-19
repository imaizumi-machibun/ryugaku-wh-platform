# School データフィールド リファレンス

学校（School）APIの全フィールド定義・入力要件・表示先をまとめたドキュメントです。
microCMS 管理画面でフィールドを追加する際の参考にしてください。

> 型定義: `src/lib/microcms/types.ts`
> ラベル定数: `src/lib/utils/constants.ts`

---

## 1. 既存フィールド（コア情報）

### name
- **説明**: 学校の正式名称
- **型**: テキストフィールド（`string`）
- **必須**: YES
- **入力例**: `Kaplan International Melbourne`
- **要件**: microCMS のコンテンツID（slug）の元にもなるため、正確な英語表記を推奨
- **表示先**: 一覧カード、詳細ページ見出し、JSON-LD、パンくずリスト

### country
- **説明**: 所属する国。国マスターデータへのリレーション
- **型**: コンテンツ参照（`Country`）
- **必須**: YES
- **要件**: microCMS の countries API に登録済みの国を選択
- **表示先**: 一覧カード、詳細ページ、フィルター、JSON-LD

### city
- **説明**: 学校が所在する都市名
- **型**: テキストフィールド（`string`）
- **必須**: YES
- **入力例**: `メルボルン`, `バンクーバー`
- **要件**: 日本語表記。都市名のみ（州名・県名は不要）
- **表示先**: 一覧カード、詳細ページ見出し、JSON-LD

### description
- **説明**: 学校の詳細な説明文
- **型**: リッチエディタ（`string` / HTML）
- **必須**: いいえ
- **要件**: HTML形式。2〜5文程度で学校の特色・立地・強みを記述。`dangerouslySetInnerHTML` で描画されるため、microCMS のリッチエディタから入力
- **表示先**: 詳細ページ本文

### heroImage
- **説明**: メインビジュアル画像
- **型**: 画像（`MicroCMSImage`）
- **必須**: いいえ
- **要件**: 推奨サイズ 1200x630px 以上。横長のアスペクト比。JPEG/WebP推奨
- **表示先**: 詳細ページヒーロー、OGP画像

### gallery
- **説明**: 校内・授業風景などのギャラリー画像
- **型**: 画像の繰り返し（`MicroCMSImage[]`）
- **必須**: いいえ
- **要件**: 最大10枚程度。各画像は800px以上推奨
- **表示先**: 詳細ページギャラリーセクション

### courseTypes
- **説明**: 提供しているコースの種別
- **型**: 複数選択リスト（`CourseType[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `general` | 一般英語 | 日常会話・文法・リーディング等の総合コース |
| `business` | ビジネス | ビジネス英語・プレゼン・ミーティング英語 |
| `exam-prep` | 試験対策 | IELTS / TOEFL / Cambridge 等の試験対策 |
| `conversation` | 会話 | スピーキング特化コース |
| `intensive` | 集中コース | 週25時間以上の集中プログラム |

- **表示先**: 詳細ページバッジ

### costRange
- **説明**: 費用帯の目安
- **型**: セレクトフィールド（`CostRange`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `budget` | リーズナブル | 週300USD未満が目安 |
| `standard` | スタンダード | 週300〜500USD が目安 |
| `premium` | プレミアム | 週500USD以上が目安 |

- **表示先**: 一覧カード、詳細ページバッジ、フィルター

### weeklyFeeLow
- **説明**: 週あたりの最低料金
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **単位**: USD（米ドル）
- **入力例**: `350`
- **要件**: 0以上の整数。最も安いコースの週額を入力
- **表示先**: 詳細ページ費用セクション

### weeklyFeeHigh
- **説明**: 週あたりの最高料金
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **単位**: USD（米ドル）
- **入力例**: `600`
- **要件**: 0以上の整数。`weeklyFeeLow` 以上の値
- **表示先**: 詳細ページ費用セクション

### features
- **説明**: 学校の特徴タグ
- **型**: 複数選択リスト（`SchoolFeature[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `small-class` | 少人数制 | 1クラス10人以下を目安 |
| `online-support` | オンラインサポート | オンライン学習プラットフォームあり |
| `japanese-staff` | 日本人スタッフ | 日本語対応可能なスタッフが在籍 |
| `certificate` | 資格取得 | 修了証・資格取得に対応 |
| `activities` | アクティビティ | 課外活動・社会活動プログラムあり |
| `accommodation` | 宿泊手配 | 宿泊先の手配サービスあり |

- **表示先**: 一覧カード、詳細ページバッジ

### website
- **説明**: 学校の公式ウェブサイトURL
- **型**: テキストフィールド（`string`）
- **必須**: いいえ
- **入力例**: `https://www.kaplan.com/melbourne`
- **要件**: `https://` から始まる完全なURL
- **表示先**: 詳細ページサイドバー、JSON-LD

### address
- **説明**: 学校の所在地住所
- **型**: テキストフィールド（`string`）
- **必須**: いいえ
- **入力例**: `123 Collins Street, Melbourne VIC 3000`
- **要件**: 現地語（英語等）表記。通り名・番地・郵便番号を含む
- **表示先**: 詳細ページサイドバー、JSON-LD（`streetAddress`）

### isFeatured
- **説明**: おすすめ学校としてハイライト表示するか
- **型**: 真偽値（`boolean`）
- **必須**: いいえ
- **デフォルト**: `false`
- **要件**: トップページや一覧で優先表示したい学校のみ `true`
- **表示先**: 一覧ページの並び順・ハイライト

---

## 2. 基本情報フィールド（新規追加）

### foundedYear
- **説明**: 学校の設立年
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `1938`
- **要件**: 西暦4桁。1800〜現在の範囲
- **表示先**: 詳細ページ「学校基本情報」グリッド、JSON-LD（`foundingDate`）

### totalStudents
- **説明**: 全校の在籍生徒数（年間平均）
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `800`
- **要件**: 1以上の整数。年間の平均在籍数を目安に入力
- **表示先**: 詳細ページ「学校基本情報」グリッド

### averageClassSize
- **説明**: 1クラスあたりの平均生徒数
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `12`
- **要件**: 1以上の整数。学校公式情報を参照
- **表示先**: 詳細ページ「学校基本情報」グリッド

### japaneseRatio
- **説明**: 在籍生徒に占める日本人の割合
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **単位**: パーセント（%）
- **入力例**: `15`（= 15%）
- **要件**: 0〜100 の整数。学校公式または体験者の情報を参照。0 は「日本人なし」を意味する有効な値
- **表示先**: 詳細ページ「学校基本情報」グリッド

### nationalityCount
- **説明**: 在籍生徒の出身国籍数
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `45`
- **要件**: 1以上の整数。多国籍環境の指標として利用
- **表示先**: 詳細ページ「学校基本情報」グリッド

### minimumAge
- **説明**: 入学を受け入れる最低年齢
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `16`
- **要件**: 一般的に 16〜18。学校の入学要件を確認
- **表示先**: 詳細ページ「学校基本情報」グリッド

### classroomCount
- **説明**: 学校が保有する教室の数
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `30`
- **要件**: 1以上の整数。学校の規模感の指標
- **表示先**: 詳細ページ「学校基本情報」グリッド

---

## 3. 連絡先フィールド（新規追加）

### email
- **説明**: 学校の問い合わせ用メールアドレス
- **型**: テキストフィールド（`string`）
- **必須**: いいえ
- **入力例**: `info@kaplan-melbourne.example.com`
- **要件**: 有効なメールアドレス形式。一般公開されているアドレスのみ
- **表示先**: 詳細ページサイドバー、JSON-LD（`email`）

### phone
- **説明**: 学校の電話番号
- **型**: テキストフィールド（`string`）
- **必須**: いいえ
- **入力例**: `+61-3-1234-5678`
- **要件**: 国番号付き推奨（`+国番号-市外局番-番号`）。ハイフン区切りで視認性を確保
- **表示先**: 詳細ページサイドバー、JSON-LD（`telephone`）

### nearestStation
- **説明**: 最寄りの公共交通機関の駅名
- **型**: テキストフィールド（`string`）
- **必須**: いいえ
- **入力例**: `Flinders Street Station`
- **要件**: 駅名のみ。路線名は含めなくてよい。現地語表記
- **表示先**: 詳細ページサイドバー

### latitude
- **説明**: 学校所在地の緯度
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `-37.8136`
- **要件**: 小数点以下4桁以上の精度。南半球はマイナス値。`longitude` とペアで入力すること
- **表示先**: 詳細ページサイドバー（Google Maps リンク）、JSON-LD（`geo`）

### longitude
- **説明**: 学校所在地の経度
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `144.9631`
- **要件**: 小数点以下4桁以上の精度。西経はマイナス値。`latitude` とペアで入力すること
- **表示先**: 詳細ページサイドバー（Google Maps リンク）、JSON-LD（`geo`）

---

## 4. 学習環境フィールド（新規追加）

### languages
- **説明**: 学校で学べる言語
- **型**: 複数選択リスト（`SchoolLanguage[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `english` | 英語 | 最も一般的。ESL/EFL コース |
| `french` | フランス語 | カナダ・フランス等のフランス語コース |
| `spanish` | スペイン語 | スペイン・中南米等のスペイン語コース |
| `german` | ドイツ語 | ドイツ・オーストリア等のドイツ語コース |
| `korean` | 韓国語 | 韓国の語学学校向け |
| `chinese` | 中国語 | 中国・台湾の語学学校向け |
| `italian` | イタリア語 | イタリアのイタリア語コース |
| `portuguese` | ポルトガル語 | ブラジル・ポルトガル等のポルトガル語コース |
| `arabic` | アラビア語 | 中東地域のアラビア語コース |

- **要件**: 1つ以上選択推奨。学校一覧のフィルターにも使用される
- **表示先**: 詳細ページ「学習環境・設備」セクション、一覧ページフィルター

### accreditations
- **説明**: 学校が取得している認定・認証資格
- **型**: 複数選択リスト（`Accreditation[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `british-council` | British Council | 英国文化振興会の認定（イギリス） |
| `cambridge-english` | Cambridge English | ケンブリッジ大学英語検定機構の認定 |
| `ialc` | IALC | International Association of Language Centres |
| `eaquals` | Eaquals | Evaluation & Accreditation of Quality in Language Services |
| `neas` | NEAS | National ELT Accreditation Scheme（オーストラリア） |
| `languages-canada` | Languages Canada | カナダ語学学校認定団体 |
| `celta` | CELTA | Certificate in Teaching English（教師資格だが学校認定の指標にも） |
| `acels` | ACELS | Accreditation and Co-ordination of English Language Services（アイルランド） |
| `nzqa` | NZQA | New Zealand Qualifications Authority（ニュージーランド） |
| `other` | その他 | 上記以外の地域・専門認定 |

- **要件**: 学校の公式サイトで確認できる認定のみ入力
- **表示先**: 詳細ページ「学習環境・設備」セクション

### facilities
- **説明**: 学校が提供する設備・施設
- **型**: 複数選択リスト（`Facility[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `wifi` | Wi-Fi | 校内無料Wi-Fi |
| `study-room` | 自習室 | 自主学習用のスペース |
| `cafe` | カフェ | カフェテリア・軽食販売 |
| `library` | 図書室 | 教材・書籍の貸出 |
| `computer-lab` | PC室 | 生徒が利用できるPC |
| `lounge` | ラウンジ | 休憩・交流スペース |
| `kitchen` | キッチン | 生徒が利用できるキッチン |
| `garden` | 庭園 | 屋外スペース・中庭 |
| `gym` | ジム | フィットネス施設 |
| `prayer-room` | 祈祷室 | 宗教的なお祈りスペース |

- **表示先**: 詳細ページ「学習環境・設備」セクション

### accommodationTypes
- **説明**: 学校が手配可能な宿泊タイプ
- **型**: 複数選択リスト（`AccommodationType[]`）
- **必須**: いいえ
- **選択肢**:

| 値 | ラベル | 説明 |
|---|---|---|
| `homestay` | ホームステイ | 現地家庭での滞在。食事付きが一般的 |
| `student-residence` | 学生寮 | 学校運営または提携の学生寮 |
| `shared-apartment` | シェアアパート | 他の生徒と共同生活するアパート |
| `studio` | スタジオ | 個室タイプのワンルーム |
| `hotel` | ホテル | ホテル・サービスアパートメント |
| `hostel` | ホステル | バックパッカー向けのドミトリー等 |

- **要件**: 学校が直接手配または提携先を紹介できるもののみ
- **表示先**: 詳細ページ「学習環境・設備」セクション

### airportPickup
- **説明**: 空港送迎サービスの有無
- **型**: 真偽値（`boolean`）
- **必須**: いいえ
- **要件**: 有料・無料問わず、学校が送迎サービスを提供している場合は `true`
- **表示先**: 詳細ページ「学習環境・設備」セクション

### minimumWeeks
- **説明**: 最小受講期間（週数）
- **型**: 数値フィールド（`number`）
- **必須**: いいえ
- **入力例**: `1`, `2`, `4`
- **要件**: 1以上の整数。最も短いコースの受講可能週数
- **表示先**: 詳細ページ「学習環境・設備」セクション

---

## 5. microCMS フィールド設定ガイド

microCMS 管理画面で新規フィールドを追加する際の推奨設定です。

| フィールドID | 表示名 | 種類 | 備考 |
|---|---|---|---|
| `foundedYear` | 設立年 | 数値 | |
| `totalStudents` | 全校生徒数 | 数値 | |
| `averageClassSize` | 平均クラスサイズ | 数値 | |
| `japaneseRatio` | 日本人比率 | 数値 | 説明文に「0〜100（%）」と記載 |
| `nationalityCount` | 国籍数 | 数値 | |
| `minimumAge` | 受入最低年齢 | 数値 | |
| `classroomCount` | 教室数 | 数値 | |
| `email` | メールアドレス | テキスト | |
| `phone` | 電話番号 | テキスト | |
| `nearestStation` | 最寄り駅 | テキスト | |
| `latitude` | 緯度 | 数値 | |
| `longitude` | 経度 | 数値 | |
| `languages` | 対応言語 | 複数選択 | 選択肢は上記の `SchoolLanguage` を参照 |
| `accreditations` | 認定資格 | 複数選択 | 選択肢は上記の `Accreditation` を参照 |
| `facilities` | 設備 | 複数選択 | 選択肢は上記の `Facility` を参照 |
| `accommodationTypes` | 宿泊タイプ | 複数選択 | 選択肢は上記の `AccommodationType` を参照 |
| `airportPickup` | 空港送迎 | 真偽値 | |
| `minimumWeeks` | 最小受講週数 | 数値 | |

---

## 6. 表示箇所サマリー

各フィールドがサイト上のどこに表示されるかの一覧です。

| 表示箇所 | 使用フィールド |
|---|---|
| **一覧カード** | name, country, city, costRange, courseTypes, features, heroImage, isFeatured |
| **詳細ページ ヒーロー** | heroImage |
| **詳細ページ ヘッダー** | name, country, city, costRange, courseTypes, features |
| **詳細ページ 本文** | description |
| **詳細ページ 基本情報グリッド** | foundedYear, totalStudents, averageClassSize, japaneseRatio, nationalityCount, minimumAge, classroomCount |
| **詳細ページ 費用** | weeklyFeeLow, weeklyFeeHigh |
| **詳細ページ 学習環境・設備** | languages, accreditations, facilities, accommodationTypes, airportPickup, minimumWeeks |
| **詳細ページ ギャラリー** | gallery |
| **サイドバー 学校情報** | address, nearestStation, phone, email, website |
| **サイドバー 地図リンク** | latitude, longitude |
| **一覧フィルター** | country, languages, costRange |
| **JSON-LD** | name, city, country, website, address, email, phone, foundedYear, latitude, longitude |
