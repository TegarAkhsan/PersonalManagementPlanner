# BRIEF: ProjectFlow PRO — Personal Productivity Workspace

> Dokumen ini adalah brief menyeluruh untuk membangun ulang (re-generate) website "ProjectFlow PRO", berdasarkan analisis 3 screenshot (Home Dashboard, Habits & Events, dan postingan promosi di Threads).
> Bagian bertanda **[TERLIHAT]** diamati langsung dari screenshot. Bagian bertanda **[ASUMSI]** adalah inferensi karena halamannya tidak terlihat; sesuaikan bila perlu.

---

## 1. Ringkasan Produk

**Nama:** ProjectFlow PRO
**Jenis:** Web app / template all-in-one personal productivity workspace, dark mode, bergaya "Notion-like / Linear-like".
**Tagline (usulan):** "Atur semua kegiatanmu di satu tempat: project, task, habit, dan jadwal."

**Tujuan utama** (dari caption pembuatnya):
1. Mencatat semua ide dan task dengan visual yang kuat.
2. Memastikan event, tugas, pekerjaan, dan jadwal tidak terlupakan.
3. Gamifikasi (streak, heatmap, progress bar) supaya mengatur kegiatan terasa seru.
4. Cocok untuk orang yang ingin lebih produktif (creator, mahasiswa, freelancer, pekerja mandiri).

**Positioning:** Pengganti "project management tool + habit tracker + kalender" dalam satu dashboard pribadi. Contoh data demo menunjukkan target pengguna adalah content creator / solopreneur (project "Launch Notion Template (CreatorOS)", task "Upload video ke TikTok", "Kirim email newsletter", "Setup automasi email"), sekaligus dipakai untuk hidup pribadi (gym, skincare, ibadah, badminton).

---

## 2. Target Pengguna

- Content creator dan solopreneur yang mengelola proyek, konten, dan rutinitas harian.
- Mahasiswa dan profesional muda yang ingin satu tempat untuk tugas, jadwal, dan kebiasaan.
- Pengguna yang suka visual dan gamifikasi (streak, heatmap, persentase).
- Pengguna Indonesia (ada habit "Ibadah tepat waktu" dengan 5 waktu salat; UI utama berbahasa Inggris, konten bebas bahasa).

---

## 3. Struktur Navigasi **[TERLIHAT]**

### Sidebar kiri (collapsible, ada tombol toggle di samping logo)
- **Logo:** ikon kotak oranye/amber + teks "ProjectFlow **PRO**" (PRO berwarna amber).
- **Tombol "+ Create"** dengan dropdown (membuat Project / Task / Habit / Event / Note / Goal **[ASUMSI isi dropdown]**).
- **WORKSPACE**
  - Home (aktif di screenshot)
  - Today
  - Projects
  - Tasks
  - Goals
  - Habits & Schedule
  - Calendar
  - Notes
  - Analytics
- **SYSTEM**
  - Archive Habits
  - Settings

### Top bar
- **Search bar** global dengan shortcut `Ctrl K` (command palette / quick search).
- **Tanggal dan jam live** di kanan atas, contoh: "Fri, 2 Oct 2026 · 11:26 PM".
- **Dua ikon toggle tampilan** (layout grid/list) dan satu ikon compact/fullscreen **[ASUMSI: ganti layout dashboard dan mode fokus]**.

---

## 4. Analisis Fitur per Halaman

### 4.1 Home Dashboard **[TERLIHAT]**

**A. Kartu statistik (4 KPI di atas)**
| Kartu | Contoh nilai | Sub-teks |
|---|---|---|
| Total Projects | 3 | "All active projects" |
| Total Tasks | 50 | "Across all lists" |
| In Progress | 3 | "6% of total tasks" |
| Completed | 46 | "92% of total tasks" |

Rumus persentase: `status_count / total_tasks * 100`, dibulatkan. Setiap kartu punya ikon outline di kotak kecil (folder, checkbox, jam, centang bulat) dan angka besar di kanan.

