import React, { useState, useEffect } from 'react'
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
// Create a union of the names we want to use in the form
type LFieldNames = `L${1 | 2 | 3 | 4 | 5 | 6}`; // This defines L1, L2, L3, L4, L5, L6 as valid keys

const TransactionForm = ({ onfetchData,designation, onClose }: any) => {
  const [product, setProduct] = useState([])
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      ProductID: '',
      Amount: '',
      L1: 0,
      L2: 0,
      L3: 0,
      L4: 0,
      L5: 0,
      L6: 0,
    }
  })

  useEffect(() => {
    fetchProductData()
  }, [])

  const fetchProductData = async () => {
    try {
      const res = await ApiClient.post(`/getproduct`)
      const response = res.data.data
      const designationProductNames = designation.map((item: any) => item.ProductName);
const missingProducts = response.filter((item: any) => !designationProductNames.includes(item.ProductName));
setProduct(missingProducts);
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const requestData = {
        ProductID: data.ProductID,
        Amount: data.Amount,
        L1: data.L1,
        L2: data.L2,
        L3: data.L3,
        L4: data.L4,
        L5: data.L5,
        L6: data.L6,
      }

      const endpoint = `/createlevel`
      const response = await ApiClient.post(endpoint, requestData)

      if (response.status === 200) {
        onClose()
        onfetchData()
        toast.success('Saved Successfully')
      }
    } catch (err) {
      toast.error('Error saving transaction')
    }
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
        Add Level Structure
      </Typography>

      <Box sx={{ mb: 2 }}>
      <Controller
          name='ProductID'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={product.sort((a: any, b: any) => a.ProductName.localeCompare(b.ProductName))}
                getOptionLabel={(option: any) => option.ProductName || ''}
                value={product?.find((pricevalue: any) => pricevalue?.Id === watch('ProductID')) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.Id || null)
                  //setMerchantName(newValue.OwnerName)
                }}
                isOptionEqualToValue={(option, value) => option?.Id === value?.Id}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id='ProductID'
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
        
      </Box>

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
        <Box key={index} sx={{ mb: 2 }}> {/* Add margin-bottom for spacing */}
          <Controller
            name={`L${index}` as LFieldNames} // Cast to LFieldNames
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

      <Box sx={{ mt: 2 }}> {/* Margin Top for Submit Button */}
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
          Save
        </Button>
      </Box>
    </form>
  )
}

export default TransactionForm
