const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/auth/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../components/home/Home')
  },
  {
    path: '/examen',
    name: 'Examen',
    component: () => import(/* webpackChunkName: "examen" */ '../components/examenOnline')
  },
  {
    path: '/clasificados',
    name: 'clasificados',
    component: () => import(/* webpackChunkName: "clasificados" */ '../components/clasificados')
  },
  {
    path: '/medalleros',
    name: 'medalleros',
    component: () => import(/* webpackChunkName: "medalleros" */ '../components/medalleros')
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: () => import(/* webpackChunkName: "reportes" */ '../components/reportes')
  },
  {
    path: '/respuestas',
    name: 'Respuestas',
    component: () => import(/* webpackChunkName: "respuestas" */ '../components/examenOnline/respuestasExamenOnline.vue'),
    props: true
  },
  {
    path: '/404',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "notFound" */ '../layout/AppNotFound.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
];

export default routes;
