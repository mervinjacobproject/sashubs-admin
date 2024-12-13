import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'

interface ActionsDropdownProps {
  value: string
  onChange: (value: string) => void
  rowId: number
  fetchData: any
}

const PaidDraftDropdown: React.FC<ActionsDropdownProps> = ({ rowId, value, onChange, fetchData }) => {
  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string
    onChange(newValue)
    const apiUrl =
      newValue === '0'
        ? `https://api.5aabtransport.com.au/api.php?moduletype=payslip&apitype=edit_status&id=${rowId}&draft=draft`
        : `https://api.5aabtransport.com.au/api.php?moduletype=payslip&apitype=edit_status&id=${rowId}&draft=payslip`
    try {
      await axios.post(apiUrl)
      toast.success(`Payslip status updated to ${newValue === '0' ? 'Draft' : 'Payslip'}`)
      fetchData(1, 10, '', '')
    } catch (error) {
      console.error('Error making API request:', error)
    }
  }

  return (
    <>
      {value === 'Payslip' ? (
        <CustomChip
          rounded
          size='small'
          color={'secondary'}
          label={'Payslip'}
          sx={{ fontSize: '13px', fontWeight: '15px', width: '100px' }}
        />
      ) : (
        <CustomTextField
          select
          defaultValue='Waiting'
          sx={{ mr: 4, mb: 2, fontSize: '12px' }}
          value={value === 'Draft' ? '0' : value === 'Payslip' ? '1' : ''}
          onChange={handleChange}
        >
          <MenuItem sx={{ fontSize: '12px' }} value='0'>
            Draft
          </MenuItem>
          <MenuItem sx={{ fontSize: '12px' }} value='1'>
            Payslip
          </MenuItem>
        </CustomTextField>
      )}
    </>
  )
}

export default PaidDraftDropdown
