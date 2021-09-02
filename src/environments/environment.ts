const testQA = false;

export const environment = {
  production: false,
  api: {
    functions: testQA ?
      'http://localhost:5000/gianfaraoneweb/us-central1/app/' :
      ''
  },
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  }
};
