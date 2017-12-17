document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
       document.getElementById('servicesContents').style.visibility="hidden";
       localStorage.setItem("dataCache", "");
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}
$(document).ready(function() {
  /*
    var defaults = {
    containerID: 'toTop', // fading element id
    containerHoverID: 'toTopHover', // fading element hover id
    scrollSpeed: 1200,
    easingType: 'linear'
    };
  */

  getServicesData();
  $().UItoTop({ easingType: 'easeOutQuart' });
  $(".scroll").click(function(event){
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
  });
  });
  /* init Jarallax */
  $('.jarallax').jarallax({
    speed: 0.5,
    imgWidth: 1366,
    imgHeight: 768
  })
$(function () {
  // Slideshow 4
  $("#slider4").responsiveSlides({
  auto: true,
  pager:true,
  nav:false,
  speed: 400,
  namespace: "callbacks",
  before: function () {
    $('.events').append("<li>before event fired.</li>");
  },
  after: function () {
    $('.events').append("<li>after event fired.</li>");
  }
  });
  var $gallery = $('.gallery a').simpleLightbox();

  $gallery.on('show.simplelightbox', function(){
    console.log('Requested for showing');
  })
  .on('shown.simplelightbox', function(){
    console.log('Shown');
  })
  .on('close.simplelightbox', function(){
    console.log('Requested for closing');
  })
  .on('closed.simplelightbox', function(){
    console.log('Closed');
  })
  .on('change.simplelightbox', function(){
    console.log('Requested for change');
  })
  .on('next.simplelightbox', function(){
    console.log('Requested for next');
  })
  .on('prev.simplelightbox', function(){
    console.log('Requested for prev');
  })
  .on('nextImageLoaded.simplelightbox', function(){
    console.log('Next image loaded');
  })
  .on('prevImageLoaded.simplelightbox', function(){
    console.log('Prev image loaded');
  })
  .on('changed.simplelightbox', function(){
    console.log('Image changed');
  })
  .on('nextDone.simplelightbox', function(){
    console.log('Image changed to next');
  })
  .on('prevDone.simplelightbox', function(){
    console.log('Image changed to prev');
  })
  .on('error.simplelightbox', function(e){
    console.log('No image found, go to the next/prev');
    console.log(e);
  });
});
function showServiceDialog(index) {
   var service = JSON.parse(localStorage.getItem("dataCache"));
  // setTimeout(function(){
     document.getElementById("serviceDesc").innerHTML = service[index].description;
   //},1000);
  switch (index) {
    case 1:
      console.log();
      break;
    case 2:
    //  alert(index);
      break;
    case 3:
    //  alert(index);
      break;
    case 4:
    //  alert(index);
      break;
    case 5:
    //  alert(index);
      break;
    case 6:
    //  alert(index);
      break;
    case 7:
    //  alert(index);
      break;
    case 8:
      //alert(index);
      break;
    default:
  }
}

function getServicesData(){
  $.ajax({
    dataType: "json",
    url: "data/services.json?" +new Date().getTime(),
    data: {},
    success: function (res) {
        localStorage.setItem("dataCache", JSON.stringify(res));
        document.getElementById('loadServices').style.visibility="hidden";
        document.getElementById('servicesContents').style.visibility="visible";
        document.getElementById('servicesContents').innerHTML= getServicesContent(res);
    }});
}
function getServicesContent(data)
{
  var servicesHtml = '<div class="w3-welcome-grids">';
  for(var i = 0; i < data.length; i++) {
      var service = data[i];
      servicesHtml +=   '<div class="col-md-3 w3-welcome-grid">' +
                          '<div class="w3-welcome-grid-info">' +
                            '<a href="#servicesModal" onclick="showServiceDialog('+ i +')" data-toggle="modal" >'+
                              '<img src="' + service.image + '" alt="" />'+
                              '<h4>' + service.title +'</h4>'+
                              '<p>' + service.description + '</p>'+
                            '</a>'+
                          '</div>'+
                        '</div>';
      if(i==3)
      {
          servicesHtml +=  '<div class="clearfix"> </div></div><div class="w3-welcome-grids">'
      }
  }
        servicesHtml += '</div>';


  return servicesHtml;
}
