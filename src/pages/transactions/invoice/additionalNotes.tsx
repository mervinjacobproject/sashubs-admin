import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export interface JobtaskInfoMethods {
  childMethod: () => void;
}

interface jobtaskProps {
  ref: any;
  editId: number;
  handleNext: () => void;
  editnotes:any
}

const AdditionalNotes: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(

  ({ editId, handleNext,editnotes }, ref) => {
  
    const [items, setItems] = useState([]); 
   
    

    return (
      <>
        <form>
        <Grid xs={12}>
                 
                 <TextField
                   name={`_notes`}
                 
                   InputLabelProps={{
                     style: { fontSize: '12px' },
                   }}
                   id='Description'
                //    label='Job Notes'
                   variant='outlined'
                //    value={editnotes}
                   fullWidth
                   multiline
                   rows={5}
                   margin='normal'
                 />
               </Grid>

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
        </form>
      </>
    );
  }
);

export default AdditionalNotes;
