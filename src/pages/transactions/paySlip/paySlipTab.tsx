import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PaySlipDraftTable from './paySlipDraftTable'
import PaySlipPaidTable from './paySlipPaidTable'
import PaySlipNotPaidTable from './paySlipNotPaidTable'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState, useEffect } from 'react'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'



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

export default function InvoiceTab() {
  const [value, setValue] = React.useState(0)
  const [draft, setDraft] = React.useState(0)
  const [notpaid, setNotPaid] = React.useState(0)
  const [paid, setPaid] = React.useState(0)



  const handledraft = () => {
    const query = `query MyQuery {
      listPaySlip5AABS(filter: {Draft: {eq: 1}}) {
        totalAmount
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        const items = res.data.data.listPaySlip5AABS.totalAmount
        setDraft(items)
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }
  const handleNotPaid = () => {
    const query = `query MyQuery {
      listPaySlip5AABS(filter: {Status: {eq: false}}) {
        totalAmount
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        const items = res.data.data.listPaySlip5AABS.totalAmount

        // let total = 0
        // items.forEach((item: any) => {
        //   if (item.FinalNetTotal !== '') {
        //     total += parseFloat(item.FinalNetTotal)
        //   }
        // })
        setNotPaid(items)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }
  const handlePaid = () => {
    const query = `query MyQuery {
      listPaySlip5AABS(filter: {Status: {eq: true}}) {
        totalAmount
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        const items = res.data.data.listPaySlip5AABS.totalAmount

        // let total = 0
        // items.forEach((item: any) => {
        //   if (item.FinalNetTotal !== '') {
        //     total += parseFloat(item.FinalNetTotal)
        //   }
        // })
        setPaid(items)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    handledraft()
    handleNotPaid()
    handlePaid()
  }, [])



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          allowScrollButtonsMobile
          onChange={handleChange}
          aria-label='full width tabs example'
          sx={{
            background: '#fff',
            height: '66px',
            borderRadius: '5px',
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF8A30)'
            }
          }}
        >
          <Tab
            sx={{ minWidth: '33%', color: '#2C2C28', height: '66px', marginTop: '7px' }}
            label={
              <div>
                <span> Draft</span>
                <div
                  style={{
                    fontSize: '15px',
                    color: '#555',
                    marginBottom: '7px',
                    paddingBottom: '6px',
                    padding: '5px'
                  }}
                >
                  $ <AnimatedNumber value={draft} duration={1200} />
                </div>
              </div>
            }
          />
          <Tab
            sx={{ minWidth: '33%', color: '#2C2C28', height: '66px', marginTop: '7px' }}
            label={
              <div>
                <span>Not Paid</span>
                <div
                  style={{
                    fontSize: '15px',
                    color: '#555',
                    marginBottom: '7px',
                    paddingBottom: '6px',
                    padding: '5px'
                  }}
                >
                  $ <AnimatedNumber value={notpaid} duration={1200} />
                </div>
              </div>
            }
          />
          <Tab
            sx={{ minWidth: '33%', color: '#2C2C28', height: '66px', marginTop: '7px' }}
            label={
              <div>
                <span>Paid</span>
                <div
                  style={{
                    fontSize: '15px',
                    color: '#555',
                    marginBottom: '7px',
                    paddingBottom: '6px',
                    padding: '5px'
                  }}
                >
                  $ <AnimatedNumber value={paid} duration={1200} />
                </div>
              </div>
            }
          />
        </Tabs>
      </Box>
      {[<PaySlipDraftTable handledraft={handledraft} handlePaid={handlePaid}  handleNotPaid={handleNotPaid} key='draft' />, <PaySlipNotPaidTable handledraft={handledraft} handlePaid={handlePaid}  handleNotPaid={handleNotPaid} key='notPaid' />, <PaySlipPaidTable handledraft={handledraft} handlePaid={handlePaid}  handleNotPaid={handleNotPaid} key='paid' />].map(
        (Component, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {Component}
          </CustomTabPanel>
        )
      )}
    </Box>
  )
}
