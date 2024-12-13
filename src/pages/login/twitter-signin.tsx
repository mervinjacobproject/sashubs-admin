// import React from 'react'
// import TwitterLogin from 'react-twitter-login'
// import jwt from 'jsonwebtoken'
// import toast from 'react-hot-toast'

// const TwitterSignIn = () => {
//   const handleSuccess = (response: any) => {
//     const { oauth_token, oauth_token_secret } = response // Get the oauth tokens
//     if (oauth_token && oauth_token_secret) {
//       console.log('OAuth Token:', oauth_token)
//       console.log('OAuth Token Secret:', oauth_token_secret)
//       toast.success('Login Successful')
//     } else {
//       toast.error('Login Failed')
//     }
//   }

//   // Error handler for login failure
//   const handleError = (error: any) => {
//     console.error('Login Failed:', error)
//     toast.error('Login Failed')
//   }

//   return (
//     <div>
//       <TwitterLogin
//         authCallback={handleSuccess}
//         // onFailure={handleError}
//         consumerKey='WHFodW9MeEFIZVRaaXpIdkt0UGg6MTpjaQ'
//         consumerSecret='GkYPY6AEdLtArb_Om3ZL9NzTkZWN_0MxWZxq9UtyDnd6RqvGoj'
//         // buttonText="Login"
//         // showIcon={true}
//       />
//     </div>
//   )
// }

// export default TwitterSignIn

import React from "react";
import TwitterLogin from "react-twitter-login";
import toast from "react-hot-toast";

const TwitterSignIn = () => {
  const handleSuccess = (response: any) => {
    const { oauth_token, oauth_token_secret } = response; // Get the oauth tokens

    if (oauth_token && oauth_token_secret) {
      console.log("OAuth Token:", oauth_token);
      console.log("OAuth Token Secret:", oauth_token_secret);
      toast.success("Login Successful");
      // Optionally send the tokens to your API to fetch user data
      // or store them in a global state
    } else {
      toast.error("Login Failed");
    }
  };

  // Error handler for login failure
  const handleError = (error: any) => {
    console.error("Login Failed:", error);
    toast.error("Login Failed");
  };

  return (
    <div>
      <TwitterLogin
        authCallback={handleSuccess}
        // onFailure={handleError}
        consumerKey="WHFodW9MeEFIZVRaaXpIdkt0UGg6MTpjaQ"
        consumerSecret="GkYPY6AEdLtArb_Om3ZL9NzTkZWN_0MxWZxq9UtyDnd6RqvGoj"
        callbackUrl="http://localhost:3000/twitter-callback" // Set your actual callback URL
      />
    </div>
  );
};

export default TwitterSignIn;
