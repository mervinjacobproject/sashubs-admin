import React from 'react'
import { useState, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { Card, CircularProgress, Grid, Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ActionsDropdown from './jobWaitingDropdown'
import ActionsDropdown_invoice from './invoicestatusDropdown'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import Jobsteperform from 'src/pages/transactions/invoice/jobsteperform'
import { toast } from 'react-hot-toast'
import { a$ } from '@fullcalendar/core/internal-common'
import { CSVLink, CSVDownload } from 'react-csv'
import CustomTextField from 'src/@core/components/mui/text-field'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomChip from 'src/@core/components/mui/chip'
import JobCompleteDropdown from './jobCompleteDropdown'
import NotPaidInvoiceStatusDropdown from './notPaidInvoiceStatus'
import InvoiceNotpaidHeader from 'src/pages/apps/invoice/list/invoiceNotpaidHeader'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import InvoiceSteperForm from '../createInvoice/invoicesteperform'

interface CellType {
  row: InvoiceType
}

const defaultData = [
  {
    id: 1,
    S_No: '1',
    Created_Date: '2023-01-01',
    Date: '2023-01-02',
    JobId: '123',
    Customer: 'John Doe',
    Reference: 'Ref123',
    DropLocation: 'LocationA',
    Status: 'Waiting'
  },
  {
    id: 2,
    S_No: '2',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Status: 'Completed'
  },
  {
    id: 3,
    S_No: '3',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Status: 'Completed'
  },
  {
    id: 4,
    S_No: '4',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Status: 'Completed'
  },
  {
    id: 5,
    S_No: '5',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Status: 'waiting'
  }
]

const handleOpenDrawer = () => {
  // Handle other response statuses if needed
}

const JobCompleteTable = ({handlePaid,handleNotPaid,handledraft}:any) => {
  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  const [dropdownValues] = useState<string[]>(['Waiting'])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [Joblistcompleted, setJoblistCompleted] = React.useState<any>('')
  const [notpaidValue, setNotPaidValue] = React.useState<any>('')
  const [selectedRows, setSelectedRows] = React.useState<any>('')
  const [toEmail, setToEmail] = useState<any>('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [rowCount, setRowCount] = useState<number>(0)
  const [currentPageSize, setCurrentPageSize] = useState<any>(10)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const [pageSize, setPageSize] = useState<any>(10)
  const [modalOpenSend, setModalOpenSend] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [companyName, setcompanyName] = useState<any>('')
  const [pickupDate, setPickupDate] = useState('')
  const [customer, setcustomer] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [customerlist, setCustomerList] = useState<any>([])
  const [showMessage, setShowMessage] = useState(false)

  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () => setModalOpenSend(false)

  const [loading, setLoading] = useState(true)



  const handleSendButton = async () => {
    if (!toEmail) {
      setIsValidEmail(false)
      return
    }
    try {
      await handleSendConfirm()
    } catch (error) {
      toast.error('Error sending mail')
    }
  }

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleEmail = (e: any) => {
    const email = e.target.value
    setToEmail(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@,]+$/
    setIsValidEmail(emailRegex.test(email))
  }

  const handleCancelSend = () => {
    setModalOpenSend(false)
    setIsValidEmail(true)
    setToEmail('')
  }

  const selectRow = (selectedID: any) => {
    return Joblistcompleted.find((i: any) => i.ID === selectedID)
  }

  const handleSendClick = (id: any) => {
    handleModalSendOpen(true)
    const selectedRow = selectRow(id)
    if (selectedRow) {
      setSelectedRows(selectedRow)
    }
  }

  const handleSendEmail = (emp: any) => {
    const tempData: any = companyName?.find((itm: any) => itm.CId === emp)?.Email
    setToEmail(tempData)
  }


  const handleSendConfirm = async () => {
    try {
      const columns = [
        { header: 'Sl.no', dataKey: 'Sl.no' },
        { header: 'Date', dataKey: 'DateTime' },
        { header: 'Customer', dataKey: 'customer' },
        { header: 'InvoiceId', dataKey: 'InvoiceId' },
        { header: 'SubTotal', dataKey: 'SubTotal' },
        { header: 'Status', dataKey: 'Status' },
        { header: 'Draft', dataKey: 'Draft' }
      ]

      const rows = {
        'Sl.no': 1,
        DateTime: selectedRows.DateTime,
        customer: formatCustomer(selectedRows.Customer),
        InvoiceId: selectedRows.InvoiceId,
        SubTotal: `$${selectedRows.SubTotal}`,
        Status: selectedRows.Status === true ? 'Paid' : 'Not Paid',
        Draft: selectedRows.Draft === true ? 'Draft' : 'Invoice'
      }

      const pdf:any = new jsPDF()
      pdf.autoTable({ columns, body: [rows] })

      const pdfBlob = pdf.output('blob')

      const formData = new FormData()
      formData.append('file', pdfBlob, 'employee_designations.pdf')

      const apiUrl = `https://api.5aabtransport.com.au/api.php?moduletype=send_file&email=${encodeURIComponent(
        toEmail
      )}`
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('Mail sent Successfully')
        setToEmail('')
        setModalOpenSend(false)
      } else {
        toast.error('Error sending mail')
      }
    } catch (error) {
      toast.error('Error sending mail')
      // Handle any errors that occurred during the execution
      console.error('Error:', error)
    }
  }

  function formatCustomer(customerId: any) {
    const customer = customerlist.find((c: any) => c.CId === parseInt(customerId))
    return customer ? customer.CompanyName : ''
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteJobInvoice5AAB(input: {ID:${selectedRowId}}) {
        AdditionalCharge
        AdditionalChargePrice
        AdditionalChargeRate
        AssignTo
        Customer
        DateTime
        Description
        Draft
        DropLat
        DropLng
        DropLocation
        DueDate
        EmpQTY1
        EmpTotal
        FinalNetTotal
        ID
        IP
        InvoiceFrom
        InvoiceId
        JobIds
        KM
        JobsNew
        NetTotal
        Passup
        PickupDate
        PickupLat
        PickupLng
        PickupLocation
        PickupTime
        PriceCategory
        Status
        SubTotal
        Tax
        TaxId
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchData()
        handledraft()
        handleNotPaid()
        handlePaid()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const printData = async (customer: any, Id: any) => {
    // Define headers
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json',
    };
  
    try {
      // First GraphQL query
      const driverQuery = `
        query {
          getCustomer5AAB(CId: ${customer}) {
            Address1
            Address2
            CId
            CompanyName
            PostCode
          }
        }
      `;
  
      const driverRes = await ApiClient.post(`${AppSink}`, { query: driverQuery }, { headers });
      const driverData = driverRes.data.data.getCustomer5AAB;
  
      // Second GraphQL query
      const paySlipQuery = `
        query {
          listJobNewTask5AABS(filter: { JId: { eq: ${Id} } }) {
            items {
              Description
              Qty
              PerRate
              TotalRate
            }
          }
        }
      `;
  
      const paySlipRes = await ApiClient.post(`${AppSink}`, { query: paySlipQuery }, { headers });
      const paySlipData = paySlipRes.data.data.listJobNewTask5AABS.items;
  
      // Helper functions
      const formatCurrency = (amount: number) => amount.toFixed(2); // Replace with your currency formatting logic
  
      // Construct printable data
      const imageSource = '/images/icons/project-icons/sev 1.png';
  
      const fromAddress = `
        <div class="col-6">
         
         5AAB TRANSPORT<br>
         Unit 1 , 575 SOMMERVILLERD<br>
         SUNSHINE VIC 3020<br>
          Australia<br>
        T: 03 9364 8258<br>
        </div>
      `;


      const paymentAddressTo = `
      <div class="col-6">
    
        <strong>To Address:</strong><br>
       5AAB TRANSPORT<br>
       Unit 1 , 575 SOMMERVILLERD<br>
       SUNSHINE VIC 3020<br>
        Australia<br>
      T: 03 9364 8258<br>
      harry : 0422 623 777<br>
      </div>
    `;


    const paymentcustomerDetails = `
    <div>
      <strong>Customer:</strong>9,Tatterson Rd,Dandenong ,Victoria<br>
      <strong>Invoice Number:</strong>5AAB-00005675<br>
      <strong>Amount Enclosed:</strong><br>
      <br>Enter the amount you are paying above<br>
    
    </div>
  `;


      const invoiceDetails = `
      <div>
        <strong>Invoice Date:</strong> 2024-08-12<br>
        <strong>Invoice Number:</strong> INV-5AAB-00005675<br>
        <strong>Bank Account Details:</strong><br>
        Name: 5aab Transport Pty Ltd<br>
        BSB: 063188<br>
        Account number: 10300195<br>
        ABN Number: 61136541734<br>
      </div>
    `;

    
  
      const toAddress = `
        <div class="col-6">
          <strong>To Address:</strong><br>
          <span>${driverData.CompanyName}</span><br>
          <span>${driverData.Address1}</span><br>
          <span>${driverData.PostCode}</span><br>
          <span>Australia</span><br>
        </div>
      `;
  
  
      const tableHeader = `
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>GST</th>
        <th>Amount AUD</th>
      </tr>
    `;

  const tableRows = paySlipData.map((row: any, index: number) => `
      <tr>
        <td>${row.Description}</td>
        <td style="text-align: center;">${row.Qty}</td>
        <td style="text-align: center;">${formatCurrency(Number(row.PerRate))}</td>
        <td style="text-align: center;">10%</td>
        <td style="text-align: center;">${formatCurrency(Number(row.TotalRate))}</td>
      </tr>
    `).join('');

  // Calculate totals
  const subTotal = paySlipData.reduce((sum: number, row: any) => sum + parseFloat(row.TotalRate), 0).toFixed(2);
  const gstTotal = (parseFloat(subTotal) * 0.10).toFixed(2);
  const totalAmount = (parseFloat(subTotal) + parseFloat(gstTotal)).toFixed(2);

  const tableFooter = `
      <tr>
        <td colspan="4" style="text-align: right; padding: 10px;"><strong>Subtotal</strong></td>
        <td style="text-align: center;">${formatCurrency(Number(subTotal))}</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; padding: 10px;"><strong>GST (10%)</strong></td>
        <td style="text-align: center;">${formatCurrency(Number(gstTotal))}</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; padding: 10px;"><strong>Total AUD</strong></td>
        <td style="text-align: center;">${formatCurrency(Number(totalAmount))}</td>
      </tr>
    `;

    const BankDetails = `
    <div>
     <strong>BankDetails </strong><br>
      <strong>Bank Name:</strong> Commonwealth Bank<br>
      <strong>Branch Name / IFSC Code:</strong>Craigieburn /<br>
      <strong>Account Name:</strong> 5aab Transport<br>
      <strong>  Account number:</strong> 10300195<br>
    </div>
  `;


      const printableData = `
             <style>
              .custom-table {
                width: 100%;
                margin-top: 20px;
              }
              .custom-table th, .custom-table td {
                padding: 10px;
                text-align: center;
                border: 1px solid #ddd;
              }
              .address-container {
                display: flex;
                justify-content: space-between;
                padding-top: 20px;
              }
              .invoice-details {
                padding-top: 50px;
              }
            </style>
        <div class="row">
          <div class="address-container">
            <div>
              <img src="${imageSource}" alt="Cross Image" />
              <h3 class="size-content">Tax Invoice</h3>
            </div>
            <div>${fromAddress}</div>
             
          </div>
        </div>

         <div class="row">
          <div class="address-container">
            <div>
             
            
            </div>
           
               <div>${invoiceDetails}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="address-head">${toAddress}</div>
        </div>
        <table class="custom-table">
          ${tableHeader}
          ${tableRows}
          ${tableFooter}
            </table>

         <div class="row">
          <div class="invoice-details">
           <div> ${BankDetails}</div>
          </div>
        </div>
         <div class="row">
          <div class="invoice-details">
           
             
          </div>
        </div>
        <hr>
<strong>PAYMENT ADVICE </strong><br>
          <div class="row">
          <div class="address-container">
         
            <div>
           
            
                <div>${paymentAddressTo}</div>
            </div>
            <div>${paymentcustomerDetails}</div>
             
          </div>
        </div>
      
      `;
  
      const printWindow = window.open('', '_blank');
  
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Tax Invoice</title>
            </head>
            <body>
              <div id="pdf-container">${printableData}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      } else {
        console.error('Unable to open a new window. Please check your popup blocker settings.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // const printData = async (id: any) => {
  //   let jobData = [];
  //   let taskData = [];
  //   let additionalData = [];
  //   let workData = [];
  //   try {
  //     const query = `query MyQuery {
  //       listJobInvoice5AABS(filter: {ID: {eq: ${id}}}) {
  //         items {
  //           AdditionalCharge
  //           AdditionalChargePrice
  //           AdditionalChargeRate
  //           AssignTo
  //           Customer
  //           DateTime
  //           Description
  //           Draft
  //           DropLat
  //           DropLng
  //           DropLocation
  //           DueDate
  //           EmpTotal
  //           EmpQTY1
  //           FinalNetTotal
  //           ID
  //           IP
  //           InvoiceFrom
  //           InvoiceId
  //           JobsNew
  //           JobIds
  //           KM
  //           NetTotal
  //           Passup
  //           PickupDate
  //           PickupLat
  //           PickupLng
  //           PickupLocation
  //           PickupTime
  //           PriceCategory
  //           Status
  //           SubTotal
  //           Tax
  //           TaxId
  //         }
  //       }
  //       listJobNewTask5AABS(filter: {JId: {eq: ${id}}}) {
  //         items {
  //           Amount
  //           Description
  //           ID
  //           JobId
  //           JId
  //           PassupRate
  //           Passup
  //           PerRate
  //           PriceCategory
  //           Qty
  //           TotalRate
  //           Updated
  //         }
  //       }
  //       listInvoiceAdditionalCharge5AABS(filter: {InvoiceId: {eq: ${id}}}) {
  //         items {
  //           AdditionalChargeId
  //           Date
  //           ID
  //           InvoiceId
  //           JobId
  //           Value
  //         }
  //       }
  //       listJobNewInvoice5AABS(filter: {JId: {eq: ${id}}}) {
  //         items {
  //           AdditionChargeId
  //           Date
  //           Employee
  //           ID
  //           JId
  //           JobId
  //           SubTotal
  //           PayId
  //           Subject
  //           TaskAmountAud
  //           TaskDescription
  //           TaskExtraAmt
  //           TaskGST
  //           TaskQuty
  //           TaskUnitPrice
  //           TotalAud
  //           TotalGST
  //         }
  //       }
  //     }`
  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     };

  //     const res = await ApiClient.post(`${AppSink}`, { query }, { headers });
      
  //      jobData = res.data.data.listJobInvoice5AABS.items;
  //      taskData = res.data.data.listJobNewTask5AABS.items ;
  //      additionalData = res.data.data.listInvoiceAdditionalCharge5AABS.items ;
  //      workData = res.data.data.listJobNewInvoice5AABS.items ;


  //     const printData = {
  //       Invoice: {
  //         InvoiceId: jobData[0]?.JobIds || '',
  //         Customer: jobData[0]?.Customer || '',
  //         PickupDate: jobData[0]?.PickupDate || '',
  //         DueDate: jobData[0]?.DueDate || '',
  //         PickupTime: jobData[0]?.PickupTime || '',
  //         PickupLocation: jobData[0]?.PickupLocation || '',
  //         DropLocation: jobData[0]?.DropLocation || '',
  //         Kms: jobData[0]?.KM  || '',
  //         Status: jobData[0]?.Status === true ? 'Active' : jobData[0]?.Status === false ? 'Inactive' : ''
  //       },
  //       WorkDetails: workData.map((item: any) => ({
  //         Employee: item.task_employee || '',
  //         Description: item.Description || '',
  //         Quantity: item.task_qty || '',
  //         BasicRate: item.task_unitprice || '',
  //         ExtraCharge: item.task_extra_amt || '',
  //         Total: item.task_amount_aud || ''
  //       })),
  //       Tasks: taskData.map((item: any) => ({
  //         Description: item.Description || '',
  //         Quantity: item.Qty || '',
  //         Rates: item.PerRate || '',
  //         TotalAmount: item.Amount || ''
  //       })),
  //       AdditionalCharges: additionalData.map((item: any) => ({
  //         InvoiceId: item.InvoiceId.toString() || '',
  //         Name: item.AdditionalChargeId || '',
  //         Charge: item.Value.toString() || ''
  //       }))
  //     };
      
      
  
  //     const json = JSON.stringify([printData]);
  
  //     const response = await fetch(`${PrintUrl}/InvDet/Get` ,  {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: json
  //     });
  
  //     if (response.ok) {
  //       const data = await response.blob()
  //       const url = window.URL.createObjectURL(data)

  //       window.open(url)
  //     } else {
  //       console.error('Error:', response.status, response.statusText)
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else if (selectedMode === 'light') {
      return 'black'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else {
      return 'black'
    }
  }
  
  function formatNumber(number:any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      flex: 0.2,
     
      headerName: 'S.NO',
      sortable: false,
      renderCell: params =>
        params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
    },

    {
      flex: 0.3,
      minWidth: 30,
      field: 'DateTime',
      headerName: 'Date'
    },
    {
      flex: 0.4,
      minWidth: 20,
      field: 'InvoiceId',
      headerName: 'Invoice Id',

      renderCell: ({ row }) => (
        // <span> {row.invoiceid}</span>
        <CustomChip rounded size='small' skin='light' color={'success'} label={row.InvoiceId} />
      )
    },
   

    {
      field: 'customer',
      headerName: 'Customer',
      flex: 0.3,
      minWidth: 30,
     
      renderCell: (params: any) => {
        const customerId = parseInt(params.row.Customer);
        const customers = customerlist.find((c: any) => c.CId === customerId);
        return customers ? customers.CompanyName : ""
      }
    },
    {
      flex: 0.3,
      minWidth: 30,
      field: 'FinalNetTotal',
      headerName: 'Amount',
      renderCell: ({ row }) => (
        <span>{row.FinalNetTotal ? `$${formatNumber(row.FinalNetTotal)}` : ''}</span>
      )
    },

    {
      flex: 0.4,
      minWidth: 30,
      field: 'Status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <JobCompleteDropdown
          fetchData={fetchData}
          value={row.Status}
          handledraft={handledraft} handleNotPaid={handleNotPaid} handlePaid={handlePaid} 
          rowId={row.ID}
        />
      )
    },

  {
      field: 'Draft',
      minWidth: 30,
      headerName: 'Invoice Status',
      flex: 0.4,
      renderCell: ({ row }: any) => (
        <>
        {row.Draft === false ? (
        <NotPaidInvoiceStatusDropdown
         fetchData={fetchData}
          value={row.Draft}
          rowId={row.ID}
          handledraft={handledraft} handleNotPaid={handleNotPaid} handlePaid={handlePaid} 
        />
          ) : (
           
              <Button
                sx={{
                  padding: '5px 25px 5px 25px',
                  borderRadius: '3px',
                  backgroundColor: '#776cff !important',
                  color: 'white !important',
                  fontWeight: '500',
                  fontSize: '0.81em'
                }}
               
              >
                Invoice
              </Button>
           
          )}
        </>
      )
    },
    {
      flex: 0.5,
      minWidth: 30,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
           {row.InvoiceFrom === "JOB" ?
          <DrawerComponent
            anchor='right'
            onOpen={handleOpenDrawer}
            buttonLabel='EDit'
            // initiallyOpen={isInitiallyOpen}
          >
           <InvoiceSteperForm JobIds={row.ID} customer={row.Customer} separateId={row.JobIds} />
          </DrawerComponent>
          :
          <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='EDit'>
            <Jobsteperform geteditId={row.ID} fetchData={fetchData} />
          </DrawerComponent>
        }
          <Tooltip title='Delete'>
          <IconButton onClick={() =>{ setShowMessage(false); handleDelete(row.ID) }}>
              <Icon icon='ic:baseline-delete' /> {/* Assuming you have a delete icon */}
            </IconButton>
          </Tooltip>

          <Tooltip title='Print'>
            <div>
            <IconButton onClick={() => printData(row.Customer,row.ID)}>
                <Icon icon='ion:print' />
              </IconButton>
            </div>
          </Tooltip>

           {/* <Tooltip title='Mail'>
              <div>
                <IconButton
                  onClick={() => {
                    handleSendClick(row.ID)
                    handleSendEmail(row.Customer)
                  }}
                  disabled={selectedRows.length > 0}
                >
                  <Icon icon='icon-park-outline:send-email' />
                </IconButton>
              </div>
            </Tooltip> */}
        </>
      )
    }
  ]


  const updateDraftStatus = (val: string, rowId: number) => {
    // Handle other response statuses if needed
  }



  const fetchCustomer = async () => {
    try {
      const query = `
        query MyQuery {
          listCustomer5AABS {
            items {
              Address1
              Address2
              CId
              CompanyPanNo
              CompanyName
              ContactPerson
              Country
              CusGroup
              CustomerId
              Date
              Email
              FirstName
              IP
              InsertedBy
              LandLine
              LastName
              Password
              Mobile
              Photo
              PostCode
              State
              Status
              Suburb
              Title
              UpdatedAt
              UpdatedBy
            }
          }
        }
        `;
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers });
      const items = res.data.data.listCustomer5AABS.items;
      setCustomerList(items);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchCustomer()
    fetchCompanyyName()
  }, []);


  const fetchCompanyyName = async () => {
    const query = `query MyQuery {
      listCustomer5AABS {
        items {
          CId
          CompanyName
          FirstName
          LastName
          Email
        }
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setcompanyName(res.data.data.listCustomer5AABS.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchData = async () => {
    let filterString = `{Status: {eq: false}`

    if (customer) {
      filterString += `, Customer: {eq: ${customer}}`
    }
   
    if (pickupDate) {
      filterString += `, DateTime: {contains: "${pickupDate}"}`
    }
    filterString += '}'
    
    const query = `
    query MyQuery {
      listJobInvoice5AABS(filter:  ${filterString} ) {
        items {
          AdditionalCharge
          AdditionalChargePrice
          AdditionalChargeRate
          AssignTo
          Customer
          DateTime
          Description
          Draft
          DropLat
          DropLng
          DropLocation
          DueDate
          EmpQTY1
          EmpTotal
          FinalNetTotal
          ID
          IP
          InvoiceFrom
          InvoiceId
          JobIds
          JobsNew
          KM
          NetTotal
          Passup
          PickupDate
          PickupLat
          PickupLng
          PickupLocation
          PickupTime
          PriceCategory
          Status
          SubTotal
          Tax
          TaxId
        }
      }
    }


  `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        setJoblistCompleted(res.data.data.listJobInvoice5AABS.items)
        setTotalCount(res.data.data.listJobInvoice5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch(error => {
        setIsTableLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel,pickupDate, customer,])






  const columns: GridColDef[] = [...defaultColumns]

  return (
    <>
      <DatePickerWrapper>
        <Grid item xs={12}>
          <InvoiceNotpaidHeader
            companyName={companyName}
            setShowMessage={setShowMessage}
            showMessage={showMessage}
            setcustomer={setcustomer}
            setPickupDate={setPickupDate}
            fetchData={fetchData}
           
          />
        </Grid>

        <Card>
        
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              getRowId={(row) => row.ID}
              rows={Joblistcompleted}
              rowCount={totalCount}
              loading={isTableLoading}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={e =>
                setPaginationModel({
                  ...e
                })
              }
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
        
        </Card>
      </DatePickerWrapper>

      <CustomModal
        open={modalOpenSend}
        onClose={handleModalCloseSend}
        onOpen={handleModalSendOpen}
        buttonText=''
        buttonOpenText=''
      >
        <CustomTextField
          label={
            <div>
              <span className='status' style={{ color: getColor() }}>
                To :
              </span>
            </div>
          }
          variant='outlined'
          fullWidth
          margin='normal'
          defaultValue={toEmail}
          onChange={handleEmail}
          error={!isValidEmail}
          helperText={!isValidEmail && 'Please enter a valid email address'}
        />

        <div className='delete-popup' style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#808080',
              '&:hover': {
                background: '#808080',
                color: 'white'
              }
            }}
            onClick={handleCancelSend}
          >
            Cancel
          </Button>

          <Button
            variant='contained'
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            onClick={handleSendButton}
          >
            {' '}
            <Icon style={{ marginRight: '5px' }} icon='cil:send' />
            Send
          </Button>
        </div>
      </CustomModal>

      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p
          style={{
            color: getColor()
          }}
        >
          Are you sure you want to delete?
        </p>

        <div className='delete-popup' style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#808080',
              '&:hover': {
                background: '#808080',
                color: 'white'
              }
            }}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>

          <Button
            variant='contained'
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            onClick={handleDeleteConfirm}
          >
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default JobCompleteTable
