import index from '../controllers/index'
import home from '../controllers/home'
import details from '../controllers/details'
import classes from '../controllers/classes'
import carts from '../controllers/carts'
import error from '../controllers/error'
import people from '../controllers/people'
import goods from '../controllers/goods'
import search from '../controllers/search'
import list from '../controllers/list'
import reg from '../controllers/reg'


export default class Router {
  constructor(obj) {
    this.mode = obj.mode
    // this.mode = 'history'
    // 路由配置
    this.routes = {
      '/error':error,
      '/':home,
      '/index': index,
      '/index/home': home,
      '/index/details': details,
      '/index/search': search,
      '/index/home/classes': classes,
      '/index/home/list':list,
      '/index/home/carts': carts,
      '/index/home/goods': goods,
      '/index/home/people': people,
      '/index/home/reg': reg,
    }
    
    // 组件挂载根元素
    this.root = $('main')
    // 导航菜单列表
    // this.navList = $('nav a')
    index.render()
    // home.render()
    this.init()
  }

  init() {
    this.loadView(location.pathname);
    if (this.mode === 'hash') {
      window.addEventListener('load', this.hashRefresh.bind(this), false);
      window.addEventListener('hashchange', this.hashRefresh.bind(this), false);
    } else {
      this.bindLink()
      window.addEventListener('load', this.loadView.bind(this, location.pathname));//location.pathname为"/"
      window.addEventListener('popstate', this.historyRefresh.bind(this));
     
    }
  }
  /**
   * history模式劫持 a链接
   */
  bindLink() {
    $('.footnav').on('click','a',this.handleLink.bind(this))
  }
  /**
   * history 处理a链接
   * @param  e 当前对象Event
   */
  handleLink(e) {
   e.preventDefault()
    // 获取元素路径属性
    let tar = $(e.target).parent();
    let href = tar.attr('href')
    
    // 对非路由链接直接跳转
    if (href.slice(0, 1) !== '#') {
      window.location.href = href
    } else {
      let path = href.slice(1)
      history.pushState({
        path: path
      }, null, path)
      // 加载相应页面
      this.loadView(path.split('?')[0])
    }
  }
  /**
   * hash路由刷新执行
   * @param {object} e
   */
  hashRefresh(e) {
    // console.log(e)
    if (e.newURL) {
     // console.log(e.newURL);//http://localhost:8080/#/index/home/classes

      var newURL = e.newURL.split('#')[1];//  /index/home/classes
      var oldURL = e.oldURL.split('#')[1];
    }
    // 获取当前路径,默认'/index'
    //console.log(location.hash);#/index/home/classes
    var currentURL = location.hash.slice(1).split('?')[0] || '/index/home';
    this.loadView(currentURL)
  }
  /**
   * history模式刷新页面
   * @param  e  当前对象Event
   */
  historyRefresh(e) {
    console.log(e.state)
    console.log(history.state)
    const state = e.state || {}
    const path = state ? null :state.path.split('?')[0]  
    if (path) {
      this.loadView(path)
    }
  }
  /**
   * 加载页面
   * @param {string} currentURL 
   */
  loadView(currentURL) {
    if (this.mode === 'history' && currentURL === '/') {
      history.replaceState({
        path: '/'
      }, null, '/')
      currentURL = '/index/home'
    }
    // 多级链接拆分为数组,遍历依次加载
    this.currentURLlist = currentURL.slice(1).split('/')
    this.url = ""
    //console.log(this.currentURLlist)
    this.currentURLlist.forEach((item, index) => {
      // 导航菜单激活显示
      if (index === this.currentURLlist.length-1) {
        this.navActive(item)
      }
      this.url += "/" + item
      this.controllerName = this.routes[this.url]
    //  console.log(this.controllerName)
      // 404页面处理
      if (!this.controllerName) {
        this.errorPage()
        return false
      }
      // 对于嵌套路由的处理
      if (this.oldURL && this.oldURL[index] == this.currentURLlist[index]) {
        this.handleSubRouter(item, index)
      } else {
        this.controller(this.controllerName, this.url)
      }
    });
    // 记录链接数组,后续处理子级组件
    this.oldURL = JSON.parse(JSON.stringify(this.currentURLlist))
    
  }
  /**
   * 处理嵌套路由
   * @param {string} item 链接list中当前项
   * @param {number} index 链接list中当前索引
   */
  handleSubRouter(item, index) {
    // console.log(this)
    // 新路由是旧路由的子级
    if (this.oldURL.length < this.currentURLlist.length) {
      // 相同路由部分不重新加载
      if (item !== this.oldURL[index]) {
        this.controller(this.controllerName)
        console.log('解绑状态监听事件')
        store.getSubject().unsubscribe('stateChange')
      }
    }
    // 新路由是旧路由的父级
    if (this.oldURL.length > this.currentURLlist.length) {
      var len = Math.min(this.oldURL.length, this.currentURLlist.length)
      
      // 只重新加载最后一个路由
      if (index == len - 1) {
        // console.log(this.name)
        this.controller(this.controllerName)
      }
    }
  }
  /**
   * 导航激活显示
   * @param  item 当前router对象
   */
  navActive(item) {
    $(`.${item}`).addClass('fnavActive').siblings().removeClass('fnavActive')
  }
  /**
   * 404页面处理
   */
  errorPage() {
    if (this.mode === 'hash') {
      location.href = '#/error'
    } else {
      history.replaceState({
        path: '/error'
      }, null, '/error')
      this.loadView('/error')
    }
  }
  /**
   * 组件控制器
   * @param {string} name 
   */
  controller(name, item) {
    name.render() // name 是当前路由匹配的那个 controller
    // this.navActive(item) // 切换路由时导航高亮
  }
  /**
   * 手动跳转路由
   * @param {string} path 
   */
  push(path) {
    if (this.mode === 'hash') {
      location.hash = '#' + path
    } else {
      history.pushState({
        path: path
      }, null, path)
      // 加载相应页面
      this.loadView(path.split('?')[0])
    }
  }
  /**
   * 绑定组件对象中events 事件
   * @desc 将组件对象中this通过call绑定
   * ! 仅支持绑定当前组件下的DOM事件
   */
  bindEvents() {
    var self = this;
    //eventType: 事件类型;selector: 事件作用对象;handleEvent: 事件执行方法
    var eventType = "",
      selector = "",
      handleEvent = "";
    var Event = function (eventType, selector, handleEvent) {
      self.$el.find(selector).on(eventType, (e) => {
        // 执行事件
        self[handleEvent](e)
      })
    }
    // 遍历events对象
    for (var index in self.events) {
      eventType = index.match(/[0-9A-Za-z]+\s/i)[0].trim(); // 匹配事件名
      selector = index.replace(/[0-9A-Za-z]+\s/i, "").trim(); // 匹配事件作用元素选择器
      handleEvent = self.events[index]; // 匹配处理事件名称
      var obj = new Event(eventType, selector, handleEvent);
      obj = null; // 用完即释放空间
    }
    Event = null
  }
  
}
// export default class Router{
 
