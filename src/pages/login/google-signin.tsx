import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import jwt from 'jsonwebtoken'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'

export default function GoogleSignIn() {
  const { signInwithSocialMediaApi, handleSuccessSocialMedia, getCustomerApi, setLoading }: any =
    useContext(AuthContext)
  const handleSuccess = (credentialResponse: any) => {
    const idToken = credentialResponse.credential
    decodeToken(idToken)
  }
  const decodeToken = async (credentialResponse: any) => {
    try {
      const decoded: any = jwt.decode(credentialResponse)
      if (decoded) {
        const repsonseData = await signInwithSocialMediaApi(decoded?.email)
        console.log('responseData', repsonseData)
        if (repsonseData.data.success == true) {
          setLoading(true)
          await getCustomerApi(decoded?.email)
          await handleSuccessSocialMedia(repsonseData.data.CustomerDetails)
          toast.success('Login Successfull')
        } else {
          toast.error(`${repsonseData.data.message}`)
        }
      }
      return decoded
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  const handleError = () => {
    console.error('Login Failed')
  }

  return (
    <GoogleOAuthProvider clientId='777150079685-a6sba24eim2setbce6i0r1u2hgj5injr.apps.googleusercontent.com'>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap theme='outline' text='signin' />
    </GoogleOAuthProvider>
  )
}
