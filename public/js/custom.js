$(document).ready(function(){
  $(document).on("click",".log_users",function(){
      $(".mob_none").slideToggle();
  });
});

// ===== Scroll to Top ==== 
$(window).scroll(function() {
  if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
    $('#stop').fadeIn(200);    // Fade in the arrow
  } else {
    $('#stop').fadeOut(200);   // Else fade out the arrow
  }
});
$(document).on('click','#stop',function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

$(window).scroll(function() { 

    var scroll = $(window).scrollTop();
    if (scroll >= 300) {

        $("header").addClass("headerfixed");

    } else {

        $("header").removeClass("headerfixed");

    }

});

$(document).ready(function(){
  $(document).on("click",".mobile-list",function(){
      $(".search-filter").slideToggle();
  });
});

  $(document).ready(function(){
    $(document).on("click",".mobile_filter",function(){
        $(".left-profle").slideToggle();
        
    });
});

  $(document).ready(function(){
    $(document).on("click",".mobile_filter",function(){
        $(".mobile_sh").slideToggle("slow",()=>{
            if($('.mobile_sh').css('display')==='none'){
              $('.mobile_filter p').html('Show Menu');
            }else{
              $('.mobile_filter p').html('Hide Menu');
            }
        });
    });
});

$(document).ready(function() {
  $(document).on("click",".top_menu_click",function(){
		$(".aft_log_top_menu").slideToggle("slow");
	});
});
$(document).on('click', function () {
  var $target = $(event.target);
  if (!$target.closest('.aft_log_top_menu').length
    && !$target.closest('.top_menu_click').length
    && $('.aft_log_top_menu').is(":visible")) {
    $('.aft_log_top_menu').slideUp();
  }
  
});

$(document).ready(function(){
	//toggle the componenet with class accordion_body
	$(document).on("click",".accordion_head",(function(){
		var id=$(this).data('id');
		if ($('.aa'+id).is(':visible')) {
			$(".aa"+id).slideUp(600);
			$(".plusminus"+id).text('+');
		}
		else
		{
			$(".accordion_body").slideUp(600);
			
			$(".plusminus").text('+');
			$(this).next(".accordion_body").slideDown(600); 
			$(this).children(".plusminus"+id).text('-');
		}
  }));
});

$(document).ready(function() {
  $(document).on("click",".rvw-show",(function(){
        $(".rvw-box-more").slideToggle("slow",()=>{
          if($('.rvw-show').text() ==="Show all review +"){
            $('.rvw-show').text('Show less review -')
          }
          else{
            $('.rvw-show').text('Show all review +')
          }
      });
  }))
})
$(document).ready(function() {
  $(document).on("click",".read_rvw",(function(){
        $(".more_rvw").slideToggle("slow",()=>{
          if($('.read_rvw').text() ==="Less review -"){
            $('.read_rvw').text('More review +')
          }
          else{
            $('.read_rvw').text('Less review -')
          }
      });
  }))
})


