// import React, { useCallback, useEffect, useState } from 'react'
// import { useForm, Controller } from 'react-hook-form'
// import { Autocomplete, Button, Grid, Typography } from '@mui/material'
// import Icon from 'src/@core/components/icon'
// import ApiClient from 'src/apiClient/apiClient/apiConfig'
// import CustomTextField from 'src/@core/components/mui/text-field'

// interface FormData {
//   Tax: any
//   request_date: string
//   actionmessage:any
//   action_date:any
//   action:any

  
// }

// const ApprovalEditForm = ({ editId, fetchData,onCloseModal }: any) => {
//   const [options, setOptions] = useState<any>([])
//   const [open, setOpen] = useState<boolean>(false)

//   const [selectedCountry, setSelectedCountry] = useState<any>({})
//   const [selectedTax, setSelectedTax] = useState(null)
//   const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
//   const [employee, setEmployee] = useState<any>([])

//   const {
//     handleSubmit,
//     control,
//     watch,
//     setValue, 
//     formState: { errors }
//   } = useForm<FormData>({
//     defaultValues: {
//       Tax: '',
   
//       request_date: '',
//       actionmessage:'',
//       action_date:"",
//       action:""
//     }
//   })
//   useEffect(()=>{
   
   
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[])
   
 

//   const getFormDetails = useCallback(
//     (editid: any) => {
//       const apiParams = {
//         moduletype: 'jobapprove',
//         apitype: 'list',
//         id: editid
//       }
//       const paramString = new URLSearchParams(apiParams).toString()
//       ApiClient.get(`api.php?${paramString}`)
//         .then(res => {
//           if (res.data && res.data.length > 0) {
//             const { country, request_date,actionmessage,action_date,action } = res.data[0]
            
//             setValue('request_date', request_date)
//             setValue('actionmessage', actionmessage)
//             setValue('action_date', action_date)
//             setValue('action', action)
//             setSelectedCountry({ id: country, countryname: country })
//           }
//         })
//         .catch(err => {
//           console.error('Something went wrong', err)
//         })
//     },
//     [setValue, setSelectedCountry]
//   )

//   useEffect(() => {
//     if (editId) {
//       getFormDetails(editId)
//     }
//   }, [editId, getFormDetails])

 

//   const onSubmit = (data: FormData) => {
//     const { request_date ,actionmessage,action_date,action} = data
//     const apiParams: any = {
//       moduletype: 'jobapprove',
//       apitype: 'edit',
//       jobid: '83017',
//       request_date: request_date,
//       actionmessage:actionmessage,
//       action_date:action_date,
//       action:action,
//       id: editId || ''
//     }

//     const paramString = new URLSearchParams(apiParams).toString()
//     const apiMethod = ApiClient.put

//     apiMethod(`api.php?${paramString}`)
//       .then(res => {
//         if (res.data && res.data.length > 0) {
//           const { state_name } = res.data[0]
//           setValue('request_date', request_date),
//           setValue('actionmessage', actionmessage)
//           setValue('action_date', action_date)
//           setValue('action', action)
//         }
//         onCloseModal()
//         fetchData(1, 10, '', '')
//       })
//       .catch(err => {
//       })
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Typography variant='h6'  style={{marginTop: '25px'}}>Update Approval Details </Typography>

//       <div>
//         <Controller
//           name='request_date'
//           control={control}
//           defaultValue=''
//           rules={{ required: 'Suburb Name is required' }}
//           render={({ field }) => (
//             <CustomTextField
//               {...field}
//               id='request_date'
//               label={
//                 <div>
//                   <span className='status-container'>Request Date</span>
//                 </div>
//               }
//               variant='outlined'
//               fullWidth
//               margin='normal'
//               error={!!errors.request_date}
//               helperText={errors.request_date && errors.request_date.message}
//             />
//           )}
//         />
//       </div>
//       <div>
//         <Controller
//           name='action'
//           control={control}
//           defaultValue=''
//           rules={{ required: 'Suburb Name is required' }}
//           render={({ field }) => (
//             <CustomTextField
//               {...field}
//               id='action'
//               label={
//                 <div>
//                   <span className='status-container'>Customer Action</span>
//                 </div>
//               }
//               variant='outlined'
//               fullWidth
//               margin='normal'
//               error={!!errors.action}
             
//             />
//           )}
//         />
//       </div>
     
//       <div>
//         <Controller
//           // name='action_date'
//           control={control}
//           defaultValue=''
//           rules={{ required: 'Suburb Name is required' }}
//           render={({ field }) => (
//             <CustomTextField
//               {...field}
//               id='action_date'
//               label={
//                 <div>
//                   <span className='status-container'>Action Date</span>
//                 </div>
//               }
//               variant='outlined'
//               fullWidth
//               margin='normal'
//               error={!!errors.action_date}
//               helperText={errors.action_date && errors.action_date.message}
//             />
//           )}
//         />
//       </div>
//     <div>
//         <Controller
//           name='actionmessage'
//           control={control}
//           defaultValue=''
//           rules={{ required: 'Suburb Name is required' }}
//           render={({ field }) => (
//             <CustomTextField
//               {...field}
//               id='actionmessage'
//               label={
//                 <div>
//                   <span className='status-container'>Message</span>
//                 </div>
//               }
//               variant='outlined'
//               fullWidth
//               margin='normal'
//               error={!!errors.actionmessage}
//               helperText={errors.actionmessage && errors.actionmessage.message}
//             />
//           )}
//         />
//       </div>


   
//       <div style={{ display: 'flex', justifyContent: 'end', paddingTop: '5px' }}>
//         <Button
//           type='submit'
//           sx={{
//             float: 'right',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: '90px',
//             padding: '5px !important',
//             height: '35px',
//             fontSize: '15px',
//             whiteSpace: 'nowrap',
//             '&:hover': {
//               background: '#776cff',
//               color: 'white'
//             }
//           }}
//           variant='contained'
//         >
//           <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
//           Save
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default ApprovalEditForm
import React from 'react'

const Approvaleditform = () => {
  return (
    <div>Approvaleditform</div>
  )
}

export default Approvaleditform
