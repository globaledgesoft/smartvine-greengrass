 function loadAnim(x) {
    $('body').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
    });
  };
  loadAnim('fadeIn');
  function changePageColor1(){    
    $('body').css('background-color','#642f6c');
    $('body div').css('background-color','#ffffff');
    $('body').css('opacity','0.7');
  }
    function changePageColor2(){    
    $('body').css('background-color','#c6007e');
    $('body div').css('background-color','#ffffff');
    $('body').css('opacity','0.5');
  }
setTimeout(function(){ loadAnim('fadeOut'); }, 3000);
setTimeout(function(){ loadAnim('fadeIn'); changePageColor1(); }, 3600);
setTimeout(function(){ loadAnim('fadeOut'); }, 10000);
setTimeout(function(){ loadAnim('fadeIn');changePageColor2(); }, 10600);
