
const goodsTpl = require('../views/goods.html')

const render = async() => {
  $('main').html(goodsTpl)
}
export default {
  render
}

