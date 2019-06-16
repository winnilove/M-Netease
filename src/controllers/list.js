const listTpl = require('../views/list.html')
const listAddTpl = require('../views/listAdd.html')

import fetch from '../models/fetch'

const render = async() => {
  //能请求到很多数据post:https://m.you.163.com/xhr/item/saleRankItems.json  
  //参数：categoryId:1005002,subCategoryId:0
 
  let result = await fetch.post('/api/xhr/item/saleRankItems.json',{categoryId:1005002,subCategoryId:0})
  let data = result.data;
  let rendListTpl = template.render(listTpl,{data})
  $('main').html(rendListTpl)
  let bScroll = new BScroll('.listC',{
    scrollY : true,
    click: true,
    scrollbar :false,
    freeScroll :true,
    probeType: 1,
    bounceTime:500,      //回弹时间
    // pullUpLoad: {
    //     threshold: -60    //当上拉距离超过盒子高度的10px的时候,就派发一个上拉加载的事件
    // },
    // pullDownRefresh:{
    //   threshold: -10   //当下拉长度距离盒子顶部的高度超过10px的时候,就派发一个下拉刷新的事件
    // },
    useTransition:false  // 防止iphone微信滑动卡顿
  })
   // 初始化位置
  bScroll.scrollTo(0, -60)
  let head = $('.headArrow img'),
  topImgHasClass = head.hasClass('up')
  let foot = $('.footArrow img'),
  bottomImgHasClass = head.hasClass('down')
  bScroll.on('scroll',function(){
    let y = this.y//y:scroll 纵轴坐标。
    let maxY = this.maxScrollY-y//maxScrollY:scroll 最大纵向滚动位置。是负值
    //maxY刚好是滚动的那个div的高度减去父容器(wraper)的高度
    //div在最开始的时候
    // console.log(y)//-0
    // console.log(this.maxScrollY);//-3694
    // console.log(maxY);//-3694
    // console.log($('.listC').children().height())//4240

   
    // 下拉，当隐藏的loading完全显示的时候触发
    if (y >= 0) {
      !topImgHasClass && head.addClass('up')
      return
    }
  })
  //// 绑定手指松开触发的事件
  bScroll.on('scrollEnd',async function(){
    //下拉刷新处理
    if(this.y >= -50 && this.y < 0){
      this.scrollTo(0,-50)
      head.removeClass('up')
    }else if(this.y >= 0){
      head.attr('src','/images/ajax-loader.gif')
      //异步加载数据
      let result = await fetch.post('/api/xhr/item/saleRankItems.json',{categoryId:1005002,subCategoryId:0})
      let data = result.data;
      let rendListAddTpl = template.render(listAddTpl,{data})
      //$('main').html(rendListTpl)
      $('.headArrow').after(rendListAddTpl)
      this.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scrollTo(0, -40)
      head.removeClass('up')
      head.attr('src', '/images/arrow.png')
    }
  })

  //pullingUp 和pullingDown事件什么位置下拉或者下拉都触发事件，而需求是到顶端时下拉才触发事件
  // bScroll.on("pullingUp",function(){    //上拉加载事件
  //   console.log('加载ajax数据');
  //   bScroll.finishPullUp();//可以多次执行上拉加载，没有这段代码上拉只会加载一次
  // });
  // bScroll.on("pullingDown",function(){  //下拉刷新事件
  //     console.log('下拉刷新数据');
  //     bScroll.finishPullDown()//可以多次执行下拉刷新，没有这段代码下只会刷新一次
  // });
  // bScroll.refresh();//初始化demo  当异步加载数据的时候，重新渲染页面，这段代码非常重要


}
export default {
  render
}

