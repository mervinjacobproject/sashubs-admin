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
  jobId: number
  handleNext: () => void
}

const JobAdditionalCharges: React.FC<jobadditonalProps> = forwardRef<JobAdditonalInfoMethods, jobadditonalProps>(
  ({ handleNext }, ref) => {
    const router = useRouter()
    const { id: routerId } = router.query
    const [Additonalcharge, setAdditonalcharge] = useState<any>([])
    const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
    const [invoiceTaskCalc, setInvoiceTaskCalc] = useState<any>([])
    const [Joblist, setJoblist] = useState<any>([])
    const [totalTaskAmount, setTotalTaskAmount] = useState(0)
    const [selectedRowData, setSelectedRowData] = useState<any>('')
    const [editMode, setEditMode] = useState(false)
    const [jobID, setJobID] = useState<any>([])
    const [nameList, setNameList] = useState<any>([])
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [isTableLoading, setIsTableLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [selectedRowId, setSelectedRowId] = useState('')
    const [jobAddCharge, setJobAddCharge] = useState('')
    const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10
    })

    const {
      control,
      handleSubmit,
      trigger,
      setValue,
      reset,
      watch,
      formState: { errors }
    } = useForm()

    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalCloseDelete = () => setModalOpenDelete(false)

    const handleDelete = (id: string) => {
      handleModalOpenDelete()
      setSelectedRowId(id)
    }

    const handleDeleteConfirm = () => {
      const query = `mutation my {
        deleteJobAdditionalCharge5AAB(input: {ID:${selectedRowId}}) {
          AdditionalChargeId
          Date
          ID
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

        .then((res: any) => {
          toast.success('Deleted successfully')

          fetchCalculation()
          setModalOpenDelete(false)
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

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
      if (routerId && routerId !== 'new') {
        FetchNextjobid()
      } else {
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      }
    }))

    const fetchCalculation = async () => {
      if (routerId && routerId !== 'new') {
        try {
          const query = `
          query MyQuery {
            listJobAdditionalCharge5AABS(filter: { JobId: { eq: ${routerId} } }) {
              items {
                AdditionalChargeId
                Date
                ID
                JobId
                Value
              }
            }
          }
        `
          const headers = {
            'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
            'Content-Type': 'application/json'
          }
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          const items = res.data.data.listJobAdditionalCharge5AABS.items
          setJoblist(items)
          setInvoiceTaskCalc(items)

          const calculatedTotal = items.reduce((total: any, item: any) => total + parseFloat(item.Value), 0)
          setTotalTaskAmount(calculatedTotal)
          setTotalCount(res.data.data.listJobAdditionalCharge5AABS.items.length)
          setIsTableLoading(false)
        } catch (error) {
          setIsTableLoading(false)
        }
      } else {
        setTotalTaskAmount(0)
      }
    }

    useEffect(() => {
      fetchCalculation()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (selectedTaxCharge) {
        setValue('job_add_charge', selectedTaxCharge.charge)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTaxCharge])
    

    useEffect(() => {
      if (selectedRowData) {
        setValue('name', selectedRowData.AdditionalChargeId || '')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowData])

    const handleCancelDelete = () => {
      setModalOpenDelete(false)
    }

    const handleEdit = (id: string) => {
      const selectedRow = invoiceTaskCalc.find((row: any) => row.ID === id)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
        setEditMode(true)
        setValue('Tax', selectedRow.AdditionalChargeId)
        setValue('job_add_charge', selectedRow?.Value)
      }
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

    const fetchJobId = async () => {
      const query = `query MyQuery {
        listJobsNew5AABS {
          items {
            ID
            JobId
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        setJobID(res.data.data.listJobsNew5AABS.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const fetchCustomer = async () => {
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
      fetchJobId()
      fetchCustomer()
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
        field: 'JobId',
        headerName: 'job id',
        flex: 0.3,
        sortable: false,
        renderCell: (params: any) => {
          const countryId = params.row.JobId
          const country: any = jobID.find((c: any) => c.ID == countryId)
          return country ? country.JobId : ''
        }
      },
      {
        field: 'Name',
        headerName: 'Name',
        flex: 0.3,
        sortable: false,
        renderCell: (params: any) => {
          const countryId = params.row.AdditionalChargeId
          const country: any = nameList.find((c: any) => c.ID == countryId)
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
        sortable: false,
        renderCell: ({ row }: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Update'>
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


    const handleSaveItem = async () => {
      const isValid = await trigger()
      const { id: routerId } = router.query

      if (isValid) {
        const query = `
        mutation my {
          createJobAdditionalCharge5AAB(input: {AdditionalChargeId:${selectedTaxCharge?.chargeId ? selectedTaxCharge?.chargeId : selectedRowData.AdditionalChargeId}, Date: "", JobId:${routerId}, Value: "${jobAddCharge}"}) {
            AdditionalChargeId
            Date
            ID
            JobId
            Value
          }
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            fetchCalculation()
            toast.success("Additional Charges Added Successfully")
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
          updateJobAdditionalCharge5AAB(input: {AdditionalChargeId:${selectedTaxCharge?.chargeId ? selectedTaxCharge?.chargeId : selectedRowData.AdditionalChargeId}, Date: "", ID:${selectedRowData?.ID}, JobId:${routerId}, Value:"${jobAddCharge}"}) {
            AdditionalChargeId
            Date
            ID
            JobId
            Value
          }
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            fetchCalculation()
            toast.success("Additional Charges Updated Successfully")
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
              spacing={3}
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
                        : 'inherit'
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
                        options={Additonalcharge.sort((a: any, b: any) => a.Name?.localeCompare(b.Name))}
                        getOptionLabel={data => data.Name || ''}
                        value={
                          Additonalcharge.find((tax: any) => {
                            return tax.ID === watch('Tax')
                          }) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue?.ID || null)
                          setSelectedTaxCharge({
                            chargeId: newValue.ID || null,
                            name: newValue.Name || '',
                            charge: newValue.Charge || ''
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
              <Grid item xs={6} sx={{ marginTop: '6px' }}>
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
                            Charge
                          </span>
                        </div>
                      }
                      onChange={(e: any) => {
                        // field.onChange(e)
                        // setJobAddCharge(e.target.value)

                        const input = e.target.value;
                        const isValidInput = /^[0-9.]*$/.test(input);
                        if (isValidInput) {
                          field.onChange(e);
                          setJobAddCharge(e.target.value)
                        }
                      }}
                      inputProps={{
                        style: { color: getColor() }
                      }}
                      variant='outlined'
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
                {' '}
                Total Charges :$<AnimatedNumber value={totalTaskAmount} duration={1200} />
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
    `}
          </style>
          <DataGrid
            columns={columns}
            autoHeight
            pagination
            rowHeight={62}
            disableRowSelectionOnClick
            loading={isTableLoading}
            getRowId={row => row.ID}
            paginationModel={paginationModel}
            rows={Joblist}
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
)

export default JobAdditionalCharges