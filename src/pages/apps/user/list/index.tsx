// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports

import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports


import Grid from '@mui/material/Grid'



// ** Icon Imports



// ** Store Imports

import { useDispatch } from 'react-redux'

// ** Custom Components Imports


import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import

// ** Actions Imports
import { fetchData } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import {  AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'
import CrmDashboard from 'src/pages/dashboards/crm'

// interface UserRoleType {
//   [key: string]: { icon: string; color: string }
// }

// interface UserStatusType {
//   [key: string]: ThemeColor
// }

// ** renders client column

// const userRoleObj: UserRoleType = {
//   admin: { icon: 'tabler:device-laptop', color: 'secondary' },
//   author: { icon: 'tabler:circle-check', color: 'success' },
//   editor: { icon: 'tabler:edit', color: 'info' },
//   maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
//   subscriber: { icon: 'tabler:user', color: 'warning' }
// }

// const userStatusObj: UserStatusType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

// ** renders client column

// const renderClient = (row: UsersType) => {
//   if (row.avatar.length) {
//     return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
//   } else {
//     return (
//       <CustomAvatar
//         skin='light'
//         color={row.avatarColor}
//         sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
//       >
//         {getInitials(row.fullName ? row.fullName : 'John Doe')}
//       </CustomAvatar>
//     )
//   }
// }

// const RowOptions = ({ id }: { id: number | string }) => {
//   // ** Hooks

//   const dispatch = useDispatch<AppDispatch>()

//   // ** State

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

//   const rowOptionsOpen = Boolean(anchorEl)

//   const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//   const handleRowOptionsClose = () => {
//     setAnchorEl(null)
//   }

//   const handleDelete = () => {
//     dispatch(deleteUser(id))
//     handleRowOptionsClose()
//   }

//   return (
//     <>
//       <IconButton size='small' onClick={handleRowOptionsClick}>
//         <Icon icon='tabler:dots-vertical' />
//       </IconButton>
//       <Menu
//         keepMounted
//         anchorEl={anchorEl}
//         open={rowOptionsOpen}
//         onClose={handleRowOptionsClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         PaperProps={{ style: { minWidth: '8rem' } }}
//       >
//         <MenuItem
//           component={Link}
//           sx={{ '& svg': { mr: 2 } }}
//           href='/apps/user/view/account'
//           onClick={handleRowOptionsClose}
//         >
//           <Icon icon='tabler:eye' fontSize={20} />
//           View
//         </MenuItem>
//         <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
//           <Icon icon='tabler:edit' fontSize={20} />
//           Edit
//         </MenuItem>
//         <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
//           <Icon icon='tabler:trash' fontSize={20} />
//           Delete
//         </MenuItem>
//       </Menu>
//     </>
//   )
// }

// const columns: GridColDef[] = [
//   {
//     flex: 0.25,
//     minWidth: 280,
//     field: 'fullName',
//     headerName: 'User',
//     renderCell: ({ row }: CellType) => {
//       const { fullName, email } = row

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {renderClient(row)}
//           <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
//             <Typography
//               noWrap
//               component={Link}
//               href='/apps/user/view/account'
//               sx={{
//                 fontWeight: 500,
//                 textDecoration: 'none',
//                 color: 'text.secondary',
//                 '&:hover': { color: 'primary.main' }
//               }}
//             >
//               {fullName}
//             </Typography>
//             <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
//               {email}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.15,
//     field: 'role',
//     minWidth: 170,
//     headerName: 'Role',
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <CustomAvatar
//             skin='light'
//             sx={{ mr: 4, width: 30, height: 30 }}
//             color={(userRoleObj[row.role].color as ThemeColor) || 'primary'}
//           >
//             <Icon icon={userRoleObj[row.role].icon} />
//           </CustomAvatar>
//           <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
//             {row.role}
//           </Typography>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.15,
//     minWidth: 120,
//     headerName: 'Plan',
//     field: 'currentPlan',
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
//           {row.currentPlan}
//         </Typography>
//       )
//     }
//   },
//   {
//     flex: 0.15,
//     minWidth: 190,
//     field: 'billing',
//     headerName: 'Billing',
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Typography noWrap sx={{ color: 'text.secondary' }}>
//           {row.billing}
//         </Typography>
//       )
//     }
//   },
//   {
//     flex: 0.1,
//     minWidth: 110,
//     field: 'status',
//     headerName: 'Status',
//     renderCell: ({ row }: CellType) => {
//       return (
//         <CustomChip
//           rounded
//           skin='light'
//           size='small'
//           label={row.status}
//           color={userStatusObj[row.status]}
//           sx={{ textTransform: 'capitalize' }}
//         />
//       )
//     }
//   },
//   {
//     flex: 0.1,
//     minWidth: 100,
//     sortable: false,
//     field: 'actions',
//     headerName: 'Actions',
//     renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
//   }
// ]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [role] = useState<string>('')
  const [plan] = useState<string>('')
  const [value] = useState<string>('')
  const [status] = useState<string>('')

  // const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  // const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks

  const dispatch = useDispatch<AppDispatch>()
  
  // const store = useSelector((state: RootState) => state.user)

  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       role,
  //       status,
  //       q: value,
  //       currentPlan: plan
  //     })
  //   )
  // }, [dispatch, plan, role, status, value])


 

  // const handleFilter = useCallback((val: string) => {
  //   setValue(val)
  // }, [])

  // const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
  //   setRole(e.target.value as string)
  // }, [])

  // const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
  //   setPlan(e.target.value as string)
  // }, [])

  // const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
  //   setStatus(e.target.value as string)
  // }, [])

  // const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)



  // const [designation, setDesignation] = useState([])
  // console.log(designation[0]?.customer_count,"designation")

  // const fetchData = () => {
  //   ApiClient.get('/api.php?moduletype=dashboard')
  //     .then((res: any) => {
      
  //       setDesignation(res.data)
       
  //     })
  //     .catch((err: any) => {
  //       console.error('Error fetching data:', err)
  //     })
  // }

  
  // useEffect(() => {
  //   fetchData()
  // }, [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
      <Grid item xs={12} md={3} sm={6}>
                  {/* <CardStatsHorizontalWithDetails  /> */}
                </Grid>
      </Grid>
      <CrmDashboard/>

      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='author'>Author</MenuItem>
                  <MenuItem value='editor'>Editor</MenuItem>
                  <MenuItem value='maintainer'>Maintainer</MenuItem>
                  <MenuItem value='subscriber'>Subscriber</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Plan'
                  SelectProps={{
                    value: plan,
                    displayEmpty: true,
                    onChange: e => handlePlanChange(e)
                  }}
                >
                  <MenuItem value=''>Select Plan</MenuItem>
                  <MenuItem value='basic'>Basic</MenuItem>
                  <MenuItem value='company'>Company</MenuItem>
                  <MenuItem value='enterprise'>Enterprise</MenuItem>
                  <MenuItem value='team'>Team</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Status'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}

    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
