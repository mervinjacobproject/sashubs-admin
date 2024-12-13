// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  id: any | string | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
  data: any
}

const PreviewActions = ({ id, toggleSendInvoiceDrawer, toggleAddPaymentDrawer, data }: Props) => {
  
  const formatOrderDate = (orderdate: any) => {
    const Orderdate = new Date(orderdate);
    return `${Orderdate.getDate()}-${Orderdate.getMonth() + 1}-${Orderdate.getFullYear()}`;
  };

  // Function to create PDF document
  const createPDF = () => {
    const doc = new jsPDF();
    
    const addHeader = () => {
      const imgUrl = '/images/icons/project-icons/Groesen-logo.png';
      doc.addImage(imgUrl, 'PNG', 10, 10, 30, 30); // Larger logo size for branding
      doc.setFontSize(16);
      doc.setTextColor(41, 128, 185); // Brand color for text
      doc.text('Apurva Marketing Pvt. Ltd', 50, 15);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('3H, C2 C2 Road, Balarengapuram, Madurai', 50, 25);
      doc.text('Tamil Nadu, India | +91 99523 18427', 50, 30);
      doc.text('www.apurvamarketing.com', 50, 35);
      doc.line(10, 40, 200, 40); // Separator line
    };

    const addFooter = (pageNumber: number) => {
      doc.setFontSize(10);
      doc.line(10, 285, 200, 285); // Bottom separator
      doc.text('Thank you for your Purchase!', 10, 290);
      doc.text(`Page ${pageNumber}`, 190, 290);
    };

    // Call the header
    addHeader();

    // Main Content
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('INVOICE', 10, 50);

    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice ID: ${data.ID}`, 10, 60);
    doc.text(`Date: ${formatOrderDate(data.OrderDate)}`, 10, 70);

    // Customer Details
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('Invoice To:', 10, 90);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${data.CustomerDetails[0].CustomerName}`, 10, 100);
    doc.text(`${data.CustomerDetails[0].DoorNo}, ${data.CustomerDetails[0].Street}`, 10, 105);
    doc.text(`${data.CustomerDetails[0].Area}`, 10, 110);
    doc.text(`${data.CustomerDetails[0].CityName}, ${data.CustomerDetails[0].StateName}, ${data.CustomerDetails[0].CountryName}`, 10, 115);
    doc.text(`+91 ${data.CustomerDetails[0].PhoneNo}`, 10, 120);

    // Invoice Table
    if(data.OrderDetails.length > 0) {
      const invoiceBody = data.OrderDetails.map((item: any) => [
        item.ProductName,
        item.Qty,
        item.Rate,
        item.TaxableAmount,
        item.DiscountAmount,
        item.TaxAmount,
        item.NetAmount,
      ]);

      autoTable(doc, {
        startY: 130,
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10, cellPadding: 4 },
        head: [['Product Name', 'Qty', 'Rate (Rs)', 'Taxable Amt (Rs)', 'Discount Amt (Rs)', 'Tax Amt (Rs)', 'Net Amt (Rs)']],
        body: invoiceBody,
        // didDrawCell: (data) => {
        //   if (data.row.index === 4) {
        //     // Stop drawing more rows after the 5th row
        //     doc.addPage(); // Add a new page after the 5th row
        //   }
        // },
      });
    }

    // Totals Section
    const finalY = doc.lastAutoTable?.finalY || 130;
    const marginTop = 10;
    const initialY = finalY + 20;
    const labelX = 10;
    const valueX = 160;

    doc.setFontSize(12);
    doc.text(`Subtotal:`, labelX, initialY);
    doc.text(`Rs ${data.TaxableAmount}`, valueX, initialY);
       doc.text(`Tax Amt:`, labelX, initialY + marginTop);
    doc.text(`Rs ${data.TaxAmount}`, valueX, initialY + marginTop);
    
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(16);
    doc.text(`Total:`, labelX, initialY + marginTop * 2);
    doc.text(`Rs ${data.NetAmount}`, valueX, initialY + marginTop * 2);

    // Add Footer
    addFooter(1);

    return doc;
  };

  // Download invoice as PDF
  const downloadInvoice = () => {
    const doc = createPDF();
    doc.save(`Invoice_${data.ID}.pdf`);
  };

  // Print invoice
  const printInvoice = () => {
    const doc = createPDF();
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Open in new window for printing
    const newWindow:any = window.open(blobUrl);
    newWindow.onload = function () {
        setTimeout(() => {
            newWindow.print();
        }, 500); // Adjust the timeout duration if needed
    };
  };

  return (
    <Card>
      <CardContent>
        <Button fullWidth variant='contained' onClick={toggleSendInvoiceDrawer} sx={{ mb: 2, '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:send' />
          Send Invoice
        </Button>
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal' onClick={downloadInvoice}>
          Download
        </Button>
        <Button fullWidth sx={{ mb: 2 }} color='secondary' variant='tonal' onClick={printInvoice}>
          Print
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreviewActions;
