const homeTpl = require('../views/home.html')
function render() {    
  $('#index').html(homeTpl)
  $('.navdown').on("click",function(){
      $(this).siblings("nav").toggle();
      $(this).siblings("div.mnav").toggle();
      $(this).children().toggleClass("rowActive");
  })
 
}
export default {
  render
}