$(document).ready(function() {

  $('#year_selector').change(function() {


  //show different charts depending on year range selected
    $(".tfcChart-container").hide();
    $('.' + $(this).val()).show();

  //show_hide select sector menu depending on year date range selected
    if ($("#year_selector").val() == 'barChart' || $("#year_selector").val() == 'areaChart') {
      $('.selector-container').removeClass("chartHidden");
    } else if ($("#year_selector").val() == 'pieChart') {
      $('.selector-container').addClass("chartHidden");
    }
    
  });

});