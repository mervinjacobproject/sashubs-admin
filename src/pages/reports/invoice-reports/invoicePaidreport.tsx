import React from 'react'
import { useState, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { Card, CircularProgress, Grid, Tooltip } from '@mui/material'
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

import InvlicePaidHeader from 'src/pages/apps/invoice/list/invoicePaidHeader'

import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import InvlicePaidReportHeader from './reportpaidHeader'

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

const InvoicePaidReport = (props: any) => {
  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  const [Invoicelist, setInvoicelist] = React.useState<any>('')
  const [selectedRows, setSelectedRows] = React.useState<any>('')
  const [rowCount, setRowCount] = useState<number>(0)
  const [currentPageSize, setCurrentPageSize] = useState<any>(10)
  const [paidValue, setPaidValue] = React.useState<any>('')
  const [dropdownValues] = useState<string[]>(['Waiting'])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })


  const [totalCount, setTotalCount] = useState(0)
  const [companyName, setcompanyName] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [customer, setcustomer] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [customerlist, setCustomerList] = useState<any>([])
  const [showMessage, setShowMessage] = useState(false)

  const [toEmail, setToEmail] = useState<any>('')

  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const [modalOpenSend, setModalOpenSend] = useState(false)

  const [pageSize, setPageSize] = useState<any>(10)

  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () => setModalOpenSend(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.title = 'Invoice - 5aab'
    return () => {
      document.title = '5aab'
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


  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

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
      minWidth: 10,
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
      minWidth: 30,
      field: 'InvoiceId',
      headerName: 'Invoice Id',
      align: 'center',
      renderCell: ({ row }) => <CustomChip rounded size='small' skin='light' color={'success'} label={row.InvoiceId} />
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
                row.Draft === true ? '#776cff !important' : row.Draft === false ? '#f2f2f3 !important' : '',
              color: row.Draft === true ? 'white !important' : row.Draft === false ? '#a8aaae !important' : '',
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
    let filterString = `{Status: {eq: true}`

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
        setInvoicelist(res.data.data.listJobInvoice5AABS.items)
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


  useEffect(() => {
    if (paidValue.trim().length > 1) {
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [paidValue, rowCount])

  const handleFocus = () => {
    fetchData()
    setPaginationModel({ page: 0, pageSize: 10 })
  }



  const columns: GridColDef[] = [...defaultColumns]

  return (
    <>
      <DatePickerWrapper>
        <Grid item xs={12}>
          <InvlicePaidReportHeader
          
          companyName={companyName}
          setShowMessage={setShowMessage}
          showMessage={showMessage}
          setcustomer={setcustomer}
          setPickupDate={setPickupDate}  
          />
        </Grid>

        <Card>
        
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={Invoicelist}
              getRowId={(row) => row.ID}
              rowCount={totalCount}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
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
          value={toEmail}
          // onChange={handleEmail}
          onChange={(e: any) => setToEmail(e.target.value)}
          // onChange={handleEmail}
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
            onClick={handlesendbutton}
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



export default InvoicePaidReport;

