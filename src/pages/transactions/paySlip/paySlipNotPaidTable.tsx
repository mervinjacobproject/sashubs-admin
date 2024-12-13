import React, { useEffect } from 'react'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Typography from '@mui/material/Typography'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import Link from 'next/link'
import { Button } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import NotpaidStatusDropdown from './notpaidStatusDropdown'
import NotPaidDraftDropdown from './notpaidDraftDropDown'
import { toast } from 'react-hot-toast'
import { Tooltip } from '@mui/material'
import PaySlipNotpaidHeader from 'src/pages/apps/invoice/list/payslipNotpaid'
import AppSink from 'src/commonExports/AppSink'
import CustomTextField from 'src/@core/components/mui/text-field'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import PrintUrl from 'src/commonExports/printUrl'

const PaySlipNotPaidTable = ({handledraft,handlePaid,handleNotPaid}:any) => {
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [allDate, setAllDate] = useState('')
  const [allEmpName, setAllEmpName] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rideData, setRideData] = useState([])
  const [allEmployee, setAllEmployee] = useState([])
  const [stateValue, setStateValue] = useState<any>([])
  const [toEmail, setToEmail] = useState<any>('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [modalOpenSend, setModalOpenSend] = useState(false)

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)
  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () => setModalOpenSend(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deletePaySlip5AAB(input: {ID: ${selectedRowId}}) {
        Date
        Draft
        DateTime
        Employee
        ID
        IP
        Status
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchData()
        handledraft()
        handlePaid()
        handleNotPaid()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const fetchEmpName = async () => {
    const query = `query MyQuery {
      listDriver5AABS {
        items {
          DID
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
      setStateValue(res.data.data.listDriver5AABS.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchEmpName()
  }, [])

  const fetchEmp = async () => {
    const query = `query MyQuery {
      listDriver5AABS {
        items {
          Address1
          Address2
          AppAccess
          Country
          DID
          DOB
          DOJ
          DOT
          Date
          Designation
          DocumentExpiryDate
          DocumentName
          DriverID
          Email
          EmpGroup
          FirstName
          IP
          InsertedBy
          LandLine
          LastName
          License
          LicenseNo
          Mobile
          Password
          Photo
          PostCode
          SalaryDocuments
          SalaryFrequency
          SalaryFromKM
          SalaryPerHour
          SalaryPerSQM
          SalaryPerWeight
          State
          Status
          Title
          SubURB
          UpdatedAt
          UpdatedBy
          UserName
        }
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setAllEmployee(res.data.data.listDriver5AABS.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchEmp()
  }, [])

  const fetchData = async () => {
    try {
      let filterString = `{Status: {eq: false}`

      if (allDate) {
        filterString += `, Date: {eq: "${allDate}"}`
      }
      if (allEmpName) {
        filterString += `, Employee: {eq: ${allEmpName}}`
      }
      filterString += '}'

      const query = `query MyQuery {
        listPaySlip5AABS(filter: ${filterString}) {
          totalCount
          items {
            Date
            DateTime
            Draft
            Employee
            ID
            IP
            Status
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setRideData(response.data.data.listPaySlip5AABS.items)
      setTotalCount(response.data.data.listPaySlip5AABS.items.length)
      setIsTableLoading(false)
    } catch (error) {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDate, allEmpName])

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

  const handleUpdate = (rowId: any, newValue: string) => {
    // Update the value for the row with ID rowId
  }

  const selectRow = (selectedID: any) => {
    return rideData.find((i: any) => i.ID === selectedID)
  }

  const handleSendDefault = (emp: any) => {
    const tempData: any = stateValue?.find((itm: any) => itm.DID === emp)?.Email
    setToEmail(tempData)
  }

  const handleSendClick = (id: any, employee: any) => {
    handleModalSendOpen(true)
    handleSendDefault(employee)
    const selectedRow = selectRow(id)
    if (selectedRow) {
      setSelectedRows(selectedRow)
    }
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

  const handleSendButton = async () => {
    try {
      await handleSendEmail(selectedRows.ID, selectedRows.Employee, toEmail.split(','))
    } catch (error) {
      toast.error('Error sending mail')
    }
  }

  function formatCustomer(countryId: any) {
    const employee: any = allEmployee.find((c: any) => c.DID === parseInt(countryId))
    return employee ? employee.FirstName + ' ' + employee.LastName : ''
  }


  const printData = async (empId: any, Id: any,date:any) => {
    // Define your headers
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json',
    }
  
    try {
      // First GraphQL query
      const driverQuery = `
        query MyQuery {
          listDriver5AABS(filter: { DID: { eq: ${empId} } }) {
            items {
              DID 
              Email            
              FirstName  
              LastName  
              Mobile  
              Date
            }
          }
        }
      `
  
      const driverRes = await ApiClient.post(`${AppSink}`, { query: driverQuery }, { headers })
      const driverData = driverRes.data.data.listDriver5AABS.items
      // setAllNewData(driverData)
  
      // Second GraphQL query
      const paySlipQuery = `
        query MyQuery {
          listPaySlipDetails5AABS(filter: { PaySlipId: { eq: ${Id} } }) {
            items {
              AdditionChargeId
              Date
              Employee
              ID
              InvoiceId
              JobId
              PaidAmt
              PayCalculationId
              PaySlipId
              PayableAmt
              Status
              SubTotal
              Subject
              TaskAmountAud
              TaskDescription
              TaskExtraAmt
              TaskGST
              TaskUnitPrice
              TotAud
              TotGST
              TaskQuty
            }
          }
        }
      `
  
      const paySlipRes = await ApiClient.post(`${AppSink}`, { query: paySlipQuery }, { headers })
      const paySlipData = paySlipRes.data.data.listPaySlipDetails5AABS.items
      // setalltablevalue(paySlipData)
  
      // Construct the printable data
      const imageSource = '/images/icons/project-icons/sev 1.png'
  
      const fromAddress = `
        <div class="col-6">
          <strong>From Address:</strong><br>
         5AAB TRANSPORT<br>
       Unit 1 , 575, SOMMERVILLE<br>
         RD , SUNSHINE VIC - 3064<br>
          Australia<br>
          T: 03 9364 8258<br>
        </div>
      `
  
      const toAddress = driverData
        .map((item: any) => {
          return `
            <div class="col-6">
              <strong>To Address:</strong><br>
              <span>${item.FirstName}</span><br>
              <span>${item.Email}</span><br>
              <span>${item.Mobile}</span><br>
              <span>${item.Date}</span><br>
            </div>
          `
        })
        .join('')
  
      const tableHeader =
        '<tr style="text-align: center;"><th>S.No</th><th>Description</th><th>Quantity</th><th>Basic Rate</th><th>Extra Charge</th><th>Amount AUD</th></tr>'
  
      const tableRows = paySlipData
        .map((row: any, index: number) => {
          return `<tr>
            <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
            <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskDescription}</td>
            <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskQuty}</td>
            <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskUnitPrice}</td>
            <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskExtraAmt}</td>
            <td style="text-align: center; border-bottom: 1px solid #ddd;"> ${formatCurrencydetail(Number(row.TaskAmountAud))}</td>
          </tr>`
        })
        .join('')
  
      // Calculate the total amount
      const totalAmount = paySlipData
        .reduce((sum: number, row: any) => sum + parseFloat(row.TaskAmountAud), 0)
        .toFixed(2)
  
      // Add the Total Amount row
      const totalAmountRow = `
        <tr>
          <td colspan="5" style="text-align: right; padding: 19px; border-top: 1px solid #ddd;"><strong>SubTotal:</strong></td>
          <td style="text-align: center; padding: 19px; border-top: 1px solid #ddd;"><strong>${formatCurrency(Number(totalAmount))}</strong></td>
        </tr>
          <tr>
          <td colspan="5" style="text-align: right; padding: 19px; border-top: 1px solid #ddd;"><strong>Total AUD:</strong></td>
          <td style="text-align: center; padding: 19px; border-top: 1px solid #ddd;"><strong>${formatCurrency(Number(totalAmount))}</strong></td>
        </tr>
      `
  
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
              <h3 class="size-content">Recipient Created Tax Invoice(RCTI)</h3>
            </div>
              <div>
             
              <h4>RCTI DATE</h4>
              <P>${date}</P>
            </div>
            <div>${fromAddress}</div>
          </div>
        </div>
    
        <div class="col-6">
          <div class="address-head">${toAddress}</div>
        </div>
        
        <table class="custom-table">
          ${tableHeader}
          ${tableRows}
          ${totalAmountRow} <!-- Add the total amount row here -->
        </table>
      `
  
      const printWindow = window.open('', '_blank')
  
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
               <title>Recipient Created Tax Invoice(RCTI)</title>
              <!-- Add Bootstrap CDN link here if not already included in your project -->
            </head>
            <body>
              <div id="pdf-container">${printableData}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      } else {
        console.error('Unable to open a new window. Please check your popup blocker settings.')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const formatCurrency = (amount:any) =>
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatCurrencydetail = (amount:any) =>
      amount.toLocaleString('en-AU', {
  
        currency: 'AUD',  
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
   



  const handleSendEmail = async (id: any, empId: any, toEmails: any) => {
    let roleData = []
    let employeeData = []

    try {
      const query = `{
            listPaySlipDetails5AABS(filter: {PaySlipId: {eq: ${id}}}) {
                items {
                    Date
                    Employee
                    PaySlipId
                    TaskAmountAud
                    TaskDescription
                    TaskQuty
                    TaskUnitPrice
                    TaskExtraAmt
                }
            }
            listDriver5AABS(filter: {DID: {eq: ${empId}}}) {
                items {
                    Address1
                    AppAccess
                    Address2
                    Country
                    DID
                    DOB
                    DOT
                    DOJ
                    Date
                    Deleted
                    Designation
                    DocumentExpiryDate
                    DocumentName
                    DriverID
                    Email
                    EmpGroup
                    FirstName
                    IP
                    InsertedBy
                    LandLine
                    LastName
                    License
                    LicenseNo
                    Mobile
                    Password
                    Photo
                    PostCode
                    SalaryDocuments
                    SalaryFrequency
                    SalaryFromKM
                    SalaryPerHour
                    SalaryPerSQM
                    SalaryPerWeight
                    State
                    Status
                    SubURB
                    Title
                    UpdatedAt
                    UpdatedBy
                    UserName
                }
            }
        }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      employeeData = res.data.data.listPaySlipDetails5AABS.items
      roleData = res.data.data.listDriver5AABS.items
    } catch (error) {
      console.error('Error fetching data from API:', error)
      toast.error('Error fetching data from API')
      setModalOpenSend(false)
      return
    }

    if (employeeData.length === 0 || roleData.length === 0) {
      console.error('No data fetched from API')
      toast.error('No data fetched from API')
      return
    }

    const rows = [
      {
        PersonDet: {
          Name: roleData[0].FirstName || '',
          Address: roleData[0].Address1 || '',
          Country: roleData[0].State || '',
          Email: roleData[0].Email || '',
          PhoneNumber: roleData[0].Mobile || ''
        },
        PricingDet: [
          {
            Description: employeeData[0].TaskDescription || '',
            BasicRate: employeeData[0].TaskUnitPrice || '',
            Quantity: employeeData[0].TaskQuty || '',
            ExtraCharge: employeeData[0].TaskExtraAmt || '',
            AmountAUD: employeeData[0].TaskAmountAud || ''
          }
        ]
      }
    ]

    const json = JSON.stringify([rows])

    try {
      const response = await fetch(`${PrintUrl}/TaxInv/Get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })

      if (!response.ok) {
        throw new Error(`Failed to send mail.`)
      }

      const pdf: any = new jsPDF()
      pdf.autoTable({ columns, body: [rows] })
      const pdfBlob = pdf.output('blob')

      const formData = new FormData()
      formData.append('file', pdfBlob, 'employee_designations.pdf')

      const emailList = toEmails.join(',')

      const apiUrl = `https://api.5aabtransport.com.au/api.php?moduletype=send_file&email=${encodeURIComponent(
        emailList
      )}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      })

      toast.success('Mails sent Successfully')
      setModalOpenSend(false)
      setToEmail('')
    } catch (error) {
      toast.error('Error sending mail')
      console.error('Error sending mail:', error)
      setModalOpenSend(false)
    }
  }

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.3,
      field: 'Date',
      headerName: 'Date',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.Date}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'Employee',
      headerName: 'Employee',
      renderCell: (params: any) => {
        const countryId = params.row.Employee
        const employee: any = allEmployee?.find((employee: any) => employee.DID === countryId)
        return employee ? employee.FirstName + ' ' + employee.LastName : ''
      }
    },
    {
      flex: 0.3,
      field: 'Status',
      headerName: 'Status',
      sortable: false,
      renderCell: ({ row }: any) => {
        const defaultStatus = row.Status === true ? 'Paid' : 'Not Paid'
        return (
          <>
            <NotpaidStatusDropdown
              fetchData={fetchData}
              handledraft={handledraft}
              handleNotPaid={handleNotPaid}
              handlePaid={handlePaid}
              rowId={row.ID}
              defaultValue={defaultStatus}
              onUpdate={newValue => handleUpdate(row.ID, newValue)}
            />
          </>
        )
      }
    },
    // {
    //   flex: 0.3,
    //   field: 'Draft',
    //   headerName: 'Draft',
    //   sortable: false,
    //   renderCell: ({ row }: any) => {
    //     const defaultDraft = row.Draft === 1 ? 'Draft' : 'PaySlip'
    //     return (
    //       <>
    //         <NotPaidDraftDropdown fetchData={fetchData} rowId={row.ID} defaultVal={defaultDraft} />
    //       </>
    //     )
    //   }
    // }

    {
      field: 'Draft',
      headerName: 'Draft',
      flex: 0.3,
      renderCell: ({ row }: any) => (
        <>
          {row.Draft === 1 ? (
            <NotPaidDraftDropdown  handledraft={handledraft}
            handleNotPaid={handleNotPaid}
            handlePaid={handlePaid} fetchData={fetchData} rowId={row.ID} defaultVal={'Draft'} />
          ) : (
            <Button
              sx={{
                padding: '5px 25px 5px 25px',
                borderRadius: '3px',
                backgroundColor: '#dff7e9 !important',
                color: '#28c76f !important',
                fontWeight: '500',
                fontSize: '0.81em'
              }}
            >
              Payslip
            </Button>
          )}
        </>
      )
    }
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.3,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <Tooltip title='View'>
            <Link href={`/transactions/payslip/details?empId=${row.Employee}&Id=${row.ID}`}>
              <IconButton sx={{ color: '#8e8c96' }}>
                <Icon icon='ion:eye' />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDelete(row.ID)}>
              <Icon icon='ic:baseline-delete' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Print'>
          <IconButton onClick={() => printData(row.Employee,row.ID,row.Date)}>
              <Icon icon='ion:print' />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]
  return (
    <>
      <DatePickerWrapper>
        <Card>
          <PaySlipNotpaidHeader
            setSelectedRows={setSelectedRows}
            stateValue={stateValue}
            setAllEmpName={setAllEmpName}
            setAllDate={setAllDate}
          />
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rowCount={totalCount}
            getRowId={row => row.ID}
            rows={rideData}
            loading={isTableLoading}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onRowSelectionModelChange={(rows: any) => setSelectedRows(rows)}
            onPaginationModelChange={e =>
              setPaginationModel({
                ...e
              })
            }
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
                To:
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
                background: '#0d3562',
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
        <Typography
          style={{
            color: getColor()
          }}
        >
          Are you sure you want to delete?
        </Typography>

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
export default PaySlipNotPaidTable
