
const peopleTpl = require('../views/people.html')

const footNavTpl = require('../views/footnav.html')
const headLogoTpl = require('../views/headlogo.html')

const render = async() => {
  $('#index').html(peopleTpl)
  // $('.footnav').html(footNavTpl)
  // $('.head').html(headLogoTpl)
}
export default {
  render
}

