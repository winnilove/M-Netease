const classesTpl = require('../views/classes.html')
import fetch from '../models/fetch'

const render = async() => {
  let result = await fetch.get('/api/xhr/manufacturer/list.json?limitOffset=0&limitSize=20')
  // let data = positionList = result.content.data.page.result
  console.log(result)
  $('main').html(classesTpl)
}
export default {
  render
}

