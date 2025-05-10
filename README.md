# Time Travel Code Adventure

**Versi**: 1.0.0  
**Tanggal**: 2025-05-09

## Deskripsi
Aplikasi **Time Travel Code Adventure** adalah sebuah aplikasi edukasi yang dirancang untuk membantu anak-anak belajar coding dengan cara yang menyenangkan dan imajinatif. Aplikasi ini memungkinkan anak-anak untuk belajar pemrograman dasar melalui tantangan dan proyek kreatif yang disesuaikan dengan berbagai era dalam sejarah, dimulai dari zaman prasejarah (Prehistoric) hingga masa depan (Future).

Setiap tantangan disertai umpan balik interaktif dari AI Qwen, yang memberikan respons konstruktif untuk membantu anak-anak memahami dan mengembangkan solusi yang mereka buat.

**Catatan**: Game ini menggunakan bahasa Inggris untuk tantangan dan instruksi.

## Cara Penggunaan

1. **Instalasi**
   - Pastikan [Node.js](https://nodejs.org/) dan [npm](https://www.npmjs.com/) sudah terinstal di komputer.
   - Clone repositori ini ke komputer:
     ```bash
     git clone https://github.com/irfanstrw/timetraveladventure.git
     ```
   - Masuk ke folder proyek:
     ```bash
     cd timetraveladventure
     ```
   - Install dependensi yang dibutuhkan:
     ```bash
     npm install
     ```
2. **Menyiapkan API Key Qwen**
   - Untuk menjalankan fitur AI feedback dari Qwen, diperlukan akses API key yang dapat diperoleh dari saya melalui [Google Drive](https://drive.google.com/file/d/1-IOiMYV7WR_J4Homu-OwDsC1-qZqtC8K/view?usp=sharing) atau dari situs web Alibaba.
   - Setelah mendapatkan akses, copy file API key dan tambahkan pada .env.
     
3. **Menjalankan Server**
   - Jalankan server Python menggunakan perintah berikut:
     ```bash
     python server.py
     ```
   - Server akan berjalan di `http://localhost:3000`.

4. **Akses Aplikasi**
   - Setelah server berjalan, buka browser dan kunjungi `http://localhost:3000` untuk memulai aplikasi.
   - Pengguna akan memulai dengan memilih tantangan dari era **Prasejarah (Prehistoric)**, dan berlanjut ke tantangan dari era-era lainnya hingga **Masa Depan (Future)**. Tantangan disusun secara berurutan dari yang paling awal hingga yang paling modern.
   - Pengguna dapat menginputkan solusi cerita dan kode mereka untuk setiap tantangan yang ada.

## Fitur

- **Belajar Pemrograman Dasar**: Anak-anak dapat belajar dasar-dasar pemrograman melalui tantangan yang menarik.
- **Tantangan Berdasarkan Era**: Terdapat berbagai tantangan yang berhubungan dengan berbagai era, dimulai dari prasejarah, abad pertengahan, modern, hingga masa depan.
- **Umpan Balik dari AI Qwen**: Setiap solusi yang diberikan oleh anak-anak akan dinilai dan diberi umpan balik langsung oleh AI Qwen untuk membantu mereka mengembangkan dan memahami konsep pemrograman.
- **Antarmuka Ramah Anak**: Desain aplikasi yang sederhana dan menyenangkan, membuatnya mudah digunakan oleh anak-anak.
- **Meningkatkan Imajinasi dan Kreativitas**: Selain belajar coding, anak-anak dapat mengembangkan imajinasi dan kreativitas mereka dalam menyelesaikan berbagai tantangan.

## Pemecahan Masalah

- **Masalah: Server Tidak Berjalan**
  - Pastikan Python telah terinstal dengan benar dan jalankan perintah `python server.py` di direktori yang tepat.

- **Masalah: Aplikasi Tidak Muncul di Browser**
  - Pastikan server berjalan di `http://localhost:3000` dan cek kembali apakah server Python berhasil dijalankan.

## Informasi Kontak

- **Pengembang**: Irfan Satrio  
- **Email**: irfansatrio479@gmail.com  
- **GitHub**: [https://github.com/irfanstrw](https://github.com/irfanstrw)

## Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE.md](LICENSE.md) untuk rincian lebih lanjut.

## Catatan

Aplikasi ini bertujuan untuk memberikan pengalaman belajar yang menyenangkan dan mendidik bagi anak-anak. Saya terus mengembangkan dan memperbarui aplikasi ini agar lebih bermanfaat dan menyenangkan dalam proses pembelajaran coding.
