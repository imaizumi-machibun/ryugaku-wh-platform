# 学校データ CSV テンプレート ガイド

`schools_template.csv` の各カラムの説明です。

## カラム一覧

| カラム名 | 必須 | 型 | 説明 |
|---|---|---|---|
| `name` | YES | テキスト | 学校名 |
| `country` | YES | テキスト | 国名（microCMS の国マスターデータと一致させること） |
| `city` | YES | テキスト | 都市名 |
| `description` | - | テキスト | 学校の説明文 |
| `courseTypes` | - | カンマ区切り | 提供コースの種別 |
| `costRange` | - | 選択肢 | 費用帯 |
| `weeklyFeeLow` | - | 数値 | 週あたり最低料金（USD） |
| `weeklyFeeHigh` | - | 数値 | 週あたり最高料金（USD） |
| `features` | - | カンマ区切り | 学校の特徴 |
| `website` | - | URL | 公式サイト URL |
| `address` | - | テキスト | 住所 |
| `isFeatured` | - | TRUE/FALSE | トップページ等でおすすめ表示するか |

## 選択肢の値

### courseTypes（コース種別）

| 値 | 意味 |
|---|---|
| `general` | 一般英語 |
| `business` | ビジネス |
| `exam-prep` | 試験対策（IELTS, TOEFL 等） |
| `conversation` | 会話 |
| `intensive` | 集中コース |

複数指定する場合はカンマ区切り（例: `general,exam-prep,business`）

### costRange（費用帯）

| 値 | 意味 |
|---|---|
| `budget` | リーズナブル |
| `standard` | スタンダード |
| `premium` | プレミアム |

### features（学校の特徴）

| 値 | 意味 |
|---|---|
| `small-class` | 少人数制 |
| `online-support` | オンラインサポート |
| `japanese-staff` | 日本人スタッフ在籍 |
| `certificate` | 資格取得対応 |
| `activities` | アクティビティあり |
| `accommodation` | 宿泊手配あり |

複数指定する場合はカンマ区切り（例: `small-class,activities,accommodation`）

## 注意事項

- 画像（`heroImage`, `gallery`）は CSV では扱えないため、microCMS 管理画面から個別にアップロードしてください
- `country` の値は microCMS に登録済みの国名と完全一致させる必要があります
- CSV の文字コードは UTF-8 で保存してください

---

# 学校基本情報 CSV テンプレート ガイド

`schools_basic_info_template.csv` の各カラムの説明です。既存の `schools_template.csv` とは別ファイルで、`name` をキーとして既存データと紐付けます。

## カラム一覧

| カラム名 | 必須 | 型 | 説明 |
|---|---|---|---|
| `name` | YES | テキスト | 学校名（既存データとの紐付けキー） |
| `foundedYear` | - | 数値 | 設立年（西暦） |
| `totalStudents` | - | 数値 | 全校生徒数 |
| `averageClassSize` | - | 数値 | 平均クラス人数 |
| `japaneseRatio` | - | 数値 | 日本人比率（0〜100、%） |
| `nationalityCount` | - | 数値 | 在籍する国籍数 |
| `minimumAge` | - | 数値 | 受入最低年齢 |
| `classroomCount` | - | 数値 | 教室数 |
| `email` | - | テキスト | メールアドレス |
| `phone` | - | テキスト | 電話番号（国番号付き推奨） |
| `nearestStation` | - | テキスト | 最寄り駅 |
| `latitude` | - | 数値 | 緯度（小数） |
| `longitude` | - | 数値 | 経度（小数） |
| `languages` | - | カンマ区切り | 対応言語 |
| `accreditations` | - | カンマ区切り | 認定資格 |
| `facilities` | - | カンマ区切り | 設備 |
| `accommodationTypes` | - | カンマ区切り | 宿泊タイプ |
| `airportPickup` | - | TRUE/FALSE | 空港送迎の有無 |
| `minimumWeeks` | - | 数値 | 最小受講週数 |

## 選択肢の値

### languages（対応言語）

| 値 | 意味 |
|---|---|
| `english` | 英語 |
| `french` | フランス語 |
| `spanish` | スペイン語 |
| `german` | ドイツ語 |
| `korean` | 韓国語 |
| `chinese` | 中国語 |
| `italian` | イタリア語 |
| `portuguese` | ポルトガル語 |
| `arabic` | アラビア語 |

### accreditations（認定資格）

| 値 | 意味 |
|---|---|
| `british-council` | British Council |
| `cambridge-english` | Cambridge English |
| `ialc` | IALC |
| `eaquals` | Eaquals |
| `neas` | NEAS |
| `languages-canada` | Languages Canada |
| `celta` | CELTA |
| `acels` | ACELS |
| `nzqa` | NZQA |
| `other` | その他 |

### facilities（設備）

| 値 | 意味 |
|---|---|
| `wifi` | Wi-Fi |
| `study-room` | 自習室 |
| `cafe` | カフェ |
| `library` | 図書室 |
| `computer-lab` | PC室 |
| `lounge` | ラウンジ |
| `kitchen` | キッチン |
| `garden` | 庭園 |
| `gym` | ジム |
| `prayer-room` | 祈祷室 |

### accommodationTypes（宿泊タイプ）

| 値 | 意味 |
|---|---|
| `homestay` | ホームステイ |
| `student-residence` | 学生寮 |
| `shared-apartment` | シェアアパート |
| `studio` | スタジオ |
| `hotel` | ホテル |
| `hostel` | ホステル |

複数指定する場合はカンマ区切り（例: `wifi,study-room,library`）
