// ** React Imports
import { Fragment, SyntheticEvent, useState, useEffect } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Divider from '@mui/material/Divider'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import Country from './pending'
import WaitingJob from './pending'
import CompletedJob from './complete'

import ApiClient from 'src/apiClient/apiClient/apiConfig'
import PendingTable from './pending'
import OngingJob from './ongoing'

interface TimelineItemData {
  name: string
  address: string
}

// type TimelineData = Record<'sender' | 'receiver', TimelineItemData>

// type Data = Record<'Pending' | 'OnGoing' | 'Complete', TimelineData[]>

const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiTimelineDot-root': {
    border: 0,
    padding: 0
  }
})

const EcommerceOrders = () => {
  // ** State
  const [value, setValue] = useState<string>('Pending')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card sx={{ height: '800px' }}>
      <CardHeader 
        sx={{ pb: 4 }}
        title='Job'
        subheader='Deliveries in progress'
    
      />
      <TabContext value={value} >
        <TabList variant='fullWidth' onChange={handleChange} aria-label='tabs in orders card'>
          <Tab value='Pending' label='Pending' />
          <Tab value='Ongoing' label='Ongoing' />
          <Tab value='Complete' label='Complete' />
        </TabList>
        <TabPanel value='Pending'>
          <Fragment>
            <WaitingJob />
          </Fragment>
        </TabPanel>
        <TabPanel value='Ongoing'>
          <OngingJob />
        </TabPanel>
        <TabPanel value='Complete'>
          <Fragment>
            <CompletedJob />
          </Fragment>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default EcommerceOrders
