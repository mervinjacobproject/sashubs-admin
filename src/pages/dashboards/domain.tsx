import { CircularProgress, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import toast from 'react-hot-toast'

const Popup = () => {
  const [domain, setDomain] = useState('')
  const [fullURL, setFullURL] = useState('')
  const [error, setError] = useState('')
  const [apierror, setApiError] = useState('')
  const [apiFetched, setApiFetched] = useState(false)
  const {
    handleScoreData,
    addProjectApi,
    setIsPopupOpen,
    isPopupOpen,
    handleLoading,
    getProjectApi,
    setLoading,
    setSeoScoreData,
    projectData
  }: any = useContext(AuthContext)
  const tempUserData = typeof window != 'undefined' ? window.localStorage.getItem('userData') : null
  const userData = tempUserData ? JSON.parse(tempUserData) : null

  useEffect(() => {
    if (!projectData || projectData.length == '0') {
      setIsPopupOpen('true')
    }
  }, [])

  const handleInputChange = (event: any) => {
    setDomain(event.target.value)
    setError('')
  }

  const handleURLChange = (event: any) => {
    setApiError('')
    setFullURL(event.target.value)
    setError('')
  }

  useEffect(() => {
    if (!userData || !userData?.id || apiFetched) return
    const fetchProjectData = async () => {
      try {
        setLoading(true)
        const projectApi = await getProjectApi(userData.id)
        if (projectApi == undefined || !projectApi) return
        else if (projectApi === 'empty') {
          setIsPopupOpen('true')
        } else {
          setSeoScoreData([])
          setIsPopupOpen('false')
          // await handleScoreData(projectApi[0].domainurl)
        }
        setApiFetched(true)
      } catch (error) {
        console.error('Error fetching project API:', error)
        setApiFetched(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProjectData()
  }, [])

  const normalizeDomain = (input: string) => {
    let domain = input.replace(/^(https?:\/\/)?(www\.)?/, '')
    domain = domain.replace(/\/$/, '')
    return domain
  }

  const isValidDomain = (domain: string) => {
    const regex = /^(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,}$/
    return regex.test(domain)
  }

  const extractDomainFromURL = (url: string) => {
    try {
      const { hostname } = new URL(url)
      return hostname.replace(/^www\./, '')
    } catch (e) {
      return ''
    }
  }

  const handleSubmit = async () => {
    if (domain == '' || fullURL == '') {
      setError('Both domain and URL are required.')
      return
    }
    const parsedUrl = new URL(fullURL)
    const baseUrl = parsedUrl.origin
    const normalizedDomain = normalizeDomain(baseUrl)
    const extractedDomain = extractDomainFromURL(fullURL)

    if (!domain || !fullURL) {
      setError('Both domain and URL are required.')
      return
    }

    if (!isValidDomain(normalizedDomain)) {
      setError('Please enter a valid domain name.')
      return
    }

    // if (normalizedDomain != extractedDomain) {
    //   setError('The domain does not match the URL domain.')
    //   return
    // }
    // const handleScore = await handleScoreData(baseUrl)
    // const addProject = await addProjectApi(
    //   userData?.id?.toString(),
    //   userData?.email,
    //   domain,
    //   baseUrl,
    //   handleScore?.Details?.Favicon,
    //   handleScore?.toString(),
    //   handleScore?.TotalScore
    // )
    const addProject = await addProjectApi(userData?.id?.toString(), baseUrl)
    if (addProject.data.message == 'Project already exists') {
      setApiError(addProject.data.message)
      return
    }
    setTimeout(() => {
      if (addProject?.data?.message?.toLowerCase()?.includes('successfully')) {
        setFullURL('')
        setDomain('')
      }
    }, 5000)
  }

  // return isPopupOpen == 'true' || isPopupOpen == 'add' ? (
  //   <div className='popup-overlay'>
  //     <div className='popup-content'>
  //       <div className='popup-header'>
  //         <h2 className='popup_title' >Add Projects</h2>
  //         {isPopupOpen == 'add' && (
  //           <span
  //             className='close-icon'
  //             style={{ pointerEvents: handleLoading ? 'none' : 'auto' }}
  //             onClick={() =>{ setIsPopupOpen('false')
  //               setFullURL('')
  //               setDomain('')
  //               setError('')
  //               setApiError('')
  //             }}
  //           >
  //             &times;
  //           </span>
  //         )}
  //       </div>

  //       <div className='input-group'>
  //         <TextField
  //           id='domain'
  //           label='Name'
  //           className='popup_input'
  //           variant='outlined'
  //           fullWidth
  //           value={domain}
  //           onChange={handleInputChange}
  //           sx={{
  //             '& .MuiOutlinedInput-root': {
  //               '& fieldset': {
  //                 borderColor: '#dedde0', // Set default border color here
  //               },
  //               '& input': {
  //                 color: '#333', // Change text color inside the input field
  //               },
  //             },
  //           }}
  //         />
  //       </div>

  //       <div className='input-group'>
  //         <TextField
  //           id='fullURL'
  //           label='URL'
  //           className='popup_input'
  //           variant='outlined'
  //           fullWidth
  //           placeholder='https://www.example.com'
  //           value={fullURL}
  //           onChange={handleURLChange}
  //           sx={{
  //             '& .MuiOutlinedInput-root': {
  //               '& fieldset': {
  //                 borderColor: '#dedde0', // Set default border color here
  //               },
  //               '& input': {
  //                 color: '#333', // Change text color inside the input field
  //               },

  //             },
  //           }}
  //         />
  //       </div>

  //       {error && <div className='error-message'>{error}</div>}
  //       {apierror == "Project already exists" && <div className='error-message'>Project already exists. Verify URL</div>}
  //       {handleLoading && (
  //         <div className='info-message'>
  //           SEO report is being generated. Please wait for a few minutes
  //           <div className='loading-dots'>
  //             <div className='loading-dots--dot'></div>
  //             <div className='loading-dots--dot'></div>
  //             <div className='loading-dots--dot'></div>
  //           </div>
  //         </div>
  //       )}

  //       <div className='popup-actions'>
  //         <button
  //           className='popup_button d-flex justify-content-center align-items-center'
  //           style={{ pointerEvents: handleLoading ? 'none' : 'auto' ,background:"#776cff"}}
  //           onClick={() => handleSubmit()}
  //         >
  //           {handleLoading ? (
  //             <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  //               <CircularProgress size={16} style={{ marginRight: '5px' }} color='inherit' />
  //               <span>Add Project</span>
  //             </span>
  //           ) : (
  //             'Add Project'
  //           )}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // ) : null
}

export default Popup
