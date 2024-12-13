import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import React,{useEffect,useContext,useState} from 'react'
import { Settings } from 'src/@core/context/settingsContext'
import FullscreenToggle from 'src/@core/layouts/components/shared-components/FullscreenToggle'
import FullZoom from 'src/@core/layouts/components/shared-components/FullZoom'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown, {
  NotificationsType
} from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { AuthContext } from 'src/context/AuthContext'
import { useAuth } from 'src/hooks/useAuth'
import SimpleListMenu from './UrlMenuBar'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const notifications: NotificationsType[] = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const shortcuts: ShortcutsType[] = [
  {
    title: 'Merchant',
    url: '/merchant/merchant',
    icon: 'game-icons:shop',
    subtitle: 'Merchant Details'
  },
  {
    title: 'Customer',
    url: '/customer/customer/',
    icon: 'akar-icons:person',
    subtitle: 'Customer Details'
  },
  {
    subtitle: 'Product Details',
    title: 'Product',
    url: '/product/point_product',
    icon: 'fluent-mdl2:product-variant'
  },
  {
    subtitle: 'Transaction Details',
    title: 'Tranasaction',
    url: '/customer/transaction',
    icon: 'carbon:batch-job-step'
  },
  {
    url: '/common/country/',
    icon: 'gis:search-country',
    subtitle: 'Country Details',
    title: 'Country'
  }
]

const AppBarContent = (props: Props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const auth = useAuth()
  const router = useRouter()
  const {
    projectData,
    handleScoreData,
    handleScoreDataApi,
    setLoading,
    setSeoScoreData,
    setSelectedProjectData,
    setApiLoading,
    selectedDomain,
    setSelectedDomain
  }: any = useContext(AuthContext)

  
  const DomainID = typeof window != 'undefined' && localStorage.getItem('DomainID');


  const handleDomainChange = async (val: any) => {
    setSelectedDomain(val)
    setSelectedProjectData([])
    localStorage.setItem('DomainID', val)
    const pathname: any = window.location.pathname
    if (pathname != '/dashboards/') {
      router.push('/dashboards')
    }
    setSeoScoreData([])
    setApiLoading(true)
    await handleScoreDataApi(val)
  }

  useEffect(() => {
    console.log("projectGetData",projectData,DomainID);
    if (projectData && projectData.length > 0) {
      setApiLoading(true)
      handleScoreDataApi(DomainID || projectData[0].id)
      setSelectedDomain(DomainID || projectData[0].id)
    }
  }, [projectData])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ display: 'flex', alignItems: 'center' }}>
        <Box className='domain_search_box' sx={{ minWidth: 200, padding: 1 }}>
          <SimpleListMenu projectData={projectData} handleDomainChange={handleDomainChange} DomainID={DomainID} />
        </Box>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <FullZoom />
        <FullscreenToggle />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
            <NotificationDropdown settings={settings} notifications={notifications} />
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
