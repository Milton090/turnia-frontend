const { configure } = require('quasar/wrappers');

const API_URL_LOCAL = "http://localhost:6101";
const API_URL_PRODUCCION = "https://turnia-api.onrender.com";


module.exports = configure(function (ctx) {
  return {
    framework: {
      plugins: ['Notify']
    },
    eslint: {
      warnings: true,
      errors: true
    },

    boot: [

      'axios',
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'mdi-v5',
      'fontawesome-v6',

      'roboto-font',
      'material-icons',
    ],

    build: {
      env: {
        API_URL: ctx.dev ? API_URL_LOCAL : API_URL_PRODUCCION,
      },

      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },

      vueRouterMode: 'hash',
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},

      lang: 'es',

      plugins: []
    },

    animations: [],

    ssr: {
      pwa: false,

      prodPort: 3000,

      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,

      bundler: 'packager',

      packager: {
      },

      builder: {
        appId: 'turnia'
      }
    },

    bex: {
      contentScripts: [
        'my-content-script'
      ],
    }
  }
});
