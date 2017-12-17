document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
       localStorage.setItem("carsCache", "");
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('caption').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}
$(document).ready(function() {
  getCarsData();
  $('.clockpicker').clockpicker({
       placement: 'top',
       align: 'left',
       donetext: 'Done',
       autoclose: true
   });
   $( "#pickupDate" ).datepicker({minDate: '0'});
   $('#selectMake').change(function() {
     if($(this).val() != "make0"){
       var data = JSON.parse(localStorage.getItem("carsCache"));
       var models = data[$(this).val().replace("make","")-1].make.models
       populateDropdown("selectModel",models,"model");
     }
   });
});
function populateDropdown(id,data,title){
  var index = 0;
  $('#'+ id).find('option')
  .remove()
  .end()
  .append('<option value="0">--Select '+ title+'--</option>')
  .val(title + index++);
  if(data.length >0) {
    if(id!="yearsDropdown"){
      $.each(data, function(key, obj) {
        if(obj[title].show === "true"){
         $('#'+ id)
             .append($("<option></option>")
             .attr("value",title + index++)
             .text(obj[title].label));
           }
        });
    } else{
      $.each(data, function(key, value) {
       $('#'+ id)
           .append($("<option></option>")
           .attr("value",value)
           .text(value));
      });
    }
  }
}
function getCarsData(){
  $.ajax({
    dataType: "json",
    url: "../data/cars.json?" +new Date().getTime(),
    data: {},
    success: function (res) {
        localStorage.setItem("carsCache", JSON.stringify(res));
        var services = JSON.parse(localStorage.getItem("dataCache"));
        populateDropdown("selectMake",res,"make");
        $.each(services, function(key, value) {
         $('#selectService')
             .append($("<option></option>")
             .attr("value",value.title)
             .text(value.title));
        });
        var service = decodeURIComponent(getParamValue("service"));
        if(service != undefined || service!= ""){
          $('#selectService').val(service);
        }
    }});
}
function sendForm(){
 var data = JSON.parse(localStorage.getItem("carsCache"));
 var make = $('#selectMake').val();
 var model = $('#selectModel').val()
 var models = [];
  var txtName = $('#txtName').val();
  var txtMobile = $('#txtMobile').val();
  var txtEmail = $('#txtEmail').val();
  var selectAddressType = $('#selectAddressType').val();
  var txtAddress = $('#txtAddress').val();
  var selectMake = $('#selectMake').val();
  var selectModel = $('#selectModel').val();
  var txtModelYear = $('#txtModelYear').val();
  var selectService = $('#selectService').val();
  var pickupDate = $('#pickupDate').val();
  var txtTime = $('#txtTime').val();
  var txtMessage = $('#txtMessage').val();

  if(make != "" && make != "make0"){
    selectMake = data[make.replace("make","")-1].make.label;
    models = data[make.replace("make","")-1].make.models;
  }
  if(make != "" && make != "model0"){
    selectModel = models[model.replace("model","")-1].model.label;
  }

  var style = '<link href="../css/bootstrap.css" rel="stylesheet" type="text/css" media="all" /><style>.middleHeader{text-align: center;font-weight: 900; background-color: #ffd600;color: white;} table {color:#999999;}</style>';
  var outputTable = style + '<div style="width:100%"><table class="table table-striped"><thead><tr><th>Field</th><th>Value</th></tr></thead>' +
    '<tbody>' +
    '<tr><td>Name</td><td>' + txtName + '</td></tr>' +
    '<tr><td>Phone</td><td><a href="tel:' + txtMobile + '">' + txtMobile + '</a></td></tr>' +
    '<tr><td>Email</td><td><a href="mailto:' + txtEmail + '">' + txtEmail + '</a></td></tr>' +
    '<tr><td>Pickup from </td><td>' + selectAddressType + '</td></tr>' +
    '<tr><td>Pickup address</td><td>' + txtAddress + '</td></tr>' +
    '<tr><td colspan="2" class="middleHeader">Vehicle details</td></tr>' +
    '<tr><td>Make</td><td>' + selectMake + '</td></tr>' +
    '<tr><td>Model</td><td>' + selectModel + '</td></tr>' +
    '<tr><td>Year</td><td>' + txtModelYear + '</td></tr>' +
    '<tr><td>Service type</td><td>' + selectService + '</td></tr>' +
    '<tr><td>Pickup date</td><td>' + pickupDate + '</td></tr>' +
    '<tr><td>Pickup time</td><td>' + txtTime + '</td></tr>' +
    '<tr><td>Additional note</td><td>' + txtMessage + '</td></tr>' +
    '</tbody>' +
  '</table></div>';
    window.parent.sendEmail(outputTable,txtName);
  return false;
}
function getParamValue(paramName){
   var url = window.location.search.substring(1); //get rid of "?" in querystring
   var qArray = url.split('&'); //get key-value pairs
   for (var i = 0; i < qArray.length; i++)
   {
     var pArr = qArray[i].split('='); //split key and value
     if (pArr[0] == paramName)
       return pArr[1]; //return value
   }
 }
