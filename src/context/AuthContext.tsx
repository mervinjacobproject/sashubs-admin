import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import ApiBearerToken from 'src/commonExports/apiBearer'
import LambdaBaseUrl from 'src/commonExports/apiLambdaUrl'
import PhpBaseUrl from 'src/commonExports/apiPhpUrl'
import authConfig from 'src/configs/auth'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [apiLoading, setApiLoading] = useState<any>(false)
  const [handleLoading, setHandleLoading] = useState<boolean>(false)
  const [seoScoreData, setSeoScoreData] = useState([])
  const [isPopupOpen, setIsPopupOpen] = useState('false')
  const [projectData, setProjectData] = useState([])
  const [customerDetailData, setCustomerDetailData] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [userProject, setUserProject] = useState([])
  const [selectedDomain, setSelectedDomain] = useState()
  const [seoPageAnalysisData, setSeoPageAnalysisData] = useState([])
  const [seoPageOptimizerData, setSeoPageOptimizerData] = useState([])
  const [techSeoDashBoardData, setTechSeoDashBoardData] = useState([])
  const [infiniteLoading, setInfiniteLoading] = useState(false)
  const [paginationModalOPen, setPaginationModalOpen] = useState(false)
  const [seoAuditDashboardData, setSeoAuditDashboardData] = useState([])
  const [seoSinglePAgeAuditDashboardData, setSeoSinglePageAuditDashboardData] = useState([])
  const [lastTriggerApiData, setLastTriggerApiData] = useState([])
  const [selectedProjectData, setSelectedProjectData] = useState<any>([])
  const [crawlDate, setCrawlDate] = useState('')
  const pathname = typeof window != 'undefined' && window.location.pathname
  const router = useRouter()
  const requiredFields = ['siteAudit', 'score', 'seoOptimizer', 'pageAnalysis', 'techDashboard']
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(false)
        setUser({
          ...{
            id: 1,
            role: 'admin',
            password: 'admin',
            fullName: 'John Doe',
            username: 'johndoe',
            email: 'admin@Apurva.com'
          }
        })
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        const redirectURL = returnUrl && returnUrl != '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 35) {
      return hexToRGBA('#d1242f', 1) // Red color
    } else if (percentage >= 35 && percentage < 66) {
      return hexToRGBA('#fc9812', 1) // Yellow color
    } else {
      return hexToRGBA('#069c56', 1) // Green color
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const encrypt = (value: string, key: string): string => {
    if (typeof value != 'string' || typeof key != 'string') {
      throw new TypeError('Both value and key must be strings')
    }

    let encrypted = ''
    for (let i = 0; i < value.length; i++) {
      encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return encrypted
  }

  const formatDate = (dateString: any) => {
    const createdDate = new Date(dateString)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = createdDate.getDate()
    const month = monthNames[createdDate.getMonth()]
    const year = createdDate.getFullYear()
    return `${day}-${month}-${year}`
  }

  useEffect(() => {
    // handleChangeScore(selectedProjectData)
  }, [selectedProjectData])

  const handleChangeScore = (selectProject: any) => {
    debugger
    if (selectProject && selectProject.score) {
      console.log(selectProject, 'selectedProjectData')
      const pageAnalysisData = selectProject?.score
      setSeoScoreData(pageAnalysisData)
      setTimeout(() => {
        setHandleLoading(false)
        setApiLoading(false)
        setLoading(false)
      }, 2000)
    } else {
      setSeoScoreData([])
      setApiLoading(false)
      setHandleLoading(false)
      setLoading(false)
    }
  }

  const handleScoreDataApi = async (val: any) => {
    if (!val || val == undefined || seoScoreData.length > 0) return
    try {
      setSelectedProjectData([])
      const filteredProject: any = projectData && projectData.filter((project: any) => project.id == val)
      if (filteredProject && filteredProject.length > 0) {
        const tempDate = formatDate(filteredProject[0].created_date)
        setCrawlDate(tempDate)
      }
      const tempProject: any = await getProjectDetailsUsingJson(filteredProject[0])
      console.log(tempProject, 'tempProject')
    } catch (err: any) {
      console.error('handleScoreDataApi Error:', err)
      setHandleLoading(false)
      setLoading(false)
    }
  }

  const handleScoreData = async (val: any) => {
    if (!val || val == undefined || seoScoreData.length > 0) return
    setHandleLoading(true)
    try {
      const response: any = await axios.get(`${LambdaBaseUrl}seoscore?url=${encodeURIComponent(val)}`)
      if (response?.status == 200) {
        const data = response?.data
        setSeoScoreData(data)
        setHandleLoading(false)
        setIsPopupOpen('false')
        setLoading(false)
        return data
      } else {
        setHandleLoading(false)
        setLoading(false)
      }
    } catch (err: any) {
      console.error('API Error:', err)
      setHandleLoading(false)
      setLoading(false)
    }
  }

  const handleSinglePageSiteAuditAPI = async (val: any) => {
    if (!val || val == undefined) return
    try {
      const response: any = await axios.get(`${LambdaBaseUrl}siteaudit?url=${encodeURIComponent(val)}`)
      if (response?.status == 200) {
        const data = response?.data
        setSeoSinglePageAuditDashboardData(data)
        setApiLoading(false)
      } else {
        setApiLoading(false)
      }
    } catch (err: any) {
      console.error('API Error:', err)
      setApiLoading(false)
    }
  }

  const handleseoOptimizerApi = async (val: any) => {
    if (!val || val == undefined) return
    try {
      const response: any = await axios.get(`${LambdaBaseUrl}seooptimizer?url=${encodeURIComponent(val)}&image=true`)
      if (response?.status == 200) {
        const data = response?.data
        setSeoPageOptimizerData(data)
        setPaginationModalOpen(true)
        setLoading(false)
      } else {
        setSeoPageOptimizerData([])
        setLoading(false)
      }
    } catch (err: any) {
      console.error('API Error:', err)
      setSeoPageOptimizerData([])
      setLoading(false)
    }
  }

  const getProjectApi = async (id: any) => {
    if (projectData?.length > 0) return
    setLoading(true)
    const requestUrl = `${PhpBaseUrl}/getProject?cusid=${id}`
    try {
      const res = await ApiClient.post(requestUrl)
      if (res?.status == 200) {
        const tempData: any = res?.data?.data?.filter((data: any) => data?.domainurl != null)
        if (res.data.message == 'no data present') {
          setProjectData([])
          setLoading(false)
          setApiLoading(false)
        } else {
          setProjectData(tempData)
          setLoading(false)
          setApiLoading(false)
        }
        return res?.data?.data?.filter((data: any) => data?.domainurl != null)
      } else {
        setLoading(false)
        setApiLoading(false)
        return 'empty'
      }
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500, 502, 503, 504].includes(status)) {
          setLoading(false)
          setApiLoading(false)
          toast.error(data.message || 'Invalid input provided.')
        } else {
          setLoading(false)
          setApiLoading(false)
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        setLoading(false)
        setApiLoading(false)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  const getCustomerApi = async (email: any) => {
    if (!email) return
    const requestUrl = `${PhpBaseUrl}/getCustomer?email=${email}`
    try {
      const res = await ApiClient.post(requestUrl)
      if (res?.status == 200) {
        localStorage.setItem('userData', JSON.stringify(res.data.CustomerDetails))
        setLoading(false)
        setApiLoading(false)
        return res?.data?.data?.filter((data: any) => data?.domainurl != null)
      } else {
        setLoading(false)
        setApiLoading(false)
        return 'empty'
      }
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500].includes(status)) {
          setLoading(false)
          setApiLoading(false)
          toast.error(data.message || 'Invalid input provided.')
        } else {
          setLoading(false)
          setApiLoading(false)
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        setLoading(false)
        setApiLoading(false)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  const handleSuccessSocialMedia = async (response: any, username: any, CustomerDetails: any) => {
    const user = JSON.stringify(CustomerDetails?.CustomerDetails)
    localStorage.setItem('userData', user)
    const { AccessToken, IdToken } = response.data
    if (AccessToken) {
      localStorage.setItem('adminLoginEmail', username)
      localStorage.setItem('adminLoginId', IdToken)
      localStorage.setItem('accessToken', AccessToken)
      toast.success('Login Success')
      router.push('/dashboards')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setLoading(false)
      toast.error('Username or Password was incorrect or Account may be inactive')
    }
  }

  const signInwithSocialMediaApi = async (email: any) => {
    const requestUrl = `${PhpBaseUrl}/getCustomer?email=${email}`
    try {
      const res = await ApiClient.post(requestUrl)
      return res
      if (res?.status == 200) {
        setProjectData([])
        setApiLoading(true)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
      return res
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500].includes(status)) {
          toast.error(data.message || 'Invalid input provided.')
        } else {
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  const getRefreshProjectApi = async (id: any) => {
    const requestUrl = `${PhpBaseUrl}/getProject?cusid=${id}`
    try {
      const res = await ApiClient.post(requestUrl)
      if (res?.status == 200) {
        if (res.data.message == 'no data present') {
          setProjectData([])
          setTimeout(() => {
            setApiLoading(false)
          }, 1000)
          return 'empty'
        }
        const tempData: any = res?.data?.data?.filter((data: any) => data?.domainurl != null)
        setProjectData(tempData)
        setTimeout(() => {
          setApiLoading(false)
        }, 1000)
        return res?.data?.data?.filter((data: any) => data?.domainurl != null) || 'empty'
      } else {
        setApiLoading(false)
        return 'empty'
      }
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500].includes(status)) {
          setApiLoading(false)
          toast.error(data.message || 'Invalid input provided.')
        } else {
          setApiLoading(false)
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        setApiLoading(false)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  // const getProjectDetailsUsingJson: any = async (data: any) => {
  //   const requestUrl = `${data.report}`
  //   const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  //   try {
  //     if (true) {
  //       await delay(5000) // Wait for 5 seconds if data.initial is true
  //     }
  //     const res = await ApiClient.get(requestUrl)
  //     if (res.status == 200) {
  //       const currentData: any[] = res.data // Assume currentData is an array
  //       const existingData: any = { ...selectedProjectData }
  //       currentData &&
  //         currentData.forEach(item => {
  //           requiredFields.forEach(field => {
  //             if (item[field]) {
  //               existingData[field] = item[field] // Update the field if present
  //             }
  //           })
  //         })
  //       setSelectedProjectData(existingData) // Update selectedProjectData directly (not wrapped in an array)
  //       const missingFields = requiredFields.filter(field => !existingData[field])
  //       if (missingFields.length > 0) {
  //         console.log('Missing fields:', missingFields)
  //         await delay(10000) // Wait for 10 sec before retrying
  //         return getProjectDetailsUsingJson(data) // Recursive call
  //       }
  //       return existingData // Return the updated data when all required fields are populated
  //     }
  //   } catch (err: any) {
  //     if (err?.response) {
  //       const { status, data, statusText } = err.response
  //       if ([400, 401, 402, 403, 404, 500].includes(status)) {
  //         toast.error(data.message || 'Invalid input provided.')
  //       } else {
  //         toast.error(`Error: ${status} - ${statusText}`)
  //       }
  //     } else {
  //       console.error('API Error:', err)
  //       toast.error('An unexpected error occurred. Please try again.')
  //     }
  //   }
  // }

  const getProjectDetailsUsingJson: any = async (
    data: any,
    startTime: number = Date.now(),
    lastUrl: string = data?.report
  ) => {
    const currentUrl = `${data?.report}`
    const maxWaitTime = 15 * 60 * 1000
    try {
      if (!localStorage.getItem('apiStatus')) {
        localStorage.setItem('apiStatus', JSON.stringify({ url: currentUrl, status: true }))
      }

      const timeElapsed = Date.now() - startTime
      if (timeElapsed >= maxWaitTime) {
        setApiLoading(false)
        toast.error('Time exceeded 15 minutes without populating required fields.')
        return
      }

      if (currentUrl != lastUrl) {
        toast.error('URL has changed. Stopping current process.')
        return
      }

      await delay(5000)

      const res = await ApiClient.get(currentUrl)
      if (res.status == 200) {
        const currentData: any[] = [...res.data]
        const existingData: any = { ...selectedProjectData }
        let updated = false
        console.log(currentData, 'currentData')

        // Update existing data based on required fields
        currentData.forEach(item => {
          requiredFields.forEach(field => {
            if (item.hasOwnProperty(field) && existingData[field] == null) {
              existingData[field] = item[field]
              console.log(currentData, 'currentData', existingData)
              handleChangeScore(currentData[0])
              setSelectedProjectData(currentData[0])
              setApiLoading(false)
              updated = true
            }
          })
        })

        console.log('Existing data:', existingData)
        // const missingFields = requiredFields.filter(field => !existingData[field] || existingData[field] == null)
        const missingFields = requiredFields.filter((field: any) => !currentData[0].hasOwnProperty(field))

        console.log('Missing fields:', missingFields)

        // Store the current data in setSeoScoreData (array of JSON objects)
        // setSeoScoreData(currentData)  // Update SEO score data with the fetched data

        // Retry if there are missing fields
        if (missingFields.length > 0 && updated) {
          await delay(30000)
          return getProjectDetailsUsingJson(data, startTime, currentUrl)
        }

        // If no missing fields, remove API status from local storage
        if (missingFields.length == 0) {
          localStorage.removeItem('apiStatus')
          // return existingData
        }
      }
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500, 501, 502, 503, 504].includes(status)) {
          toast.error(data.message || 'Invalid input provided.')
        } else {
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  // const addProjectApi = async (id: string, url: string) => {
  //   setHandleLoading(true)
  //   const requestUrl = `/api/posttrigger?url=${encodeURIComponent(url)}&cusid=${encodeURIComponent(id)}`
  //   try {
  //     const response = await axios.get(requestUrl)
  //     if (response.status == 200) {
  //       if (response.data.message == 'Project already exists') {
  //         setHandleLoading(false)
  //         return response
  //       }
  //       const tempPostProjectDataRes: any = []
  //       tempPostProjectDataRes.push(response.data)
  //       setLastTriggerApiData(tempPostProjectDataRes)
  //       console.log('tempPostProjectDataRes:', tempPostProjectDataRes)
  //       setSeoScoreData([])
  //       setTimeout(() => {
  //         const tempGetData: any = getRefreshProjectApi(id)
  //         console.log(tempGetData, 'tempGetData')
  //         if (tempGetData == 'empty') {
  //           await delay(3000)
  //           return getRefreshProjectApi(id)
  //         }
  //         setHandleLoading(false)
  //         setIsPopupOpen('false')
  //         toast.success(response.data.message)
  //       }, 7000)
  //     }
  //     return response
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.code == 'ECONNABORTED') {
  //         setHandleLoading(false)
  //         console.error('Request timed out after 15 minutes.')
  //       } else {
  //         setHandleLoading(false)
  //         console.error('Axios error during request:', error.message)
  //       }
  //     } else {
  //       setHandleLoading(false)
  //       console.error('Unexpected error:', error)
  //     }
  //     throw error
  //   }
  // }

  const addProjectApi = async (id: string, url: string) => {
    setHandleLoading(true)
    const requestUrl = `/api/posttrigger?url=${encodeURIComponent(url)}&cusid=${encodeURIComponent(id)}`
    try {
      const response = await axios.get(requestUrl)
      if (response.status == 200) {
        if (response.data.message == 'Project already exists') {
          setHandleLoading(false)
          return response
        }
        const tempPostProjectDataRes: any = []
        tempPostProjectDataRes.push(response.data)
        setLastTriggerApiData(tempPostProjectDataRes)
        if (pathname != '/dashboards/') {
          router.push('/dashboards')
        }
        setSeoScoreData([])
        let attemptCount = 0
        const maxAttempts = 3
        const refreshProjectData: any = async () => {
          try {
            const tempGetData: any = await getRefreshProjectApi(id)
            if (tempGetData == 'empty' && attemptCount < maxAttempts) {
              attemptCount++
              await delay(3000)
              return refreshProjectData()
            }
            if (tempGetData != 'empty') {
              setHandleLoading(false)
              setIsPopupOpen('false')
              toast.success(response.data.message)
            } else {
              setHandleLoading(false)
              toast.error('Failed to retrieve project data after 3 attempts.')
            }
          } catch (err) {
            console.error('Error while refreshing project data:', err)
            setHandleLoading(false)
            toast.error('Failed to refresh project data. Please try again.')
          }
        }
        setTimeout(refreshProjectData, 7000)
      }
      return response
    } catch (error) {
      setHandleLoading(false)
      if (axios.isAxiosError(error)) {
        if (error.code == 'ECONNABORTED') {
          console.error('Request timed out after 15 minutes.')
          toast.error('Request timed out after 15 minutes.')
        } else {
          console.error('Axios error during request:', error.message)
          toast.error(`Axios error: ${error.message}`)
        }
      } else {
        console.error('Unexpected error:', error)
        toast.error('Unexpected error occurred.')
      }
      throw error
    }
  }

  const deleteLambdaProjectApi = async (url: any, id: any) => {
    const requestUrl = `/api/deleteprojectseo?url=${encodeURIComponent(url)}&cusid=${id}`
    try {
      const res = await ApiClient.post(requestUrl)
      if (res?.status == 200) {
        return res
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
      return res
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500].includes(status)) {
          return err.response
        }
      }
      console.error('API Error:', err)
    }
  }

  const deleteProjectApi = async (id: any, cusId: any) => {
    const requestUrl = `${PhpBaseUrl}/deleteProject?projectid=${id}`
    try {
      const res = await ApiClient.post(requestUrl)
      if (res?.status == 200) {
        setApiLoading(true)
        if (projectData.length > 1) {
          getRefreshProjectApi(cusId)
        }
        if (projectData.length == 1) {
          setCrawlDate('')
          setSeoScoreData([])
          getProjectApi(cusId)
          router.push('/dashboards')
        }
        toast.success('Project deleted successfully.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
      return res
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 402, 403, 404, 500].includes(status)) {
          toast.error(data.message || 'Invalid input provided.')
        } else {
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  const editProjectApi = async (id: any, cusId: any, name: any) => {
    const requestUrl = `${PhpBaseUrl}/updateProject`
    const payload = {
      cusid: cusId,
      domainname: name,
      projectid: id
    }
    try {
      const res = await ApiClient.post(requestUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res?.status == 200) {
        setProjectData([])
        getRefreshProjectApi(cusId)
        toast.success('Project updated successfully.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
      return res
    } catch (err: any) {
      if (err?.response) {
        const { status, data, statusText } = err.response
        if ([400, 401, 500].includes(status)) {
          toast.error(data.message || 'Invalid input provided.')
        } else {
          toast.error(`Error: ${status} - ${statusText}`)
        }
      } else {
        console.error('API Error:', err)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  useEffect(() => {
    if (pathname != 'tech-seo/pages/' && paginationModalOPen == true) {
      setPaginationModalOpen(false)
    }
  }, [pathname])

  const values = {
    user,
    loading,
    setUser,
    seoScoreData,
    setSeoScoreData,
    setLoading,
    handleLoading,
    isPopupOpen,
    setIsPopupOpen,
    login: handleLogin,
    logout: handleLogout,
    encrypt,
    handleScoreData,
    addProjectApi,
    getProjectApi,
    projectData,
    isAnalyzing,
    setIsAnalyzing,
    userProject,
    setUserProject,
    selectedDomain,
    setSelectedDomain,
    seoPageAnalysisData,
    setSeoPageAnalysisData,
    infiniteLoading,
    setInfiniteLoading,
    getColorByPercentage,
    seoPageOptimizerData,
    handleseoOptimizerApi,
    techSeoDashBoardData,
    setTechSeoDashBoardData,
    paginationModalOPen,
    setPaginationModalOpen,
    seoAuditDashboardData,
    setSeoAuditDashboardData,
    apiLoading,
    setApiLoading,
    handleSinglePageSiteAuditAPI,
    seoSinglePAgeAuditDashboardData,
    setSeoSinglePageAuditDashboardData,
    handleScoreDataApi,
    deleteProjectApi,
    getRefreshProjectApi,
    editProjectApi,
    signInwithSocialMediaApi,
    handleSuccessSocialMedia,
    getCustomerApi,
    selectedProjectData,
    setSelectedProjectData,
    crawlDate,
    setProjectData,
    deleteLambdaProjectApi
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
