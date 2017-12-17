document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'uninitialized' || state == "loading") {
    $('#contents').css({'visibility' : 'hidden'});
    $('#servicesContents').css({'visibility' : 'hidden'});
    $('#contentGallery').css({'visibility' : 'hidden'});
    $('#contentReviews').css({'visibility' : 'hidden'});
  }
  else if (state == 'interactive' ) {
    $('#load').css({'visibility' : 'hidden'});
    $('#caption').css({'visibility' : 'hidden'});
    $('#contents').css({'visibility' : 'visible'});
    localStorage.setItem("dataCache", "");
  }
  else if (state == 'complete')  {
      document.getElementById('interactive');

      try{
        var blogParams = {
          "maxResults" : 1
        };
        getServicesData();
        getBlogData(blogParams);
      //  getOffers();
        $.getScript("https://maps.googleapis.com/maps/api/js?key=" +
              mapApiKey + "&libraries=places&callback=loadReviews");
      //  loadGallery();
      } catch(error){}
  }
}
$(document).ready(function() {
  $().UItoTop({ easingType: 'easeOutQuart' });
  $(".scroll").click(function(event){
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
  });
  /* init Jarallax */
  $('.jarallax').jarallax({
    speed: 0.5,
    imgWidth: 1366,
    imgHeight: 768
  })
  $("#topMarquee").responsiveSlides({
    auto: true,
    pager:true,
    nav:false,
    speed: 600,
    namespace: "callbacks",
    before: function () {},
    after: function () {}
  });
});

var place_id = "ChIJ3VRVVWVDfDkRaV8aJa5vHBI";
var blogId = "5389043814283862117";
var mapApiKey = "AIzaSyD6OqOzJ6WP1N8rjuxbuzKdJS1Z9Is3BBs";
var blogApiId = "AIzaSyBvtwn9X5wWQqxl1umcOJxIXz2qeGhN1Pw";
function showServiceDialog(index) {
   var service = JSON.parse(localStorage.getItem("dataCache"));
    $('.alert-success').addClass('hide');
    var title = index >= 0 ? (service[index].title + " " ): "";
    var desc = index >= 0 ? (service[index].description): "";
    $("#modalContent").empty();
    $("#serviceDesc").empty();
    $("#serviceDesc").html("<div style='display:inline-grid'><h3>" +
          title + "(Service booking form)</h3>" + desc +"</div>");
    $("#modalContent").html('<iframe height="400px" width="100% frameborder="0" ' +
          'style="border:0" src="/services/index.html' +
          (title == "" ? "": ('?service='+ title.replace("&","%26"))) + '" allowfullscreen></iframe>');
}

function getServicesData(){
  $.ajax({
    dataType: "json",
    url: "data/services.json?" +new Date().getTime(),
    data: {},
    success: function (res) {
      localStorage.setItem("dataCache", JSON.stringify(res));
      $('#loadServices').css({'visibility' : 'hidden'});
      $('#servicesContents').css({'visibility' : 'visible'});
      getServicesContent(res);
    }
  });
}
function getServicesContent(data){
  var rowId = "row0";
  $('#servicesContents').append('<div class="w3-welcome-grids" id=' + rowId +'></div>');
  for(var i = 0; i < data.length; i++) {
      var service = data[i];
      $('#servicesContents').append('<div class="col-md-3 w3-welcome-grid">' +
          '<div class="w3-welcome-grid-info">' +
            '<a href="#servicesModal" onclick="showServiceDialog('+ i +')" data-toggle="modal" >'+
              '<img src="' + service.image + '" alt="" />'+
              '<h4>' + service.title +'</h4>'+
              '<p>' + service.description + '</p>'+
            '</a>'+
          '</div>'+
        '</div>');
      if( (i+1)%4==0)
      {
        $('#'+rowId).append('<div class="clearfix"> </div><div class="w3-welcome-grids">');
        rowId= "row" + i;
        $('#servicesContents').append('<div class="w3-welcome-grids" id=' + rowId +'></div>');
      }
  }
}

