export function serviceInvoiceTemplate(params: {
  clientName: string;
  companyName: string;
  periodLabel: string;
  amount: string;
  number?: string | null;
}): string {
  const logoUrl = process.env.LOGO_URL;
  const numberLine = params.number
    ? `<p>Número da nota: <strong>${params.number}</strong></p>`
    : '';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Nota fiscal emitida</title>
      </head>
      <body style="font-family: Arial, sans-serif; background:#f6f4f8; margin:0; padding:24px;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;">
          ${logoUrl ? `<img src="${logoUrl}" alt="" height="36" />` : ''}
          <h1 style="color:#6B2AEE;font-size:22px;">Nota fiscal emitida</h1>
          <p>Olá, ${params.clientName}.</p>
          <p><strong>${params.companyName}</strong> emitiu uma nota fiscal de serviço referente a ${params.periodLabel}.</p>
          <p>Valor: <strong>${params.amount}</strong></p>
          ${numberLine}
          <p>Este é um comunicado automático. Guarde esta mensagem para o seu controle.</p>
        </div>
      </body>
    </html>
  `;
}
