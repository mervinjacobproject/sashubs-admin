import jwt from 'jsonwebtoken'
import React from 'react'
import FacebookLogin from 'react-facebook-login'
import toast from 'react-hot-toast'

const FacebookSignIn: React.FC = () => {
  const handleSuccess = (response: any) => {
    const accessToken = response.accessToken
    console.log('Access Token:', accessToken)

    if (accessToken) {
      const user = decodeToken(accessToken)
      if (user) {
        toast.success('Login Successful')
      }
    } else {
      toast.error('Failed to retrieve access token')
    }
  }

  const decodeToken = (token: string) => {
    try {
      const decoded: any = jwt.decode(token)
      if (decoded) {
        console.log('Decoded Token:', decoded)
        return decoded
      }
      return null
    } catch (error) {
      console.error('Failed to decode token:', error)
      toast.error('Failed to decode token')
      return null
    }
  }

  const handleError = (error: any) => {
    console.error('Login Failed:', error)
    toast.error('Login Failed')
  }

  return (
    <div>
      <FacebookLogin
        appId='1280164476732777'
        autoLoad={false}
        fields='name,email,picture'
        callback={handleSuccess}
        onFailure={handleError}
        textButton='Facebook'
        icon='fa-facebook'
        isMobile={false}
        disableMobileRedirect={true}
        responseType='token'
      />
    </div>
  )
}

export default FacebookSignIn
