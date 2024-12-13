import React, { useState } from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import jwt from 'jsonwebtoken';

const MicrosoftLoginComponent = () => {
  const clientId = "4ca93773-7d3a-4921-8836-641919d9a311"; // Replace with your Client ID
  const redirectUri = "http://localhost:3000/login/"; // Replace with your redirect URI

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleLoginSuccess = (response: any) => {
    // Extract the token from response
    const { id_token, access_token } = response;
    console.log("responsedays", response);
    // Decode the ID token to extract user information (you can use a JWT library for decoding if needed)
    const decodedToken = jwt.decode(id_token);
    console.log('ID Token:', id_token);
    console.log('Access Token:', access_token);
    console.log('User Info:', decodedToken);
    // Set user data in the state
    setUser(decodedToken);
  };

  const handleLoginFailure = (error: any) => {
    console.error('Login failed:', error);
    setError('Authentication failed. Please try again.');
  };

  return (
    <div>
      {!user ? (<></>
        // <MicrosoftLogin
        //   clientId={clientId}
        //   authCallback={handleLoginSuccess}
        //   redirectUri={redirectUri} children={undefined}
        //   graphScopes={['user.read', 'openid', 'profile', 'email']} />
      ) : (
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Preferred Username: {user.preferred_username}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MicrosoftLoginComponent;

// import React from 'react'
// import MicrosoftLogin, { ILoginResponse } from 'react-microsoft-login'

// Define the type for the authHandler callback to ensure correct data and error types.
// const authHandler = (err: any, data: ILoginResponse | null) => {
//   if (err) {
//     console.error('Authentication Error:', err)
//     return
//   }

//   if (data) {
//     // Handle the response data from Microsoft login
//     console.log('Login Data:', data)
//     // The access token is in `data.token`
//     const { idToken, accessToken } = data
//     console.log('ID Token:', idToken)
//     console.log('Access Token:', accessToken)
//     // You can send the access token to your server or handle it as needed
//   }
// }

// const MicrosoftAuth = () => {
//   return (
//     <div>
//       <MicrosoftLogin
//         clientId='4ca93773-7d3a-4921-8836-641919d9a311' // Replace with your Microsoft App's Client ID
//         authCallback={authHandler}
//         redirectUri='http://localhost:3000/login/' // Optional: Set redirect URI if needed
//         // Additional props to specify requested scopes or response type
//         graphScopes={['user.read', 'openid', 'profile', 'email']}
//       />
//     </div>
//   )
// }

// export default MicrosoftAuth
