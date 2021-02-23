module.exports = {
  title: 'Rocket',
  description: 'A Frontend for the Documoto API built with Vue.js',
  themeConfig: {
    logo: '/logo.svg',
    lastUpdated: 'Last updated',
    smoothScroll: true,
    repo: 'https://github.com/documoto/rocket',
    editLinks: true,
    editLinkText: 'Recommend a change',
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Guide',
        link: '/guide'
      }
    ],
    sidebar: [
      {
        title: 'Guide',
        path: '/guide'
      },
      {
        title: 'Testing',
        path: '/testing'
      },
      {
        title: 'Environments',
        path: '/environments'
      },
      {
        title: 'Architecture',
        path: '/architecture'
      },
      {
        title: 'State Management',
        path: '/state'
      },
      {
        title: 'Dirty Manager',
        path: '/dirty'
      },
      {
        title: 'Notes + Scripts',
        path: '/notes-scripts'
      }
    ]
  },
  plugins: [
    '@vuepress/active-header-links',
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      }
    ]
  ]
}
