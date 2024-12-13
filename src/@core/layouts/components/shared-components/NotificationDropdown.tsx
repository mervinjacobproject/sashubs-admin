// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { ThemeColor } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Divider, Grid, Link } from '@mui/material'
import { useRouter } from 'next/router'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import AppSink from 'src/commonExports/AppSink'

export type NotificationsType = {
  meta: string
  title: string
  subtitle: string
} & (
  | { avatarAlt: string; avatarImg: string; avatarText?: never; avatarColor?: never; avatarIcon?: never }
  | {
      avatarAlt?: never
      avatarImg?: never
      avatarText: string
      avatarIcon?: never
      avatarColor?: ThemeColor
    }
  | {
      avatarAlt?: never
      avatarImg?: never
      avatarText?: never
      avatarIcon: ReactNode
      avatarColor?: ThemeColor
    }
)
interface Props {
  settings: Settings
  notifications: NotificationsType[]
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)'
  } else {
    return 'white'
  }
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = (props: Props) => {
  const { settings, notifications } = props
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)

  const [matchedIds, setMatchedIds] = useState<any>([])

  const notificationLength = matchedIds.slice(0, 6).filter((i: any) => i.Read === '1').length

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  const handleOpen = () => {
    // console.log('hi')
  }

  const { direction } = settings

  const formatDate = (datetime: any) => {
    const currentDate: any = new Date()
    const date: any = new Date(datetime)
    const timeDifference = currentDate - date
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return `${seconds} seconds ago`
    } else if (minutes === 1) {
      return '1 minute ago'
    } else if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours === 1) {
      return '1 hour ago'
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else if (date.getDate() === currentDate.getDate() - 1) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return `${date.getDate()} ${date.toLocaleString('default', {
        month: 'short'
      })} ${date.getFullYear()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }
  }

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    fetchNotification()
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const fetchNotification = async () => {
    const query = `query MyQuery {
        listJobLocation5AABS {
          items {
            Datetime
            ID
            EmpId
            JobId
            JobType
            Latitude
            Longitude
            Read
          }
        }
      }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      if (response.data.data.listJobLocation5AABS.items.length > 0) {
        await fetchListJob(response.data.data.listJobLocation5AABS.items)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchListJob = async (res: any) => {
    const jobQuery = `query MyJobQuery {
      listJobsNew5AABS {
        items {
          ID
          JobId
        }
      }
    }`;

    const userQuery = `query MyUserQuery {
      listUsers5AABS {
        items {
          FirstName
          LastName
          ProfileImage
          ID
          UserId
        }
      }
    }`;

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    try {
      const jobResponse = await ApiClient.post(`${AppSink}`, { query: jobQuery }, { headers });
      const userResponse = await ApiClient.post(`${AppSink}`, { query: userQuery }, { headers });

      const userMap = new Map(
        userResponse.data.data.listUsers5AABS.items.map((userItem: any) => [userItem.UserId, userItem])
      );

      const matchedJobs = res.map((locationItem: any) => {
        const matchingJobItem = jobResponse.data.data.listJobsNew5AABS.items.find(
          (jobItem: any) => jobItem.ID === locationItem.JobId
        );

        const matchingUser:any = userMap.get(locationItem.EmpId.toString());

        if (matchingJobItem && matchingUser) {
          return {
            ...matchingJobItem,
            ...locationItem,
            FirstName: matchingUser.FirstName,
            LastName: matchingUser.LastName,
            ProfileImage: matchingUser.ProfileImage
          };
        }
        return null;
      }).filter(Boolean);

      setMatchedIds(matchedJobs);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleJob = (id: any) => {
    handleDropdownClose()
    setAnchorEl(null)
    handleCloseModal()
    router.push(`/transactions/job?id=${id}`)
  }
  const handleReadAllNotification = () => {
    ApiClient.post(`/api.php?moduletype=readallnotification`)
      .then(response => {
        setAnchorEl(null)
      })
      .catch(error => {
        console.error(error)
      })
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
  const handleNotification = async (
    id: any,
    ProfileImage: any,
    FirstName: any,
    LastName: any,
    JobType: any,
    ID: any,
    Datetime: any,
    jobId:any
  ) => {
    const query = `mutation my {
  updateJobLocation5AAB(input: {ID: ${id}, Read: "0"}) {
    Datetime
    EmpId
    ID
    JobId
    JobType
    Latitude
    Longitude
    Read
  }
}`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      await ApiClient.post(`${AppSink}`, { query }, { headers })
      fetchListJob(id)
      setIsModalOpen(true)
      fetchNotification()
      setSelectedNotification({ id, ProfileImage, FirstName, LastName, JobType, ID, Datetime,jobId })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        {/* <Badge
          color='error'
          variant='dot'
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >

        </Badge> */}
           <Icon fontSize='1.625rem' icon='tabler:bell' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'inherit !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            <CustomChip skin='light' size='small' color='primary' label={`${notificationLength} New`} />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {matchedIds
            .slice(0, 6)
            .sort((a: any, b: any) => new Date(b.Datetime).getTime() - new Date(a.Datetime).getTime())
            .map((i: any, j: any) => {
              return (
                <Fragment key={i.ID}>
                  <Grid
                    onClick={() =>
                      handleNotification(i.ID, i.ProfileImage, i.FirstName, i.LastName, i.JobType, i.ID, i.Datetime,i.JobId)
                    }
                    container
                    sx={{
                      padding: '15px 8px',
                      cursor: 'pointer',
                      backgroundColor: i.Read === '1' ? '#cacaca' : 'inherit'
                    }}
                  >
                    <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      {i.ProfileImage ? (
                        <Avatar alt='Remy' src={i.ProfileImage} />
                      ) : (
                        <Avatar alt='Remy'>{i.FirstName.charAt(0)}</Avatar>
                      )}
                    </Grid>

                    <Grid item xs={7} sx={{ display: 'grid' }}>
                      {i.ProfileImage ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: '0.8125rem',
                              fontWeight: '400',
                              color: getColor()
                            }}
                          >
                            This <CustomChip rounded size='small' skin='light' color={'success'} label={i.JobId} /> was{' '}
                            {i.JobType === 'Start' ? 'started' : 'stopped'} by {i.FirstName}
                            {i.LastName}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography
                            sx={{
                              fontSize: '0.8125rem',
                              fontWeight: '400',
                              color: getColor()
                            }}
                          >
                            This <CustomChip rounded size='small' skin='light' color={'success'} label={i.JobId} /> was{' '}
                            {i.JobType === 'Start' ? 'started' : 'stopped'} by {i.FirstName}
                            {i.LastName}
                          </Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                      {i.Datetime ? (
                        <Typography
                          sx={{ fontSize: '0.8125rem', lineHeight: '1.53846', fontWeight: '400', color: getColor() }}
                        >
                          {formatDate(i.Datetime)}
                        </Typography>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                  <Divider />
                </Fragment>
              )
            })}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            fullWidth
            variant='contained'
            onClick={handleReadAllNotification}
          >
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
      {selectedNotification && (
        <CustomModal
          open={isModalOpen}
          onClose={handleCloseModal}
          width='500px'
          buttonText='Close'
          buttonOpenText='Open'
          onOpen={handleOpen}
        >
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <Typography style={{ color: getColor(), margin: '10px !important' }}>[esc]</Typography>
            <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleCloseModal}>
              <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
            </CustomCloseButton>
          </div>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedNotification.FirstName && !selectedNotification?.ProfileImage ? (
                  <>
                    <div
                      style={{
                        border: '1px solid #cacaca',
                        padding: '15px',
                        margin: '10px 10px 10px 0px',
                        borderRadius: '10px',
                        boxShadow: '4px 4px 4px #cacaca'
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56, fontSize: 28, backgroundColor: '#cacaca' }}>
                        {selectedNotification.FirstName.charAt(0).toUpperCase()}
                      </Avatar>
                    </div>
                  </>
                ) : (
                  <ImgStyled
                    sx={{ boxShadow: '4px 4px 4px #cacaca' }}
                    src={selectedNotification?.ProfileImage}
                    alt='Profile Pic'
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={9} sx={{ display: 'grid', gap: '2px' }}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '18px', fontWeight: '600', color: '#222222', paddingBottom: '5px' }}>
                  {selectedNotification.FirstName} {selectedNotification.LastName}
                </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: '400',
                    color: getColor()
                  }}
                >
                  This
                  <CustomChip rounded size='small' skin='light' color={'success'} label={selectedNotification.jobId} />{' '}
                  was {selectedNotification.JobType === 'Start' ? 'started' : 'stopped'} by{' '}
                  {selectedNotification.FirstName}
                  {selectedNotification.LastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex' }}>
                <Grid xs={6}>
                  <Link
                    variant='body2'
                    onClick={() => {
                      handleJob(selectedNotification.ID)
                    }}
                    component='button'
                  >
                    View details
                  </Link>
                </Grid>
                <Grid xs={6}>
                  <Typography
                    sx={{
                      float: 'right',
                      color: getColor()
                    }}
                  >
                    {formatDate(selectedNotification.Datetime)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CustomModal>
      )}
    </Fragment>
  )
}

export default NotificationDropdown