function showMapModal(){
  $('.alert-success').addClass('hide');
  $("#modalContent").empty();
  $("#serviceDesc").empty();
  $("#serviceDesc").html("Autowelt Car Service & Care");
  $("#modalContent").html('<iframe height="400px" width="100% frameborder="0" style="border:0" ' +
        'src="https://www.google.com/maps/embed/v1/place?q=place_id:' +
        place_id + '&key=' + mapApiKey + '" allowfullscreen></iframe>');
}
function loadMorePosts(){
  var blogParams = {
    "maxResults" : 1,
    "pageToken" : $("#nextPageToken").val()
  }
  getBlogData(blogParams);
}
var postCount = 1;
function getBlogData(blogParams){
  blogParams.key = blogApiId;
  $.ajax({
    dataType: "json",
    url: "https://www.googleapis.com/blogger/v3/blogs/"+ blogId +"/posts",
    data: blogParams,
    success: function (res) {
      if(res.items){
        for(var i = 0; i < res.items.length; i++) {
          try {
              $('#blogContainer').append(getPostHtml(res.items[i],(postCount++)%2==0));
          } catch(error){
          }
        }
        $('#nextPageToken').val(res.nextPageToken);
      } else {
        $("#loadPosts").addClass("hide");
      }
    }
  });
}
function getPostHtml(item,isEven){
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(decodeURIComponent(item.content),"text/html");
  var mainImg = $(xmlDoc).find('img:first-of-type').attr('src');
  $(xmlDoc).find('div:first-of-type').find('div:first-of-type').remove();
  var formattedDate = formatDate(new Date(item.updated));
  var retHtml = '<div class="blog-agileinfo '+ (isEven? "blog-agileinfo-mdl" : "")+'">' +
      '<div class="col-md-4 blog-w3grid-img '+ (isEven? "blog-img-rght" : "")+'">' +
        '<a href="'+item.url+'" target="_blank" class="wthree-blogimg">' +
        '  <img src="' + mainImg +'" class="img-responsive" alt=""/>' +
        '</a>' +
      '</div>' +
      '<div class="col-md-8 blog-w3grid-text">' +
      '  <h4><a href="'+item.url+'" target="_blank" >'+ item.title +'</a></h4>' +
      '  <h6>By <a target="_blank" href="'+item.author.url+'">'+item.author.displayName+'</a> - '+formattedDate+' </h6>' +
      '  <p>'+$(xmlDoc).find('div:first-of-type').find('div:first-of-type').text()+'<h6><a target="_blank" href="'+item.url+'"> Read more >></a></h6></p>' +
      '</div>' +
      '<div class="clearfix"> </div>' +
    '</div>';
  return retHtml;
}
function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function getOffers(){
  var  blogParams = {
    "key" : blogApiId,
    "maxResults" : 6
  };
  blogId = "2398738338884344339";
  $.ajax({
    dataType: "json",
    url: "https://www.googleapis.com/blogger/v3/blogs/"+ blogId +"/posts",
    data: blogParams,
    success: function (res) {
      if(res.items){
        var itemId = "offerItem0";

        $('#offersContainer').append('<div id="' + itemId + '" class="item active"></div>');
        for(var i = 0; i < res.items.length; i++) {
          try {
              $('#' + itemId).append(getOfferHtml(res.items[i]));
              var newItem = (i + 1) % 3 == 0;
              if(newItem){
                  $('#' + itemId).append('<div class="clearfix"></div>');
                  itemId = "offerItem" + i;
                  $('#offersContainer').append('<div id="' + itemId + '" class="item"></div>');
              }
          } catch(error){
          }
        }
      }
      $('#offersCarousel').carousel({interval: 6000});
    }
  });
}

