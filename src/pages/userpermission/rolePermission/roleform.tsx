import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer1'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'
import { DataGrid, GridColDef, GridDeleteIcon } from '@mui/x-data-grid'
import LoadingButton from '@mui/lab/LoadingButton'
import CustomChip from 'src/@core/components/mui/chip'

interface RolePermissions {
  RoleId: number
  MasterId: number
  Read: boolean
  Write: boolean
  Delete: boolean
}
const ParentForm = ({ rowData, onClose, fetchData, allMasters }: any) => {
  const [currentId, setCurrentId] = useState(rowData?.row?.Id)
  const [isEditPermission, setIsEditPermission] = useState<boolean>(true)
  const [dataList, setDataList] = useState<any>([])
  const [totalCount, setTotalCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isbtnLoading, setIsbtnLoading] = useState(false)
  const [inputSets, setInputSets] = useState(1) // State to keep track of the number of input sets
  const [allImages, setAllImages] = useState<any>([{}])
  const [openDelteModal, setOpenDelteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<any>('')
  const [currentRole, setCurrentRole] = useState<any>({})

  const handleAddInputSet = () => {
    setAllImages((prevInputSets: any) => [...prevInputSets, {}]) // Increment inputSets when the button is clicked
  }

  function deletePermissions() {
    setIsLoading(true)
    const endPoint = 'api/userspermission/deleterolepermission'
    ApiLoginClient.delete(endPoint, {
      data: {
        Id: [Number(deleteId)]
      }
    })
      .then(res => {
        setIsLoading(false)
        setOpenDelteModal(false)
        toast.success(res.data.message)
        fetchPermissionsList()
        setDeleteId([])
        // setIsTableLoading(false)
        setCurrentRole({})
      })
      .catch(err => {
        setIsLoading(false)
        // setIsTableLoading(false)

        setOpenDelteModal(false)
        toast.error('Could Not Delete')
      })
  }

  const editFormData = (row: any) => {
    setCurrentRole({ ...row })
    setIsEditPermission(true)
    setValue('MasterId', row.MasterId)
    setValue('Delete', row.Delete)
    setValue('Read', row.Read)
    setValue('Write', row.Write)
  }

  const handleRemoveInputSet = (indexToRemove: number) => {
    if (allImages[indexToRemove]?.id) {
      setDeleteId(allImages[indexToRemove]?.id)
      setOpenDelteModal(true)
    } else {
      setInputSets(prevInputSets => prevInputSets - 1)
      if (Array.isArray(allImages)) {
        setAllImages((prevFormData: any) => prevFormData.filter((_: any, index: number) => index !== indexToRemove))
      } else {
        console.error('allImages is not an array')
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // Check if the key combination is "Alt + A + D"

      if (event.altKey && event.key == 'a') {
        // Call your function here
        handleAddInputSet()
      }
      if (event.altKey && event.key == 'r') {
        // Call your function here
        handleRemoveInputSet(allImages.length - 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const defaultAccountValues: any = {
    MasterId: 0,
    Read: false,
    Write: false,
    Delete: false
  }

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.altKey && event.key === 's') {
        handleSubmit(onSubmitForm)()
      }
    }
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const {
    control: attributeControl,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<RolePermissions>({
    defaultValues: defaultAccountValues
    // resolver: yupResolver(estimationSchema)
  })

  const onSubmitForm = async (data: any) => {
    const payload: any = {
      Id: currentRole?.Id ? currentRole?.Id : 0,
      RoleId: currentId,
      ...data
    }
    setIsbtnLoading(true)
    if (!currentRole?.Id) {
      const endPoint = 'api/userspermission/createrolepermission'
      ApiLoginClient.post(endPoint, payload)
        .then(res => {
          setIsbtnLoading(false)
          fetchPermissionsList()
          clearForm()
          toast.success(res.data.message)
        })
        .catch((err: any) => {
          console.log('something went wrong', err)
          toast.error(err.response?.data.message)
          setIsbtnLoading(false)
        })
    } else {
      const endPoint = 'api/userspermission/updaterolepermission'

      ApiLoginClient.put(endPoint, payload)
        .then(res => {
          setIsbtnLoading(false)
          fetchPermissionsList()
          // closeRightPopupClick()
          clearForm()
          toast.success(res.data.message)
          const escKeyEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27
            // Add any additional properties you might need
          })

          document.dispatchEvent(escKeyEvent)
        })
        .catch(err => {
          console.log('something went wrong', err)
          toast.error(err.response?.data.message)
          setIsbtnLoading(false)
          closeRightPopupClick()
        })
    }
  }

  const handleDeletePopupClose = () => {
    setOpenDelteModal(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 's' && event.altKey) {
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    fetchPermissionsList()
  }, [])

  const addNewPermission = () => {
    const obj = {
      Id: 0
    }
    setCurrentRole({ ...obj })
  }
  const clearForm = () => {
    const obj = {
      Id: null
    }
    setCurrentRole({ ...obj })
  }

  function fetchPermissionsList() {
    // setIsTableLoading(true)
    const apiParams: any = {
      RoleId: currentId
    }
    const paramString = new URLSearchParams(apiParams).toString()
    const endPoint = 'api/userspermission/readrolepermission'
    ApiLoginClient.get(endPoint + '?' + paramString)
      .then((res: any) => {
        const temp: any = res.data
        setDataList([...temp])
        // setIsTableLoading(false)
      })
      .catch((err: any) => {
        console.log('something went wrong', err)
        // setIsTableLoading(false)
        if (err.response?.data.message == 'Permissions not found') {
          setDataList([])
        }
        if (err.response?.data.message == 'Permissions not found' && paginationModel.page != 0) {
          const temp = paginationModel
          temp.page = temp.page - 1
          setPaginationModel({ ...temp })
        }
      })
  }

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      sortable: false,
      filterable: false,
      maxWidth: 85,
      headerName: 'ID',

      flex: 0.1,

      editable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },

    {
      flex: 0.3,
      field: 'master',
      sortable: false,
      filterable: false,
      minWidth: 200,

      headerName: 'Master',
      renderCell: ({ row }: any) => {
        // const { categoryName, parentCategoryName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row?.MasterName}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.4,
      minWidth: 90,
      field: 'Read',
      filterable: false,
      sortable: false,
      headerName: 'Is Read',
      renderCell: ({ row }: any) => {
        return !row.Read ? (
          <CustomChip rounded size='small' skin='light' color='primary' label='Inactive' />
        ) : (
          <CustomChip rounded size='small' skin='light' color='success' label='Active' />
        )
      }
    },
    {
      flex: 0.4,
      minWidth: 90,
      field: 'Write',
      filterable: false,
      sortable: false,
      headerName: 'Is Write',
      renderCell: ({ row }: any) => {
        return !row.Write ? (
          <CustomChip rounded size='small' skin='light' color='primary' label='Inactive' />
        ) : (
          <CustomChip rounded size='small' skin='light' color='success' label='Active' />
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 90,
      field: 'Delete',
      filterable: false,
      sortable: false,
      headerName: 'Is Delete',
      renderCell: ({ row }: any) => {
        return !row.Delete ? (
          <CustomChip rounded size='small' skin='light' color='primary' label='Inactive' />
        ) : (
          <CustomChip rounded size='small' skin='light' color='success' label='Active' />
        )
      }
    }
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.4,
      field: 'actions',
      filterable: false,
      sortable: false,
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Tooltip title='Edit Permissions'>
            <a href='#scroll'>
              <Button onClick={() => editFormData(row)}>
                <Icon fontSize={18} icon='tabler:edit' />
              </Button>
            </a>
          </Tooltip>
          <Tooltip title='Delete Master'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                const temp: any = [row.Id]
                setOpenDelteModal(true)
                setDeleteId([...temp])
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      {isEditPermission ? (
        <Box sx={{ minWidth: 750, p: 5 }} id='scroll'>
          <Typography variant='h5' sx={{ pb: 3, ml: 10 }}>
            Manage Roles and Permissions for{' '}
            <span style={{ color: 'green', fontWeight: 600 }}>{rowData?.row.RoleName}</span>
          </Typography>
          {!currentRole.Id && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button onClick={addNewPermission} variant='text'>
                Add New +
              </Button>
            </Box>
          )}
          {currentRole.Id != null && (
            <>
              <Typography variant='h5' sx={{ pb: 3 }}>
                {`${currentRole.Id >= 1 ? 'Update Roles' : 'Add New Roles'}`}
              </Typography>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container width={'100%'} height={'auto'} spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <InputLabel htmlFor='childof'>Master</InputLabel>
                    <Controller
                      name='MasterId'
                      control={attributeControl}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={
                            allMasters.filter(
                              (itm: any) => !dataList.map((dL: any) => dL.MasterId)?.includes(itm.Id)
                            ) || []
                          }
                          getOptionLabel={(option: any) => option.MasterName}
                          onChange={(_, value: any) => {
                            field?.onChange(value?.Id)
                          }}
                          // disabled={row?.Id != null}
                          value={allMasters?.find((option: any) => option.Id == field.value)}
                          isOptionEqualToValue={(option: any, value: any) => option.Id === value.Id}
                          renderInput={params => <CustomTextField {...params} fullWidth />}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Controller
                      name='Read'
                      control={attributeControl}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          control={
                            <Switch
                              sx={{ paddingBottom: '0 !important' }}
                              id='invoice-add-payment-stub'
                              onChange={(e: any) => {
                                field.onChange(e.target.checked)
                              }}
                              checked={field.value}
                            />
                          }
                          label='Is Read'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Controller
                      name='Write'
                      control={attributeControl}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          control={
                            <Switch
                              sx={{ paddingBottom: '0 !important' }}
                              id='invoice-add-payment-stub'
                              onChange={(e: any) => {
                                field.onChange(e.target.checked)
                              }}
                              checked={field.value}
                            />
                          }
                          label='Is Write'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Controller
                      name='Delete'
                      control={attributeControl}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          control={
                            <Switch
                              sx={{ paddingBottom: '0 !important' }}
                              id='invoice-add-payment-stub'
                              onChange={(e: any) => {
                                field.onChange(e.target.checked)
                              }}
                              checked={field.value}
                            />
                          }
                          label='Is Delete'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                    <Button type='submit' variant='outlined' sx={{ mr: 4 }} onClick={() => clearForm()}>
                      Cancel
                    </Button>
                    <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                      {isbtnLoading ? <CircularProgress color='inherit' sx={{ color: 'fff' }} size={24} /> : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
          <Card>
            <DataGrid
              autoHeight
              sx={{
                minHeight: '5rem'
              }}
              pagination
              rowHeight={62}
              // loading={}
              rows={dataList || []}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={e => setPaginationModel({ ...e })}
              // onSortModelChange={modal => handleSortModalChange(modal)}
              getRowId={row => row.Id}
              // onRowSelectionModelChange={rows => setSelectedRows(rows)}
              // onFilterModelChange={model => handleFilterModelChange(model)}
              rowCount={totalCount}
              // paginationMode='server'
            />
            {/* } */}
          </Card>
          <Modal
            open={openDelteModal}
            onClose={handleDeletePopupClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, p: 5, width: 400 }}>
              <Typography sx={{ padding: '5px' }} variant='h5'>
                Are you sure to delete ?
              </Typography>

              <div
                style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px 0', gap: '5px' }}
              >
                <Button
                  variant='outlined'
                  sx={{
                    '&:hover': {
                      background: '#808080',
                      color: 'white'
                    }
                  }}
                  onClick={() => setOpenDelteModal(false)}
                >
                  Cancel
                </Button>

                <LoadingButton
                  loading={isLoading}
                  loadingPosition='start'
                  startIcon={<GridDeleteIcon />}
                  variant='contained'
                  onClick={deletePermissions}
                >
                  Delete
                </LoadingButton>
              </div>
            </Box>
          </Modal>
        </Box>
      ) : (
        <Box>
          <Typography>List will be displayed here</Typography>
        </Box>
      )}
    </>
  )
}

export default ParentForm
