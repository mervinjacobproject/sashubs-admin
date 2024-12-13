import React from 'react';
import { Box } from '@mui/material'; // Assuming you're using MUI Box component
import toast from 'react-hot-toast';
import AppleLogin from 'react-apple-login'; // Apple Login component

const AppleSignIn = () => {
  // Success handler when login is successful
  const handleSuccess = (response: any) => {
    const { authorization } = response;  // Get the authorization object
    if (authorization) {
      console.log('Apple Authorization:', authorization);
      toast.success('Login Successful');
    } else {
      toast.error('Login Failed');
    }
  };

  // Error handler for login failure
  const handleError = (error: any) => {
    console.error('Login Failed:', error);
    toast.error('Login Failed');
  };

  return (
    <div>
      {/* Custom Apple Sign-in Button with Box and Icon */}
   

      {/* Hidden AppleLogin component */}
      <AppleLogin
        clientId="com.example.myapp"  // Replace with your actual Apple client ID (Bundle Identifier)
        redirectURI="https://yourdomain.com/apple-callback"  // Replace with your actual redirect URI
        responseType="code id_token"
        responseMode="form_post"
        usePopup={true}
        callback={handleSuccess}  // Callback on successful login
        // onFailure={handleError}   // Callback on login failure
      />
    </div>
  );
};

export default AppleSignIn;
