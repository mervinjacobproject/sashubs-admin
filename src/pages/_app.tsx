// ** React Imports
import { ReactNode, useState, useEffect } from 'react'
// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import

import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import Network from './network'
import { useRouter } from 'next/router'
// import '../../styles/stepperAlt/stepperAlt.css'

// ** Extend App Props with Emotion

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [isOnline, setIsOnline] = useState<any>(true)
  const router = useRouter()

  useEffect(() => {
    const handleNetworkChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleNetworkChange)
    window.addEventListener('offline', handleNetworkChange)

    const userData = localStorage.getItem('userData')
    if (userData == null) {
      router.push('/login')
    }

    return () => {
      window.removeEventListener('online', handleNetworkChange)
      window.removeEventListener('offline', handleNetworkChange)
    }
  }, [])

  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        {isOnline ? (
          <>
            <Head>
              <title>{`${themeConfig.templateName}`}</title>
              <meta
                name='description'
                content={`${themeConfig.templateName} Shopping –  Apurva is a genuine, India's leading grocery brand with a wide range of products at affordable prices. We offer a wide range of products including fresh fruits, vegetables, spices, dairy, beverages, and more. We also offer a wide range of services like grocery delivery, collection, and more. We are a one-stop-shop for all your grocery needs.`}
              />
              <link rel='manifest' href='/manifest.json' />
              <meta name='viewport' content='initial-scale=1, width=device-width' />
              <meta property='og:title' content='Apurva' />
              <meta property='og:site_name' content='Apurva - Shopping' />
              <meta property='og:url' content='https://crads.apurvarewardz.com' />
              <meta
                property='og:description'
                content='Welcome to Apurva, your trusted grocery offering a wide range of quality products at great prices. From fresh groceries to unique fancy items, find everything you need under one roof. Shop with Apurva for convenience and top-notch service.'
              />
              <meta property='og:type' content='image/png' />
              <meta property='og:image' content='https://api.apurvarewardz.com/public/Groesen-logo.png' />
            </Head>

            <AuthProvider>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </AuthProvider>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '50px', fontSize: '18px' }}>
            <Network />
          </div>
        )}
      </CacheProvider>
    </Provider>
  )
}

export default App
