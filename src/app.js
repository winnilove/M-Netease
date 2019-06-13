// import index from './controllers/index'
import home from './controllers/home'
// import position from '../controllers/position'
// import search from '../controllers/search'
// import profile from '../controllers/profile'
import details from './controllers/details'
import classes from './controllers/classes'
import carts from './controllers/carts'
//       '/index': index,
//       '/index/home': home,
//       '/index/details': details,
//       '/index/home/classes': classes,
//       '/index/home/carts': carts,
import Router from './router/index'

new Router({
    mode : 'history',
    routes:[
        { path: '/index/home', component:home },
        { path: '/index/details', component: details },
        { path: '/index/home/classes', component: classes },
        { path: '/index/home/carts', component: carts },
        { path:'*', redirect:'/index/home'}
    ]
})
// let scroll = new BScroll('.navCont',{
//     scrollX : true,
   
// })
