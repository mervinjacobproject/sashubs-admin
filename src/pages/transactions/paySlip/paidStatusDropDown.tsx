import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { toast } from 'react-hot-toast'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'

interface ActionsDropdownProps {
  defaultValue: string
  rowId: number
  fetchData: any
  onUpdate: (newValue: string) => void
  handlePaid: any
  handledraft: any
  handleNotPaid: any
}

const PaidStatusDropdown: React.FC<ActionsDropdownProps> = ({
  rowId,
  defaultValue,
  fetchData,
  onUpdate,
  handlePaid, handleNotPaid, handledraft,
}: ActionsDropdownProps) => {
  const [val, setVal] = useState(defaultValue)

  const handleStatus = async (newValue: any) => {
    try {
      let statusValue: boolean
      if (newValue === 'Paid') {
        statusValue = true
      } else if (newValue === 'Not Paid') {
        statusValue = false
      } else {
        throw new Error('Invalid status value')
      }

      const query = `
        mutation my {
          updatePaySlip5AAB(input: {ID: ${rowId}, Status: ${statusValue}}) {
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
      handledraft()
      handleNotPaid()
    } catch (error) {
      toast.error('Failed to update pay slip status')
    }
  }

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string
    setVal(newValue)

    if (newValue === 'Paid') {
      onUpdate(newValue)
      handleStatus('Paid')
    } else if (newValue === 'Not Paid') {
      onUpdate(newValue)
      handleStatus('Not Paid')
    }
  }

  return (
    <CustomTextField
      select
      value={val}
      sx={{ mr: 4, mb: 2, fontSize: '12px' }}
      SelectProps={{
        renderValue: selected => ((selected as string)?.length === 0 ? 'Waiting' : (selected as string))
      }}
      onChange={handleChange}
    >
      <MenuItem sx={{ fontSize: '12px' }} value='Not Paid'>
        Not Paid
      </MenuItem>
      <MenuItem sx={{ fontSize: '12px' }} value='Paid'>
        Paid
      </MenuItem>
    </CustomTextField>
  )
}

export default PaidStatusDropdown
