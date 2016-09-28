$(document).ready(function() {
    
  
  /* --------------------
  Event/Query handling
  -------------------- */

  //request
  ajaxRequest("json/ustats.json");
  
  //portrait
  $(document.body).on("mouseenter", ".char-img", function(){
    $(this).siblings(".char-powers").fadeIn(900);
  }).on("mouseleave", ".char-img", function(){
    $(this).siblings(".char-powers").stop(true,false).fadeOut(300);
  });
  
  //statmeters
  $(document.body).on("mouseenter", ".char-skillbar-back", function(){
    $(this).find(".char-skillbar").animate({
      width: 0
    },400);
    $(this).find(".char-skillbar-text").fadeIn(700);
  }).on("mouseleave", ".char-skillbar-back", function(){
    var that = $(this).find(".char-skillbar");
    that.stop(true,false).animate({
      width: that.attr("data-fill")
    },400);
    $(this).find(".char-skillbar-text").stop(true,false).fadeOut(300);
  });

  
  /* --------------------
  Functions
  -------------------- */
  
  function animations() {

    //portrait
    $(".char-img").addClass("fade-in");
    
    //title
    setTimeout(function() {
      $(".char-title").removeClass("vis-hidden").addClass("fade-in-simple");  
    },1000);
    
    //stats
    setTimeout(function() {
      $(".char-skillbars").removeClass("vis-hidden").addClass("fade-in-simple");  
    },1800);
    
    //skillbars
    setTimeout(function() {
      $(".char-skillbars").find(".char-skillbar").each(function(){
        $(this).animate({width: $(this).attr("data-fill")}, 2000); 
      });
    },3500);
    
    //description
    setTimeout(function() {
      $(".char-description-container").removeClass("vis-hidden").addClass("fade-in-only");  
    },5000);
  
  }
  
  /*
  * request
  * @param url - the url to send the request to
  */
  function ajaxRequest(url) {
    showLoading();
    $.ajax({
      type: "GET",
      dataType: "json",
      url: url,
      success: function(data) {
        showResult(data);
        animations();
      }
    });
  } 
  
  /*
  * show result from query
  * @param data - data from JSON-object
  */
  function showResult(data) {
    var html = "";  
    
    $.each(data.shdb.character, function(i, obj) {  
      var imagePath = obj.thumbnail.path + "." + obj.thumbnail.extension;
      var description = obj.description ? obj.description : "Description missing";
      var skillbars = "";
      var powers = "";
      
      $.each(obj.ustats, function(j, obj2) {
        skillbars += "<h4>" + j + "</h4>";
        skillbars += "<div class='char-skillbar-back'>"; 
        skillbars += "<div class='char-skillbar " + j + "' data-fill='" + obj2 + "%'></div>";
        skillbars += "<div class='char-skillbar-text vis-none'><h4>" + obj2 + "</h4></div>";
        skillbars += "</div>";  
      });
      
      $.each(obj.powers, function(k, obj3) {
        powers += "<div class='char-power col-xs-4'>";
        powers += "<h4 class='char-power-header'>" + obj3.name + "</h4>";
        powers += "<img class='char-power-img img-responsive' src='" + obj3.img + "' alt='" + obj.name + "'>";  
        powers += "</div>";
      });
      
      html += "<div class='col-md-15 char-col'>";
      html += "<div class='img-container'>";
      html += "<img class='img-responsive img-rounded char-img' src='" + obj.thumbnail + "' alt='result-poster'>";
      
      html += "<div class='char-powers vis-none'>";
      html += "<h3>Powers</h3>";
      html += powers;
      html += "</div>";
      
      html += "</div>";
      html += "<div class='char-title-container'><h2 class='text-center char-title vis-hidden'>" + obj.name + "</h2></div>";
        
      html += "<div class='char-skillbars vis-hidden'>";
      html += "<h3>Stats</h3>";
      html += skillbars;
      html += "</div>";  
      
      
      
      html += "<div class='char-description-container vis-hidden'>";
      html += "<h3>Description</h3>";
      html += "<p class='text-center char-description'>" + obj.description + "</p>";  
      html += "</div>";
      html += "</div>";
    });
    
    $(".result-container").html(html);
  }
  
  /*
  * show loading gif
  */
  function showLoading() {
    var html = "<div class='loading'><img src='img/loading.gif'></div>";
    $(".results").html(html);
  }

});
