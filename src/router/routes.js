
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout1.vue'),
    children: [
      { path: '',name:'main', component: () => import('pages/main.vue') },
      { path: 'makeMenu', component: () => import('pages/make_menu.vue') },
      { path: 'preview', component: () => import('pages/preview.vue') },
      { path: 'capture', component: () => import('pages/capture.vue') },
      { name:'detect', path: 'detect', component: () => import('pages/detect.vue') },
      { path: 'machineTest', component: () => import('pages/machine_test.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
