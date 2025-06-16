# Project Fullstack Sellerpintar - Abdullah Sajad

Tes Fullstack dengan fitur Manajemen Proyek dan Tugas menggunakan Next.js 15, Prisma, NextAuth, dan PostgreSQL.

---

## Cara Menjalankan Project di Lokal

### 1. Clone Repository

```bash
git clone https://github.com/doeljad/sp_fs_abdullah_sajad.git
cd sp_fs_abdullah_sajad

```

### 2. Install Dependency

```bash
npm install
```

### 3. Setup Database

Pastikan PostgreSQL jalan di localhost:5432
Buat database dengan nama sp_fs
Salin .env.example → .env dan isi sesuai konfigurasi lokal

```bash
cp .env.example .env
```

### 4. Jalankan Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Jalankan Project

```bash
npm run dev
```

### 6. Login

Gunakan halaman /register untuk mendaftar
Atau /login jika sudah punya akun
