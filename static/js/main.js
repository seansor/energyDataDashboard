$(document).ready(function() {
    
/*$('.tfcChartHidden').hide();*/

  $('#yearSelector').change(function() {
      
    /*var getText = $('#dropdown option:selected').html();*/
    /*$("#test").removeClass();*/
    /*$(".tfcChart").toggleClass('tfcChartHidden');*/
    $(".tfcChart").hide();
    $('.' + $(this).val()).show();
  });



});