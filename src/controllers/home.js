const homeTpl = require('../views/home.html')
function render() {    
  $('#index').html(homeTpl)
  
    var mySwiper = new Swiper ('.swiper-container', {
      speed:1000,
      direction: 'horizontal',
      loop: true,
      autoplay : 3000,    //可选选项，自动滑动
      autoplayDisableOnInteraction : false,    //注意此参数，默认为true
      // 如果需要分页器
      pagination: '.swiper-pagination',
      paginationType: 'custom',
	    paginationCustomRender: function ( swiper, current, total ) {
	      var _html = '';
	      for ( var i = 1; i <= total; i++ ) {
		    if ( current == i ) {
		       _html += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
		     } else {
		       _html += '<span class="swiper-pagination-customs"></span>';
		     }
	        }
		  return _html; //返回所有的页码html
	    },
    }) 
 
  $('.navdown').on("click",function(){
      $(this).siblings("nav").toggle();
      $(this).siblings("div.mnav").toggle();
      $(this).children().toggleClass("rowActive");
  })
  let scroll = new BScroll('.navCont',{
    scrollX : true,
    click: true
  })
  $('.footnav').on("click","div",function(){
    $(this).siblings().children().removeClass("fnavActive")
    $(this).children().addClass("fnavActive")
  })
  $('.horScroll').on("click","li",function(){
    $(this).siblings().children("a").removeClass("navActive")
   $(this).children("a").addClass("navActive")
  })

}
export default {
  render
}