$(document).ready(function() {
  

  $('#year_selector').change(function() {

  //show different charts depending on year range selected
    $(".tfcChart-container").hide();
    $('.' + $(this).val()).show();
    
    

  //show or hide select sector menu depending on year date range selected
    if ($("#year_selector").val() == 'barChart' || $("#year_selector").val() == 'areaChart') {
      $('.selector-container').removeClass("selectHidden");
    } else {
      $('.selector-container').addClass("selectHidden");
    }
    
  });
  
  //show or hide text under population and gni graphs
  $('.chart-info span:first-child').show();
  $('.chart-info').children('span').click(function(){
    $(this).siblings('p').slideToggle();
    $(this).toggle();
    $(this).siblings('span').toggle();
  });
  
  
  $('#ghg-year_selector').change(function() {

  //show different charts depending on year range selected
    $(".ghgChart-container").hide();
    $('.' + $(this).val()).show();
  
  });
  
  //show or hide additional ghg information
  $('.ets span:first-child').show();
  $('.ets span').click(function(){
    $('.ets span:nth-of-type(2)').slideToggle();
    $('.ets span:first').toggle();
    $('.ets span:last').toggle();
  });
  
  $('.nonEts span:first-child').show();
  $('.nonEts span').click(function(){
    $('nonEts span:nth-of-type(2)').slideToggle();
    $('nonEts span:first').toggle();
    $('nonEts span:last').toggle();
  });
  
});