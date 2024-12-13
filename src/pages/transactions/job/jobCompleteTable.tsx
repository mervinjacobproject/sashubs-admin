import React from 'react'
import { useState, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import JobCompleteDropdown from './jobCompleteDropdown'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomChip from 'src/@core/components/mui/chip'
import { toast } from 'react-hot-toast'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import JobsteperformJob from './jobsteperform'
import JobCompletedHeader from 'src/pages/apps/invoice/list/JobcompletedHeader'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { CircularProgress, Typography } from '@mui/material'
import Link from 'next/link'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'

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

    // InvoiceStatus: 'pending'
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

    // InvoiceStatus: 'Invoiced'
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

const JobCompleteTable = () => {
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(defaultData.length).fill('Waiting'))
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [JobCompletelist, setJobCompletelist] = useState<any>('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [customerlist, setCustomerList] = useState<any>([])
  const [createdDate, setCreatedDate] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [customer, setcustomer] = useState('')
  const [companyName, setcompanyName] = useState('')
  const [dropLocation, setdropLocation] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [showMessage, setShowMessage] = useState<any>(false)
  const [modalOpenRestore, setModalOpenRestore] = useState(false)
  const [validState, setValidState] = useState([])
  const [selectedRows, setSelectedRows] = React.useState<any>([])

  const formatedDate = (dateString: any) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const hyphenatedDate = formattedDate.split('/').join('-')

    return hyphenatedDate
  }

  const formattedTime = (dateString: any) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const options: any = {
      hour: '2-digit',
      minute: '2-digit'
    }
    const formattedTime = date.toLocaleTimeString('en-GB', options)

    return formattedTime
  }

  const handleCreateInvoice = () => {
    if (validState) {
      setModalOpenRestore(true)
    } else {
      toast.error('Only same customer name can be selected.')
      setSelectedRows([])
    }
  }

  const handleRowSelectionModelChange = (selectedRows: any) => {
    const selectedJobObjects = selectedRows.map((id: any) => JobCompletelist.find((job: any) => job.ID === id))
    const firstCustomer = selectedJobObjects[0]?.Customer
    const validSelection = selectedJobObjects.every((job: any) => job && job.Customer === firstCustomer)
    setValidState(validSelection)
    if (!validSelection) {
    } else {
      setSelectedRows(selectedRows)
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
      deleteJobsNew5AAB(input: {ID: ${selectedRowId}}) {
        AdditionalChargePrice
        AdditionChargeId
        AdditionalChargeRate
        AssignTo
        CreatedDate
        CusReference
        Customer
        DateTime
        Description
        DropIng
        DropLat
        DropLocation
        EmpQty1
        EmpTotal
        FinalNetTotal
        ID
        IP
        JobId
        JobNotes
        JobStatus
        KM
        ModifiedDate
        NetTotal
        PickupIng
        PassUp
        PickupDate
        PickupLat
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
    }

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

  // const printData = async (id : any) => {
  //   let jobData = [];
  //   let taskData = [];
  //   let additionalData = [];
  //   let workData = [];
  //   try {
  //     const query = `query MyQuery {
  //       listJobsNew5AABS(filter: {ID: {eq: ${id}}}) {
  //         items {
  //           AdditionChargeId
  //           AdditionalChargePrice
  //           AdditionalChargeRate
  //           AssignTo
  //           CreatedDate
  //           CusReference
  //           Customer
  //           DateTime
  //           Description
  //           DropIng
  //           DropLocation
  //           EmpQty1
  //           EmpTotal
  //           FinalNetTotal
  //           ID
  //           IP
  //           InvoiceType
  //           JobId
  //           JobNotes
  //           JobStatus
  //           KM
  //           ModifiedDate
  //           NetTotal
  //           PassUp
  //           PickupDate
  //           PickupIng
  //           PickupLat
  //           PickupLocation
  //           PickupTime
  //           PriceCategory
  //           Status
  //           SubTotal
  //           Tax
  //           TaxId
  //           DropLat
  //         }
  //       }
  //       listJobTask5AABS(filter: {JobId: {eq: ${id}}}) {
  //         items {
  //           AdditionalNotes
  //           Amount
  //           Description
  //           ID
  //           Image1
  //           Image2
  //           Image3
  //           InvoiceId
  //           JobId
  //           Passup
  //           PassupRate
  //           PerRate
  //           Qty
  //           TotalRate
  //           Updated
  //         }
  //       }
  //       listJobAdditionalCharge5AABS(filter: {JobId: {eq: ${id}}}) {
  //         items {
  //           AdditionalChargeId
  //           Date
  //           ID
  //           JobId
  //           Value
  //         }
  //       }
  //       listJobWorker5AABS(filter: {JobId: {eq: "${id}"}}) {
  //         items {
  //           AdditionChargeId
  //           Date
  //           Employee
  //           ID
  //           InvoiceId
  //           JobId
  //           PayId
  //           SubTotal
  //           Subject
  //           TaskAmountAud
  //           TaskDescription
  //           TaskExtraAmt
  //           TaskGST
  //           TaskQuty
  //           TaskUnitPrice
  //           TotGST
  //           TotalAud
  //         }
  //       }
  //     }`;
  
  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     };
  
  //     const response = await ApiClient.post(`${AppSink}`, { query }, { headers });
  
  //     jobData = response.data.data.listJobsNew5AABS.items;
  //     taskData = response.data.data.listJobTask5AABS.items;
  //     additionalData = response.data.data.listJobAdditionalCharge5AABS.items;
  //     workData = response.data.data.listJobWorker5AABS.items;
  //   } catch (error) {
  //     console.error('Error fetching data from API:', error);
  //     return;
  //   }
  
  //   const printData = {
  //     Job: {
  //       JobId: jobData[0]?.JobId || '',
  //       CompanyName: jobData[0]?.Customer || '',
  //       PickupDate: jobData[0]?.PickupDate || '',
  //       PickupTime: jobData[0]?.PickupTime || '',
  //       PickupLocation: jobData[0]?.PickupLocation || '',
  //       DropLocation: jobData[0]?.DropLocation || '',
  //       Status: jobData[0]?.Status === 'Active' ? 'Active' : jobData[0]?.Status === 'Inactive' ? 'Inactive' : '',
  //       Kms: jobData[0]?.KM?.toString() || ''
  //     },
  //     WorkDetails: workData.map((item: any) => ({
  //       Employee: item.Employee || '',
  //       Description: item.TaskDescription || '',
  //       Quantity: item.TaskQuty || '',
  //       BasicRate: item.TaskUnitPrice || '',
  //       ExtraCharge: item.TaskExtraAmt || '',
  //       Total: item.TotalAud || ''
  //     })),
  //     Tasks: taskData.map((item: any) => ({
  //       Description: item.Description || '',
  //       Quantity: item.Qty || '',
  //       Rates: item.PerRate || '',
  //       TotalAmount: item.Amount || ''
  //     })),
  //     AdditionalCharges: additionalData.map((item: any) => ({
  //       JobId: item.JobId?.toString() || '',
  //       Name: item.AdditionalChargeId || '',
  //       Charge: item.Value?.toString() || ''
  //     }))
  //   };
  
  //   const json = JSON.stringify([printData]);
    
  //   try {
  //     const response = await fetch(`${PrintUrl}/JobDet/Get`, {
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
  const handleOpenDrawer = () => {
    //jij
  }

  const printData = (row: any) => {
    const imageSource = '/images/icons/project-icons/sev 1.png';

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
    `;

    const tableHeader = `
      <tr style="text-align: center;">
        <th>S.No</th>
        <th>Job Id</th>
        <th>Company Name</th>
         <th>Created Date</th>
        <th>Date</th>
        <th>Reference</th>
        <th>Drop Location</th>
         <th>Status</th>
      </tr>
    `;

    const tableRows = `
      <tr>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">${row['Sl.no']}</td>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.JobId}</td>
         <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.companyName}</td>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.CreatedDate}</td>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.PickupDate}</td>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.DropLocation}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.CusReference}</td>
        <td style="text-align: center; border-bottom: 1px solid #ddd;">Completed</td>
      </tr>
    `;

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
      
      <div class="row">
        <div class="address-container">
          <div>
            <img src="${imageSource}" alt="Cross Image" />
            <h3 class="size-content">Job Details</h3>
          </div>
          <div>${fromAddress}</div>
        </div>
      </div>
      
      <table class="custom-table">
        ${tableHeader}
        ${tableRows}
      </table>
    `;

    // Print option
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Job Details</title>
            <!-- Add Bootstrap CDN link here if not already included in your project -->
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
  };
  
  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      headerName: 'S.No',
      flex: 0.2,
      editable: false,
      filterable: false,
      renderCell: (params: any) => {
        const serialNumber = params.api.getAllRowIds().indexOf(params.id) + 1;
        params.row['Sl.no'] = serialNumber; 
        return serialNumber;
      }
    },
    {
      flex: 0.3,
      field: 'jobid',
      headerName: 'Job Id',
      renderCell: ({ row }) => <CustomChip rounded size='small' skin='light' color={'success'} label={row.JobId} />
    },

    {
      field: 'customer',
      headerName: 'Customer',
      flex: 0.3,
      renderCell: (params: any) => {
        const customerId = parseInt(params.row.Customer)
        const customers = customerlist.find((c: any) => c.CId === customerId)
        const companyName = customers ? customers.CompanyName : '';
        params.row.companyName = companyName; 
        return companyName;
      }
    },
    {
      flex: 0.3,
      field: 'created_date',
      headerName: 'Created Date',
      renderCell: ({ row }: any) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Typography>{formatedDate(row.CreatedDate)}</Typography>
        </div>
      )
    },
    {
      flex: 0.3,
      field: 'pickup_date',
      headerName: 'Date',
      renderCell: ({ row }: any) => <Typography>{formatedDate(row.PickupDate)}</Typography>
    },

    {
      flex: 0.3,
      field: 'cusreference',
      headerName: 'Reference',
      renderCell: ({ row }) => (
        <Tooltip title={` ${row.CusReference}`}>
          <span>{row.CusReference}</span>
        </Tooltip>
      )
    },
    {
      flex: 0.3,
      field: 'drop_location',
      headerName: 'Drop Location',
      renderCell: ({ row }) => (
        <Tooltip title={` ${row.DropLocation}`}>
          <span>{row.DropLocation}</span>
        </Tooltip>
      )
    },

    {
      flex: 0.4,
      field: 'Status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <JobCompleteDropdown
        fetchData={fetchData}
        statusID={row.ID}
        />
      )
    },

    {
      flex: 0.4,
    
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='EDit'>
            <JobsteperformJob geteditId={row.ID} Getnotes={row.job_notes} fetchData={fetchData} />
          </DrawerComponent>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => {
                setShowMessage(false)
                handleDelete(row.ID)
              }}
            >
              <Icon icon='ic:baseline-delete' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Print'>
            <div>
              <IconButton onClick={() => printData(row)}>
                <Icon icon='ion:print' />
              </IconButton>
            </div>
          </Tooltip>
        </>
      )
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
        `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      const items = res.data.data.listCustomer5AABS.items
      setCustomerList(items)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchCustomer()
    fetchCompanyyName()
  }, [])

  const fetchCompanyyName = async () => {
    const query = `query MyQuery {
    listCustomer5AABS {
      items {
        CId
        CompanyName
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
    let filterString = `Status: {eq: 2},Deleted: {ne: true}` 
  
    if (createdDate) {
      filterString += `, CreatedDate: {eq: "${createdDate}"}`
    }

    if (pickupDate) {
      filterString += `, PickupDate: {eq: "${pickupDate}"}`
    }

    if (customer) {
      filterString += `, Customer: {eq: "${customer}"}`
    }

    if (dropLocation) {
      filterString += `, DropLocation: {contains: "${dropLocation}"}`
    }

    filterString += '}'

    const query = `
      query MyQuery {
        listJobsNew5AABS(filter: { InvoiceType: { eq: 0 }, ${filterString}) {
          totalCount
          items {
            AdditionChargeId
            AdditionalChargePrice
            AdditionalChargeRate
            AssignTo
            CreatedDate
            CusReference
            Customer
            DateTime
            Description
            DropIng
            DropLocation
            DropLat
            EmpQty1
            EmpTotal
            FinalNetTotal
            ID
            IP
            InvoiceType
            JobId
            JobNotes
            JobStatus
            KM
            ModifiedDate
            NetTotal
            PassUp
            PickupDate
            PickupIng
            PickupLocation
            PickupLat
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

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setJobCompletelist(res.data.data.listJobsNew5AABS.items)
      setTotalCount(res.data.data.listJobsNew5AABS.items.length)
      setIsTableLoading(false)
    } catch (error) {
      setIsTableLoading(false)
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, createdDate, pickupDate, customer, dropLocation])

  const handleFilter = (val: string, rowId: number) => {
    ApiClient.delete(`/api.php?moduletype=job&apitype=editstatus&id=${rowId}&status=${val}`)
      .then(() => {
        toast.success('Status Changed to Completed.')
        fetchData()
      })
      .catch((err: any) => {
        toast.error('Error,Please Try Again..')
      })
  }

  const columns: GridColDef[] = [...defaultColumns]

  return (
    <>
      <DatePickerWrapper>
        <JobCompletedHeader
          showMessage={showMessage}
          setShowMessage={setShowMessage}
          setcustomer={setcustomer}
          setPickupDate={setPickupDate}
          setdropLocation={setdropLocation}
          dropLocation={dropLocation}
          setCreatedDate={setCreatedDate}
          companyName={companyName}
          fetchData={fetchData}
          setModalOpenRestore={setModalOpenRestore}
          handleCreateInvoice={handleCreateInvoice}
          modalOpenRestore={modalOpenRestore}
          selectedRows={selectedRows}
        />
        <Card>
       
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rowCount={totalCount}
              getRowId={row => row.ID}
              rows={JobCompletelist}
              loading={isTableLoading}
              checkboxSelection
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              onPaginationModelChange={e =>
                setPaginationModel({
                  ...e
                })
              }
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
        <Typography>Are you sure you want to delete?</Typography>

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