//     constructor(params){
//       index.render()
//        // 记录routes配置
//     this.routes = params.routes || [];
//     // 记录路由模式
//     this.mode = params.mode || 'hash';
//     home.render()
//   // 调用初始化
//   this.init();
 
//   }
//     // 初始化
//    init(){
//         // 绑定路由响应事件
//         var that = this;
//         document.querySelectorAll("a").forEach((item,index)=>{
//             item.addEventListener("click",function(e){
//                 // 阻止a标签的默认行为
//                 if ( e && e.preventDefault ){
//                     e.preventDefault(); 
//                 }else{
//                     window.event.returnValue = false;  
//                 } 
                
//                 if (that.mode == 'hash'){
//                     // 判断是replace方法还是push方法
//                     if (this.getAttribute("replace")){
//                         var i = window.location.href.indexOf('#')
//                         // 通过replace方法直接替换url
//                         window.location.replace(
//                             window.location.href.slice(0, i >= 0 ? i : 0) + '#' + this.getAttribute("href")
//                         )
//                     }else{
//                         // 通过赋值追加
//                         window.location.hash = this.getAttribute("href");
//                     }
//                 }else{
//                     if (this.getAttribute("replace")){
//                         window.history.replaceState({}, '', window.location.origin+this.getAttribute("href"))
//                     }else{
//                         window.history.pushState({}, '', window.location.origin+this.getAttribute("href"))
//                     }
//                     // 手动调用更新内容方法
//                     that.routerChange();
//                 }
                
//             }, false);
//         });
//         // 监听路由改变
//         if (this.mode == 'hash'){
//             window.addEventListener("hashchange",()=>{
//                 this.routerChange();
//             });
//         }else{
//             window.addEventListener('popstate', e => {
//                 console.log(123);
//                 this.routerChange();
//             })
//         }
//         // 第一次进入的时候更新视图
//         this.routerChange();
//     }
//     // 路由改变监听事件
//    routerChange(){
//         if (this.mode == 'hash'){
//             let nowHash=window.location.hash;
//             let index=this.routes.findIndex((item,index)=>{
//                 return nowHash == ('#'+item.path);
//             });
//             if(index>=0){
//                 // 查找到对应路由
//                 this.routes[index].component;
//             }else {
//                 // 没找到对应路由，查找有没有*
//                 let defaultIndex=this.routes.findIndex((item,index)=>{
//                     return item.path=='*';
//                 });
//                 // 查找到*，执行重定向
//                 if(defaultIndex>=0){
//                     const i = window.location.href.indexOf('#')
//                     window.location.replace(
//                         window.location.href.slice(0, i >= 0 ? i : 0) + '#' + this.routes[defaultIndex].redirect
//                     )
//                 }
//             }
//         }else{
//             let path = window.location.href.replace(window.location.origin, '');
//             let index=this.routes.findIndex((item,index)=>{
//                 console.log('path...', path, 'item.path...', item.path);
//                 return path == item.path;
//             });
//             if(index>=0){
//                 // 查找到对应路由
//                 console.log(this.routes[index]);
//                 this.routes[index].component.render();
//             }else {
//                 // 没找到对应路由，查找有没有*
//                 let defaultIndex=this.routes.findIndex((item,index)=>{
//                     return item.path=='*';
//                 });
//                 // 查找到*，执行重定向
//                 if(defaultIndex>=0){
//                     window.history.replaceState({}, '', window.location.origin+this.routes[defaultIndex].redirect)
//                     this.routerChange();
//                 }
//             }
//         }
//     }
// }
