const env = process.env.NODE_ENV || "development";

const config = {
  common: {
    firebaseConfig: {
      apiKey: "AIzaSyAXmfWP6O-8IBzwGF3nXY6uAxz-35Jw22g",
      authDomain: "ludopaytm-237a3.firebaseapp.com",
      projectId: "ludopaytm-237a3",
      storageBucket: "ludopaytm-237a3.appspot.com",
      messagingSenderId: "659001619159",
      appId: "1:659001619159:web:388a8526043c10901e7692",
    },
    GTM_ID: "GTM-WMZ7N4F",
    ONESIGNAL_CONFIG: {
      appId: "1f9a3ea6-924d-4b40-99fe-7ed0a4166ca9",
      safariWebId: "web.onesignal.auto.33b67024-44c4-4b60-aec5-91af5568c874",
    },
  },
  development: {
    SOCKET_CONFIG: {
      endpoint: "https://ludopaytm.com",
    },
  },

  production: {
    SOCKET_CONFIG: {
      endpoint: "https://mamashakuni.com",
    },
  },
};

// let config;
// if (process.env.NODE_ENV === "production") {
//   config = require("./prod.js");
// } else {
//   config = require("./dev.js");
// }
// module.exports = config;

export default Object.assign(config.common, config[env]);
