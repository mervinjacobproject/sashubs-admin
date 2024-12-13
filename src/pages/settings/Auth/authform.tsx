import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import * as yup from 'yup'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, CircularProgress } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'

const AuthForm = () => {
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)
  const [allRole, setAllRole] = useState([])
  const [pageMaster, setPageMaster] = useState<any>([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [user, setUser] = useState([])
  const [groupNames, setGroupNames] = useState([])
  const [groupCheckboxState, setGroupCheckboxState] = useState({})

  useEffect(() => {
    const uniqueGroupNames: any = Array.from(new Set(pageMaster.map((page: any) => page.GroupName)))
    setGroupNames(uniqueGroupNames)
  }, [pageMaster])

  const addressSchema = yup.object().shape({
    price_category: yup.string().required('Role is required')
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(addressSchema)
  })

  const fetchAllNavbarItem = async () => {
    setLoading(true)
    const query = `query MyQuery {
        listPageMaster5AABS {
          items {
            GroupName
            ID
            PageName
            PageURL
          }
        }
      }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setPageMaster(response.data.data.listPageMaster5AABS.items)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    const permissionsArray = selectedCheckbox.reduce((acc: any, checkboxId) => {
      const parts = checkboxId.split('-')
      const permissionType: any = parts[parts.length - 1]
      const formattedPageName = parts.slice(0, -1).join('-')
      const existingPage: any = acc.find((page: any) => page.name === formattedPageName)
      if (existingPage) {
        existingPage[permissionType] = true
      } else {
        const newPage: any = { name: formattedPageName, read: false, write: false, create: false }
        newPage[permissionType] = true
        acc.push(newPage)
      }

      return acc
    }, [])

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      let completedRequests = 0
      const totalRequests = permissionsArray.length
      for (const permission of permissionsArray) {
        const { name, read, write, create } = permission
        const formattedName = name.replace(/-/g, ' ')
        const matchingPage = pageMaster.find((page: any) => page.PageName.toLowerCase() === formattedName.toLowerCase())
        if (matchingPage) {
          const { ID } = matchingPage;
          if (user.length > 0) {
            const userDataPage = user.find((page: any) => page.PageId === ID);
            if (userDataPage) {
              const { ID:userId } = userDataPage;
            const mutation = `{
                updateUserPermission5AAB(input: {
                  CreatePermission: ${create},
                  ID:${userId},
                  PageId: ${ID}, 
                  UserId: ${selectedRoleId},
                  ViewPermission: ${read},
                  WritePermission: ${write}
                }) {
                  ID
                }
              }`
            const query = `mutation my  ${mutation} `;
            await ApiClient.post(`${AppSink}`, { query }, { headers });
          }} else {
            const mutation = `
              {
                createUserPermission5AAB(input: {
                  CreatePermission: ${create},
                  PageId: ${ID}, 
                  UserId: ${selectedRoleId},
                  ViewPermission: ${read},
                  WritePermission: ${write}
                }) {
                  ID
                }
              }
            `;
            const query = `mutation my  ${mutation} `;
            await ApiClient.post(`${AppSink}`, { query }, { headers });
          }
          completedRequests++;
          setProgress((completedRequests / totalRequests) * 100);
        }
      }
      for (const page of pageMaster) {
        const matchingPermission = permissionsArray.find((permission: any) => {
          const formattedName = permission.name.replace(/-/g, ' ');
          return page.PageName.toLowerCase() === formattedName.toLowerCase();
        });
      
        if (!matchingPermission) {
          if (user.length > 0) {
            const userDataPage = user.find((userDataPage: any) => userDataPage.PageId === page.ID);
            if (userDataPage) {
              const { ID:userId } = userDataPage;
              const mutation = `
                {
                  updateUserPermission5AAB(input: {
                    CreatePermission: false,
                    PageId: ${page.ID}, 
                    ID:${userId},
                    UserId: ${selectedRoleId},
                    ViewPermission: false,
                    WritePermission: false
                  }) {
                    ID
                  }
                }
              `;
              const query = `mutation my  ${mutation}`;
              await ApiClient.post(`${AppSink}`, { query }, { headers });
            } else {
              console.error(`No user data found for page ID ${page.ID}`);
            }
          } else {
            const mutation = `
            {
                createUserPermission5AAB(input: {
                  CreatePermission: false,
                  PageId: ${page.ID}, 
                  UserId: ${selectedRoleId},
                  ViewPermission: false,
                  WritePermission: false
                }) {
                  ID
                }
              }
            `;
            const query = `mutation my  ${mutation}`;
            await ApiClient.post(`${AppSink}`, { query }, { headers });
            completedRequests++;
            setProgress((completedRequests / totalRequests) * 100);
          }
        }
      }
      
    } catch (error) {
      console.error( error)
    }
  }

  const togglePermission = (id: string, groupname: string, permissionType: string) => {
    const arr = selectedCheckbox.slice()
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
    } else {
      arr.push(id)
      if (permissionType !== 'read' && permissionType !== 'write' && permissionType !== 'create') {
        return
      }
      const relatedPages = pageMaster.filter((page: any) => page.GroupName === groupname)
      relatedPages.forEach((page: any) => {
        const relatedId = `${page.PageName.toLowerCase().split(' ').join('-')}-${permissionType}`
        if (!selectedCheckbox.includes(relatedId)) {
          arr.push(relatedId)
        }
      })
    }
    setSelectedCheckbox(arr)
  }

  const handleSelectCheckbox = (groupName: any, permissionType: any) => {
    const updatedSelectedCheckbox = [...selectedCheckbox]
    const groupPages = pageMaster.filter((page: any) => page.GroupName === groupName)
    groupPages.forEach((page: any) => {
      const id = page.PageName.toLowerCase().split(' ').join('-')
      const checkboxId = `${id}-${permissionType}`
      const index = updatedSelectedCheckbox.indexOf(checkboxId)
      if (index !== -1) {
        updatedSelectedCheckbox.splice(index, 1)
      } else {
        updatedSelectedCheckbox.push(checkboxId)
      }
    })
    const anyCheckboxChecked = groupPages.some((page: any) =>
      updatedSelectedCheckbox.includes(`${page.PageName.toLowerCase().split(' ').join('-')}-${permissionType}`)
    )
    const newGroupCheckboxState: any = { ...groupCheckboxState }
    newGroupCheckboxState[groupName] = anyCheckboxChecked
    setGroupCheckboxState(newGroupCheckboxState)
    setSelectedCheckbox(updatedSelectedCheckbox)
  }

  const handleSelectAllCheckbox = () => {
    if (selectedCheckbox.length === pageMaster.length * 3) {
      setSelectedCheckbox([])
      const newGroupCheckboxState = Object.fromEntries(groupNames.map(groupName => [groupName, false]))
      setGroupCheckboxState(newGroupCheckboxState)
    } else {
      const allCheckboxIds = pageMaster.flatMap((row: any) => {
        const id = row.PageName.toLowerCase().split(' ').join('-')
        return [`${id}-read`, `${id}-write`, `${id}-create`]
      })
      setSelectedCheckbox(allCheckboxIds)
      const newGroupCheckboxState = Object.fromEntries(groupNames.map(groupName => [groupName, true]))
      setGroupCheckboxState(newGroupCheckboxState)
    }
  }

  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < pageMaster.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCheckbox])

  useEffect(() => {
    if (selectedRoleId !== null && pageMaster.length > 0) {
      selectUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, pageMaster, allRole])

  const fetchAllActiveRole = async () => {
    const query = `query MyQuery {
      listUserRoles5AABS(filter: {Status: {eq: true}}) {
        items {
          ID
          RoleName
          Status
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        setAllRole(res.data.data.listUserRoles5AABS.items)
      })
      .catch((err: any) => {
        //  hi
      })
  }

  const selectUser = async () => {
    const query = `query MyQuery {
        listUserPermission5AABS(filter: {UserId: {eq: ${selectedRoleId}}}) {
          items {
            CreatePermission
            ID
            PageId
            UserId
            ViewPermission
            WritePermission
          }
        }
      }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setUser(res.data.data.listUserPermission5AABS.items)
      const updatedSelectedCheckbox: any = []
      pageMaster?.forEach((page: any) => {
        const id = page.PageName?.toLowerCase().split(' ').join('-')
        const pageId = page.ID
        const permissions = res.data.data.listUserPermission5AABS.items.find(
          (userItem: any) => userItem.PageId === pageId
        )
        if (permissions) {
          const { ViewPermission, WritePermission, CreatePermission } = permissions
          if (ViewPermission === true) updatedSelectedCheckbox.push(`${id}-read`)
          if (WritePermission === true) updatedSelectedCheckbox.push(`${id}-write`)
          if (CreatePermission === true) updatedSelectedCheckbox.push(`${id}-create`)
        }
      })
      setSelectedCheckbox(updatedSelectedCheckbox)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAllActiveRole()
    fetchAllNavbarItem()
  }, [])

  const handleChecked = (groupName: any, permissionType: any) => {
    const allGroupCheckboxIds = pageMaster
      .filter((page: any) => page.GroupName === groupName)
      .flatMap((row: any) => {
        const id = row.PageName.toLowerCase().split(' ').join('-')
        return `${id}-${permissionType}`
      })

    return allGroupCheckboxIds.some((id: any) => selectedCheckbox.includes(id))
  }

  const backColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.78)'
    } else if (selectedMode === 'light') {
      return '#fff'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.78)'
    } else {
      return '#fff'
    }
  }
  return (
    <>
      <Grid container spacing={6}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Typography
            sx={{
              backgroundColor: backColor(),
              display: 'flex',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: 'sans-serif',
              padding: '10px',
              color: 'black',
              width: '100%'
            }}
          >
            Set Role Permissions
          </Typography>
          <Box sx={{ my: 4 }}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='price_category'
                control={control}
                render={({ field }) => (
                  <>
                    <div>
                      <span style={{ fontSize: '14px', marginBottom: '4px' }}>Role</span>
                      <Typography
                        variant='caption'
                        color='error'
                        sx={{ fontSize: '17px', marginLeft: '2px' }}
                      ></Typography>
                    </div>
                    <Autocomplete
                      {...field}
                      options={allRole}
                      getOptionLabel={(option: any) => option.RoleName || ''}
                      value={
                        allRole?.find((pricevalue: any) => pricevalue?.RoleName === watch('price_category')) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.RoleName || null)
                        setSelectedRoleId(newValue?.ID)
                      }}
                      isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          error={Boolean(errors.price_category) && !field.value}
                          helperText={errors.price_category && !field.value ? 'Pricing field is required' : ''}
                          inputProps={{
                            ...params.inputProps
                          }}
                        />
                      )}
                    />
                  </>
                )}
              />
            </Grid>
          </Box>
          <Typography variant='h4'>Role Permissions</Typography>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <CircularProgress />
            </div>
          ) : (
            <Grid container>
              <Grid item xs={12}>
                <Grid sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <Typography>Administrator Access</Typography>
                  <Typography>
                    <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          checked={selectedCheckbox.length === pageMaster.length * 3}
                        />
                      }
                    />
                  </Typography>
                </Grid>
                <Box>
                  
                  {/* <LinearProgress value={75} sx={{ height: 3 }} variant='determinate' value={progress} /> */}

                  {groupNames.map(groupName => {
                    return (
                      <Accordion key={groupName} sx={{ width: '100%' }}>
                        <AccordionSummary>
                          <Box
                            style={{
                              width: '100%',
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr 1fr',
                              alignItems: 'center'
                            }}
                          >
                            <Typography>{groupName} </Typography>
                            <FormControlLabel
                              label='Read'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${groupName}-read`}
                                  onChange={() => handleSelectCheckbox(groupName, 'read')}
                                  onClick={event => event.stopPropagation()}
                                  checked={handleChecked(groupName, 'read')}
                                />
                              }
                            />
                            <FormControlLabel
                              label='Write'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${groupName}-write`}
                                  onChange={() => handleSelectCheckbox(groupName, 'write')}
                                  onClick={event => event.stopPropagation()}
                                  checked={handleChecked(groupName, 'write')}
                                />
                              }
                            />
                            <FormControlLabel
                              label='Create'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  id={`${groupName}-create`}
                                  size='small'
                                  onChange={() => handleSelectCheckbox(groupName, 'create')}
                                  onClick={event => event.stopPropagation()}
                                  checked={handleChecked(groupName, 'create')}
                                />
                              }
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            {pageMaster
                              .filter((page: any) => page.GroupName === groupName)
                              .map((i: any) => {
                                const id = i.PageName?.toLowerCase().split(' ').join('-')
                                return (
                                  <div
                                    key={i.ID}
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Typography key={i.ID}>{i.PageName}</Typography>
                                    <Typography>
                                      <Controller
                                        name={`${id}-read`}
                                        control={control}
                                        render={({ field }) => (
                                          <FormControlLabel
                                            label='Read'
                                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                            control={
                                              <Checkbox
                                                {...field}
                                                size='small'
                                                id={`${id}-read`}
                                                onChange={() => togglePermission(`${id}-read`, i.GroupName, 'read')}
                                                checked={selectedCheckbox.includes(`${id}-read`)}
                                              />
                                            }
                                          />
                                        )}
                                      />
                                    </Typography>
                                    <Typography>
                                      <Controller
                                        name={`${id}-write`}
                                        control={control}
                                        render={({ field }) => (
                                          <FormControlLabel
                                            label='Write'
                                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                            control={
                                              <Checkbox
                                                {...field}
                                                size='small'
                                                id={`${id}-write`}
                                                onChange={() => togglePermission(`${id}-write`, i.GroupName, 'write')}
                                                checked={selectedCheckbox.includes(`${id}-write`)}
                                              />
                                            }
                                          />
                                        )}
                                      />
                                    </Typography>
                                    <Typography>
                                      <Controller
                                        name={`${id}-create`}
                                        control={control}
                                        render={({ field }) => (
                                          <FormControlLabel
                                            label='Create'
                                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                            control={
                                              <Checkbox
                                                {...field}
                                                size='small'
                                                id={`${id}-create`}
                                                onChange={() => togglePermission(`${id}-create`, i.GroupName, 'create')}
                                                checked={selectedCheckbox.includes(`${id}-create`)}
                                              />
                                            }
                                          />
                                        )}
                                      />
                                    </Typography>
                                  </div>
                                )
                              })}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}
                </Box>
              </Grid>
            </Grid>
          )}
          <Box className='demo-space-x'>
            <Button
              sx={{
                backgroundColor: '#776cff',
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                }
              }}
              type='submit'
              variant='contained'
              onClick={handleSubmit(onSubmit)}
              disabled={!watch('price_category')}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Grid>
    </>
  )
}

export default AuthForm
