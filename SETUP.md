# GitHub Pages セットアップ手順

## 前提
- GitHub アカウント所有
- Git の基本操作ができる OR GitHub Web UI でファイル操作ができる

## 手順

### 1. リポジトリ作成
1. github.com にログイン
2. 右上の「+」→「New repository」
3. Repository name: `training-recorder`
4. Public を選択（GitHub Pages で無料ホスティングするため）
5. 「Add a README file」はチェック不要（自分で用意済み）
6. 「Create repository」

### 2. ファイルアップロード

**Web UI での方法（最も簡単）**
1. 作成したリポジトリの画面で「uploading an existing file」をクリック
2. 以下4ファイルをドラッグ&ドロップ：
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. 「Commit changes」

**Git コマンドでの方法**
```bash
git clone https://github.com/<your-username>/training-recorder.git
cd training-recorder
# 4ファイルをコピー
git add .
git commit -m "Initial commit"
git push
```

### 3. GitHub Pages 有効化
1. リポジトリの「Settings」タブ
2. 左サイドバー「Pages」
3. Source: 「Deploy from a branch」
4. Branch: `main` / Folder: `/ (root)` → Save
5. ~1分待つ
6. 緑バーで「Your site is live at https://<your-username>.github.io/training-recorder/」と表示される

### 4. iPhone で確認
1. Safari で上記URLを開く
2. 「共有」→「ホーム画面に追加」で PWA 化可（アイコン化）
3. localStorage が効くので、同じブラウザで開けば前回データが残る

## 試運転

### テスト用JSON
```json
{
  "cycle": 9,
  "week": "heavy",
  "day": 1,
  "day_name": "Upper",
  "date": "2026-11-07",
  "location": "エニタイム港南台（朝）",
  "exercises": [
    {
      "id": "C",
      "priority": "MUST",
      "name": "バーベルベンチプレス",
      "target": "107.5kg × 4 × 4",
      "sets": [
        {"weight": "", "reps": ""},
        {"weight": "", "reps": ""},
        {"weight": "", "reps": ""},
        {"weight": "", "reps": ""}
      ],
      "memo": ""
    },
    {
      "id": "D",
      "priority": "CORE",
      "name": "加重懸垂（ワイド）",
      "target": "+20kg × 5 × 3",
      "sets": [
        {"weight": "", "reps": ""},
        {"weight": "", "reps": ""},
        {"weight": "", "reps": ""}
      ],
      "memo": ""
    }
  ],
  "session_memo": ""
}
```

このJSONを貼り付けて「展開」→ フォームが出て入力可能なら OK。
