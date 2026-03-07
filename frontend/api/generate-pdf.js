import PDFDocument from 'pdfkit';
import { getTenders, clearTenders } from './tender.js';
import { getTenders, clearTenders } from './tender.js';

function convertToIndianWords(number) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanThousand(num) {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + convertLessThanThousand(num % 100) : '');
  }

  if (number === 0) return 'Zero';

  const [integerPart, decimalPart] = number.toFixed(2).split('.');
  let result = '';
  let num = parseInt(integerPart);
  
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    result += convertLessThanThousand(crores) + ' Crore ';
    num = num % 10000000;
  }

  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += convertLessThanThousand(lakhs) + ' Lakh ';
    num = num % 100000;
  }

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertLessThanThousand(thousands) + ' Thousand ';
    num = num % 1000;
  }

  if (num > 0) {
    result += convertLessThanThousand(num);
  }

  result = result.trim();
  
  if (decimalPart && parseInt(decimalPart) > 0) {
    result += ` and Paise ${convertLessThanThousand(parseInt(decimalPart))}`;
  }

  return result || 'Zero';
}

function calculateTotalCost(tender) {
  const dailyCosts = [
    parseFloat(tender.minimumDailyWages || 0),
    parseFloat(tender.bonus || 0),
    parseFloat(tender.edli || 0),
    parseFloat(tender.epfAdminCharge || 0),
    parseFloat(tender.operationalAllowance1 || 0),
    parseFloat(tender.operationalAllowance2 || 0),
    parseFloat(tender.operationalAllowance3 || 0),
    parseFloat(tender.esi || 0),
    parseFloat(tender.providentFund || 0)
  ];

  const totalDailyCost = dailyCosts.reduce((sum, cost) => sum + cost, 0);
  const overtimeCost = (parseFloat(tender.overtimeHours) || 0) * 
                      (parseFloat(tender.overtimeRemuneration) || 0);
  
  const a = (totalDailyCost * 
             parseFloat(tender.numResources) * 
             parseFloat(tender.workingDays) * 
             parseFloat(tender.duration)) +
            (overtimeCost * 
             parseFloat(tender.numResources) * 
             parseFloat(tender.duration));

  const b = a * 0.18;
  const c = a * (parseFloat(tender.serviceCharge)/100);

  return (a + b + c);
}

