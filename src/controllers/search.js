const searchTpl = require('../views/search.html')
const searchListTpl = require('../views/searchList.html')
import Router from '../router'
import fetch from '../models/fetch'

const render = () => {
  $('#index').html(searchTpl)
  //元素聚焦的时候触发
  $('.inputCon').on('focus',showSearchRes)
  $('.inputCon').on('blur',hideSearchRes)
  $('.inputCon').on('input',getSearchValue)
  //输入完成以后
  $('.inputCon').on('change',rendSearchList)
  $('.sList').on("click","a",function(){
    console.log($(this))
    $('.inputCon').val($(this))
  })
 
  function showSearchRes(){
    $('.searCon').css("display","block")
  }
  function hideSearchRes(){
    $('.searCon').css("display","none")
  }
  async function getSearchValue(){
    let valueInp = $('.inputCon').val()
    let html = ""
    let result = await fetch.post('/api/xhr/search/searchAutoComplete.json',{keywordPrefix: valueInp})
    result.data.forEach(item=>{
      html += `<li class="sList"><a href="javascript:void(0);">${item}</a></li>`
    })
    $('.resPost').html(html)
  }
  async function rendSearchList(){
    let valueInp = $('.inputCon').val()
    let result = await fetch.get(`/api/xhr/search/search.json?keyword=${valueInp}&sortType=0&descSorted=false&categoryId=0&matchType=0&floorPrice=-1&upperPrice=-1&size=40&itemId=0&stillSearch=false&searchWordSource=7&_stat_search=autoComplete`)
    let data = result.data.directlyList
    //渲染searchList页面
    let rendSearchListTpl = template.render(searchListTpl,{data})
    $('.searlistCon').html(rendSearchListTpl)
  } 
}
export default {
  render
}