**B. Seksi "TASKS"**
- Toggle tampilan: **Board (Kanban)** dan **List**.
- Tab filter: `All Tasks` (aktif, underline amber) · `Today` · `Yesterday` · `Overdue` · `Unrelated Tasks` · `Inbox` · `Completed`.
  - "Unrelated Tasks" = task yang tidak terhubung ke project mana pun.
  - "Inbox" = task yang baru ditangkap, belum diproses.
- Tombol collapse (chevron ^) untuk melipat seksi.
- **Kanban kolom:** `In Progress` (ikon lingkaran biru), `Review` (ikon jam oranye), `Done` (ikon centang hijau). Setiap kolom punya badge jumlah item.
- **Kartu task** berisi:
  - Ikon status kecil + judul (task selesai: dicoret dan redup)
  - Label sumber/tipe (contoh "Upcoming task")
  - Ikon kalender + tanggal jatuh tempo (contoh "Oct 3, 2026")
  - Badge prioritas di kanan bawah (contoh "High" merah)
  - Drag and drop antar kolom **[ASUMSI]**

**C. Panel kanan**
- **Mini calendar** bulanan (October 2026): navigasi bulan `<` `>`, hari ini dilingkari amber, **titik kecil di bawah tanggal** yang punya task/event (titik amber = event, titik pink = task).
- **"Upcoming Tasks & Events"**: daftar urut waktu dengan titik berwarna (amber = Event, pink = Task project), judul, keterangan waktu ("Today", "Tomorrow", "Oct 4"), nama project asal, dan label "Event" untuk event.

> ⚠️ **Bug di demo yang harus DIHINDARI:** event menampilkan tanggal "1899-12-30". Ini epoch default Google Sheets/Excel saat sel tanggal kosong. Pada versi baru, event tanpa tanggal harus ditampilkan "No date" atau tidak dimunculkan.

### 4.2 Habits & Events **[TERLIHAT]**

- Header "HABITS & EVENTS" + tab **Habits** (aktif) dan **Events**.
- **Grid kartu habit** (3 kolom di desktop). Tiap kartu:
  - Emoji/ikon + nama habit (contoh: 💪 Gym / Workout 45m, 📖 Read 10 Pages, 📵 No Screen Time before Bed, 🔥 Badminton, ✨ Morning Skincare, 🔥 Ibadah tepat waktu)
  - "Target: Daily"
  - **Heatmap kalender bulanan** (kolom M T W T F S S, kotak per hari). Hari tercentang diwarnai sesuai warna habit; hari belum/tidak dilakukan abu-abu gelap; hari kosong di luar bulan tidak digambar.
  - **Status hari ini:** "✓ Completed Today" (berwarna) atau "✓ Not Completed Yet" (abu-abu, bisa diklik untuk menandai).
  - **Monthly Progress:** persentase + rasio (contoh 32% (10/31)) + progress bar tipis berwarna.
  - **Streak** (ikon api 🔥 "1 day") dan **Max** streak terbaik ("Max: 9 days").
- **Warna per habit** berbeda: biru, kuning/amber, hijau, pink, dll.
- **Habit bertipe checklist (sub-habit):** "Ibadah tepat waktu" tidak memakai heatmap, melainkan daftar checklist harian (Subuh, Dzuhur, Ashar, Maghrib, Isya) dengan navigator tanggal `< Today >`. Progress dihitung dari total sub-item sebulan (9/155 = 6%, yaitu 31 hari x 5 item).
- Tombol "+ New Habit" **[ASUMSI, terlihat di postingan Threads]**.
- **Archive Habits** di sidebar untuk habit yang dihentikan.

### 4.3 Halaman lain **[ASUMSI, tidak terlihat]**
| Halaman | Fungsi yang disarankan |
|---|---|
| Today | Fokus hari ini: task jatuh tempo, event, habit yang belum selesai |
| Projects | Daftar project (kartu + progress), detail project berisi task list/board |
| Tasks | Semua task, filter by status/priority/project/tag, board dan list |
| Goals | Target jangka panjang (OKR sederhana) terhubung ke project/habit, dengan progress |
| Calendar | Kalender penuh (month/week/day) menggabungkan task, event, habit |
| Notes | Catatan/ide cepat, rich text sederhana, bisa dikaitkan ke project |
| Analytics | Grafik produktivitas: task selesai per minggu, konsistensi habit, streak, distribusi prioritas |
| Settings | Tema, format tanggal, awal minggu, ekspor/impor data, akun |

