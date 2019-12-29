const testQA = false;

export const environment = {
  production: false,
  api: {
    functions: testQA ?
      'http://localhost:5000/gianfaraoneweb/us-central1/app' :
      'https://us-central1-gianfaraoneweb.cloudfunctions.net/app/'
  }
};
