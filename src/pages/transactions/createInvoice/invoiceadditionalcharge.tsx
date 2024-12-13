import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { IconButton, Tooltip } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { Box } from '@mui/system'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import Autocomplete from '@mui/material/Autocomplete'
import { useRouter } from 'next/router'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'

export interface JobAdditonalInfoMethods {
  childMethod: (id: any) => void
}
interface jobadditonalProps {
  ref: any
  handleNext: () => void
  editId:any
  customer:any
  separateId:any
}

const InvoiceAdditionalCharges: React.FC<jobadditonalProps> = forwardRef<JobAdditonalInfoMethods, jobadditonalProps>(
  ({ handleNext,editId,customer,separateId }, ref) => {
    const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10
    })
    const router: any = useRouter()
    const invoiceEditId = router.query.invoiceid === undefined ? separateId : router.query.invoiceid
    const createInvoiceId = router.query.createInvoiceId === undefined ? editId : router.query.createInvoiceId
    const [totalCount, setTotalCount] = useState(0)
    const [createTaskItems, setCreateTaskItems] = useState([])
    const [namelist, setNameList] = useState<any>([])
    const [jobAddCharge, setJobAddCharge] = useState('')
    const [Additonalcharge, setAdditonalcharge] = useState<any>([])
    const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
    const [totalTaskAmount, setTotalTaskAmount] = useState(0)
    const [selectedRowData, setSelectedRowData] = useState<any>('')
    const [editMode, setEditMode] = useState(false)
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState('')

    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalCloseDelete = () => setModalOpenDelete(false)

    const {
      control,
      handleSubmit,
      trigger,
      setValue,
      reset,
      watch,
    } = useForm()
   
    const FetchNextjobid = async () => {
      const query = `query MyQuery {
        listAdditionalCharges5AABS(filter: {Status: {eq: true}}) {
          items {
            Charge
            Description
            ID
            Name
            Status
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        setAdditonalcharge(res.data.data.listAdditionalCharges5AABS.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    useEffect(() => {
      if (selectedTaxCharge) {
        setValue('job_add_charge', selectedTaxCharge.charge)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTaxCharge])

    const handleEdit = (id: string) => {
      const selectedRow:any = createTaskItems.find((row: any) => row.ID === id)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
        setEditMode(true)
        setValue('Tax', selectedRow.AdditionalChargeId)
        setValue('job_add_charge', selectedRow?.Value)
      }
    }

    const handleDelete = (id: string) => {
      handleModalOpenDelete()
      setSelectedRowId(id)
    }

    const handleDeleteConfirm = () => {
      const query = `mutation my {
        deleteInvoiceAdditionalCharge5AAB(input: {ID: ${selectedRowId}}) {
          AdditionalChargeId
          Date
          ID
          InvoiceId
          JobId
          Value
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
  
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          toast.success('Deleted successfully')
          fetchCreateTask(createInvoiceId)
          setModalOpenDelete(false)
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      }
    }))

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

    const fetchAdditionalCharge = async () => {
      const query = `query MyQuery {
        listAdditionalCharges5AABS {
          items {
            Charge
            Description
            ID
            Name
            Status
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        setNameList(res.data.data.listAdditionalCharges5AABS.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    useEffect(() => {
      fetchAdditionalCharge()
      FetchNextjobid()
    }, [])

    const defaultColumns: any = [
      {
        field: 'Sl.no',
        flex: 0.1,
        headerName: 'S.No',
        sortable: false,
        renderCell: (params: any) =>
          params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
      },
      {
        field: 'Name',
        headerName: 'Name',
        flex: 0.3,
        sortable: false,
        renderCell: (params: any) => {
          const countryId = params.row.AdditionalChargeId
          const country: any = namelist.find((c: any) => c.ID == countryId)
          return country ? country.Name : ''
        }
      },
      {
        flex: 0.3,
        field: 'Value',
        headerName: 'Charge',
        renderCell: ({ row }:any) => <b>{formatCurrency(Number(row.Value))}</b>
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.2,

        renderCell: ({ row }: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Edit'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleEdit(row.ID)}>
                <Icon icon='tabler:edit' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.ID)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ]
    const columns = [...defaultColumns]

    
  const formatCurrency = (amount:any) =>
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const fetchCreateTask = async (id: any) => {
      const query = `query MyQuery {
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
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        if (res.status === 200) {
          const items = res.data.data.listInvoiceAdditionalCharge5AABS.items
          setCreateTaskItems(items)
          const calculatedTotal = items.reduce((total: any, item: any) => total + parseFloat(item.Value), 0)
          setTotalTaskAmount(calculatedTotal)
          setTotalCount(items.length)
          if (items.length === 0) {
            FetchAllData()
          }
        }
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    }

    useEffect(() => {
      if (createInvoiceId !== undefined) {
        fetchCreateTask(createInvoiceId)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createInvoiceId])

    const mergeAllData = async (id: any) => {
      try {
        const query = `query MyQuery {
      listJobAdditionalCharge5AABS(filter: {JobId: {eq: ${id}}}) {
        items {
          AdditionalChargeId
          Date
          ID
          JobId
          Value
        }
      }
    }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        if (id) {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          if (res.data.data.listJobAdditionalCharge5AABS) {
            return { id, items: res.data.data.listJobAdditionalCharge5AABS.items }
          }
        }
        return null
      } catch (error) {
        console.error(error)
      }
    }
    const FetchAllData = async () => {
      try {
        const ids: any = invoiceEditId.split(',').map((id: any) => id.trim())
        const allResponse: any = []

        if (createTaskItems && createTaskItems.length === 0) {
          for (const id of ids) {
            const cusRef = await mergeAllData(id)
            if (cusRef && cusRef.items && Array.isArray(cusRef.items)) {
              allResponse.push(cusRef)
            }
          }
        }
        if (createTaskItems && createTaskItems.length === 0) {
          for (const response of allResponse) {
            for (const item of response.items) {
              const { AdditionalChargeId, Value } = item
              const smallID = response.id
              await addAlldetails(smallID, AdditionalChargeId, Value)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    const addAlldetails = async (smallID: any, AdditionalChargeId: any, Value: any) => {
      try {
        const query = `mutation my {
          createInvoiceAdditionalCharge5AAB(input: {AdditionalChargeId: ${AdditionalChargeId}, Date: "", InvoiceId: ${createInvoiceId}, JobId: ${smallID}, Value: "${Value}"}) {
            AdditionalChargeId
            Date
            ID
            InvoiceId
            JobId
            Value
          }
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        await ApiClient.post(`${AppSink}`, { query }, { headers })
        fetchCreateTask(createInvoiceId)
      } catch (err) {
        console.error(err)
      }
    }

    const handleSaveItem = async () => {
      const isValid = await trigger()
      if (isValid) {
        const query = `
         mutation my {
          createInvoiceAdditionalCharge5AAB(input: {AdditionalChargeId:${
            selectedTaxCharge?.chargeId ? selectedTaxCharge?.chargeId : selectedRowData.AdditionalChargeId
          }, Date: "", InvoiceId:${createInvoiceId}, JobId: 0, Value: "${jobAddCharge}"}) {
            AdditionalChargeId
            Date
            ID
            InvoiceId
            JobId
            Value
          }
        }
        `
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            toast.success("Additional charge added successfully")
            fetchCreateTask(createInvoiceId)
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }

    const handleUpdateItem = async () => {
      const isValid = await trigger()
      const { id: routerId } = router.query
      if (isValid) {
        const query = `
       mutation my {
          updateInvoiceAdditionalCharge5AAB(input: {AdditionalChargeId: ${
            selectedTaxCharge?.chargeId ? selectedTaxCharge?.chargeId : selectedRowData.AdditionalChargeId
          }, Date: "", ID:${selectedRowData?.ID}, InvoiceId: ${createInvoiceId}, JobId: 0, Value: "${jobAddCharge}"}) {
            AdditionalChargeId
            Date
            ID
            InvoiceId
            JobId
            Value
          }
        }
        `

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            toast.success("Additional charge updated successfully")
            fetchCreateTask(createInvoiceId)
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }

    return (
      <>
        <form
          onSubmit={handleSubmit(async formData => {
            if (editMode) {
              await handleUpdateItem()
              setEditMode(false)
            } else {
              await handleSaveItem()
            }
          })}
        >
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', width: '100%' }}>
            <Grid
              container
              spacing={2}
              sx={{
                padding: '20px',
                borderRadius: '5px',
                backgroundColor:
                  localStorage.getItem('selectedMode') === 'dark'
                    ? 'inherit'
                    : localStorage.getItem('selectedMode') === 'light'
                    ? '#f6f6f7'
                    : localStorage.getItem('systemMode') === 'dark'
                    ? 'inherit'
                    : 'inherit',
              }}
            >
              <Grid item xs={6}>
                <Controller
                  name='Tax'
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Autocomplete
                        {...field}
                        options={Additonalcharge}
                        getOptionLabel={data => data.Name || ''}
                        value={
                          Additonalcharge.find((tax: any) => {
                            return tax.ID === watch('Tax')
                          }) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue?.ID || null)
                          setSelectedTaxCharge({
                            chargeId: newValue?.ID || null,
                            name: newValue?.Name || '',
                            charge: newValue?.Charge || ''
                          })
                          setValue('Tax', newValue?.ID || null)
                          setJobAddCharge(newValue?.Charge || '')
                        }}
                        isOptionEqualToValue={(option, value) => {
                          return option?.ID === value?.ID
                        }}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            label={
                              <div>
                                <span
                                  className='firstname'
                                  style={{
                                    color: getColor()
                                  }}
                                >
                                  Name
                                </span>
                                <Typography
                                  variant='caption'
                                  color='error'
                                  sx={{ fontSize: '17px', marginLeft: '2px' }}
                                >
                                  *
                                </Typography>
                              </div>
                            }
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error ? fieldState.error.message : null}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6} sx={{ marginTop: '5px' }}>
                <Controller
                  name='job_add_charge'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id='Description'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Charges
                          </span>
                        </div>
                      }
                      onChange={(e: any) => {
                        const input = e.target.value
                        const isValidInput = /^[0-9.]*$/.test(input)
                        if (isValidInput) {
                          field.onChange(e)
                          setJobAddCharge(e.target.value)
                        }
                      }}
                      inputProps={{
                        style: { color: getColor()} 
                      }}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              sx={{
                float: 'right',
                width: '100px',
                display: 'flex',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                background: '#776cff',
                alignItems: 'center',
                marginTop: '10px',
                color: '#fff',
                '&:hover': {
                  background: '#776cff'
                }
              }}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', padding: '20px' }}>
              <Typography>
                Total Charges :$<AnimatedNumber value={totalTaskAmount} duration={1200}></AnimatedNumber>
              </Typography>
            </div>
          </Box>
        </form>
        <div style={{ height: '300px', overflow: 'auto' }}>
          <style>
            {`
      /* WebKit browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 2px;
      }
 
      ::-webkit-scrollbar-thumb {
        background-color: #776cff;
      }
    `}{' '}
          </style>

          <DataGrid
            columns={columns}
            autoHeight
            pagination
            disableRowSelectionOnClick
            // loading={isTableLoading}
            paginationModel={paginationModel}
            rows={createTaskItems}
            getRowId={(row:any) => row.ID}
            pageSizeOptions={[10, 25]}
            rowCount={totalCount}
            onPaginationModelChange={e =>
              setPaginationModel({
                ...e
              })
            }
          />
        </div>
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
)
export default InvoiceAdditionalCharges
