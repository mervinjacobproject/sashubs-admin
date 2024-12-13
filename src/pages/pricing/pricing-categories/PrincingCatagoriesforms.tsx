import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  title: string
  priceperuom: string
  riskfactors: string
  status: boolean
  resetEditid: any
}

const PrincingCatagoriesform = ({ newId, editId, fetchData, resetEditid, rideData }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      priceperuom: '',
      riskfactors: '',
      status: true
    }
  })

  useEffect(() => {
    return () => {
      resetEditid()
    }
  }, [resetEditid])

  const getFormDetails = useCallback(
    (editId: any) => {
      const query = `
      query MyQuery {
        getPricing5AAB(ID: ${editId}) {
          CId
          ID
          PricePerUOM
          RiskFactors
          Status
          Title
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.get(`${AppSink}?query=${encodeURIComponent(query)}`, { headers })
        .then(res => {
          if (res.data.data.getPricing5AAB && res.data.data.getPricing5AAB) {
            const { Title, RiskFactors, Status, PricePerUOM } = res.data.data.getPricing5AAB
            setValue('title', Title)
            setValue('priceperuom', PricePerUOM)
            setValue('riskfactors', RiskFactors)
            setValue('status', Status === true)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    [setValue]
  )

  useEffect(() => {
    if (editId) {
      getFormDetails(editId)
    }
  }, [editId, getFormDetails])

  const onSubmit = (data: FormData) => {
    const designationExists = rideData?.some(
      (item: any) => item.Title.toLowerCase() === data.title.toLowerCase() && item.ID !== newId
    )
    if (designationExists) {
      toast.error('Title already exist')
      return
    }
    const statusValue = data.status ? true : false
    const query = newId
      ? `mutation my {
    updatePricing5AAB(input: {CId: 10, ID:${newId},  PricePerUOM: "${data.priceperuom}", RiskFactors: "${data.riskfactors}", Status: ${statusValue}, Title: "${data.title}"}) {
      CId
      ID
      PricePerUOM
      RiskFactors
      Status
      Title
    }
  }`
      : `mutation my {
    createPricing5AAB(input: {CId: 10, PricePerUOM:"${data.priceperuom}", RiskFactors: "${data.riskfactors}", Status: ${statusValue}, Title: "${data.title}"}) {
      CId
      ID
      PricePerUOM
      RiskFactors
      Status
      Title
    }
  }
  `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    const requestQuery = query

    ApiClient.post(`${AppSink}`, { query: requestQuery }, { headers })
      .then(res => {
        closeRightPopupClick()
        editId ? toast.success('Updated Successfully') : toast.success('Saved Successfully')
        fetchData()
      })
      .catch(err => {
        console.error(err)
      })
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
        {' '}
        Pricing Category
      </Typography>

      <div>
        <Controller
          name='title'
          control={control}
          defaultValue=''
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              autoFocus
              id='title'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Title
                  </span>
                </div>
              }
              variant='outlined'
              onChange={(e) => {
                const inputValue = e.target.value;
                const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                field.onChange(modifiedValue)
              }}
              fullWidth
              margin='normal'
              error={!!errors.title}
              helperText={errors.title && errors.title.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='priceperuom'
          control={control}
          rules={{
            required: 'Price per Unit is required'
          }}
          render={({ field }) => (
            <div style={{ position: 'relative' }}>
            <span
              style={{
              
                position: 'absolute',
                left: '10px',
                 top: '67%',
                 transform: 'translateY(-50%)',
                color: getColor(),
                zIndex: 1,
              }}
            >
              $
            </span>
            <CustomTextField
              {...field}
              id='priceperuom'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Price Per Unit
                  </span>
                </div>
              }
              type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.priceperuom}
              helperText={errors.priceperuom && errors.priceperuom.message}
              InputProps={{
                startAdornment: (
                  <span
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    {/* This space is to offset the dollar symbol */}
                  </span>
                ),
              }}
              style={{ paddingLeft: '20px' }} // Adjust padding to make space for the dollar symbol
            />
            </div>
          )}
        />
      </div>

      <div>
        <Controller
          name='riskfactors'
          control={control}
          defaultValue=''
          rules={{ required: 'Riskfactors is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='riskfactors'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Riskfactors
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              onChange={(e) => {
                const inputValue = e.target.value;
                const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                field.onChange(modifiedValue)
              }}
              margin='normal'
              error={!!errors.riskfactors}
              helperText={errors.riskfactors && errors.riskfactors.message}
            />
          )}
        />
      </div>

      <div className='status-container'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                checked={Boolean(field.value)}
                onChange={e => field.onChange(e.target.checked)}
                color='primary'
              />
              <Typography style={{ color: getColor() }}>{field.value ? 'Active' : 'Inactive'}</Typography>
            </>
          )}
        />
      </div>

      <div>
        <Button
          type='submit'
          sx={{
            mb: 2,
            mr: 2,
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
          {editId ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
export default PrincingCatagoriesform
