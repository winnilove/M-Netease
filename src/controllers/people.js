
const peopleTpl = require('../views/people.html')

const render = async() => {
  $('main').html(peopleTpl)
}
export default {
  render
}

