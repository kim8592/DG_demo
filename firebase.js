// Firebase Config
        const myFirebaseConfig = {
          apiKey: "AIzaSyCec3z_zcgLxLhAI3GqXcS82hYghlNpJYQ", 
          authDomain: "danhgiapro.firebaseapp.com",
          projectId: "danhgiapro",
          storageBucket: "danhgiapro.firebasestorage.app",
          messagingSenderId: "138066186458",
          appId: "1:138066186458:web:5e2df64faf833ddba595e3"
        };

        let app, auth, db;
        try {
          app = firebase.initializeApp(myFirebaseConfig);
          auth = firebase.auth();
          db = firebase.firestore();
        } catch (e) {
          console.error('Firebase init error:', e);
        }

        const appId = 'danhgiapro';