---

## 5. Model Data (disarankan)

```
Project   { id, name, description, color, icon, status(active|archived), createdAt }
Task      { id, title, projectId?, status(todo|in_progress|review|done), priority(low|medium|high),
            dueDate?, tags[], notes?, completedAt?, createdAt }
Event     { id, title, date, startTime?, endTime?, projectId?, location?, type:"event" }
Habit     { id, name, emoji, color, targetFrequency("daily"|"weekly"|custom),
            type("single"|"checklist"), subItems[]? (untuk checklist: Subuh, Dzuhur, ...),
            archived:boolean, createdAt }
HabitLog  { id, habitId, date(YYYY-MM-DD), completed:boolean, subItemId? }
Goal      { id, title, targetDate?, progress, linkedProjectIds[], linkedHabitIds[] }
Note      { id, title, content, projectId?, createdAt, updatedAt }
```

### Logika perhitungan
- **Monthly progress habit single:** `jumlah hari tercentang di bulan ini / jumlah hari dalam bulan`.
- **Monthly progress habit checklist:** `jumlah sub-item tercentang / (jumlah hari x jumlah sub-item)`.
- **Current streak:** hitung mundur dari hari ini (atau kemarin jika hari ini belum dicentang) hingga ada hari yang terlewat.
- **Max streak:** rangkaian hari berturut-turut terpanjang dalam seluruh histori (atau bulan ini; pilih salah satu dan konsisten).
- **Statistik Home:** total project aktif, total task, jumlah in_progress, jumlah done, beserta persentase terhadap total task.
- **Overdue:** `dueDate < hari ini AND status != done`.

---

## 6. Desain Visual (Design System) **[TERLIHAT]**