function getOfferHtml(item){
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(decodeURIComponent(item.content),"text/html");
  var mainImg = $(xmlDoc).find('img:first-of-type').attr('src');
  var retHtml  = '<div href="#servicesModal" onclick="showOffer(\'' + item.id + '\')" data-toggle="modal" class="col-md-4 Works-grid">' +
      '<img src="' + mainImg + '" class="img-responsive" alt=""/>' +
      '<p>' + $(xmlDoc).find('div:first-of-type').find('div:first-of-type').html() + '</p>' +
      '<div id="div'+ item.id + '" style="display:none"> ' +item.content +' </div>' +
      '</div>';
  return retHtml;
}
function showOffer(offerId) {
  $('.alert-success').addClass('hide');
  $("#modalContent").empty();
  $("#serviceDesc").empty();
  $("#serviceDesc").html("Autowelt Car Service & Care");
  $("#modalContent").html($('#div'+ offerId).html());
}
function loadReviews() {
  $("#writeReview").prop("href", "https://search.google.com/local/writereview?placeid=" + place_id);
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.1844955, lng: 77.419433},
    zoom: 15
  });
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: place_id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var itemId = "item0";
      $('#reviewsCarousel').append('<div id="' + itemId + '" class="item active"></div>');
      $("#reviewsRating").val(place.rating);
      $("#reviewsRating").rating();
      //$(".rating-container .caption").addClass('hide');

      for(var i = 0; i < place.reviews.length; i++) {
        var review = place.reviews[i];
        try {
          $('#' + itemId).append(getReviewHtml(review,i));
          var newItem = (i + 1) % 3 == 0;
          if(newItem){
              $('#' + itemId).append('<div class="clearfix"></div>');
              itemId = "item" + i;
              $('#reviewsCarousel').append('<div id="' + itemId + '" class="item"></div>');
          }
        } catch(error){
        }
      }
      $('#' + itemId).append('<div class="col-md-4 testimonial-info keep-text-center-mobile-only">' +
        '<a id="reviewsLink" class="position-relative-mobile-only" style="position:absolute;" target="_blank" href="https://www.google.co.in/search?tbm=lcl&q=AUTOWELT+CAR+SERVICE+%26+CARE&oq=AUTOWELT+CAR+SERVICE+%26+CARE&gs_l=psy-ab.3..35i39k1.18404.18404.0.18632.1.1.0.0.0.0.208.208.2-1.1.0....0...1.2.64.psy-ab..0.1.208.7BCS9iMTRKs#lrd=0x397c4365555554dd:0x121c6fae251a5f69,1,&rlfi=hd:;si:1305040785768079209;mv:!1m3!1d302.6493010526696!2d77.419433!3d23.1844955!2m3!1f0!2f0!3f0!3m2!1i743!2i507!4f13.1"> More Reviews</a>' +
      '</div>');
      $('#' + itemId).append('<div class="clearfix"></div>');
      $('#reviewsCarousel').append(
            '<a data-slide="prev" href="#reviewsContainer" class="carousel-control left">' +
             '<span class="fa fa-chevron-left" aria-hidden="true"></span>' +
           '</a>' +
           '<a data-slide="next" href="#reviewsContainer" class="carousel-control right">' +
            ' <span class="fa fa-chevron-right" aria-hidden="true"></span>' +
          ' </a>') ;
      $('#contentReviews').css({'visibility' : 'visible'});
      $('#loadReviews').css({'visibility' : 'hidden'});
      $('#reviewsContainer').carousel({interval: 6000});
      $(".ratingSmall").rating();
      //$(".rating-container .caption").addClass('hide');
    }
  });
}
function getReviewHtml(review, index){
  var newItem = (index + 1) % 3 == 0;
  var retHtml  = '<div class="col-md-4 testimonial-info">' +
      '<h5><a target="_blank" href="'+review.author_url+'">' +
      '<img class="profile" src="' + review.profile_photo_url + '" alt="" />&nbsp;&nbsp;' +
      review.author_name + '</a></h5>'+
      '<p><span>"</span>' + review.text+ '</p>' +
      '<input class="rating-loading ratingSmall" data-disabled="true" value="' +
      review.rating +'" data-min="0" data-max="5" data-step="0.1" data-size="xxs">'+
      '</div>';
  return retHtml;
}
function loadGallery(){
  $.ajax({
    dataType: "json",
    url: "data/gallery.json?" +new Date().getTime(),
    data: {},
    success: function (res) {
      $('#loadGallery').css({'visibility' : 'hidden'});
      $('#contentGallery').css({'visibility' : 'visible'});
      loadGalleryContent(res);
    }
  });
}
function loadGalleryContent(galleryData){
  var itemId = "galleryItem0";
  $('#galleryCarousel').append('<div id="' + itemId + '" class="item active"></div>');

  for(var i = 0; i < galleryData.length; i++) {
    try {
      $('#' + itemId).append(getImageHtml(galleryData[i],i));
      var newItem = (i + 1) % 8 == 0;
      if((i+1)%4 ==0 ) {  $('#' + itemId).append('<div class="clearfix"></div>');}
      if(newItem){
          $('#' + itemId).append('<div class="clearfix"></div>');
          itemId = "galleryItem" + i;
          if(i+1 != galleryData.length)$('#galleryCarousel').append('<div id="' + itemId + '" class="item"></div>');
      }
    } catch(error){
    }
  }
  $('#galleryCarousel').append(
        '<a data-slide="prev" href="#galleryContainer" class="carousel-control left">' +
         '<span class="fa fa-chevron-left" aria-hidden="true"></span>' +
       '</a>' +
       '<a data-slide="next" href="#galleryContainer" class="carousel-control right">' +
        ' <span class="fa fa-chevron-right" aria-hidden="true"></span>' +
      ' </a>') ;
  $('#galleryCarousel .galleryItem').simpleLightbox();
  $('#galleryContainer').carousel({interval: 6000});
}
function getImageHtml(data,index){
  var retHtml = '<div class="'+(data.isBig ? "gallery-bg" : "gallery-small gallery-middle")+'">'+
    '<div class="'+ (data.isBig ? "gallery-bg-text effect-2" : "gallery-small-text effect-3") +'">'+
      '<a href="'+ data.image +'" class="galleryItem ' + (data.isBig ? "big" : "")+ '"><img src="'+ data.image +'" alt="" ' +
      'title="'+ data.title +'" /></a>'+
    '</div>'+
  '</div>';
  return retHtml;
}
function sendEmail(content,name){
  $('.alert-success').removeClass('hide');
  $("#modalContent").empty();
  $("#modalContent").html(content);
  emailjs.init("user_6WqdBUayX7GBRb4ctm61D");
  emailjs.send("gmail", "template_JYum5hlW", {"reply_to":"info@autowelt.com","from_name":name,"to_name":"Team Autowelt","message_html": content})

}
