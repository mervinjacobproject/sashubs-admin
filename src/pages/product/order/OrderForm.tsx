import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  Switch,
  TextField,
  Typography,
  Grid,
  IconButtonProps,
  IconButton,
  Card,
  Link,
  Divider,
  Autocomplete,
  Tooltip,
  Popper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  ButtonGroup,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Menu,
  MenuItem
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState, useEffect, use, Fragment } from 'react'
import { toast } from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomerGroupName from 'src/pages/customer/point-Transaction/groupnamecustomer'
import ProductGroupName from 'src/pages/customer/point-Transaction/addproduct'
import CustomTextField from 'src/@core/components/mui/text-field'
import {  GridColDef, GridToolbar, GridRenderEditCellParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons, GridCellEditStartParams, GridCellModesModel, DataGrid } from '@mui/x-data-grid'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import { line, select } from 'd3'
import { set } from 'nprogress'
import { Troubleshoot } from '@mui/icons-material'
import { left } from '@popperjs/core'
import { MenuButton } from '@chakra-ui/react'

interface Row {
  ID: any
  sno: any
  ProductName: any
  Qty: any
  Rate: any
  TaxableAmount: any
  TaxPercentage: any
  TaxAmount: any
  Discount: any
  DiscountPercentage: any
  NetAmount: any
}
interface FormData {
  ProductName: string;
  Description: string;
  MRP: string;
  Price: string;
  SpecialPrice: string;
  OrderNo: string;
  TaxPercentage: string;
  date:any;
  Notes:any
}
const modalDesign = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#cacaca'
  } else if (selectedMode === 'light') {
    return '#f2f2f7'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#cacaca'
  } else {
    return '#f2f2f7'
  }
}
const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  return selectedMode === 'dark' ? 'rgba(208, 212, 241, 0.68)' : 'black'
}
const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  return selectedMode === 'dark' ? 'rgb(47, 51, 73)' : 'white'
}
const formatCurrency = (value: string) => {
  const num = parseFloat(value)
  return isNaN(num) ? '' : num.toFixed(2)
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Customergroupform = ({ onClose, onFetchData }: any) => {
  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      ProductName: '',
        Description: '',
        MRP: '',
        Price: '',
        SpecialPrice: '',
        TaxPercentage:'',
        OrderNo: '',
        Notes:'',
        date:'',
    }
  })
  const MRP = watch('MRP');
  const Price = watch('Price');
  const SpecialPrice = watch('SpecialPrice');
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [customerError, setCustomerError] = useState('')
  const [selectedgroupName1, setSelectedgroupName1] = useState({ ProductName: '', ID: '' })
  const [openPopupcustomerGroup1, setOpenPopupEmployeeGroup1] = useState(false)
  const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
  const [groupNameSearch1, setgroupNameSearch1] = useState('')
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')
  const [TaxPercentage, setTaxPercentage] = useState(0)
  const [DisPercentage, setDisPercentage] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [availabledata, setData] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [totalQty, setTotalQty] = useState(0) 
  const options = ['Save & Close', 'Close']
  const defaultRows: Row[] = [
    {
      ID: 1,
      sno: 1,
      ProductName: '',
      Qty: 0,
      Rate: null,
      TaxableAmount: null,
      TaxPercentage: null,
      TaxAmount: null,
      Discount: null,
      DiscountPercentage: null,
      NetAmount: null
    }
  ]
  const [productValue, setProductValue] = useState('')
  const [rows, setRows] = useState<Row[]>(defaultRows)
  const [taxableAmount, setTaxableAmount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [netAmount, setNetAmount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [orderID, setOrderID] = useState(0)
  const [order, setOrder] = useState<any>([])
  // const [rowsno, setRowsno] = React.useState(1);
  // const [rowid, setRowid] = React.useState(0);
  const [rowid, setid] = useState(null)
  const [rowsno, setsno] = useState(null)
  const [sno, setSNo] = useState(null)
  const [updatedRows, setUpdatedRows] = useState(rows)
  const [updatedSelectedRows, setUpdatedSelectedRows] = useState<Row>()
  const [notesState, setNotesState] = useState('');

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNotesState(value); // Update local state
    //setValue("Notes", value); // Update form state
  };
  const handleSave = async () => {
    
    const customerID = selectedgroupName?.id ? selectedgroupName.id : fetchedgroupName
    if (!customerID) {
      setCustomerError('Please select a Customer')
      toast.error('Please select a Customer')
      return
    }
      ApiClient.post(
        `/ordercreate?CustomerID=${customerID}&TotalQty=${totalQty}&TaxableAmount=${taxableAmount}&TaxAmount=${taxAmount}&NetAmount=${netAmount}&Discount=${discountAmount}&TransactionID=0&TransactionStatus=1&OrderStatus=1&Notes=${notesState}`
      )
        .then((res: any) => {
          const orderID = res.data.id
          if (orderID) {
            fetchCreate(orderID)
          }
        })
        .catch(() => {
          toast.error('Error creating order')
        })
      
  }
  const fetchCreate = async (orderID: any) => {
    
    try {
      if (updatedRows.length - 1 < updatedRows.length) {
      const productIDs = updatedRows.map(row => row.ID).join(',');
      const quantities = updatedRows.map(row => row.Qty).join(',');
      const rates = updatedRows.map(row => row.Rate).join(',');
      const taxPercentages = updatedRows.map(row => row.TaxPercentage).join(',');
      const taxAmounts = updatedRows.map(row => row.TaxAmount).join(',');
      const discountAmounts = updatedRows.map(row => row.Discount).join(',');
      const discountPercentages = updatedRows.map(row => row.DiscountPercentage).join(',');
      const netAmounts = updatedRows.map(row => row.NetAmount).join(',');
      const taxableAmounts = updatedRows.map(row => row.TaxableAmount).join(',');
  
      // Make the API call
      const res = await ApiClient.post(
        `/orderdetailscreate?OrderID=${orderID}&ProductID=${productIDs}&Qty=${quantities}&Rate=${rates}&TaxPercentage=${taxPercentages}&TaxAmount=${taxAmounts}&DiscountAmount=${discountAmounts}&DiscountPercentage=${discountPercentages}&NetAmount=${netAmounts}&TaxableAmount=${taxableAmounts}`
      );
      if (res.data.id) {
       onFetchData()
          toast.success('Order created successfully')
       onClose()
      }
      toast.success('Order Detail created successfully');
    }} catch (error) {
      toast.error('Error creating order detail');
    }
  };
  const handleOpengroupName = () => {
    setOpenPopupEmployeeGroup(true)
  }
  const fetchEmployeeGroup = async () => {
    try {
      const res = await ApiClient.post(`/getcustomer?CustomerName=${groupNameSearch}`)
      const response = res.data.data
      const filteredResponse = response.filter((row: any) => row.Status == 1)
      setGetEmployeeGroup(filteredResponse)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchEmployeeGroup()
    fetchEmployeeGroup1()
  }, [groupNameSearch, groupNameSearch1])
  const handleEmployeeGroupClose = () => {
    setOpenPopupEmployeeGroup(false)
  }
  const clearSelectedgroupname = () => {
    setSelectedgroupName({ CustomerName: '', id: '' })
    setFetchedgroupName('')
  }
  const handlegroupnameclick = () => {
    clearSelectedgroupname()
  }

  const fetchEmployeeGroup1 = async () => {
    try {
      const res = await ApiClient.post(`/productgetall?ProductName=${groupNameSearch1}`)
      const response = res.data.data
      const filteredResponse = response.filter((row: any) => row.Status == 1)
      setGetEmployeeGroup1(filteredResponse)
    } catch (err) {
      console.error(err)
    }
  }
  const handleEmployeeGroupClose1 = () => {
    setOpenPopupEmployeeGroup1(false)
  }
  const clearSelectedgroupname1 = () => {
    setSelectedgroupName1({ ProductName: '', ID: '' })
    setFetchedgroupName1('')
  }
  const handlegroupnameclick1 = () => {
    clearSelectedgroupname1()
  }
  const handleCellEditCommit = (params:any) => {
    handleQtyChange(params.value, params.row)
  }
  const handleQtyChange = (value: any, row: any) => {
    const totalQty = value || 0
    const updatedRows1 = updatedRows.map(row1 => {
      if (row1.sno == row.sno) {
        const selectedProduct = getEmployeeGroup1.find((item: any) => item.ID == row1.ID)

        if (selectedProduct) {
          const price = parseFloat(selectedProduct.Price)
          const spPrice = parseFloat(selectedProduct.SpecialPrice)
          const activePrice: any = spPrice > 0 ? spPrice : price
          const totalSubAmount: any = totalQty * price
          const totalAmount: any = totalQty * activePrice
          const taxPercentage = parseFloat(selectedProduct.TaxPercentage)
          const taxAmount: any = (totalAmount * taxPercentage) / 100
          const netAmount: any = totalAmount + taxAmount
          const discountAmount: any = spPrice == 0 ? 0 : totalQty * price - totalQty * spPrice

          return {
            ...row1,
            Qty: value, // Update the quantity here
            Rate: totalSubAmount,
            TaxableAmount: totalAmount,
            TaxAmount: taxAmount,
            NetAmount: netAmount,
            Discount: discountAmount
          }
        }
      }
      return row1
    })

     setUpdatedRows(updatedRows1)
    const totals = calculateTotals(updatedRows1)
  }
  const handleAddRow = () => {
    if (updatedRows) {
      const newRow = {
        ID: null,
        sno: updatedRows.length + 1,
        ProductName: '',
        Qty: null,
        Rate: null,
        TaxableAmount: null,
        TaxPercentage: null,
        TaxAmount: null,
        Discount: null,
        DiscountPercentage: null,
        NetAmount: null
      }
      
      setUpdatedRows((prevRows: any) => [...prevRows, newRow])
    }
  }
  const handleDrop = (event: any, dropIndex: number) => {
    const draggedSno = parseInt(event.dataTransfer.getData('sno')); // Get the sno of the dragged row
    const draggedRow = updatedRows.find(row => row.sno == draggedSno); // Find the dragged row
  
    if (!draggedRow) return; // If draggedRow is undefined, exit the function
  
    // Find the index of the dragged row
    const draggedRowIndex = updatedRows.findIndex(row => row.sno === draggedSno);
  
    // Remove the dragged row from the updatedRows array
    const newRows = updatedRows.filter(row => row.sno !== draggedSno);
  
    // Insert the dragged row at the drop index
    newRows.splice(dropIndex, 0, draggedRow);
  
    // Update sno values starting from 1
    const updatedRowsWithSno = newRows.map((row, idx=0) => ({
      ...row,
      sno: idx + 1,
    }));
  
    // Set the updated rows state
    setUpdatedRows(updatedRowsWithSno);
  };
  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: '#776cff',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  }))

  const GroupItems = styled('ul')({
    padding: 0
  })

  const handleDragStart = (event: any, sno: any) => {
    event.dataTransfer.setData('sno', sno)
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }
  const [place, setPlace] = useState(false)
  const [anchorPosition, setAnchorPosition] = useState<{ x: number, y: number } | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpengroupName1 = (event:any) => {
    setPlace(true)
    setAnchorPosition({ x: event.clientX, y: event.clientY });
    
    //setOpenPopupEmployeeGroup1(true)
  }
   // State to control the dialog
   const [saveError, setSaveError] = useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handledropClose = () => {
    setAnchorEl(null);
  }
  const handleClose = () => {
    setPlace(false);
    setAnchorPosition(null);
    reset()
    setSaveError('')
  };
  
  const onSubmitForm = (data: any) => {
    const empGroupExists = getEmployeeGroup1?.some(
      (item: any) => item.ProductName == data.ProductName
    );
    if (empGroupExists == true) {
      setSaveError('Product Name already exists!');
    }

else{
    ApiClient.post(
      `/createproducts?ProductName=${data.ProductName}&Description=${data.Description}&MRP=${data.MRP}&Price=${data.Price}&SpecialPrice=${data.SpecialPrice}&OrderNo=${data.OrderNo}&TaxPercentage=0&Status=1`
    )
      .then(res => {
        setPlace(false);
        toast.success('Product Name Added Successfully');
        handleClose()
        
        //handleCloseModal();
        //setPlace(false)
        // onFetchData();
        // fetchEmployeeGroup();
        
      })
      .catch((err: any) => {
        toast.error('Error saving data');
      });
    }
  }
  useEffect(() => {
    setPlace(place)
    }, [])
  const dynamicColumns: GridColDef[] = [
    {
      field: 'reorder',
      headerName: '',
      maxWidth: 10,
      flex: 0.1,
      sortable: false,
      cellClassName: 'cellPaddingLeft',
      headerClassName: 'smallHeader',
      renderCell: (params:any) => (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'grab', position: 'relative', right: '20px' }}
          draggable
          onDragStart={e => handleDragStart(e, params.row.sno)}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, params.row.sno - 1)} // Adjust index to start from 0
        >
          <DragIndicatorIcon />
        </div>
      )
    },
    { field: 'sno', headerName: 'Sno', flex: 0.05, headerClassName: 'super-app-theme--header' },

    {
      field: 'ProductName',
      headerName: 'Product Name',
      flex: 0.15,
      editable: true,
      width: 100,
      headerClassName: 'super-app-theme--header',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.ProductName}>
          <div>{row.ProductName || 'Select a Product'}</div>
        </Tooltip>
      ),
      renderEditCell: (params: any) => {
        const selectedValue = getEmployeeGroup1.find(
          (item: any) => item.ProductName == params.formattedValue
        ) || null;
    
        return (
          <Autocomplete
            disableClearable
            options={getEmployeeGroup1.sort((a: any, b: any) => b.ProductName.localeCompare(a.ProductName))}
            value={selectedValue}  // This sets the initial value correctly when you move between rows
            getOptionLabel={(option) => option?.ProductName || ''}
            onChange={(event, newValue) => {
              // Update the state or data grid row value with the new selected option
              handleAutocompleteChange(params, event, newValue);
            }}
            groupBy={option => 'option'}
            renderOption={(props, option) => (
              <>
              {place == false ? (
               
              <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{option.ProductName}</span>
                <span>-</span>
                <span>Rs {option.Price}</span>
              </Box>
               ) : (alert('Please select a product from the dropdown'))
             }
              </>
            )}
            renderInput={(inputProps: any) => (
              <TextField
                {...inputProps}
                id="ProductName"
                name="ProductName"
                variant="standard"
                placeholder="Select a Product"
              />
            )}
            renderGroup={(params) => (
              <li key={params.key}>
                {place == false ? (
                  <Box
                    component="div"
                    onClick={handleOpengroupName1}
                    sx={{ cursor: 'pointer', padding: '8px', color: '#776cff', backgroundColor: '#fff' }}
                  >
                    + Create New Product
                  </Box>
                 ) :  null}
                
                <Divider />
                {params.children}
              </li>
            )}
            
    //         renderGroup={(params) => (
    //           <li key={params.key}>
    //             {place == false ? (
    //             <Box component="div" onClick={handleOpengroupName1} sx={{ cursor: 'pointer', padding: '8px',color: '#776cff',
    // backgroundColor: '#fff', }}>
    //               + Create New Product
    //             </Box>
    //             ):  (
    //               <form onSubmit={handleSubmit(onSubmitForm)}>
    //                 <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
    //                   <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Add a Product Name</Typography>
    //                 </Grid>
    //                 <br/>
    //                 <Grid item xs={12}>
    //                   <Divider />
    //                 </Grid>
    //                 <br/>
    //                 <Controller
    //                   name="ProductName"
    //                   control={control}
    //                   rules={{ required: 'Product Name is required' }}
    //                   render={({ field }) => (
    //                     <TextField {...field}
    //                     value={field.value || ''} label="Product Name" variant="outlined" fullWidth sx={{ marginBottom: 2 }} error={!!errors.ProductName} />
    //                   )}
    //                 />
                  
    //                 {/* Description */}
    //                 <Controller
    //                   name="Description"
    //                   control={control}
    //                   render={({ field }) => (
    //                     <TextField {...field} label="Description" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
    //                   )}
    //                 />
                  
    //                 {/* MRP */}
    //                 <Controller
    //                   name="MRP"
    //                   control={control}
    //                   rules={{ required: 'MRP is required', pattern: { value: /^[0-9]+(\.\d{1,2})?$/, message: 'Invalid MRP format' } }}
    //                   render={({ field }) => (
    //                     <TextField {...field} label="MRP (₹)" variant="outlined" fullWidth sx={{ marginBottom: 2 }} type="number" error={!!errors.MRP} 
    //                       InputProps={{                
    //                         inputProps: { style: { textAlign: 'right' } }
    //                       }} 
    //                       onBlur={(e) => {
    //                         const formattedValue = formatCurrency(e.target.value);
    //                         field.onChange(formattedValue);
    //                       }}
    //                     />
    //                   )}
    //                 />
                  
    //                 {/* Price */}
    //                 <Controller
    //                   name="Price"
    //                   control={control}
    //                   rules={{
    //                     required: 'Price is required',
    //                     validate: {
    //                       isLessThanMRP: value => {
    //                         const priceValue = parseFloat(value);
    //                         const mrpValue = parseFloat(MRP);
    //                         return priceValue <= mrpValue || 'Price must be equal to or less than MRP';
    //                       },
    //                       isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid price format'
    //                     }
    //                   }}
    //                   render={({ field }) => (
    //                     <TextField
    //                       {...field}
    //                       label="Price (₹)"
    //                       variant="outlined"
    //                       fullWidth
    //                       sx={{ marginBottom: 2 }}
    //                       type="number"
    //                       error={!!errors.Price}
    //                       InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
    //                       onBlur={(e) => {
    //                         const formattedValue = formatCurrency(e.target.value);
    //                         field.onChange(formattedValue);
    //                       }}
    //                     />
    //                   )}
    //                 />
                  
    //                 {/* Special Price */}
    //                 <Controller
    //                   name="SpecialPrice"
    //                   control={control}
    //                   rules={{
    //                     required: 'Special Price is required',
    //                     validate: {
    //                       isLessThanPrice: value => {
    //                         const specialPriceValue = parseFloat(value);
    //                         const priceValue = parseFloat(Price);
    //                         return specialPriceValue <= priceValue || 'Special Price may be 0 or less than Price';
    //                       },
    //                       isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid Special Price format'
    //                     }
    //                   }}
    //                   render={({ field }) => (
    //                     <TextField
    //                       {...field}
    //                       label="Special Price (₹)"
    //                       variant="outlined"
    //                       fullWidth
    //                       sx={{ marginBottom: 2 }}
    //                       type="number"
    //                       error={!!errors.SpecialPrice}
    //                       InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
    //                       onBlur={(e) => {
    //                         const formattedValue = formatCurrency(e.target.value);
    //                         field.onChange(formattedValue);
    //                       }}
    //                     />
    //                   )}
    //                 />
    //               <Controller
    //                       name="TaxPercentage"
    //                       control={control}
    //                       render={({ field }) => (
    //                         <TextField {...field} label="Tax Percentage (%)" variant="outlined" fullWidth margin="normal" type="number" 
    //                         InputProps={{                
    //                           inputProps: {
    //                             style: { textAlign: 'right' },
    //                           },
    //                         }} onBlur={(e) => {
    //                           const formattedValue = formatCurrency(e.target.value);
    //                           field.onChange(formattedValue);
    //                         }}/>
    //                       )}
    //                     />
    //                 {/* Order No */}
    //                 <Controller
    //                   name="OrderNo"
    //                   control={control}
    //                   rules={{
    //                     required: 'Order Number is required',
    //                     pattern: {
    //                       value: /^[1-9]\d*$/,
    //                       message: 'Order Number must be a positive integer without decimal or negative values',
    //                     }
    //                   }}
    //                   render={({ field }) => (
    //                     <TextField
    //                       {...field}
    //                       label="Order No"
    //                       variant="outlined"
    //                       fullWidth
    //                       sx={{ marginBottom: 2 }}
    //                       InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
    //                       error={!!errors.OrderNo}
    //                     />
    //                   )}
    //                 />
    //                 <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
    //                   <Button
    //                     onClick={handleClose}
    //                     >Cancel</Button>
    //                   <Button
    //                     type='submit'
    //                     sx={{
    //                       marginRight: '2px',
    //                       display: 'flex',
    //                       justifyContent: 'center',
    //                       alignItems: 'center',
    //                       width: '90px',
    //                       padding: '5px !important',
    //                       height: '35px',
    //                       fontSize: '15px',
    //                       whiteSpace: 'nowrap',
    //                       '&:hover': {
    //                         background: '#776cff',
    //                         color: 'white',
    //                       }
    //                     }}
    //                     variant='contained'
    //                   >
    //                     <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
    //                     Save
    //                   </Button>
    //                 </Grid>
    //                 </form>
    //                             )}
    //             <Divider />
    //             {params.children}
    //           </li>
    //         )}
            noOptionsText={
              <Box sx={{ textAlign: 'left', padding: '8px 0' }}>
                {searchValue &&
                  !getEmployeeGroup1.some(
                    (option: any) => option.ProductName?.toLowerCase() === searchValue.toLowerCase()
                  ) && (
                    <Typography variant="body2" color="text.secondary">
                      No results found for "{searchValue}"
                    </Typography>
                  )}
              </Box>
            }
            sx={{
              '& .MuiAutocomplete-inputRoot': {
                width: '250px',
              },
            }}
          />
        );
      }
    },
    {
      field: 'Qty',
      headerName: 'Quantity',
      headerAlign: 'right',
      flex: 0.07,
      width: 150,
      type: 'number',
      editable: true,
      renderCell: ({ row }: any) => (
        <Tooltip title={row.Qty}>
          <div style={{marginRight: '15px'}}>{row.Qty || ''}</div>
        </Tooltip>
      ),
      renderEditCell:params  => (
        <TextField
          id='Qty'
          name='Qty'
          
          value={ params.formattedValue}
          onChange={e => {
            const newValue = e.target.value
            if (/^\d*$/.test(newValue)) {
              handleQtyChange(newValue, params.row); // Pass the entire row for context
            }
            //handleQtyChange(newValue, params.row) // Pass the entire row for context
          }}
          sx={{
            //marginRight: '10px',
            width: '100%', // Set TextField width to 100%
            textAlign: 'right', // Align text to the right
            '& input': {
              textAlign: 'right', // Ensure input text is right-aligned
            },
          }}
        />
      ),
      cellClassName: 'custom-cell-padding'
    },
    {
      field: 'Rate',
      headerName: 'Rate (₹)',
      flex: 0.07,
      width: 150,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.Rate}>
          <div>{formatCurrency(row.Rate)}</div>
        </Tooltip>
      ),
    },
    {
      field: 'TaxableAmount',
      headerName: 'Taxable Amount (₹)',
      flex: 0.1,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.TaxableAmount}>
          <div>{formatCurrency(row.TaxableAmount)}</div>
        </Tooltip>
      )
    },
    {
      field: 'TaxPercentage',
      headerName: 'Tax Percentage (%)',
      flex: 0.1,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.TaxPercentage}>
          <div>{formatCurrency(row.TaxPercentage)}</div>
        </Tooltip>
      )
    },
    {
      field: 'TaxAmount',
      headerName: 'TaxAmount (₹)',
      flex: 0.1,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.TaxAmount}>
          <div>{formatCurrency(row.TaxAmount)}</div>
        </Tooltip>
      )
    },
    {
      field: 'DiscountPercentage',
      headerName: 'Discount Percentage (%)',
      flex: 0.125,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.DiscountPercentage}>
          <div>{formatCurrency(row.DiscountPercentage)}</div>
        </Tooltip>
      )
    },
    {
      field: 'Discount',
      headerName: 'Discount Amount (₹)',
      flex: 0.125,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.Discount}>
          <div>{formatCurrency(row.Discount)}</div>
        </Tooltip>
      )
    },
    {
      field: 'NetAmount',
      headerName: 'NetAmount (₹)',
      flex: 0.1,
      type: 'number',
      headerAlign: 'right',
      headerClassName: 'super-app-theme--header',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.NetAmount}>
          <div>{formatCurrency(row.NetAmount)}</div>
        </Tooltip>
      )
    }
    // Add more dynamic columns if needed
  ]
  
  const deleteColumn: GridColDef = {
    field: 'actions',
    headerName: '',
    flex: 0.1,
    maxWidth: 70,

    renderCell: (params:any) => (
      <div style={{ width: '100px', position: 'relative', right: '12px' }}>
        <IconButton
          aria-label='delete'
          onClick={() => handleDeleteRow(params.row.sno, params.row.OrderID)}
          size='small'
          sx={{ color: 'red' }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    ),
    headerAlign: 'right' // Align the header of the delete column to the right
  }
  const handleDeleteRow = (id: number, orderid: any) => {
    ApiClient.post(`/deleteorderdetail?ID=${id}`)
      .then((res: any) => {
        setOrderID(orderid);
        //fetchOrderData(orderid);
        toast.success('Deleted successfully');

        // Filter out the deleted row
        setUpdatedRows((prevRows: any) => {
          const newRows = prevRows.filter((row: any) => row.sno != id);
          calculateTotals(newRows);
          // Reassign sno based on the new order
          return newRows.map((row: any, index: number) => ({
            ...row,
            sno: index + 1, // Assign sno starting from 1
          }));
           // Recalculate totals, if necessary
 
        });
      })
      .catch((err: any) => {
        console.error('Error deleting designation:', err);
        toast.error('Error deleting designation');
      });
};

  const columns: GridColDef[] = [...dynamicColumns, deleteColumn]
  //const [rows, setRows] = useState([]); // State to hold the DataGrid rows
  const calculateTotals = (rows: any) => {
    const totalValues = {
      totalTaxableAmount: 0,
      totalTaxPercentage: 0,
      totalTaxAmount: 0,
      totalDiscount: 0,
      totalNetAmount: 0,
      totalDiscountPercentage: 0,
      discountCount: 0, // To calculate average
      totalqty: 0, // To calculate average
      totalAmount: 0 // To calculate average
    }

    rows.forEach((row: any) => {
totalValues.totalqty += row.Qty || 0
      totalValues.totalAmount += row.Rate || 0
      totalValues.totalTaxableAmount += row.TaxableAmount || 0
      totalValues.totalTaxPercentage += row.TaxPercentage || 0
      totalValues.totalTaxAmount += row.TaxAmount || 0
      totalValues.totalDiscount += row.Discount || 0
      totalValues.totalNetAmount += row.NetAmount || 0

      if (row.DiscountPercentage) {
        totalValues.totalDiscountPercentage += row.DiscountPercentage
        //totalValues.discountCount += 1 // Count for average calculation
      }
    })
    setTotalAmount(totalValues.totalAmount)
    setDisPercentage(totalValues.totalDiscountPercentage)
    setTaxableAmount(totalValues.totalTaxableAmount)
    setDiscountAmount(totalValues.totalDiscount)
    setNetAmount(totalValues.totalNetAmount)
    setTaxAmount(totalValues.totalTaxAmount)
    setTaxPercentage(totalValues.totalTaxPercentage)
    setTotalQty(totalValues.totalqty)
    return totalValues
  }
  const calculateSubTotals = (rows: any) => {
    const totalValues = {
      totalTaxableAmount: 0,
      totalTaxPercentage: 0,
      totalTaxAmount: 0,
      totalDiscount: 0,
      totalNetAmount: 0,
      totalDiscountPercentage: 0,
      discountCount: 0, // To calculate average
      totalqty: 0 // To calculate average
    }

    rows.forEach((row: any) => {
totalValues.totalqty += row.Qty || 0
      totalValues.totalTaxableAmount += row.TaxableAmount || 0
      totalValues.totalTaxPercentage += row.TaxPercentage || 0
      totalValues.totalTaxAmount += row.TaxAmount || 0
      totalValues.totalDiscount += row.Discount || 0
      totalValues.totalNetAmount += row.NetAmount || 0

      if (row.DiscountPercentage) {
        totalValues.totalDiscountPercentage += row.DiscountPercentage
        //totalValues.discountCount += 1 // Count for average calculation
      }
    })
    setDisPercentage(totalValues.totalDiscountPercentage)
    setTaxableAmount(totalValues.totalTaxableAmount)
    setDiscountAmount(totalValues.totalDiscount)
    setNetAmount(totalValues.totalNetAmount)
    setTaxAmount(totalValues.totalTaxAmount)
    setTaxPercentage(totalValues.totalTaxPercentage)
    setTotalQty(totalValues.totalqty)
    return totalValues
  }
  const handleAutocompleteChange = (params: any,event:any, newValue: any) => {
    if (newValue) {
      // Find the selected product from the list
      const selectedProduct = getEmployeeGroup1.find(
        (product: any) => product.ProductName === newValue.ProductName
      );
      if (selectedProduct) {
        const price = parseFloat(selectedProduct.Price) || 0;
        const spPrice = parseFloat(selectedProduct.SpecialPrice) || 0;
        const taxPercentage = parseFloat(selectedProduct.TaxPercentage) || 0;
  
        // Calculate derived values
        const activePrice = spPrice > 0 ? spPrice : price;
        const taxAmount = (activePrice * taxPercentage) / 100;
        const discountAmount = spPrice === 0 ? 0 : price - spPrice;
        const discountPercentage = price !== 0 ? (discountAmount / price) * 100 : 0;
  
        // Update the rows array
        const updatedRows1 = updatedRows.map((data) => {
          // Check if this row matches the one being edited
          if (data.sno === params.row.sno) {
            return {
              ...data,
              ID: selectedProduct.ID,
              ProductName: newValue.ProductName,
              Qty: 1, // Default quantity; adjust if needed
              Rate: price,
              TaxableAmount: activePrice,
              TaxPercentage: taxPercentage,
              Discount: discountAmount,
              DiscountPercentage: discountPercentage,
              TaxAmount: taxAmount,
              NetAmount: activePrice + taxAmount,
            };
          }
          return data; // Leave other rows unchanged
        });
  
        // Update the state and totals
        setUpdatedRows(updatedRows1);
        calculateTotals(updatedRows1); // Ensure this function is defined to handle recalculation logic
        updateAddRows(updatedRows1); // Update additional rows, if needed
      }
    }
  };
  
  const updateAddRows = (values: any) => {
    if (values.length == updatedRows.length && values[values.length -1].ProductName) {
    handleAddRow() // Add a new row if all rows are filled
     }
  }
  const calculateTax = (rate: any, qty: any) => {
    const taxRate = 0.18 // Example tax rate of 18%
    return rate * qty * taxRate
  }
  const calculateNetAmount = (rate: any, qty: any) => {
    return rate * qty + calculateTax(rate, qty) // Tax-inclusive total
  }
  const processRowUpdate = (newRow: any, oldRow: any) => {
    const updatedRows1 = updatedRows.map(row => (row.sno == newRow.sno ? newRow : row))
    setUpdatedRows(updatedRows1)
    return newRow // Return the updated row to ensure it displays in the grid immediately
  }
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  const handleCellClick = (params: any) => {
    if (params.field === 'Qty') {
      handleQtyChange(params.value, params.row)
      setCellModesModel({
        ...cellModesModel,
        [params.id]: { ...cellModesModel[params.id], [params.field]: { mode: 'edit' } },
      });
    }
    if (params.field == 'ProductName') {
      setCellModesModel({
        ...cellModesModel,
        [params.id]: { ...cellModesModel[params.id], [params.field]: { mode: 'edit' } },
      });
    }
  };
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleToggle = (e:any) => {
    handleClick(e)
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <Box
      sx={{
        display: 'inline',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'center', md: 'space-between' },
        alignItems: { xs: 'center', md: 'center' }
      }}
    >
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        height='px'
        //  width='100%'
        borderBottom='1px solid #ccc'
      >
        <Box sx={{ width: '90%' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography variant='h4'></Typography>

            <Link href='#' underline='hover'>
              {'Sales Overview'}
            </Link>
            <Typography variant='h4' sx={{ position: 'relative', bottom: '3px', left: '10px', width: '4%' }}>
              {'>'}
            </Typography>
            <Link href='#' underline='hover'>
              {'Invoice'}
            </Link>
          </div>

          <Typography variant='subtitle1'></Typography>
          <Typography variant='subtitle1'></Typography>
        </Box>
        <Box
          display='flex'
          alignItems='center'
          flexDirection='row'
          justifyContent='flex-end'
          sx={{ width: '60%', marginTop: '10px' }}
        >
          <Box display='flex' flexDirection='row' alignItems='center' sx={{mb: 5, mr: 1}}>
          {/* <ButtonGroup  aria-label='split button' sx={{border:'1px solid black',height:'37px'}}> */}
          <ButtonGroup  aria-label='split button' sx={{border:'1px solid black',height:'37px'}}>
          <Button
              type='submit'
              disabled={!taxAmount || !netAmount || !taxableAmount || selectedgroupName.id === ''}
              sx={{ backgroundColor: 'white', color: 'black', width: '140px' }}
              onClick={handleSave}
            >
              Save & Close
            </Button>
            <Button 
      aria-haspopup='menu'
      onClick={handleToggle}
      aria-label='select merge strategy'
      aria-expanded={open ? 'true' : undefined}
      aria-controls={open ? 'split-button-menu' : undefined}
      sx={{ backgroundColor: 'white' ,color:'black'}}
    >
      <Icon icon='tabler:chevron-down' onClick={handleClick}/>
      </Button>
          </ButtonGroup>
          
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handledropClose}
      >
        <MenuItem disabled={!taxAmount || !netAmount || !taxableAmount || selectedgroupName.id === ''} onClick={() => { /* Your save and close logic here */ handleSave(); }}>Save & Close</MenuItem>
        <MenuItem onClick={() => { /* Your close logic here */ onClose(); }}>Close</MenuItem>
      </Menu>
      {/* </ButtonGroup> */}
          
            {/* <Button
              type='submit'
              disabled={!taxAmount || !netAmount || !taxableAmount || selectedgroupName.id === ''}
              sx={{ backgroundColor: 'white', color: 'black', width: '140px' }}
              onClick={handleSave}
            >
              Save & Close
            </Button> */}
          </Box>

          {/* <Icon icon='codicon:kebab-vertical' style={{ marginLeft: '2px',marginBottom: '5px' }} /> */}
        </Box>
      </Box>
      <div style={{ height: '90%', overflow: 'auto', overflowX: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <style>
          {`
    /* WebKit browsers (Chrome, Safari) */
    ::-webkit-scrollbar {
      width: 2px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #776cff;
    }
  `}
        </style>
        <form  style={{ width: '99%' }}>
          <Card
            sx={{
              display: 'flex',
              justifyItems: 'center',
              width: '100%',
              marginTop: '30px',
              height: '900px', // Shadow for all sides except bottom
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              border: '1px solid #ccc'
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                justifyItems: 'center',
                width: '100%',
                marginTop: '20px',
                height: '900px', // Shadow for all sides except bottom
                borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
                flexDirection: 'column'
              }}
            >
              <Grid container spacing={4} alignItems='center' sx={{ marginLeft: '10px' }}>
                <Grid item xs={12} sm={3.9} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ? '' : '' }}>
                  <span style={{ color: getColor(), fontSize: '14px' }}>Customer Name</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                    {selectedgroupName.CustomerName !== '' || fetchedgroupName != '' ? (
                      <Typography sx={{ width: '100%' }} onClick={handleOpengroupName}>
                        {selectedgroupName.CustomerName !== '' ? (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '5px',
                              backgroundColor: modalDesign(),
                              padding: '15px',
                              justifyContent: 'space-between',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            <Typography sx={{ color: '#222' }}>{selectedgroupName.CustomerName}</Typography>
                            <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '5px',
                              backgroundColor: modalDesign(),
                              padding: '10px',
                              justifyContent: 'space-between',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            <Typography sx={{ color: '#222' }}>
                              {
                                getEmployeeGroup
                                  ?.sort((a: any, b: any) => a.CustomerName.localeCompare(b.CustomerName))
                                  .map((item: any) => {
                                    if (Number(item.Id) === Number(fetchedgroupName)) {
                                      return item.CustomerName
                                    }
                                    return null
                                  })
                                  .filter((CustomerName: any) => CustomerName !== null)[0]
                              }
                            </Typography>
                            <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                          </Box>
                        )}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          color: '#776cff',
                          fontWeight: 600,
                          width: '500px',
                          cursor: 'pointer',
                          backgroundColor: '#f2f2f7',
                          padding: '15px',
                          borderRadius: '5px'
                        }}
                        onClick={handleOpengroupName}
                      >
                        Select a Customer
                      </Typography>
                    )}
                    {(selectedgroupName.id || fetchedgroupName) && (
                      <Icon
                        icon='material-symbols-light:delete-outline'
                        style={{ cursor: 'pointer', fontSize: '30px' }}
                        onClick={handlegroupnameclick}
                      />
                    )}
                  </Box>
                  {customerError && (
                    <Typography variant='caption' color='error'>
                      Please select a Customer.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3.9}>
                  <span style={{ color: getColor(), fontSize: '14px' }}>Issued Date</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                  <Controller
                    name='date'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        type='date'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        //  style={{height:'30px',width:'100%',marginTop:'20px'}}
                        placeholder='Enter text'
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid sx={{ height: 'auto', width: '99%' }}>
                <style>
                  {`
          .MuiDataGrid-root .MuiDataGrid-cell {
            border: 1px solid #ccc; /* Add border to each cell */
          }
        `}
                </style>
                <DataGrid
      autoHeight
      pagination
      rowHeight={40}
      editMode="cell"
      rows={updatedRows}
      getRowId={row => row.sno}
      columns={columns}
      columnHeaderHeight={40}
      //onProcessRowUpdate={handleCellEditCommit}
     // onCellEditCommit={handleCellEditCommit}
                   isCellEditable={params => true}
      onCellClick={handleCellClick} // Enable single-click edit mode
      cellModesModel={cellModesModel} // Control cell edit mode
      disableRowSelectionOnClick
      slotProps={{
        toolbar: { setUpdatedRows },
      }}
      components={{
        Toolbar: GridToolbar,
      }}
      sx={{
        marginTop: '2%',
        border: '1px solid #ccc',
        '& .MuiDataGrid-cell:hover': {
          color: '#ccc',
        },
        '& .custom-cell-padding': {
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
        },        
        borderRadius: '8px',
        height: 'auto',
        width: '100%',
        overflow: 'auto',
        marginLeft: '5px',
      }}
    />
                {/* <DataGrid
                  autoHeight
                  pagination
                  rowHeight={40}
                   editMode='cell'
                   isCellEditable={params => true}
                  rows={updatedRows}
                  getRowId={row => row.sno} // Ensure rows have a unique ID
                  columns={columns}
                  columnHeaderHeight={40}
                  components={{
                    Toolbar: GridToolbar
                  }}
                  disableRowSelectionOnClick
                  slotProps={{
                    toolbar: { setUpdatedRows },
                  }}
                  sx={{
                    marginTop: '2%',
                    border: '1px solid #ccc',
                    '& .MuiDataGrid-cell:hover': {
                      color: '#ccc'
                    },
                    borderRadius: '8px',
                    height: 'auto',
                    width: '100%',
                    overflow: 'auto',
                    marginLeft: '5px'
                  }}
                /> */}

                <div style={{ display: 'flex', height: '50%', width: '100%' }}>
                  <div
                    style={{ marginLeft: '20px', display: 'flex', width: '30%', height: '85%', alignItems: 'flex-end' }}
                  >
                    <Grid item xs={12}>
                    <Controller
        name="Notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Notes"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            onChange={handleNotesChange} // Use custom onChange
            value={notesState} // Bind the local state
          />
        )}
      />
        </Grid>
                    <Grid item sx={{ display: 'flex', width: '70%', height: '38%' }}>
                      
                    </Grid>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '70%',
                      alignItems: 'center',
                      height: '75%'
                    }}
                  >
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Grid sx={{ padding: '20px', width: '300px', textAlign: 'start' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}
                        >
                          <div>Subtotal</div>
                          <div>{totalAmount.toFixed(2)}</div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}
                        >
                          <div>Taxable Amount</div>
                          <div>{taxableAmount.toFixed(2)}</div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}
                        >
                          <div>Discount</div>
                          {/* <div>{`${DisPercentage.toFixed(2)} %`}</div> */}
                          <div>{`-${discountAmount.toFixed(2)}`}</div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}
                        >
                          <div style={{ width: '65px' }}>Tax</div>
                          {/* <div>{`${TaxPercentage.toFixed(2)} %`}</div> */}
                          <div>{taxAmount.toFixed(2)}</div>
                        </div>
                        <Divider style={{ backgroundColor: '#00cfe8' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>Net Amount</div>
                          <div>{netAmount.toFixed(2)}</div>
                        </div>
                        <Divider style={{ backgroundColor: '#00cfe8' }} />
                      </Grid>
                    </Grid>
                  </div>
                </div>
                
                <CustomModal
                  open={openPopupcustomerGroup}
                  onClose={() => {
                    handleEmployeeGroupClose()
                    setgroupNameSearch('')
                  }}
                  onOpen={handleOpengroupName}
                  buttonText=''
                  buttonOpenText=''
                  height={500}
                >
                  <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleEmployeeGroupClose}>
                    <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
                  </CustomCloseButton>
                  <CustomerGroupName
                    getEmployeeGroup={getEmployeeGroup}
                    setSelectedgroupName={setSelectedgroupName}
                    handleEmployeeGroupClose={handleEmployeeGroupClose}
                    fetchEmployeeGroup={fetchEmployeeGroup}
                    setgroupNameSearch={setgroupNameSearch}
                    onFetchData={onFetchData}
                    groupNameSearch={groupNameSearch}
                  />
                </CustomModal>
                <Popover
        open={Boolean(anchorPosition)}
        onClose={handleClose}
        // sx={{width: '800px', maxWidth: '800px',marginLeft: '0px',}}
        anchorReference="anchorPosition"
        anchorPosition={
          anchorPosition ? { top: anchorPosition.y, left: anchorPosition.x } : undefined
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ width: '500px' }}
      >
        <Box sx={{ width: '400px' }} p={2}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid item xs={12}  sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Add a Product Name</Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <br />
                    <Grid item xs={12} >
                    <Controller
    name="ProductName"
    control={control}
    rules={{ required: 'Product Name is required' }}
    render={({ field }) => (
      <TextField {...field} label="Product Name" variant="outlined" fullWidth sx={{ marginBottom: 2 }} error={!!errors.ProductName} />
    )}
  />