async function generatePDF(tenders) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      let grandTotal = 0;

      // For each tender, create a new page and add content
      tenders.forEach((tender, index) => {
        if (index > 0) doc.addPage();

        const totalCost = calculateTotalCost(tender);
        grandTotal += totalCost;

        // Add GEM number at top-right
        doc.fontSize(12)
           .text(`GEM Number: ${tender.gemNumber}`, { align: 'right' });

        // Add sub heading
        doc.moveDown()
           .fontSize(14)
           .text(tender.subHeading, { align: 'center' });

        // Create table
        const tableData = [
          ['Field', 'Value'],
          ['Consignee(s)', tender.consignees],
          ['Number of Resources', tender.numResources],
          ['Service Charge (incl. GST)', `${tender.serviceCharge}%`],
          ['Minimum Daily Wages', `Rs. ${tender.minimumDailyWages}`],
          ['Bonus', `Rs. ${tender.bonus}`],
          ['EDLI', `Rs. ${tender.edli}`],
          ['EPF Admin Charge', `Rs. ${tender.epfAdminCharge}`],
          ['Operational Allowance 1', `Rs. ${tender.operationalAllowance1}`],
          ['Operational Allowance 2', `Rs. ${tender.operationalAllowance2}`],
          ['Operational Allowance 3', `Rs. ${tender.operationalAllowance3}`],
          ['Overtime Hours', tender.overtimeHours],
          ['Overtime Remuneration/hr', `Rs. ${tender.overtimeRemuneration}`],
          ['ESI', `Rs. ${tender.esi}`],
          ['Provident Fund', `Rs. ${tender.providentFund}`],
          ['Working Days/Month', tender.workingDays],
          ['Duration (months)', tender.duration]
        ];

        // Draw table
        let yPosition = doc.y + 20;
        const pageWidth = doc.page.width - 100;
        const colWidth = pageWidth / 2;
        const startX = 50;

        // Draw initial top border of the table
        doc.strokeColor('#000')
           .lineWidth(1)
           .moveTo(startX, yPosition - 5)
           .lineTo(startX + pageWidth, yPosition - 5)
           .stroke();

        tableData.forEach((row, i) => {
          // Draw background for header
          if (i === 0) {
            doc.fillColor('#f0f0f0')
               .rect(startX, yPosition - 5, pageWidth, 25)
               .fill();
          }

          doc.fillColor('#000')
             .fontSize(10);

          // Draw cell contents with padding
          doc.text(row[0], startX + 10, yPosition);
          doc.text(row[1], startX + colWidth + 10, yPosition);

          // Draw vertical lines
          doc.strokeColor('#000')
             .lineWidth(1);
          
          // Left border
          doc.moveTo(startX, yPosition - 5)
             .lineTo(startX, yPosition + 20)
             .stroke();
          
          // Middle vertical line
          doc.moveTo(startX + colWidth, yPosition - 5)
             .lineTo(startX + colWidth, yPosition + 20)
             .stroke();
          
          // Right border
          doc.moveTo(startX + pageWidth, yPosition - 5)
             .lineTo(startX + pageWidth, yPosition + 20)
             .stroke();

          yPosition += 25;

          // Draw horizontal line after each row (black line)
          doc.strokeColor('#000')
             .lineWidth(1)
             .moveTo(startX, yPosition - 5)
             .lineTo(startX + pageWidth, yPosition - 5)
             .stroke();
        });

        // Add subtotal in numbers
        doc.moveDown(2)
           .fontSize(11)
           .text(`Subtotal: Rs. ${totalCost.toLocaleString('en-IN', { 
             minimumFractionDigits: 2,
             maximumFractionDigits: 2 
           })}`, {
             align: 'left'
           });

        // Add total in words
        const totalInWords = convertToIndianWords(totalCost);
        doc.moveDown()
           .fontSize(11)
           .text(`Amount in Words: Rupees ${totalInWords} Only`, {
             align: 'left'
           });
      });

      // Add summary page if there are multiple tenders
      if (tenders.length >= 1) {
        doc.addPage();
        
        // Add heading
        doc.fontSize(16)
           .text('Summary of Tender(s)', { align: 'center' })
           .moveDown(2);

        // Create summary table
        let yPosition = doc.y;
        const pageWidth = doc.page.width - 100;
        const colWidths = [pageWidth * 0.2, pageWidth * 0.4, pageWidth * 0.4];
        const startX = 50;

        // Draw table header with background
        doc.fillColor('#f0f0f0')
           .rect(startX, yPosition - 5, pageWidth, 30)
           .fill()
           .fillColor('#000')
           .fontSize(12);

        // Draw header texts
        ['Tender No.', 'GEM Number', 'Amount'].forEach((header, i) => {
          const xPos = startX + (i > 0 ? colWidths.slice(0, i).reduce((a, b) => a + b, 0) : 0);
          doc.text(header, xPos + 10, yPosition + 5);
        });

        // Draw vertical lines for columns
        doc.strokeColor('#000');
        [0, 1, 2].forEach(i => {
          const xPos = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.moveTo(xPos, yPosition - 5)
             .lineTo(xPos, yPosition + 25)
             .stroke();
        });
        // Draw right border
        doc.moveTo(startX + pageWidth, yPosition - 5)
           .lineTo(startX + pageWidth, yPosition + 25)
           .stroke();

        // Draw header bottom line
        yPosition += 25;
        doc.moveTo(startX, yPosition)
           .lineTo(startX + pageWidth, yPosition)
           .stroke();

        // Add tender rows
        tenders.forEach((tender, index) => {
          const tenderTotal = calculateTotalCost(tender);
          yPosition += 25;
          
          // Draw row background (alternating colors)
          if (index % 2 === 0) {
            doc.fillColor('#f9f9f9')
               .rect(startX, yPosition - 5, pageWidth, 30)
               .fill();
          }
          
          // Draw row content
          doc.fillColor('#000');
          const rowData = [
            `Tender ${index + 1}`,
            tender.gemNumber,
            `Rs. ${tenderTotal.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          ];

          rowData.forEach((text, i) => {
            const xPos = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.text(text, xPos + 10, yPosition);
          });

          // Draw vertical lines
          [0, 1, 2].forEach(i => {
            const xPos = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.moveTo(xPos, yPosition - 5)
               .lineTo(xPos, yPosition + 25)
               .stroke();
          });
          // Draw right border
          doc.moveTo(startX + pageWidth, yPosition - 5)
             .lineTo(startX + pageWidth, yPosition + 25)
             .stroke();

          // Draw row bottom line
          yPosition += 25;
          doc.moveTo(startX, yPosition)
             .lineTo(startX + pageWidth, yPosition)
             .stroke();
        });

        // Add space before grand total
        yPosition += 50;

        // Add grand total box with background
        const grandTotalBoxHeight = 40;
        doc.fillColor('#f0f0f0')
           .rect(startX, yPosition, pageWidth, grandTotalBoxHeight)
           .fill();

        // Add grand total text
        doc.fillColor('#000')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Grand Total:', startX + 10, yPosition + 10)
           .font('Helvetica')
           .text(`Rs. ${grandTotal.toLocaleString('en-IN', {
             minimumFractionDigits: 2,
             maximumFractionDigits: 2
           })}`, startX + pageWidth - 200, yPosition + 10, {
             width: 190,
             align: 'right'
           });

        // Draw border around grand total box
        doc.strokeColor('#000')
           .rect(startX, yPosition, pageWidth, grandTotalBoxHeight)
           .stroke();

        // Add grand total in words
        const grandTotalInWords = convertToIndianWords(grandTotal);
        yPosition += grandTotalBoxHeight + 20;
        doc.fontSize(12)
           .text(`Total Amount in Words: Rupees ${grandTotalInWords} Only`, startX, yPosition, {
             width: pageWidth,
             align: 'left'
           });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tenders = await getTenders();
    
    if (tenders.length === 0) {
      return res.status(400).json({ error: 'No tenders available' });
    }

    const pdfBuffer = await generatePDF(tenders);
    
    // Clear tenders after generating PDF
    await clearTenders();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tenders.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
