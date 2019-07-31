
const regTpl = require('../views/reg.html')

const render = async() => {
  $('#index').html(regTpl)
  $('.ui-btn-wrap').on('click',".ui-btn-primary",async(e)=>{
      e.stopPropagation()
      $.ajax({
          url:'/api/consumers/register',
          type: 'POST',
          data: $('#frm_login').serialize(),
          success: (result) => {
            $('.main').html("注册成功，3秒后进入登录页面")
            setTimeout(()=>{
              window.location.hash='#/index/home/people'
            },3000)
            
          },

      })
  })
}
export default {
  render
}

