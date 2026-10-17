/**
 * Utility to generate and download an official Invoice (HTML / PDF printable)
 */
export function generateInvoiceHTML(order, settings) {
  const invoiceNumber = order.orderId || `INV-${Date.now()}`;
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const amountFormatted = (Number(order.amount) || 0).toLocaleString('id-ID');
  const isConfirmed = order.status === 'confirmed';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f4f6f8; padding: 40px 20px; color: #1e293b; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 48px; border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #f1f5f9; }
    .brand-title { font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .brand-tagline { font-size: 12px; color: #f59e0b; font-weight: 600; margin-top: 2px; }
    .brand-meta { font-size: 11px; color: #64748b; margin-top: 8px; line-height: 1.5; }
    .inv-meta { text-align: right; }
    .inv-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; }
    .inv-number { font-size: 20px; font-weight: 900; font-family: monospace; color: #d97706; margin-top: 2px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 8px; }
    .badge-paid { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-pending { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
    
    .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px 0; border-bottom: 1px solid #f1f5f9; }
    .info-col h4 { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 800; margin-bottom: 8px; letter-spacing: 0.5px; }
    .info-col p { font-size: 14px; color: #334155; line-height: 1.6; }
    .info-col strong { color: #0f172a; font-weight: 700; }

    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { text-align: left; padding: 12px 16px; background: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800; border-bottom: 1px solid #e2e8f0; }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
    .total-section { display: flex; justify-content: flex-end; padding-top: 24px; }
    .total-box { width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b; }
    .total-row.grand { border-top: 2px solid #e2e8f0; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 900; color: #0f172a; }
    .total-row.grand span:last-child { color: #d97706; }

    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px dashed #cbd5e1; text-align: center; }
    .footer p { font-size: 11px; color: #64748b; line-height: 1.6; max-width: 600px; margin: 0 auto; }
    .print-actions { margin-bottom: 24px; display: flex; justify-content: flex-end; gap: 12px; max-width: 800px; margin-left: auto; margin-right: auto; }
    .btn-print { background: #f59e0b; color: white; border: none; padding: 10px 20px; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; }
    .btn-print:hover { background: #d97706; }
    @media print {
      body { background: white; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
      .print-actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">${settings?.companyName || 'Orvian'}</div>
        <div class="brand-tagline">${settings?.companyTagline || 'One space. Every ambition.'}</div>
        <div class="brand-meta">
          ${settings?.companyAddress || 'Surabaya, Jawa Timur, Indonesia'}<br>
          Email: ${settings?.companyEmail || 'billing@orvian.id'} | Telp/WA: ${settings?.companyPhone || '+62 858-2000-4069'}
        </div>
      </div>
      <div class="inv-meta">
        <div class="inv-label">Bukti Pembayaran / Invoice</div>
        <div class="inv-number">${invoiceNumber}</div>
        <div class="badge ${isConfirmed ? 'badge-paid' : 'badge-pending'}">
          ${isConfirmed ? '✓ LUNAS / VERIFIED' : '⏳ MENUNGGU VERIFIKASI'}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Tanggal: ${dateStr}</div>
      </div>
    </div>

    <div class="grid-info">
      <div class="info-col">
        <h4>Ditagihkan Kepada:</h4>
        <p><strong>${order.name || 'Pelanggan Orvian'}</strong></p>
        <p>Email: ${order.email || '-'}</p>
        <p>Nomor HP: ${order.phone || '-'}</p>
      </div>
      <div class="info-col">
        <h4>Metode Pembayaran:</h4>
        <p><strong>${(order.paymentMethod || 'QRIS').toUpperCase().replace('_', ' ')}</strong></p>
        <p>Status Lisensi: ${order.plan ? `Paket ${order.plan}` : 'Akses Penuh'}</p>
        <p>Siklus Tagihan: ${order.billingCycle === 'yearly' ? 'Tahunan (12 Bulan)' : 'Bulanan'}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Deskripsi Layanan</th>
          <th>Siklus</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Langganan Workspace Orvian (${order.plan || 'Pro'})</strong><br>
            <span style="font-size: 11px; color: #64748b;">Akses penuh proyek tak terbatas, sinkronisasi Google Calendar, OKR, dan analitik.</span>
          </td>
          <td>${order.billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}</td>
          <td style="text-align: right; font-weight: 700; font-family: monospace;">Rp ${amountFormatted}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>Rp ${amountFormatted}</span>
        </div>
        <div class="total-row">
          <span>Pajak (PPN 0%):</span>
          <span>Rp 0</span>
        </div>
        <div class="total-row grand">
          <span>Total Lunas:</span>
          <span>Rp ${amountFormatted}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>${settings?.footerNotes || 'Terima kasih telah mempercayakan alur kerja proyek Anda kepada Orvian.'}</p>
      <p style="margin-top: 6px; font-size: 10px; color: #94a3b8;">Dokumen ini dihasilkan secara otomatis oleh sistem ProjectFlow / Orvian dan sah sebagai bukti pembayaran digital.</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadInvoice(order, settings) {
  const htmlContent = generateInvoiceHTML(order, settings);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.focus();
  } else {
    // If pop-up blocked, trigger download as html file
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.orderId || 'Orvian'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
