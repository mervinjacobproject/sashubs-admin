import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from 'src/@core/utils/firebase'; // Ensure firebase is initialized properly here

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

          const messaging = getMessaging(firebaseApp);

          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {

            const currentToken = await getToken(messaging, {
              vapidKey: 'BKkLbcNOZ_y47F_xMha04wucevhspWT5O6bCpSsCiWjzr-ySSrYm_vACmhgPDWfN4zT1zgjmpMDJGPsVMcMK3i4',
              serviceWorkerRegistration: registration,
            });

            if (currentToken) {
              setToken(currentToken);
            } else {
            }
          } else {
          }
        } catch (error) {
          console.error('An error occurred while retrieving token:', error);
        }
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
