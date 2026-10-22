/**
 * RSVP -> Google Sheet
 * ---------------------------------------------------------
 * Skrip ini menerima data RSVP dari undangan (index.html) lewat
 * permintaan POST, lalu menuliskannya sebagai baris baru di
 * spreadsheet yang sama tempat skrip ini "ditempel".
 *
 * CARA PASANG (sekali saja, +-5 menit):
 * 1. Buka https://sheets.google.com, buat spreadsheet baru.
 *    Judul bebas, misal "RSVP Firdha & Hilal".
 * 2. Di menu atas: Extensions -> Apps Script.
 * 3. Hapus semua kode contoh yang ada, lalu tempel SELURUH isi
 *    file Code.gs ini, lalu klik ikon simpan (atau Ctrl+S).
 * 4. Klik tombol biru "Deploy" (kanan atas) -> "New deployment".
 * 5. Klik ikon gerigi di sebelah "Select type" -> pilih "Web app".
 * 6. Isi:
 *      - Description      : bebas, misal "RSVP endpoint"
 *      - Execute as        : Me (akun Google kamu)
 *      - Who has access     : Anyone
 *    PENTING: harus "Anyone", bukan "Anyone with Google account",
 *    supaya tamu yang mengisi RSVP tidak perlu login Google.
 * 7. Klik "Deploy". Google akan minta izin akses -> klik "Authorize
 *    access", pilih akun kamu, klik "Advanced" -> "Go to ... (unsafe)"
 *    kalau muncul peringatan (ini normal untuk skrip buatan sendiri),
 *    lalu "Allow".
 * 8. Setelah itu muncul "Web app URL" -> COPY url tersebut
 *    (bentuknya seperti https://script.google.com/macros/s/AKfycby.../exec)
 * 9. Tempel URL itu ke index.html, cari baris:
 *        sheetUrl: '',
 *    ganti jadi:
 *        sheetUrl: 'https://script.google.com/macros/s/....../exec',
 * 10. Upload ulang index.html ke GitHub. Selesai — setiap RSVP yang
 *     masuk akan otomatis nambah baris baru di spreadsheet ini.
 *
 * CATATAN:
 * - Kalau nanti kamu ubah kode di Apps Script, harus "Deploy" ->
 *   "Manage deployments" -> ikon pensil -> "New version" -> Deploy
 *   lagi, supaya perubahan ikut aktif di URL yang sama.
 * - Spreadsheet ini hanya bisa dilihat oleh akun Google kamu sendiri
 *   (dan siapa pun yang kamu ajak share manual), jadi datanya aman.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Buat header kalau sheet masih kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Waktu', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan / Doa']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }

  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.waktu || '',
    data.nama || '',
    data.kehadiran || '',
    data.jumlahTamu || '',
    data.ucapan || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
