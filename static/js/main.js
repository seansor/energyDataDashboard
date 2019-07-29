$(document).ready(function() {
  

  $('#year_selector').change(function() {

  //show different charts depending on year range selected
    $(".tfcChart-container").hide();
    $('.' + $(this).val()).show();
    
    /*if ($(".scrolling-wrapper").height()>3){
      $(".scrolling-wrapper").addClass("border");
    } else {
      $(".scrolling-wrapper").removeClass("border");
    }*/
    
    

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
  $('.ets-info span:first').show();
  $('.ets-info span').click(function(){
    $('.ets-info p:last').slideToggle(function(){
      $('.ets-info span:first').toggle();
      $('.ets-info span:last').toggle();
    });
  });
  
  $('.nonEts-info span:first').show();
  $('.nonEts-info span').click(function(){
    $('.nonEts-info p:last').slideToggle(function(){
      //don't change from more info to less info until slide toggle is complete
        $('.nonEts-info span:first').toggle();
        $('.nonEts-info span:last').toggle();
    });
  });
  
  //edit: move pie chart down when in mobile view
  var pieChart = d3.select("#TFCbyFuel_pie");
  
  $("#TFCbyFuel_pie").children("svg g:first-child").attr("transform", "translate(156.5,250)");
  
  
});