</Grid>
<Grid item xs={12} >
<Controller
    name="Description"
    control={control}
    render={({ field }) => (
      <TextField {...field} label="Description" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
    )}
  />
  </Grid>
  {/* MRP */}
  <Grid item xs={12} >
  <Controller
    name="MRP"
    control={control}
    rules={{ required: 'MRP is required', pattern: { value: /^[0-9]+(\.\d{1,2})?$/, message: 'Invalid MRP format' } }}
    render={({ field }) => (
      <TextField {...field} label="MRP (₹)" variant="outlined" fullWidth sx={{ marginBottom: 2 }} type="number" error={!!errors.MRP} 
        InputProps={{                
          inputProps: { style: { textAlign: 'right' } }
        }} 
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
    )}
  />
</Grid>
  {/* Price */}
  <Grid item xs={12} >
  <Controller
    name="Price"
    control={control}
    rules={{
      required: 'Price is required',
      validate: {
        isLessThanMRP: value => {
          const priceValue = parseFloat(value);
          const mrpValue = parseFloat(MRP);
          return priceValue <= mrpValue || 'Price must be equal to or less than MRP';
        },
        isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid price format'
      }
    }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Price (₹)"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        type="number"
        error={!!errors.Price}
        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
    )}
  />
</Grid>
<Grid item xs={12} >
  {/* Special Price */}
  <Controller
    name="SpecialPrice"
    control={control}
    rules={{
      required: 'Special Price is required',
      validate: {
        isLessThanPrice: value => {
          const specialPriceValue = parseFloat(value);
          const priceValue = parseFloat(Price);
          return specialPriceValue <= priceValue || 'Special Price may be 0 or less than Price';
        },
        isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid Special Price format'
      }
    }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Special Price (₹)"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        type="number"
        error={!!errors.SpecialPrice}
        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
    )}
  />
  </Grid>
  <Grid item xs={12} >
