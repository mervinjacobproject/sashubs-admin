import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { Settings } from 'src/@core/context/settingsContext'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'
import AppSink from 'src/commonExports/AppSink'
import { useAuth } from 'src/hooks/useAuth'
import { dispatch } from 'src/store'
import { fetchUserProfile, selectUserProfile } from 'src/store/apps/admin'
import { fetchDataPageMaster } from 'src/store/apps/pageMaster'
import { fetchDataRole } from 'src/store/apps/role'

interface Props {
  settings: Settings
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 38,
  height: 38
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = (props: Props) => {
  const tempUserData = typeof window != 'undefined' ? window.localStorage.getItem('userData') : null
  const userData = tempUserData ? JSON.parse(tempUserData) : null
  const [userDetails, setUserDetails] = useState<any>([])
  const { settings } = props
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const router = useRouter()
  const { logout } = useAuth()
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  const userProfileState = useSelector(selectUserProfile)
  const loginId = localStorage.getItem('adminLoginId')
  const [datasets, setDatasets] = useState<any>([])

  const profileImageUrl = userData ? userData?.image || 'defaultImageUrl' : 'defaultImageUrl'
  const adminFirstname = userData ? userData?.firstname : 'admin'
  const adminLastname = userData ? userData?.lastname : 'admin'
  const adminUserId = userProfileState?.data?.[0]?.UserId
  const userType = localStorage.getItem('adminLoginType')

  useEffect(() => {
    const roleId = userProfileState.data?.[0]?.RoleId
    if (roleId) {
      dispatch(fetchDataRole(roleId))
      dispatch(fetchDataPageMaster())
    }
  }, [userProfileState])

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [])

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {adminFirstname && !profileImageUrl ? (
          <Avatar sx={{ width: 38, height: 38, fontSize: 28, borderRadius: '50%', backgroundColor: '#cacaca' }}>
            {adminFirstname.charAt(0).toUpperCase()} {adminLastname.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <Avatar
            alt={adminFirstname}
            src={profileImageUrl}
            sx={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }}
          />
        )}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} /> */}
            {adminFirstname && !profileImageUrl ? (
              <Avatar sx={{ width: 38, height: 38, fontSize: 28, borderRadius: '50%', backgroundColor: '#cacaca' }}>
                {adminFirstname.charAt(0).toUpperCase()} {adminLastname.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                alt={adminFirstname}
                src={profileImageUrl}
                sx={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain !important' }}
              />
            )}
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              {/* <Typography sx={{ fontWeight: 500 }}>{adminFirstname.charAt(0).toUpperCase(0)}</Typography> */}
              <Typography sx={{ fontWeight: 500 }}>
                {adminFirstname?.charAt(0).toUpperCase() + adminFirstname?.slice(1)}
              </Typography>
              {/* {userType === '0' ?
                (<Typography variant='body2'>Employee</Typography>) : (
                  <Typography variant='body2'>Admin</Typography>
                )} */}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
          <Box sx={styles}>
            <Icon icon='tabler:user-check' />
            My Profile
          </Box>
        </MenuItemStyled>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
