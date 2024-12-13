// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
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
import Jobstepercard, { JobstepercardInfoMethods } from './jobstepercard'

import Jobtask, { JobtaskInfoMethods } from './jobtask'
import Workdetails, { JobworkerInfoMethods } from './jobworkdetail'
import JobAdditionalCharges, { JobAdditonalInfoMethods } from './jobadditionalcharge'
import PodDetails from './podDetails'
import JobNotes from './podNotes'
import AdditionalNotes from './additionalNotes'
import InvoiceJobtask from './jobtask'
import toast from 'react-hot-toast'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'

// import WorkDetails from './jobworkdetail'

const steps = [
  {
    title: 'Add New Invoice',
    icon: 'tabler:users',
    subtitle: 'Provide your personal information'
  },
  {
    icon: 'tabler:id',
    title: 'Tasks',
    subtitle: 'Enter your address details'
  },
  {
    title: 'Additional Charges',
    icon: 'tabler:credit-card',
    subtitle: 'Review and select your rate card'
  },
  {
    icon: 'mdi:cloud-access-outline',
    subtitle: 'Grant seamless access to the app.',
    title: 'Work Details'
  }

  // {
  //   icon: 'mdi:cloud-access-outline',
  //   subtitle: 'Receipt of goods received.',
  //   title: 'Pod Details'
  // },

  // {
  //   icon: 'uil:notes',
  //   subtitle: 'Receipt of goods received.',
  //   title: 'Job Notes'
  // },
  // {
  //   icon: 'uil:notes',
  //   subtitle: 'Receipt of goods received.',
  //   title: 'Additional Notes'
  // }
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

const Jobsteperform = ({ geteditId, editId, fetchData }: any) => {
 const [activeStep, setActiveStep] = useState<number>(0)
  const personalInfoRef = useRef<JobstepercardInfoMethods>(null)
  const TaskRef = useRef<JobtaskInfoMethods>(null)
  const WorkerInfoRef = useRef<JobworkerInfoMethods>(null)
  const JobAdditionalRef = useRef<JobAdditonalInfoMethods>(null)

  const theme = useTheme()
  const [currentEditId, setCurrentEditId] = useState<any>(0)
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
    if (activeStep == 0) {
      const isValid = await personalInfoRef?.current?.triggerValidation()
      if (personalInfoRef?.current && isValid) {
       await personalInfoRef?.current.childMethod({})
      //  fetchData()
      }
      if (isValid) {
        setActiveStep(activeStep + 1)
      }
    } else if (activeStep == 1) {
      if (TaskRef?.current) {
        TaskRef?.current.childMethod({})
      }
    } else if (activeStep == 2) {
      if (JobAdditionalRef?.current) {
        JobAdditionalRef?.current.childMethod({})
      }
    } else if (activeStep == 3) {
      const isValid = WorkerInfoRef?.current?.triggerValidation()
      if (WorkerInfoRef?.current) {
        WorkerInfoRef?.current.childMethod({})
      }
      if (isValid) {
        toast.success('Submitted Successfully..!!')
        closeRightPopupClick()
      }
    } 
  }
  const setEditId = (geteditId: any) => {
    setCurrentEditId(geteditId)
  }

  const ResetEditIdFun = () => {
    const currentUrl = new URL(window.location.href);
    setCurrentEditId(0);
    currentUrl.searchParams.delete('invoiceid');
    currentUrl.searchParams.delete('id');
    window.history.pushState({}, '', currentUrl);
  };

  const reset = () => {
    if (geteditId === 'new') {
      setCurrentEditId('new');
    } else {
      if (geteditId == null) {
        setCurrentEditId(0);
      } else {
        setCurrentEditId(geteditId);
      }
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const invoiceId = queryParams.get('id');

    reset();
    queryParams.delete('invoiceid');
    // const newUrl = `${window.location.pathname}?id=${invoiceId}`;
    // window.history.pushState({}, '', newUrl);

    return () => {
      ResetEditIdFun();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (geteditId != null && geteditId !== 0 && geteditId !== undefined) {
      setEditId(geteditId);
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.delete('invoiceid');
      queryParams.delete('createInvoiceId');
      // const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      // window.history.pushState({}, '', newUrl);
    }
  }, [geteditId]);


  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Jobstepercard handleNext={handleNext} editId={geteditId} setEditId={setEditId} ref={personalInfoRef} />
      case 1:
        return <InvoiceJobtask handleNext={handleNext} editId={geteditId} setEditId={setEditId} ref={TaskRef} />
      case 2:
        return <JobAdditionalCharges handleNext={handleNext} ref={JobAdditionalRef} />
      case 3:
        return <Workdetails handleNext={handleNext} editId={currentEditId} ref={WorkerInfoRef} />
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1
    const handleSaveAndFinish = () => {
      if (stepCondition) {
        const confirmed = window.confirm('Are you sure you want to save and finish?')
        if (confirmed) {
          callChildMethod()
          // fetchData()
        } else {
          // Optionally, you can add code here to handle the case where the user cancels the action
        }
      } else {
        callChildMethod()
      }
    }

    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='tonal'
          color='secondary'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon={theme.direction === 'ltr' ? 'tabler:arrow-left' : 'ph:arrow-left-light'} />}
        >
          Previous
        </Button>
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
                ? 'tabler:arrow-right'
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
      return 'rgba(208, 212, 241, 0.78)';
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
          color:'black'
        }}
      >
        Invoice Details
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
                  const isStepDisabled = index >= 1 && index <= 5 && geteditId === undefined

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
                            <Typography className='step-subtitle'>{step.subtitle}</Typography>
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

export default Jobsteperform
