# DevKit AI — Project Brief

> Dummy project untuk integrasi & testing AI Cost Intelligence tracker.
> Tujuan: generate real, varied AI usage logs dengan cost profile yang berbeda per fitur.

---

## Tujuan Project Ini

Project ini **bukan produk utama**. Ini adalah **test app** yang:

- Punya beberapa fitur AI dengan cost profile berbeda
- Terintegrasi dengan SDK AI Cost Tracker
- Menghasilkan log data yang rich dan bervariasi untuk demo dashboard
- Bisa disimulasikan penggunaan berat (spam request) untuk trigger cost spike alert

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (App Router) + TailwindCSS + shadcn/ui |
| AI Provider | Anthropic SDK + OpenAI SDK |
| AI Cost Tracker | `ai-cost-tracker` SDK (internal) |
| Package Manager | pnpm |

---

## 5 Fitur AI

### 1. Cover Letter Generator
**Endpoint:** `/cover-letter`

**Flow:**
- User input: nama, job title yang dilamar, 2-3 poin pengalaman
- AI generate cover letter profesional (~400 kata)

**AI Config:**
```ts
model: "gpt-4o"
max_tokens: 800
feature: "cover-letter-generator"
```

**Cost profile:** Mahal — prompt panjang + output panjang. Ini fitur paling boros di app.

---

### 2. SQL Explainer
**Endpoint:** `/sql-explainer`

**Flow:**
- User paste SQL query
- AI jelaskan dalam bahasa Indonesia yang mudah dipahami
- Bonus: kasih 1-2 saran optimasi

**AI Config:**
```ts
model: "claude-haiku-4-5-20251001"
max_tokens: 400
feature: "sql-explainer"
```

**Cost profile:** Murah & cepat. Kontras dengan Cover Letter.

---

### 3. Code Reviewer
**Endpoint:** `/code-reviewer`

**Flow:**
- User paste satu fungsi/snippet kode (bahasa apapun)
- AI review: readability, potential bug, improvement suggestion
- Output dalam format: ✅ Good / ⚠️ Warning / ❌ Issue

**AI Config:**
```ts
model: "gpt-4o-mini"
max_tokens: 500
feature: "code-reviewer"
```

**Cost profile:** Medium. Di antara Cover Letter dan SQL Explainer.

---

### 4. Email Reply Drafter
**Endpoint:** `/email-drafter`

**Flow:**
- User paste email yang diterima
- AI generate **3 opsi balasan**: Formal / Casual / Tegas
- Semua dalam satu response

**AI Config:**
```ts
model: "claude-haiku-4-5-20251001"
max_tokens: 600
feature: "email-drafter"
```

**Cost profile:** Medium-low, tapi output 3x per request. Menarik untuk demo "cost per output."

---

### 5. Restaurant Finder
**Endpoint:** `/restaurant-finder`

**Flow:**
- User input: lokasi + preferensi (budget, cuisine, suasana)
- AI browse web untuk cari rekomendasi restoran real
- Output: 3-5 rekomendasi dengan nama, deskripsi singkat, estimasi harga, link

**AI Config:**
```ts
model: "claude-sonnet-4-6"
tools: [{ type: "web_search_20250305", name: "web_search" }]
max_tokens: 1000
feature: "restaurant-finder"
```

**Cost profile:** Paling mahal — ada web search tool call di atas LLM call. Ini yang akan di-flag Trae advisor sebagai "most expensive feature."

---

## Cara Integrasi AI Cost Tracker SDK

Setiap AI call harus di-wrap dengan tracker. Contoh:

```ts
// Tanpa tracker (before)
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: prompt }]
})

// Dengan tracker (after)
const response = await trackedAI({
  feature: "cover-letter-generator",
  userId: session.userId,           // opsional tapi recommended
  run: async () => {
    return await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    })
  }
})
```

Install SDK:
```bash
pnpm add ai-cost-tracker
```

Init di `lib/tracker.ts`:
```ts
import { createTracker } from 'ai-cost-tracker'

export const trackedAI = createTracker({
  apiKey: process.env.COST_TRACKER_API_KEY!,
  workspace: "devkit-ai"
})
```

---

## Environment Variables

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
COST_TRACKER_API_KEY=
```

---

## Struktur Folder

```
devkit-ai/
├── app/
│   ├── page.tsx                  # Landing / nav ke semua fitur
│   ├── cover-letter/
│   │   └── page.tsx
│   ├── sql-explainer/
│   │   └── page.tsx
│   ├── code-reviewer/
│   │   └── page.tsx
│   ├── email-drafter/
│   │   └── page.tsx
│   └── restaurant-finder/
│       └── page.tsx
├── app/api/
│   ├── cover-letter/route.ts
│   ├── sql-explainer/route.ts
│   ├── code-reviewer/route.ts
│   ├── email-drafter/route.ts
│   └── restaurant-finder/route.ts
├── lib/
│   └── tracker.ts
└── components/
    └── ui/                       # shadcn components
```

---

## UI Notes

- Tidak perlu polish tinggi — ini test app
- Tiap halaman: form input di kiri, hasil AI di kanan
- Satu navbar sederhana untuk navigasi antar fitur
- Pakai shadcn/ui components biar cepat: `Card`, `Textarea`, `Button`, `Badge`
- Loading state saat AI processing (penting untuk demo)

---

## Goal Demo

Setelah app jalan, simulate usage dengan:

1. Jalankan tiap fitur 5-10x dengan input berbeda
2. Pakai fitur Restaurant Finder paling banyak (biar jadi cost outlier)
3. Cek dashboard AI Cost Tracker — harus keliatan:
   - Cost per feature breakdown
   - Restaurant Finder sebagai most expensive
   - SQL Explainer sebagai most efficient
   - Trae advisor flag: "switch Cover Letter ke gpt-4o-mini, hemat ~40%"

---

## Timeline Estimasi

| Task | Estimasi |
|---|---|
| Setup Next.js + shadcn | 15 menit |
| 5 API routes + AI integration | 1.5 jam |
| 5 halaman UI (form + result) | 1.5 jam |
| Integrasi tracker SDK | 30 menit |
| Testing + generate dummy logs | 30 menit |
| **Total** | **~4 jam** |
