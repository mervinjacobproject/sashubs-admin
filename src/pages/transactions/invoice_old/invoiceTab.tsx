import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DraftInvoice from './draft'
import PaidInvoice from './paid'
import NotPaid from './notpaid'

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
                <Box sx={{ paddingTop: "10px" }}>
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} allowScrollButtonsMobile onChange={handleChange} aria-label='full width tabs example' sx={{
                    background: "#fff", height: "66px", borderRadius: "5px", "& .MuiTabs-indicator": {
                        backgroundColor: "#FF8A30)"
                    }
                }}>
                    <Tab sx={{ minWidth: '33%', color: "#2C2C28", height: "66px", marginTop:'7px' }} label={
                        <div>
                            DRAFT
                            <div style={{ fontSize: '15px', color: '#555', marginBottom:'7px', paddingBottom: "6px", padding:'5px' }}>$ 0.00</div>
                        </div>
                    } {...a11yProps(0)} />

                    <Tab sx={{ minWidth: '33%', color: "#2C2C28", height: "66px",marginTop:'7px'  }} label={
                        <div>
                            NOT PAID
                            <div style={{ fontSize: '15px', color: '#555',  marginBottom:'7px', paddingBottom: "6px" ,padding:'5px' }}>$ 10,228,493.24</div>
                        </div>
                    } {...a11yProps(1)} />

                    <Tab sx={{ minWidth: '33%', color: "#2C2C28", height: "66px" ,marginTop:'7px'}} label={
                        <div>
                            PAID
                            <div style={{ fontSize: '15px', color: '#555',  marginBottom:'7px', paddingBottom: "6px",padding:'5px' }}>$ 34,544,155.07</div>
                        </div>
                    }{...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <DraftInvoice />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <NotPaid />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <PaidInvoice />
            </CustomTabPanel>
        </Box>
    )
}
