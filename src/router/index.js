import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'


export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {

    let autenticado = sessionStorage.getItem('autenticado')
    let autorizacion = to.matched.some(record => record.meta.auth)

    if (autorizacion && !autenticado) {
      const loginpath = window.location.pathname;
      next({ name: '', query: { from: loginpath } });
    } else {
        next();
    }

});

  return Router
})