- **Tema:** dark mode utama. Latar halaman hitam pekat (~#0B0B0D), sidebar dan kartu sedikit lebih terang (~#141416 / #1A1A1D), border tipis abu gelap (~#26262B).
- **Aksen utama:** amber/oranye (~#F5A524 / #FBBF24) untuk logo, tab aktif, hari ini, dan sorotan.
- **Warna semantik:** biru (in progress), oranye (review), hijau (done), merah (prioritas High), pink (task project / habit), plus warna bebas per habit.
- **Tipografi:** sans-serif modern (Inter / Geist). Judul seksi huruf kapital kecil dengan tracking lebar ("TASKS", "HABITS & EVENTS", "WORKSPACE"). Angka KPI besar dan tebal.
- **Bentuk:** sudut membulat (radius 8–12px), kartu dengan border halus, ikon outline tipis (gaya Lucide).
- **Komponen:** kartu stat, tab underline, kanban column, task card, badge prioritas, heatmap grid, progress bar tipis, mini calendar dengan dot indicator, sidebar item dengan highlight aktif, search dengan hint keyboard.
- **Layout Home:** 3 area: sidebar (±200px) | konten utama fleksibel | panel kanan (±220px, kalender + upcoming).
- **Responsif:** pada layar kecil, sidebar jadi drawer, panel kanan turun ke bawah, grid habit jadi 1–2 kolom.

---

## 7. Interaksi dan UX

- `Ctrl/Cmd + K` membuka command palette (cari task/project/note, buat item baru).
- Klik kotak hari di heatmap atau tombol "Not Completed Yet" untuk toggle selesai.
- Drag and drop kartu antar kolom Kanban mengubah status.
- Klik tanggal di mini calendar memfilter/menyorot task di hari itu.
- Animasi halus saat centang habit dan saat progress bar bertambah (feedback gamifikasi).
- Empty state ramah untuk setiap seksi.
- Persistensi data (lihat bagian 8).

---

## 8. Rekomendasi Tech Stack

> Pilih salah satu sesuai kebutuhan; semua dapat menghasilkan tampilan yang sama.

**Opsi A — Web app modern (disarankan):**
- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- State: Zustand / TanStack Query
- Drag and drop: `@dnd-kit`
- Chart (Analytics): Recharts
- Tanggal: date-fns
- Backend/DB: Supabase (Postgres + auth) atau Firebase; untuk prototipe cukup `localStorage`/IndexedDB.

**Opsi B — Ringan tanpa build:**
- Satu file HTML + Tailwind CDN + Alpine.js/vanilla JS, data di `localStorage`.

**Opsi C — Backend spreadsheet (gaya demo asli):**
- Frontend statis + Google Sheets via Apps Script sebagai database. Pastikan sel tanggal kosong tidak dirender sebagai "1899-12-30".

---

## 9. Cakupan MVP vs Lanjutan

**MVP (wajib):**
1. Sidebar + top bar (search, tanggal/jam)
2. Home: 4 kartu statistik, Tasks (board + list + tab filter), mini calendar, upcoming
3. CRUD Project, Task, Event
4. Habits: kartu dengan heatmap, streak, max streak, progress bulanan, habit checklist, arsip
5. Persistensi data

**Lanjutan:**
Today, Goals, Calendar penuh, Notes, Analytics, Settings, command palette lengkap, notifikasi/pengingat, tag dan subtask, recurring task, ekspor/impor, mode terang, sinkronisasi multi-device.

---

## 10. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Tampilan dark mode mirip screenshot (tata letak 3 area, aksen amber).
- [ ] Angka KPI dan persentase di Home dihitung otomatis dari data.
- [ ] Task dapat dipindah antar kolom In Progress / Review / Done dan statistik ikut berubah.
- [ ] Tab filter (Today, Yesterday, Overdue, Unrelated, Inbox, Completed) menampilkan hasil yang benar.
- [ ] Mini calendar menampilkan titik di tanggal yang punya item; "Upcoming" terurut waktu.
- [ ] Heatmap habit benar (tanggal dan hari dalam seminggu sesuai bulan), streak dan max streak akurat.
- [ ] Habit checklist (Subuh–Isya) menghitung progres per sub-item.
- [ ] Tidak ada tanggal "1899-12-30"; item tanpa tanggal ditangani dengan baik.
- [ ] Data tetap ada setelah refresh.
- [ ] Responsif di mobile dan desktop.

---

## 11. Prompt Siap Pakai untuk Generate Ulang

Salin prompt di bawah ini ke Claude / generator lain, dan lampirkan dokumen ini:

```
Bangun web app "ProjectFlow PRO" sesuai brief terlampir: personal productivity
workspace dark mode dengan sidebar (Home, Today, Projects, Tasks, Goals,
Habits & Schedule, Calendar, Notes, Analytics, Archive Habits, Settings), top bar
(search Ctrl+K, tanggal/jam live), Home dengan 4 kartu statistik, Kanban task
(In Progress/Review/Done) dengan tab filter, mini calendar + Upcoming Tasks &
Events, serta halaman Habits dengan heatmap bulanan, streak, max streak,
progress bulanan, dan habit tipe checklist. Gunakan Next.js + TypeScript +
Tailwind + shadcn/ui, data awal berupa seed demo (project "Launch Notion
Template (CreatorOS)", task TikTok/newsletter/automasi email, habit Gym, Read 10
Pages, No Screen Time before Bed, Badminton, Morning Skincare, Ibadah tepat
waktu), simpan data di localStorage. Ikuti design system dan kriteria
penerimaan pada brief. Kerjakan MVP dulu, lalu tambahkan halaman lanjutan.
```

---

## 12. Catatan dan Batasan Analisis

- Hanya 2 halaman aplikasi (Home, Habits & Events) yang terlihat; halaman lain disusun sebagai asumsi.
- Teks kecil pada screenshot Threads (sebagian blur) tidak semuanya terbaca; detail seperti tombol "New Habit" disimpulkan dari tata letak.
- Nama "CreatorOS" dan "Launch Notion Template" hanya data demo; ganti dengan data milikmu sendiri agar tidak meniru aset orang lain.
- Gunakan brief ini untuk membuat versi orisinalmu; jangan menyalin aset visual, logo, atau branding "ProjectFlow PRO" apa adanya jika bukan milikmu.
