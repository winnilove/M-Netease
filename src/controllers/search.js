const searchTpl = require('../views/search.html')
const searchListTpl = require('../views/searchList.html')
import fetch from '../models/fetch'

const render = () => {
  $('#index').html(searchTpl)
  //元素聚焦的时候触发
  $('.inputCon').on('focus',showSearchRes)
  // $('.inputCon').on('blur',hideSearchRes)
  $('.inputCon').on('input',getSearchValue)
  //输入完成以后,change事件当标签的值被修改并且失焦后，但并未进行提交
  $('.inputCon').on('change',rendSearchList)
 
  function showSearchRes(){
   
    $('.searCon').css("display","block")
  }
  function hideSearchRes(){
    $('.searCon').css("display","none")
  }
  async function getSearchValue(){
    let valueInp = $('.inputCon').val()
    let html = ""
    //let result = await fetch.post('/api/xhr/search/searchAutoComplete.json',{keywordPrefix: valueInp})
    let result = await fetch.get('/api/position/find',{
      keywords:valueInp
    })
    
    result.data.result.forEach(item=>{
      html += `<li class="sList"><a href="javascript:void(0);">${item.companyName}</a></li>`
    })
    $('.resPost').html(html)
    $('.sList').on("click",function(){
      $('.inputCon').val($(this)[0].innerText)
      hideSearchRes()
      rendSearchList()
    })
  }

  //let canRun = true;
   function rendSearchList(){
    // if(!canRun) return
    // canRun = false
    // //节流，其实这里节流没有意义
    // setTimeout(async function(){
    //   let valueInp = $('.inputCon').val()
    //   console.log(valueInp);
    //   let result = await fetch.get(`/api/xhr/search/search.json?keyword=${valueInp}&sortType=0&descSorted=false&categoryId=0&matchType=0&floorPrice=-1&upperPrice=-1&size=40&itemId=0&stillSearch=false&searchWordSource=7&_stat_search=autoComplete`)
    //   let data = result.data.directlyList
    //   //渲染searchList页面
    //   let rendSearchListTpl = template.render(searchListTpl,{data})
    //   // location.href += `?keyword=${valueInp}`
    //   $('.searlistCon').html(rendSearchListTpl)
    //   canRun = true
    // },100)
    let valueInp = $('.inputCon').val()
    let page=0,pagesize=6,keywords=valueInp
    $.ajax({
      url: '/api/position/find',
      headers: {
        'X-Access-Token': localStorage.getItem('token')
      },
      data:{
        page,
        pagesize,
        keywords
      },
      success(result) {
       console.log(result)
      }
    })
  } 
}
export default {
  render
}