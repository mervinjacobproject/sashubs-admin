
import React, { ReactNode } from 'react';
import Icon from 'src/@core/components/icon';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerComponentProps {
  anchor: Anchor;
  onOpen: () => void;
  buttonLabel: string;
  children: ReactNode;
  width?: string;
  tableHeader?:string[];
  title:string;
  tableData: string[][];
}

const DownLoadPdf: React.FC<DrawerComponentProps> = ({ tableData,tableHeader, title }) => {
  
  const downloadPdf = () => {
    const doc:any = new jsPDF();
    doc.text(title, 14, 16);

    doc.autoTable({
      startY: 20,
      head: [tableHeader],
      body: tableData,
    });
    doc.save('table.pdf');
  };

  return (
    <React.Fragment>      
        <Icon style={{cursor:'pointer'}} onClick={downloadPdf} color='red' icon="ant-design:file-pdf-twotone" width={20} height={20} />        
    </React.Fragment>
  );
};

export default DownLoadPdf;


// -----------: Note :----------

// These aare all the to paseed as params

// 1. let tableData  : any = [
//         ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
//         ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
//       ];

// 2. const tableHeader = ["Column 1", "Column 2", "Column 3"];

// 3. const title = "Your Table Title";
