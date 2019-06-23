
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
            console.log(result)
          },

      })
  })
}
export default {
  render
}

