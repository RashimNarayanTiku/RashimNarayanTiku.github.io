//active class changing


$(function(){

	var aboutOffsetTop = $('#about').offset().top;
	var projectsOffsetTop = $('#projects').offset().top;
	var resumeOffsetTop = $('#resume').offset().top;
	var contactOffsetTop = $('#contact').offset().top;
	var sidebarOffsetTop = $('#sidebar').offset().top;
	
	$(document).on('scroll',function(){

		//active section
		var scrollTop = $(window).scrollTop();
		var activeLi;
		
		$('#progressbar').css('display','inline');
		if(scrollTop < sidebarOffsetTop-50){
			activeLi = $('.heading'); 		
			$('#progressbar').css('display','none');		
		}


		if(scrollTop < aboutOffsetTop-250){
			activeLi = $('.heading'); 				
		}
		else if(scrollTop < projectsOffsetTop-250){
			activeLi = $('.about');			
		}
		else if(scrollTop < resumeOffsetTop-250){
			activeLi = $('.projects');		
		}
		else if(scrollTop < contactOffsetTop-250){
			activeLi = $('.resume');		
		}
		else{
			activeLi = $('.contact');		
		}
		activeLi.addClass('active');
		$('.navbar-nav>li').not(activeLi).removeClass('active');


		// progress bar	
		const progressbar = document.querySelector('#progressbar');
		const page_content = document.querySelector('.page-content');
		const headingtop = page_content.getBoundingClientRect().top;
		let progressValue = (0 - headingtop) / (page_content.offsetHeight - window.innerHeight);
		progressbar.style.transform = `scaleX(${progressValue})`;
	});
});

