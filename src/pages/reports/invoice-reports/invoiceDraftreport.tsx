import React from 'react'
import { useState, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { Card, CircularProgress, Grid, Tooltip, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


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

import InvoiceDraftHeader from 'src/pages/apps/invoice/list/invoiceDraftTableHeader'
import { rows } from 'src/@fake-db/table/static-data'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import InvoiceDraftReportHeader from './reportdraftheader'

interface CellType {
  row: InvoiceType
}

const handleOpenDrawer = () => {
  // Handle other response statuses if needed
}

const InvoiceDraftReports = (props: any) => {

  const [geteditId, setgeteditId] = React.useState<any>('')
  const [dropdownValues] = useState<string[]>(['Waiting'])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [selectedRows, setSelectedRows] = React.useState<any>('')
  const [draftValue, setDraftValue] = React.useState<any>('')
  const [Joblist, setJoblist] = React.useState<any>('')
  const [toEmail, setToEmail] = useState<any>('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rowCount, setRowCount] = useState<number>(0)
  const [currentPageSize, setCurrentPageSize] = useState<any>(10)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [pageSize, setPageSize] = useState<any>(10)
  const [totalCount, setTotalCount] = useState(0)
  const [modalOpenSend, setModalOpenSend] = useState(false)
  const [companyName, setcompanyName] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [customer, setcustomer] = useState('')
  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () => setModalOpenSend(false)
  const [showMessage, setShowMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customerlist, setCustomerList] = useState<any>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleSendClick = () => {
    handleModalSendOpen(true)
  }

  const handleCancelSend = () => {
    setModalOpenSend(false)
  }

  const handlesendbutton = async () => {
    try {

      toast.success('Mail sent successfully')
    } catch (error) {
      toast.error('Error sending mail')
    } finally {
      setModalOpenSend(false)
    }
  }

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
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
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }



  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }


  const printData = async (id: any) => {
    let jobData = [];
    let taskData = [];
    let additionalData = [];
    let workData = [];
    try {
      const query = `query MyQuery {
        listJobInvoice5AABS(filter: {ID: {eq: ${id}}}) {
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
            EmpTotal
            EmpQTY1
            FinalNetTotal
            ID
            IP
            InvoiceFrom
            InvoiceId
            JobsNew
            JobIds
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
        listJobNewTask5AABS(filter: {JId: {eq: ${id}}}) {
          items {
            Amount
            Description
            ID
            JobId
            JId
            PassupRate
            Passup
            PerRate
            PriceCategory
            Qty
            TotalRate
            Updated
          }
        }
        listInvoiceAdditionalCharge5AABS(filter: {InvoiceId: {eq: ${id}}}) {
          items {
            AdditionalChargeId
            Date
            ID
            InvoiceId
            JobId
            Value
          }
        }
        listJobNewInvoice5AABS(filter: {JId: {eq: ${id}}}) {
          items {
            AdditionChargeId
            Date
            Employee
            ID
            JId
            JobId
            SubTotal
            PayId
            Subject
            TaskAmountAud
            TaskDescription
            TaskExtraAmt
            TaskGST
            TaskQuty
            TaskUnitPrice
            TotalAud
            TotalGST
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };

      const res = await ApiClient.post(`${AppSink}`, { query }, { headers });
      
       jobData = res.data.data.listJobInvoice5AABS.items;
       taskData = res.data.data.listJobNewTask5AABS.items ;
       additionalData = res.data.data.listInvoiceAdditionalCharge5AABS.items ;
       workData = res.data.data.listJobNewInvoice5AABS.items ;


      const printData = {
        Invoice: {
          InvoiceId: jobData[0]?.JobIds || '',
          Customer: jobData[0]?.Customer || '',
          PickupDate: jobData[0]?.PickupDate || '',
          DueDate: jobData[0]?.DueDate || '',
          PickupTime: jobData[0]?.PickupTime || '',
          PickupLocation: jobData[0]?.PickupLocation || '',
          DropLocation: jobData[0]?.DropLocation || '',
          Kms: jobData[0]?.KM  || '',
          Status: jobData[0]?.Status === true ? 'Active' : jobData[0]?.Status === false ? 'Inactive' : ''
        },
        WorkDetails: workData.map((item: any) => ({
          Employee: item.task_employee || '',
          Description: item.Description || '',
          Quantity: item.task_qty || '',
          BasicRate: item.task_unitprice || '',
          ExtraCharge: item.task_extra_amt || '',
          Total: item.task_amount_aud || ''
        })),
        Tasks: taskData.map((item: any) => ({
          Description: item.Description || '',
          Quantity: item.Qty || '',
          Rates: item.PerRate || '',
          TotalAmount: item.Amount || ''
        })),
        AdditionalCharges: additionalData.map((item: any) => ({
          InvoiceId: item.InvoiceId.toString() || '',
          Name: item.AdditionalChargeId || '',
          Charge: item.Value.toString() || ''
        }))
      };
      
      
  
      const json = JSON.stringify([printData]);
  
      const response = await fetch(`${PrintUrl}/InvDet/Get` ,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      });
  
      if (response.ok) {
        const data = await response.blob();
        const url = window.URL.createObjectURL(data);
        
        setTimeout(() => {
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      
      field: 'DateTime',
      headerName: 'Date'
    },
    {
      flex: 0.3,
    
      field: 'InvoiceId',
      headerName: 'Invoice Id',
      renderCell: ({ row }) => <CustomChip rounded size='small' skin='light' color={'success'} label={row.InvoiceId} />
    },
  

    {
      field: 'customer',
      headerName: 'Customer',
      flex: 0.3,
     
      renderCell: (params: any) => {
        const customerId = parseInt(params.row.Customer);
        const customers = customerlist.find((c: any) => c.CId === customerId);

        return customers ? customers.CompanyName : ""
      }
    },
    {
      flex: 0.3,
      field: 'SubTotal',
      headerName: 'Amount',
      renderCell: ({ row }) => (
        <span>{row.SubTotal ? `$${formatNumber(row.SubTotal)}` : ''}</span>
      )
    },
    
   


    {
      field: 'status',
      headerName: 'Status',
      flex: 0.4,
      renderCell: ({ row }: any) => {
        return (
          <Button
            sx={{
              padding: '5px 30px 5px 30px',
              width: '8px',
              borderRadius: '3px',
              cursor: 'initial',
              backgroundColor:
                row.Status === true ? '#dff7e9 !important' : row.Status === false ? '#f2f2f3 !important' : '',
              color: row.Status === true ? '#28c76f !important' : row.Status === false ? '#a8aaae !important' : '',
              fontWeight: '500',
              fontSize: row.Status === false ? '0.81em' : '0.81em'
            }}
          >
            {row.Status === true ? 'Paid' : row.Status === false ? 'NotPaid' : ''}
          </Button>
        )
      }
    },
    {
      field: 'draft',
      headerName: 'Invoice Status',
      flex: 0.4,
      renderCell: ({ row }: any) => {
        return (
          <Button
            sx={{
              padding: '5px 30px 5px 30px',
              width: '8px',
              borderRadius: '3px',
              cursor: 'initial',
              backgroundColor:
              row.Draft === true ? '#776cff !important' : row.Draft === false ? '#0d3562 !important' : '',
              color: row.Draft === true ? 'white !important' : row.Draft === false ? 'white !important' : '',
              fontWeight: '500',
              fontSize: row.Draft === false ? '0.81em' : '0.81em'
            }}
          >
            {row.Draft === true ? 'Invoice' : row.Draft === false ? 'Draft' : ''}
          </Button>
        )
      }
    }
  
  ]
  

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
    let filterString = `{Draft: {eq: false}`

    if (customer) {
      filterString += `, Customer: {eq: ${customer}}`
    }
   
    if (pickupDate) {
      filterString += `, DateTime: {eq: "${pickupDate}"}`
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
        setJoblist(res.data.data.listJobInvoice5AABS.items)
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
      <Head>
        <title>Invoice - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <DatePickerWrapper>
        <Grid item xs={12}>
          <InvoiceDraftReportHeader
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
            
              rowCount={totalCount}
              loading={isTableLoading}
              rows={Joblist}
              getRowId={(row) => row.ID}
              columns={columns}
              
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
             
              
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
        
        </Card>
      </DatePickerWrapper>

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



export default InvoiceDraftReports
