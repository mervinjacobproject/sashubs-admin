import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ApiClient from 'src/apiClient/apiClient/apiConfig';

export interface JobtaskInfoMethods {
  childMethod: () => void;
}

interface jobtaskProps {
  ref: any;
  editId: number;
  handleNext: () => void;
}

const PodDetails: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(
  ({ editId, handleNext }, ref) => {
    const [items, setItems] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [showMessage, setShowMessage] = useState<boolean[]>([]);

    const handleIconButtonClick = (index: number) => {
      setShowMessage((prevShowMessage) => {
        const updatedShowMessage = [...prevShowMessage];
        updatedShowMessage[index] = !updatedShowMessage[index];
        return updatedShowMessage;
      });
    };

    const fetchData = async () => {
      try {
        const res = await ApiClient.get('/api.php?moduletype=pod_settings&apitype=active_list');
        setItems(res.data);
        // Initialize the showMessage state based on the number of items
        setShowMessage(new Array(res.data.length).fill(false));
      } catch (err) {
        console.error('Error fetching Pod Settings data:', err);
      }
    };
    const fetchImage = async (podId: number) => {
      try {
        const res = await ApiClient.get(`/api.php?moduletype=employee&apitype=image&action_type=list&podid=${podId}&job_id=${editId}`);
        
        // Check if res.data is an array before mapping
        if (Array.isArray(res.data)) {
          const imageUrls = res.data
            .filter((imageItem: any) => imageItem.image) // Filter out items without a valid image property
            .map((imageItem: any) => imageItem.image);
          
          setImages((prevImages) => [...prevImages, ...imageUrls]);
        } else {
          console.error('Invalid Pod Images data:', res.data);
        }
      } catch (err) {
        console.error('Error fetching Pod Images:', err);
      }
    };
    
    
    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      items.forEach((item, index) => {
        fetchImage(item.id);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, editId]);

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext();
      },
    }));

    return (
      <>
        <form>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {items.map((item, i) => (
              <div key={item.id} onClick={() => handleIconButtonClick(i)}>
                <Card
                  sx={{
                    padding: '5px',
                    display: 'grid',
                    margin: '10px',
                    gridTemplateColumns: '1fr 12fr',
                    alignItems: 'center',
                    border: '1px solid #cacaca',
                    height: '50px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography sx={{ textAlign: 'start', paddingLeft: '10px' }}>{i + 1}</Typography>
                  <Typography>{item.title}</Typography>
                </Card>

                {/* {showMessage[i] && (
                  <div
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '0px' }}
                    className={`message-container ${showMessage[i] ? 'show' : ''}`}
                  >
                    {images
                      .filter((_, j) => j === i)
                      .map((filteredImageItem, j) => (
                        <div key={j}>
                          {' '}
                          <img style={{ width: '50px', height: '50px' }} src={filteredImageItem} alt={`pod-${i}-image-${j}`} />
                        </div>
                      ))}
                  </div>
                )} */}

{showMessage[i] && (
  <div
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '0px' }}
    className={`message-container ${showMessage[i] ? 'show' : ''}`}
  >
    {images[i] && <img style={{ width: '50px', height: '50px' }} src={images[i]} alt={`pod-${i}-image`} />}
  </div>
)}

              </div>
            ))}
          </Box>
        </form>
      </>
    );
  }
);

export default PodDetails;



// import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import Typography from '@mui/material/Typography';
// import Icon from 'src/@core/components/icon';
// import Button from '@mui/material/Button';
// import { Box, TextField } from '@mui/material';
// import ApiClient from 'src/apiClient/apiClient/apiConfig';

// export interface JobtaskInfoMethods {
//   childMethod: () => void;
// }

// interface jobtaskProps {
//   ref: any;
//   editId: number;
//   handleNext: () => void;
// }

// const PodDetails: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(
//   ({ editId, handleNext }, ref) => {
//     const [items, setItems] = useState<any[]>([]);
//     const [images, setImages] = useState<any[]>([]);
//     const [showMessage, setShowMessage] = useState<any>(false);
//     const [showMessageIndex, setShowMessageIndex] = useState<number | null>(null);


    

//   const handleIconButtonClick = (index:any) => {
//     debugger
//     setShowMessageIndex((prevIndex) => (prevIndex === index ? null : index));
//     setShowMessage(!showMessage)
//   };

//     const fetchData = async () => {
//       try {
//         const res = await ApiClient.get('/api.php?moduletype=pod_settings&apitype=active_list');
//         setItems(res.data);
//       } catch (err) {
//         console.error('Error fetching Pod Settings data:', err);
//       }
//     };

//     // moduletype=employee&apitype=image&action_type=list&podid=11&job_id=60847

//     const fetchImage = async () => {
      
//       try {
//         const res = await ApiClient.get(`/api.php?moduletype=employee&apitype=image&action_type=list&podid=11&jobid=${editId}`);
//         setImages(res.data);
//       } catch (err) {
//         console.error('Error fetching Pod Images:', err);
//       }
//     };

//     useEffect(() => {
//       fetchData();
//       fetchImage();
//     }, []);

//     useImperativeHandle(ref, () => ({
//       async childMethod() {
//         handleNext();
//       },
//     }));

//     return (
//       <>
//         <form>
//         <Box sx={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
//             {items.map((item: any, i: number) => (
//               <div key={item.id} onClick={() => handleIconButtonClick(item.id)}>
//                 <Card
//                   sx={{
//                     padding: '5px',
//                     display: 'grid',
//                     margin: '10px',
//                     gridTemplateColumns: '1fr 12fr',
//                     alignItems: 'center',
//                     border: '1px solid #cacaca',
//                     height: '50px',
//                     cursor:"pointer"
//                   }}
//                 >
//                   <Typography sx={{ textAlign: 'start', paddingLeft: '10px' }}>{i + 1}</Typography>
//                   <Typography>{item.title}</Typography>
//                 </Card>
              
//                 {showMessage && showMessageIndex === item.id && (
//                   <div style={{display:"flex",justifyContent:"center",alignItems:"center", paddingLeft:"0px"}} className={`message-container ${showMessage ? 'show' : ''}`}>
//                     {images?.map((imageItem: any, j: number) => (
//                       j === item.id && (<div key={j} > <img style={{width:"50px",height:"50px"}} src={imageItem.image} /></div>)
//                     ))}
//                   </div>
//                 )}
//                </div>
//             ))}
//           </Box>

//           <style>
//             {`
//               /* WebKit browsers (Chrome, Safari) */
//               ::-webkit-scrollbar {
//                 width: 2px;
//               }

//               ::-webkit-scrollbar-thumb {
//                 background-color: #776cff;
//               }
//             `}
//           </style>
//         </form>
//       </>
//     );
//   }
// );

// export default PodDetails;
