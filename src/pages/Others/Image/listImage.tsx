
import React, { useState, useEffect } from 'react';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import Icon from 'src/@core/components/icon';
import { toast } from 'react-hot-toast';

const ListImage = () => {
  const [images, setImages] = useState<any>([]);

  const fetchData = () => {
    ApiClient.get('/api.php?moduletype=image_mgmt&apitype=list-all')
      .then((res) => {
        // Check if the response indicates no data available
        if (res.data && res.data.length > 0 && res.data[0].id === "" && res.data[0].message === "No Data Available") {
          setImages([]); // Set an empty array to indicate no images
        } else {
          setImages(res.data || []);
        }
      })
      .catch((err) => {
        // console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteImage = (id: number) => {
    ApiClient.delete(`/api.php?moduletype=image_mgmt&apitype=delete_image&id=${id}`)
      .then((res: any) => {
     
        toast.success('Deleted successfully');
        fetchData();
      })
      .catch((err: any) => {
        // console.error('Error deleting image:', err);
        toast.error('Error deleting image');
      });
  };

  return (
    <div>
      <h1>Image List</h1>
      {images.length > 0 ? (
        <ul style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {images.map((image: any, index: number) => (
            <li key={index} className="image-container">
              <img
                style={{ width: '200px', height: '200px', borderRadius: "10px", display: "flex", alignItems: "space-between" }}
                src={image.image}
                alt={`Image ${index}`}
              />
              <div
                className="delete-icon"
                onClick={() => handleDeleteImage(image.id)}
              >
                <Icon icon="ic:baseline-delete" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default ListImage;


























// import React, { useState, useEffect } from 'react';
// import ApiClient from 'src/apiClient/apiClient/apiConfig';
// import Icon from 'src/@core/components/icon';
// import { toast } from 'react-hot-toast';



// const ListImage = () => {
//   const [images, setImages] = useState<any>([]);

//   const fetchData = () => {
//     ApiClient.get('/api.php?moduletype=image_mgmt&apitype=list-all')
//       .then((res) => {
//         setImages(res.data || []);
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//       });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDeleteImage = (id: number) => {
//     ApiClient.delete(`/api.php?moduletype=image_mgmt&apitype=delete_image&id=${id}`)
//       .then((res: any) => {
//         toast.success('Deleted successfully');
//         fetchData(); 
//       })
//       .catch((err: any) => {
//         console.error('Error deleting image:', err);
//         toast.error('Error deleting image');
//       });
//   };

//   return (
//     <div>
//       <h1>Image List</h1>
//       {images.length > 0 ? (
//         <ul style={{display: 'flex', alignItems: 'center',gap:'20px'}} >
//           {images.map((image: any, index: number) => (
//             <li key={index} className="image-container">
//               <img 
//                 style={{ width: '200px', height: '200px',borderRadius:"10px", display:"flex",alignItems:"space-between" }}
//                 src={image.image}
//                 alt={`Image ${index}`}
                
//               />
//               <div
//                 className="delete-icon"
//                 onClick={() => handleDeleteImage(image.id)}
//               >
//                 <Icon icon="ic:baseline-delete" />
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No images available</p>
//       )}
//     </div>
//   );
// };

// export default ListImage;
