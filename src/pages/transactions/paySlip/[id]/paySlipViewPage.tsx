// ** React Imports
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'
import PaySlipTable from './paySlipTable'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import 'jspdf-autotable'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'

const PaySlipView = () => {
  const router = useRouter()
  const { empId, Id } = router.query
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [paySlip, setPaySlip] = useState<any>([])
  const [allEmployee, setAllEmployee] = useState<any>([])
  const [totalAmt, setTotalAmt] = useState(0)


  const [employee, setEmployee] = useState([])

  const fetchData = async () => {
    const query = `
    query MyQuery {
      listDriver5AABS(filter: {DID: {eq: ${empId}}}) {
        items {
          DID 
          Email            
          FirstName  
          LastName  
          Mobile  
          Date
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
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDataId = () => {
    if (Id) {
      const query = `
      query MyQuery {
        listPaySlipDetails5AABS(filter: {PaySlipId: {eq: ${Id}}}) {
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
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setEmployee(res.data.data.listPaySlipDetails5AABS.items)
          setPaySlip(res.data.data.listPaySlipDetails5AABS.items)
        })
        .catch(err => {
          console.error('Error fetching data:', err)
        })
    }
  }

  useEffect(() => {
    fetchDataId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id])

  
  const formatCurrency = (amount:any) =>
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    
   
  const printData = () => {
    // Updated imageSource with correct slashes
    const imageSource = '/images/icons/project-icons/sev 1.png'
  
    const fromAddress = `
      <div class="col-6">
        <strong>From Address:</strong><br>
        Khushdeep Singh<br>
        91, MAREEBA WAY, CRAIGIEBURN<br>
        VICTORIA - 3064<br>
        Australia<br>
        Email: khushdeepsingh14721@gmail.com<br>
        Phone: 0448459767<br>
      </div>
    `
  
    const toAddress = allEmployee
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
  
    const tableRows = employee
      .map((row: any, index: any) => {
        return `<tr>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskDescription}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskQuty}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskUnitPrice}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskExtraAmt}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.TaskAmountAud}</td>
        </tr>`
      })
      .join('') 
  
    // Calculate the total amount
    const totalAmount = employee.reduce((sum: number, row: any) => sum + parseFloat(row.TaskAmountAud), 0).toFixed(2)
  
    // Add the Total Amount row
    const totalAmountRow = `
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
          padding: 19px;
          text-align: center;
        }
        .custom-table th {
          border-bottom: 1px solid #ddd;
        }
        .address-container {
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .address-head {
          padding-bottom: 20px;
          padding-top: 20px;
        }
        .size-content {
          display: flex;
          justify-content: start;
        }
        .address-head {
          padding-bottom: 30px;
          padding-top: 20px;
        }
      </style>
      
      <div class="row" style="">
        <div class="address-container">
          <div>
            <img src="${imageSource}" alt="Cross Image" />
            <h3 class="size-content">Pay Slip</h3>
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
             <title>Payslip</title>
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
  }
  

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pb: 4 }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Employee Details
            </Typography>
            <Divider sx={{ my: '0 !important' }} />
            <Box sx={{ pt: 4 }}>
              <div>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Employee Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {allEmployee[0]?.FirstName &&
                      allEmployee[0]?.LastName &&
                      allEmployee[0].FirstName + ' ' + allEmployee[0].LastName}
                  </Typography>{' '}
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Mobile:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {(allEmployee as { Mobile: string }[])[0]?.Mobile}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{allEmployee[0]?.Email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Date:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{allEmployee[0]?.Date}</Typography>
                </Box>
              </div>
            </Box>
          </CardContent>
          <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 4 }}>
          <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
            Employee Details
          </Typography>
          <Divider sx={{ my: '0 !important' }} />
          <PaySlipTable totalAmt={totalAmt} setTotalAmt={setTotalAmt} printData={printData} paySlipData={paySlip} fetchData={fetchData} id={Id} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaySlipView
