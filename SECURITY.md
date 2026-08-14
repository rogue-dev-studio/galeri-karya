<!--
@Author: rogue-dev-studio
@Date: 2026-08-14 16:45:00
@Last Modified by: rogue-dev-studio
@Last Modified time: 2026-08-14 16:45:00
-->

# Security

Jangan taruh GitHub PAT, OAuth client secret, atau API key di gist publik, di `config.js`, atau di JavaScript frontend.

Kode lama di repo ini pernah memuat token dari gist `omeans-team` lalu memanggil GitHub API dari browser. Cabut token itu jika masih aktif.

Laporan: buka issue di repo ini atau email [aris.hadisopiyan@gmail.com](mailto:aris.hadisopiyan@gmail.com).
