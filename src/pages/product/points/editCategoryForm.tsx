import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Typography, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

interface FormData {
  ProductID: any
  Amount: string
  L1: number
  L2: number
  L3: number
  L4: number
  L5: number
  L6: number
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
type LFieldNames = `L${1 | 2 | 3 | 4 | 5 | 6}`; // This defines L1, L2, L3, L4, L5, L6 as valid keys

const TransactionEditForm = ({ employeegroupName, onfetchData, onClose }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      ProductID: employeegroupName?.ProductID || '',
      Amount: employeegroupName?.Amount || '',
      L1: employeegroupName?.L1 || 0,
      L2: employeegroupName?.L2 || 0,
      L3: employeegroupName?.L3 || 0,
      L4: employeegroupName?.L4 || 0,
      L5: employeegroupName?.L5 || 0,
      L6: employeegroupName?.L6 || 0,
    }
  })
  const [Product, setProduct] = useState([])
  useEffect(() => {
    fetchProductData()
  }, [])
  const fetchProductData = async () => {
    try {
      const res = await ApiClient.post(`/getproduct`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setProduct(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  useEffect(() => {
    if (employeegroupName) {
      setValue('ProductID', employeegroupName.ProductID)
      setValue('Amount', employeegroupName.Amount)
      setValue('L1', employeegroupName.L1)
      setValue('L2', employeegroupName.L2)
      setValue('L3', employeegroupName.L3)
      setValue('L4', employeegroupName.L4)
      setValue('L5', employeegroupName.L5)
      setValue('L6', employeegroupName.L6)
    }
  }, [employeegroupName, setValue])

  const onSubmit = async (data: FormData) => {
    
      ApiClient.post(`/updatelevel?Id=${employeegroupName?.Id}&ProductID=${data.ProductID}&L1=${data.L1}&L2=${data.L2}&L3=${data.L3}&L4=${data.L4}&L5=${data.L5}&L6=${data.L6}&Amount=${data.Amount}`)
       .then((res: any) => {
          toast.success('Levels Updated successfully')
          onClose()
        onfetchData()
        //toast.success('Updated Successfully')
      
    }) 
    .catch((err: any) => {
      console.error('Error adding Levels:', err)
      toast.error('Error adding Levels')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'sans-serif',
          padding: '10px'
        }}
      >
        Edit Level Structure
      </Typography>
      <div>
        <Controller
          name='ProductID'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={Product.sort((a: any, b: any) => a.ProductName.localeCompare(b.ProductName))}
                getOptionLabel={(option: any) => option.ProductName || ''}
                value={Product?.find((pricevalue: any) => pricevalue?.Id === watch('ProductID')) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.Id || null)
                }}
                isOptionEqualToValue={(option, value) => option?.Id === value?.Id}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id="ProductName"
                    label={
                      <div>
                        <span
                          className='vehicleType'
                          style={{
                            color: getColor(),
                            fontSize: '14px'
                          }}
                        >
                          Product Name
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    error={Boolean(errors.ProductID) && !field.value}
                    helperText={errors.ProductID && !field.value ? 'Product Name is required' : ''}
                    inputProps={{
                      ...params.inputProps
                    }}
                  />
                )}
              />
            </>
          )}
        />
      </div>
      {/* <Box sx={{ mb: 2 }}>
        <Controller
          name='ProductID'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={[]} // Provide options if needed, or populate via props
              getOptionLabel={(option: any) => option.ProductName || ''}
              onChange={(_, newValue) => {
                field.onChange(newValue?.Id || null)
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label="Product Name"
                  error={Boolean(errors.ProductID)}
                  helperText={errors.ProductID ? 'Product Name is required' : ''}
                />
              )}
            />
          )}
        />
      </Box> */}

      <Box sx={{ mb: 2 }}>
        <Controller
          name='Amount'
          control={control}
          rules={{ required: 'Amount is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              label="Amount"
              type='number'
              fullWidth
              error={!!errors.Amount}
              helperText={errors.Amount && errors.Amount.message}
            />
          )}
        />
      </Box>

      {/* Fields for L1 to L6 */}
      {[1, 2, 3, 4, 5, 6].map(index => (
        <Box key={index} sx={{ mb: 2 }}>
          <Controller
            name={`L${index}` as LFieldNames}
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label={`Level ${index}`}
                type='number'
                fullWidth
              />
            )}
          />
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          type='submit'
          sx={{
            float: 'right',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90px',
            padding: '5px !important',
            height: '35px',
            fontSize: '15px',
            whiteSpace: 'nowrap',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            }
          }}
          disabled={!isDirty || !isValid}
          variant='contained'
        >
          <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
          Update
        </Button>
      </Box>
    </form>
  )
}

export default TransactionEditForm
