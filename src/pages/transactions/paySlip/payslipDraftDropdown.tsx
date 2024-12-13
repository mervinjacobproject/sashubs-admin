import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'

interface ActionsDropdownProps {
  rowId: any
  fetchData: any
  defaultVal: string
  handlePaid : any
  handledraft: any
  handleNotPaid: any

}

const PaySlipStatusDropdown: React.FC<ActionsDropdownProps> = ({ rowId, fetchData, handlePaid,handleNotPaid,handledraft, defaultVal }) => {
  const [val, setVal] = useState('Draft')
  const handleStatus = async (rowId: string, newValue: string) => {
    try {
      let statusValue
      if (newValue === 'Draft') {
        statusValue = 1
      } else if (newValue === 'PaySlip') {
        statusValue = 0
      }
      const query = `
      mutation my {
        updatePaySlip5AAB(input: {ID: ${rowId}, Draft: ${statusValue}}) {
          Date
          DateTime
          Draft
          Employee
          ID
          IP
          Status
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      await ApiClient.post(`${AppSink}`, { query }, { headers })
      fetchData()
      handlePaid()
      handleNotPaid()
      handledraft()
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }
  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string
    if (newValue === 'Paid') {
      alert('JOB already in Paid List')
    } else {
      setVal(newValue)
      handleStatus(rowId, newValue)
    }
  }

  return (
    <CustomTextField
      select
      sx={{ mr: 4, mb: 2, fontSize: '12px' }}
      SelectProps={{
        renderValue: selected => ((selected as string)?.length === 0 ? 'Draft' : (selected as string))
      }}
      value={defaultVal}
      onChange={handleChange}
    >
      <MenuItem sx={{ fontSize: '12px' }} value='Draft'>
        Draft
      </MenuItem>
      <MenuItem sx={{ fontSize: '12px' }} value='PaySlip'>
        Payslip
      </MenuItem>
    </CustomTextField>
  )
}

export default PaySlipStatusDropdown
