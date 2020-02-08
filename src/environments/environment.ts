const testQA = false;

export const environment = {
  production: false,
  api: {
    functions: testQA ?
      'http://localhost:5000/gianfaraoneweb/us-central1/app/' :
      'https://us-central1-gianfaraoneweb.cloudfunctions.net/app/'
  },
  firebase: {
    apiKey: 'AIzaSyBBL-0x0RHmgmfRWTpBvHzBQS62mDwbEGQ',
    authDomain: 'gianfaraoneweb.firebaseapp.com',
    databaseURL: 'https://gianfaraoneweb.firebaseio.com',
    projectId: 'gianfaraoneweb',
    storageBucket: 'gianfaraoneweb.appspot.com',
    messagingSenderId: '957873330274',
    appId: '1:957873330274:web:65018019d5fb5ddb26d93b'
  }
};
