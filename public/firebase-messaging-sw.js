// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtxIiXVRcooI-ld1J4HFrqb6JlWZJ-95Y",
  authDomain: "chotu-app-a37c6.firebaseapp.com",
  projectId: "chotu-app-a37c6",
  messagingSenderId: "900629836084",
  appId: "1:900629836084:web:df58a9929598c947e6f561"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
