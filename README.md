# Training Recorder

Simple mobile-friendly web app for logging weight training sessions.

Designed to be used with a markdown-based training menu workflow.
Paste JSON from your menu, record sets on your phone during training,
export as markdown when done.

## Features

- **JSON input**: Paste training menu data
- **Mobile-first**: Optimized for iPhone/Android
- **Set recording**: Weight × reps per set, with memos
- **Add/remove sets**: Flexible set count during training
- **Priority colors**: 🔴 MUST / 🟡 CORE / 🟢 EXTRA
- **Markdown export**: Copy or download as .md
- **Auto-save**: localStorage keeps your in-progress data
- **No backend**: Pure static HTML/CSS/JS, hostable on GitHub Pages

## Setup (GitHub Pages)

1. Create a new public GitHub repository named `training-recorder`
2. Upload the 4 files: `index.html`, `style.css`, `script.js`, `README.md`
3. Go to Settings → Pages
4. Source: Deploy from a branch
5. Branch: `main` / Folder: `/ (root)` → Save
6. Wait ~1 minute, access at `https://<your-username>.github.io/training-recorder/`

## Usage

### Preparing a session
1. Generate your training menu (contains a JSON code block)
2. On your phone, open the menu in Obsidian
3. Tap the copy button on the JSON code block
4. Open the web app URL
5. Paste the JSON, tap "展開"

### During training
- Enter weight × reps per set
- Add/remove sets as needed
- Add memos per exercise
- Data auto-saves to browser localStorage

### After training
- Tap "MD生成" to create a markdown summary
- Tap "コピー" to copy to clipboard
- Paste back into your training log system (e.g. `/log` command)

## JSON Input Format

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
      "name": "バーベルベンチプレス（ナロー・脚上げ可）",
      "target": "105-107.5kg × 4-6 × 4",
      "sets": [
        {"weight": "", "reps": ""},
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

### Field reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `cycle` | number | yes | Cycle number |
| `week` | string | yes | `"heavy"` / `"hyp"` / `"pump"` |
| `day` | number | yes | Day number (1,2,4,5,6) |
| `day_name` | string | no | e.g. `"Upper"`, `"Lower"` |
| `date` | string | no | YYYY-MM-DD |
| `location` | string | no | e.g. training facility |
| `exercises` | array | yes | List of exercises |
| `exercises[].id` | string | yes | e.g. `"C"`, `"D"` |
| `exercises[].priority` | string | yes | `"MUST"` / `"CORE"` / `"EXTRA"` |
| `exercises[].name` | string | yes | Exercise display name |
| `exercises[].target` | string | no | Target weight/rep/set text |
| `exercises[].sets` | array | yes | Initial set placeholders |
| `exercises[].memo` | string | no | Exercise-level memo |
| `session_memo` | string | no | Overall session memo |

## Markdown Output Format

```markdown
## Training Log

**Cycle**: 9
**Week**: Heavy
**Day**: 1 (Upper)
**Date**: 2026-11-07
**Location**: エニタイム港南台（朝）

### Exercises

**🔴 C: バーベルベンチプレス（ナロー・脚上げ可）**
- 107.5 × 4
- 107.5 × 4
- 107.5 × 4
- 107.5 × 3
- Memo: 脚上げ採用、右肘問題なし

**🔴 D: 加重懸垂（ナロー）**
- +20 × 5
- +20 × 5
- +20 × 4
...

### Session Memo

全体的に調子良好。次回107.5全4セット維持狙う。
```

## Development

Pure vanilla JS. No build step. No dependencies.

To test locally:
```bash
# Any static server works, e.g.:
python -m http.server 8000
# Then open http://localhost:8000
```

## License

Private use.