<Controller
        name="TaxPercentage"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Tax Percentage (%)" variant="outlined" fullWidth margin="normal" type="number" 
          InputProps={{                
            inputProps: {
              style: { textAlign: 'right' },
            },
          }} onBlur={(e) => {
            const formattedValue = formatCurrency(e.target.value);
            field.onChange(formattedValue);
          }}/>
        )}
      />
      </Grid>
      {saveError && (
        <Grid item xs={12}> <Typography variant='caption' color='error' sx={{ fontSize: '15px', marginTop: '5px' }}>{saveError}</Typography> </Grid>
      )}
  {/* Order No */}
 
            
                    {/* Add other fields similarly, ensuring to stop propagation on click */}
            
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button
                        type='submit'
                        sx={{
                          marginRight: '2px',
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
                            color: 'white',
                          },
                        }}
                        variant='contained'
                      >
                        <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
                        Save
                      </Button>
                    </Grid>
                  </form>
        </Box>
      </Popover>
                {/* <CustomModal
                  open={openPopupcustomerGroup1}
                  onClose={() => {
                    handleEmployeeGroupClose1()
                    setgroupNameSearch1('')
                  }}
                  onOpen={handleOpengroupName1}
                  buttonText=''
                  buttonOpenText=''
                  height={500}
                >
                  <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleEmployeeGroupClose1}>
                    <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
                  </CustomCloseButton>
                  <ProductGroupName
                    getEmployeeGroup={getEmployeeGroup1}
                    setSelectedgroupName={setSelectedgroupName1}
                    handleEmployeeGroupClose={handleEmployeeGroupClose1}
                    fetchEmployeeGroup={fetchEmployeeGroup1}
                    setgroupNameSearch={setgroupNameSearch1}
                    onFetchData={onFetchData}
                    groupNameSearch={groupNameSearch1}
                  />
                </CustomModal> */}
              </Grid>
            </Grid>
          </Card>
        </form>
      </div>
    </Box>
  )
}

export default Customergroupform
