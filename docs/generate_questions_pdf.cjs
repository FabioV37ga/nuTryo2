const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');

async function run() {
  const mdPath = '.doc/frontend_questoes.md';
  if (!fs.existsSync(mdPath)) { console.error('Arquivo não encontrado'); process.exit(1); }
  const markdown = fs.readFileSync(mdPath, 'utf8');

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - 50;
  const lineHeight = 16;
  const maxChars = 95;

  drawText(page, 'Questionário Frontend (Professor)', 50, y, fontBold, 18);
  y -= 28;

  // Processa linhas mantendo **bold**
  const lines = markdown.split(/\r?\n/).filter(l => l.trim().length > 0);
  for (const raw of lines) {
    if (y < 60) { page = pdfDoc.addPage(); y = height - 50; }
    const segments = parseBold(raw.trim());
    // Quebra por comprimento sem perder negrito
    const broken = breakSegments(segments, maxChars);
    for (const lineSegments of broken) {
      if (y < 60) { page = pdfDoc.addPage(); y = height - 50; }
      let x = 50;
      for (const seg of lineSegments) {
        const font = seg.bold ? fontBold : fontRegular;
        drawText(page, seg.text, x, y, font, 12);
        x += font.widthOfTextAtSize(seg.text, 12);
      }
      y -= lineHeight;
    }
    if (/^---+$/.test(raw)) { y -= 6; }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('.doc/frontend_questoes.pdf', pdfBytes);
  console.log('PDF gerado em .doc/frontend_questoes.pdf');
}

function drawText(page, text, x, y, font, size) {
  page.drawText(text, { x, y, size, font });
}

function parseBold(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(p => p.length > 0);
  return parts.map(p => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return { text: p.slice(2, -2), bold: true };
    }
    return { text: p, bold: false };
  });
}

function breakSegments(segments, maxChars) {
  const lines = [];
  let current = [];
  let length = 0;
  for (const seg of segments) {
    if (seg.text.length + length <= maxChars) {
      current.push(seg);
      length += seg.text.length;
    } else {
      // quebra segmento grande
      const remaining = seg.text.split(/(\s+)/);
      for (const token of remaining) {
        if (token.length + length > maxChars) {
          if (current.length) { lines.push(current); }
          current = [{ text: token, bold: seg.bold }];
          length = token.length;
        } else {
          current.push({ text: token, bold: seg.bold });
          length += token.length;
        }
      }
    }
  }
  if (current.length) lines.push(current);
  return lines;
}

run().catch(e => { console.error(e); process.exit(1); });
