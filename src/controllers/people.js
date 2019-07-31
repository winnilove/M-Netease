
const peopleTpl = require('../views/people.html')

const footNavTpl = require('../views/footnav.html')
const headLogoTpl = require('../views/headlogo.html')

const render = async() => {
  $('#index').html(peopleTpl)
  $('.ui-btn-wrap').on('click',".ui-btn-primary",async(e)=>{
    e.stopPropagation()
    $.ajax({
        url:'/api/consumers/login',
        type: 'POST',
        data: $('#frm_login').serialize(),
        success: (result,statusCode,jqXHR) => {
          $('.main').html("登录成功，3秒后回到首页")
          setTimeout(()=>{
            window.location.hash='#/index/home'
          },3000)
          localStorage.setItem('token',jqXHR.getResponseHeader('X-Access-Token'))
        },

    })
  })
}
export default {
  render
}

