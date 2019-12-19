/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  pwa: {
    name: 'AwesomeJS',
    themeColor: '#F7DF1D',
    msTileColor: '#25241F',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/guijs-32.png',
      favicon16: 'img/icons/guijs-16.png',
      appleTouchIcon: 'img/icons/guijs-152.png',
      maskIcon: 'img/icons/guijs-safari-mask.svg',
      msTileImage: 'img/icons/guijs-144.png',
    },
    manifestOptions: {
      'background_color': '#25241F',
      'icons': [
        {
          'src': 'img/icons/guijs-48.png',
          'sizes': '48x48',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-72.png',
          'sizes': '72x72',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-96.png',
          'sizes': '96x96',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-144.png',
          'sizes': '144x144',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-168.png',
          'sizes': '168x168',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-192.png',
          'sizes': '192x192',
          'type': 'image/png',
        }, {
          'src': 'img/icons/guijs-512.png',
          'sizes': '512x512',
          'type': 'image/png',
        },
      ],
    },
  },

  chainWebpack (config) {
    config.resolve.symlinks(false)

    config.plugin('prefetch').tap(options => {
      if (!options[0].fileBlacklist) {
        options[0].fileBlacklist = []
      }
      options[0].fileBlacklist.push(/emoji-toolkit(.)+?\.js$/)
      return options
    })
  },
}
