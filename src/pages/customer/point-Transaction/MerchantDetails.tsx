import React from 'react'
import { useRouter } from 'next/router';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import toast from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
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
import { ConstructionOutlined } from '@mui/icons-material';
import MerchantNew from 'src/pages/merchant/merchant/MerchantNew';
import MerchantRewards from 'src/pages/merchant/merchant/MerchantRewards';
import MerchantAddress from 'src/pages/merchant/merchant/MerchantAddress';
import { data } from 'jquery';

const steps = [
    {
      title: 'Personal Information',
      icon: 'tdesign:personal-information',
      subtitle: 'Provide your Merchant information.'
    },
    {
      title: 'General Information',
      icon: 'streamline:information-desk-customer',
      subtitle: 'Provide your Merchant Reward information.'
    },
    {
      icon: 'fa6-solid:address-card',
      subtitle: 'Enter merchant address details.',
      title: 'Merchant Address Details'
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
  
  interface MerchantNewMethods {
    childMethod: any
    triggerValidation: any
  }
  
  interface MerchantAddressMethods {
    childMethod: any
    triggerValidation: any
  }
  
  interface MerchantRewardsMethods {
    childMethod: any
    triggerValidation: any
  }
interface Merchant {
    OwnerName: string;
    // Define other properties as needed
  }

function MerchantDetails() {
    const MerchantNewRef = useRef<MerchantNewMethods>(null)
  const MerchantAddressRef = useRef<MerchantAddressMethods>(null)
  const MerchantRewardsRef = useRef<MerchantRewardsMethods>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [currentEditId, setCurrentEditId] = useState<any>(0)
  const [customergroupname, setCustomergroupname] = useState<any[]>([])

  const theme = useTheme()
  const [createId, setCreateId] = useState('')

  const handleNext = () => {
   // debugger
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    //fetchData()
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
  }



  const callChildMethod = async () => {
    let isValid = false
    switch (activeStep) {
      case 0:
        isValid = await MerchantNewRef?.current?.triggerValidation()
        if (MerchantNewRef?.current && isValid) {
          MerchantNewRef?.current.childMethod({})
        }
        break
      case 1:
        isValid = await MerchantRewardsRef?.current?.triggerValidation()
        if (MerchantRewardsRef?.current && isValid) {
          MerchantRewardsRef?.current.childMethod()
        }
        break
      case 2:
        isValid = await MerchantAddressRef?.current?.triggerValidation()
        if (MerchantAddressRef?.current && isValid) {
          MerchantAddressRef?.current.childMethod()
          //fetchData()
          // toast.success('Submitted Successfully..!!')
          closeRightPopupClick()
        }
        break
      default:
        break
    }
  }
    const router = useRouter();
    const { merchantID } = router.query;
    
    const [merchantData, setMerchantData] = useState<any | null>(null)
    useEffect(() => {
       // MerchantDetails()
       if(merchantID)
       {
        fetchMerchantName()
       }
      }, [merchantID])

      const fetchMerchantName = async () => {
      
        try {
          const res = await ApiClient.post(`/getmerchant`);
          const response = res.data.data;
          setCustomergroupname(response)
          // Filter the data where merchantID matches
          const filteredData = response.filter((row: any) => row.id == merchantID);
      
          // Add serial number after filtering
          const dataWithSerialNumber = filteredData.map((row: any, index: number) => ({
            ...row,
            'S.No': index + 1
          }));
          //setCustomergroupname(dataWithSerialNumber)
          dataWithSerialNumber.map((data: any) => {
          setMerchantData(data);  
          })  
        } catch (err) {
          toast.error('Error fetching data:');
        }
      };
      const getStepContent = (step: number) => {
        switch (step) {
          case 0:
            return (
              <MerchantNew
              editid={currentEditId ? currentEditId : merchantData?.id}
                handleNext={handleNext}
                setEditId={setEditId}
                ref={MerchantNewRef}
                customer={merchantData}
                createId={createId}
                setCreateId={setCreateId}
    
                customergroupname={customergroupname}
              />
            )
          case 1:
            return (
              <MerchantRewards
              editid={currentEditId ? currentEditId : merchantData?.id}
                handleNext={handleNext}
                setEditId={setEditId}
                ref={MerchantRewardsRef}
                 //customer={merchantData}
                onFetchData={fetchMerchantName}
                createId={createId}
                // setCreateId={setCreateId}
                customergroupname={customergroupname}
              />
            )
          case 2:
            return (
              <MerchantAddress
              editid={currentEditId ? currentEditId : merchantData?.id}
                handleNext={handleNext}
                ref={MerchantAddressRef}
                onFetchData={fetchMerchantName}
                createId={createId}
                editStatus={merchantData.Status}
                customer={merchantData}
                customergroupname={customergroupname}
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
          {/* Show Previous button only if activeStep is greater than 0 */}
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
          <Grid item xs={7} spacing={2}></Grid>
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
            Merchant Details
          </Typography>
          <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Grid item xs={3} spacing={2}>
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
                      const isStepDisabled = (index >= 1 && index <= 2) && (!merchantData || !merchantData.id);

    
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
            <Grid item xs={9}  spacing={2}>
              <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
                {renderContent()}
                {renderFooter()}
              </CardContent>
            </Grid>
          </Card>
        </>
      )
}

export default MerchantDetails
