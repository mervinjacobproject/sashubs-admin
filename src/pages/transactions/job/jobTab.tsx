import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { Box, Grid, Accordion, AccordionSummary, Button, IconButton, Tooltip, AccordionDetails } from '@mui/material'
import JobWaitingTable from './jobWaitingTable'
import JobCompleteTable from './jobCompleteTable'
import JobInvoiceTable from './jobinvoiceTable'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: '10px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function JobTab() {
  const [value, setValue] = React.useState(0)
  const [fromJobComplete, setFromJobComplete] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    setFromJobComplete(newValue === 1 ? false : true)
  }

  useEffect(() => {
    if (!fromJobComplete) {
    }
  }, [value, fromJobComplete])

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return '#4a5070'
    } else if (selectedMode === 'light') {
      return '#FFFFFF'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return '#4a5070'
    } else {
      return '#FFFFFF'
    }
  }

  const getColorfont = () => {
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

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          allowScrollButtonsMobile
          onChange={handleChange}
          aria-label='full width tabs example'
        
        >
          <Tab
            sx={{ minWidth: '33%', backgroundColor:getColor(), color:getColorfont(), height: '66px', textTransform: 'uppercase' }}
            label='Waiting'
            {...a11yProps(0)}
          />
          <Tab
            sx={{ minWidth: '33%',backgroundColor:getColor(), color: getColorfont(), height: '66px', textTransform: 'uppercase' }}
            label='Job Complete'
            {...a11yProps(1)}
          />
          <Tab
            sx={{ minWidth: '33%',backgroundColor:getColor(), color: getColorfont(), height: '66px', textTransform: 'uppercase' }}
            label='Invoiced'
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <JobWaitingTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <JobCompleteTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <JobInvoiceTable />
      </CustomTabPanel>
    </Box>
  )
}
