import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { Grid } from '@mui/material'
import CustomerNew from './CustomerNew'
import CustomerContact from './CustomerContact'
import CustomerImage from './CustomerImage'
import CustomerAddress from './CustomerAddress'
import { fetchData } from 'src/store/apps/user'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import toast from 'react-hot-toast'
//import CustomerReference from './CustomerReference'
import dynamic from 'next/dynamic';

const CustomerReference = dynamic(() => import('./CustomerReference'), {
  ssr: false,
});
const steps = [
  {
    title: 'Customer Details',
    icon: 'raphael:customer',
    subtitle: 'Provide your personal information.'
  },
  {
    icon: 'fa6-solid:address-card',
    subtitle: 'Enter your address details.',
    title: 'Address'
  },
  {
    icon: 'lsicon:tree-outline',
    subtitle: 'Enter your Reference Tree details.',
    title: 'My Reference Tree'
  }
]

const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  height: '100%',
  minWidth: '15rem',
  '& .MuiStep-root:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 0
  }
}))

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(6)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))
interface CustomerNewMethods {
  childMethod: any
  triggerValidation: any
}

interface CustomerAddressMethods {
  childMethod: any
  triggerValidation: any
}
interface CustomerReferenceMethods {
  childMethod: any
  triggerValidation: any
}

const CustomerSteperform = ({ editid, fetchData, customer }: any) => {
  const CustomerNewRef = useRef<CustomerNewMethods>(null)
  const CustomerAddressRef = useRef<CustomerAddressMethods>(null)
  const CustomerReferenceRef = useRef<CustomerReferenceMethods>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [currentEditId, setCurrentEditId] = useState<any>(0)
  const theme = useTheme()
  const [createId, setCreateId] = useState('')

  const handleNext = () => {
    setActiveStep(activeStep + 1)
    fetchData()
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const callChildMethod = async () => {
    let isValid = false
    switch (activeStep) {
      case 0:
        isValid = await CustomerNewRef?.current?.triggerValidation()
        if (CustomerNewRef?.current && isValid) {
          CustomerNewRef?.current.childMethod({})
        }

        break

      case 1:
        isValid = await CustomerAddressRef?.current?.triggerValidation()
        if (CustomerAddressRef?.current && isValid) {
          CustomerAddressRef?.current.childMethod()
         // fetchData()
          // toast.success('Submitted Successfully..!!')
          //closeRightPopupClick()
        }
        break
        case 2:
          isValid = await CustomerReferenceRef?.current?.triggerValidation()
          if (CustomerReferenceRef?.current && isValid) {
            CustomerReferenceRef?.current.childMethod()
           // fetchData()
            // toast.success('Submitted Successfully..!!')
            closeRightPopupClick()
          }
          break
      default:
        break
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CustomerNew
            editid={currentEditId ? currentEditId : editid}
            handleNext={handleNext}
            setEditId={setEditId}
            ref={CustomerNewRef}
            onFetchData={fetchData}
            customer={customer}
            createId={createId}
            setCreateId={setCreateId}
          />
        )

      case 1:
        return (
          <CustomerAddress
            editid={currentEditId ? currentEditId : editid}
            handleNext={handleNext}
            ref={CustomerAddressRef}
            onFetchData={fetchData}
            customer={customer}
            createId={createId}
          />
        )
        case 2:
        return (
          <CustomerReference
             editid={currentEditId ? currentEditId : editid}
            handleNext={handleNext}
            ref={CustomerReferenceRef}
            onFetchData={fetchData}
            customer={customer}
            createId={createId}
          />
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const setEditId = (createdId: any) => {
    setCurrentEditId(createdId)
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1
    const handleSaveAndFinish = () => {
      if (stepCondition) {
        callChildMethod()
      } else {
        callChildMethod()
      }
    }

    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
         {activeStep > 0 && (
       <Button
       style={{
         border: `2px solid ${theme.palette.grey[500]}`, // Set border color from theme
         fontWeight: '700',
         color: theme.palette.mode === 'dark' ? 'white' : 'black', // Change text color based on theme mode
       }}
       variant='tonal'
       color='secondary'
       onClick={handlePrev}
       startIcon={<Icon icon={theme.direction === 'ltr' ? 'ph:arrow-left-light' : 'ph:arrow-left-light'} />}
     >
       Previous
     </Button>

      )}

      {/* Show Save & Next button for all activeSteps */}
      <Grid item xs={6} spacing={2}></Grid>
        <Button
          sx={{
            '&:hover': {
              background: '#FF8A30'
            }
          }}
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          onClick={handleSaveAndFinish}
        >
          {stepCondition ? 'Save & Finish' : 'Save & Next'}
          <Icon
            icon={
              stepCondition
                ? 'material-symbols-light:save-sharp'
                : theme.direction === 'ltr'
                ? 'ph:arrow-right-light'
                : 'ph:arrow-right-light'
            }
          />
        </Button>
      </Box>
    )
  }

  const backColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.78)'
    } else if (selectedMode === 'light') {
      return '#fff'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.78)'
    } else {
      return '#fff'
    }
  }

  return (
    <>
      <Typography
        sx={{
          backgroundColor: backColor(),
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'sans-serif',
          padding: '10px',
          color: 'black'
        }}
      >
        Customer Details
      </Typography>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Grid item xs={3}>
          <StepperHeaderContainer>
            <StepperWrapper sx={{ height: '100%' }}>
              <Stepper
                connector={<></>}
                orientation='vertical'
                activeStep={activeStep}
                sx={{ height: '100%', minWidth: '15rem' }}
              >
                {steps.map((step, index) => {
                  const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar
                  const isStepDisabled = (index >= 1 && index <= 2) && editid === undefined
                  
                  return (
                    <Step
                      key={index}
                      onClick={() => setActiveStep(index)}
                      sx={{
                        '&.Mui-completed + svg': { color: 'primary.main' },
                        ...(isStepDisabled && { opacity: 0.5, pointerEvents: 'none' })
                      }}
                    >
                      <StepLabel>
                        <div className='step-label'>
                          <RenderAvatar
                            variant='rounded'
                            {...(activeStep >= index && { skin: 'light' })}
                            {...(activeStep === index && { skin: 'filled' })}
                            {...(activeStep >= index && { color: 'primary' })}
                            sx={{
                              ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                              ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                            }}
                          >
                            <Icon icon={step.icon} fontSize='1.5rem' />
                          </RenderAvatar>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </StepperHeaderContainer>
        </Grid>
        <Grid item xs={9}>
          <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
            {renderContent()}
            {renderFooter()}
          </CardContent>
        </Grid>
      </Card>
    </>
  )
}

export default CustomerSteperform
