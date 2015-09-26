/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Parse.initialize("OHXwopYNG5vPG9qVVm1UymVwR9CtaKospfTq7F5H", "WHQ8PA3I7hSqWurJv10VmL8oNJflH98WG16cfjeJ");
    var Cities = Parse.Object.extend("cities");
    var Bus_lines = Parse.Object.extend("bus_lines");
    var Bus_stations = Parse.Object.extend("bus_stations");
function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
function onDeviceReady() {
        StatusBar.hide();
         $('<input>').appendTo('[ class="listening"]').attr({'name':'slider','id':'slider','data-highlight':'true','min':'0','max':'100','value':'50','type':'range'}).slider({
        create: function( event, ui ) {
            $(this).parent().find('input').hide();
            $(this).parent().find('input').css({'margin-left':'-9999px','background':'#f6f6f6'}); // Fix for some FF versions
            $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
            $(this).parent().find('.ui-slider-handle').css({'background':'#2bb67e'});
        }
    }).slider("refresh");      
    
    // Test
    var i = 1;
    var interval = setInterval(function(){
        progressBar.setValue('#slider',i);
        if(i === 100) {
            clearInterval(interval);
        }
        i+=2;
    },100);  
    var progressBar = {
    setValue:function(id, value) {
        $(id).val(value);
        $(id).slider("refresh");
    }
    }  
        setTimeout(function () {
        $('#map').css("height",($(window).height()-20)+"px");
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        $(".listening").css('display', 'none');
        $(".received").css('display', 'block');
        var db = window.sqlitePlugin.openDatabase("busmap", "1.0", "PhoneGap", 200000);
        db.transaction(populateDB, errorCB, successCB);
        function successCB() {
        db.transaction(queryDB, errorCB);
        }
        }, 5000);
//end ondevice ready
}
function onSuccess(position) {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            }
        };
        //create maps
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //my location
        var locationmarker = {
            url: 'img/blue_dot.png',
            anchor: new google.maps.Point(16, 0)
        };
        var marker = new google.maps.Marker({
              position: latLong,
              map: map,
              title: 'my location',
              icon: locationmarker
          });
        setMarkers(map);
        marker.addListener('click', function() {
          $.mobile.pageContainer.pagecontainer("change", "info.html");
        });
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('control'));
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        var markers = [];
        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location,
              zoom:18
            }));
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          //  try {
           //     latitudeEnd = place.geometry.location.lat();
            //  } catch (ex) {var latitudeEnd = place.geometry.location.lat();}
          //  try {
          //      longitudeEnd = place.geometry.location.lng();
          //    } catch (ex) {var longitudeEnd = place.geometry.location.lng();}
           // var directionsDisplay = new google.maps.DirectionsRenderer();
           // var directionsService = new google.maps.DirectionsService();
         // directionsDisplay.setMap(map);
           // var request = {
             // origin: new google.maps.LatLng(latitude, longitude),
            //  destination: new google.maps.LatLng(latitudeEnd, longitudeEnd),
            //  travelMode: google.maps.TravelMode.DRIVING
           // };
          //directionsService.route(request, function(response, status) {
          //if (status == google.maps.DirectionsStatus.OK) {
          //directionsDisplay.setDirections(response);//tìm kiếm các đường di chuyển
          //}
          //});
        
          });
          map.setZoom(16);
          map.fitBounds(bounds);
        });
        // [END region_getplaces]
        //draw

        $("#mylocation").on("click",function() {
            map.setZoom(16);
            map.panTo(new google.maps.LatLng(latitude, longitude));
        })
        var latitudeStart, longitudeStart, latitudeEnd, longitudeEnd;
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay;
              // Thẻ div chứa form
              var $box_search_place = document.getElementById('box-input-info-search');
              // ELement điểm bắt đầu
              var $input_start_place = document.getElementById('input-start-place');
              // Element điểm đến
              var $input_end_place = document.getElementById('input-end-place');
              map.controls[google.maps.ControlPosition.LEFT_TOP].push($box_search_place);
        $("#findstreet").on("click",function() {
  $("[data-role=panel]").panel("close");
  $( "#box-input-info-search" ).show(100,function () {
            
                  // Thêm autocomplete, tự động gợi ý tên địa danh
              var autocomplete_start = new google.maps.places.Autocomplete($input_start_place);
              var autocomplete_end = new google.maps.places.Autocomplete($input_end_place);
              autocomplete_start.bindTo('bounds', map);
              autocomplete_end.bindTo('bounds', map);

              // Từ địa danh gợi ý được tìm kinh độ và vĩ độ của chúng
              google.maps.event.addListener(autocomplete_start, 'place_changed', function() {
                  latitudeStart = autocomplete_start.getPlace().geometry.location.lat();
                  longitudeStart = autocomplete_start.getPlace().geometry.location.lng();
              });

              google.maps.event.addListener(autocomplete_end, 'place_changed', function() {
                  latitudeEnd = autocomplete_end.getPlace().geometry.location.lat();
                  longitudeEnd = autocomplete_end.getPlace().geometry.location.lng();
              });

              //Tạo đối tượng để vẽ đường đi trên bản đồ
              directionsDisplay = new google.maps.DirectionsRenderer();
              directionsDisplay.setMap(map);
              $("#form-search-box").submit(function (e) {
                e.preventDefault();
                var request = {
                    origin: new google.maps.LatLng(latitudeStart, longitudeStart),
                    destination: new google.maps.LatLng(latitudeEnd, longitudeEnd),
                    travelMode: google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    }
                });

                $( "#box-input-info-search" ).hide();
              })
           
        });
      })
}

function getUrlVars() {
                var vars = [], hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('#');
                for(var i = 0; i < hashes.length; i++)
                {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }
function onError(error) {
    alert("the code is " + error.code + ". \n" + "message: " + error.message);
}
function populateDB(tx) {
          //  alert("create table demo");
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name, image, detail)');
        }
function queryDB(tx) {
           // alert("select table demo");
            tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
        }
function querySuccess() {
          alert('oke');
           // alert('Querry success');
        }
function errorCB(err) {
          //  alert("Error processing SQL: "+err.code);
        }
function setMarkers(map) {
  var query = new Parse.Query(Bus_stations);
  query.find({
    success:function(results) {
      var markerss = [];
      var image = {
            url: 'img/bus.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(32, 37),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
          };
          // Shapes define the clickable region of the icon. The type defines an HTML
          // <area> element 'poly' which traces out a polygon as a series of X,Y points.
          // The final coordinate closes the poly by connecting to the first coordinate.
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          var infowindow = new google.maps.InfoWindow;
          var marker, i;
       for(i=0; i<results.length; i++) {
            var note = results[i];
             marker = new google.maps.Marker({
              position: {lat: Number(note.get("lat")), lng: Number(note.get("long"))},
              map: map,
              icon: image,
              shape: shape,
              title: note.get("name"),
              zIndex: i
            });
            marker.addListener('click', (function(marker, x,y) {
                 return function() {
                     infowindow.setContent('<p>'+x+'</p><a href="pages/info.html?id='+y+'"  data-transition="slide">Xem thêm</a>');
                     infowindow.open(map, marker);
                 }
            })(marker, note.get("name"),note.id));
             markerss.push(marker);
          }

          google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoom = map.getZoom();
                // iterate over markers and call setVisible
                for (i = 0; i < markerss.length; i++) {
                    markerss[i].setVisible(zoom > 13);
                }
                });

    }, error: function(results, error) {
      alert(error.message);
    }
  });
  
  // Adds markers to the map.
  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.
  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  
  
}
$(document).on("pageshow","#infoPage", function (e) {
        var id=getUrlVars()["id"]; 
        var query = new Parse.Query(Bus_stations);
        var query2 = new Parse.Query(Bus_lines);
        query.get(id, {
          success: function(ob) {
            $("#article").append("<li><a>"+ob.get("name")+"</a></li>");
            try {
                $("#article").listview();
              } catch (ex) {}
              try {
                $("#article").listview("refresh");
              } catch (ex) {}

            query2.get(ob.get("line_id"), {
                success: function (o) {
                  $(".content").html('<h3>Tuyến số ' + o.get("code") + ': ' + o.get("name") + '</h3>' + o.get("detail") + '');
                }, error: function (o, e) {

                }
            })
          }, error: function(ob, err) {

          }
        })
      })
$("#exitFromApp").on("click",function() {
    navigator.notification.confirm(
            'Do you really want to exit?',  // message
            exitFromApp,              // callback to invoke with index of button pressed
            'Exit',            // title
            'Cancel,OK'         // buttonLabels
        );
       function exitFromApp(buttonIndex) {
      if (buttonIndex==2){
       navigator.app.exitApp();
        }}
    })

function getCity_id() {
      var query = new Parse.Query(Cities);
      $("#city_id").empty();
      query.find({
        success:function(results) {
          console.dir(results);

          $("#city_id").append('<option value="">---</option>');
          for(var i=0, len=results.length; i<len; i++) {
            var note = results[i];
            $("#city_id").append('<option value="' + note.id + '">'+note.get("name")+'</option>');
          }
          
          $("#city_id").trigger('create');
        },
        error:function(results,error) {
          alert("Error when getting Cities!");
        }
      });
    }

    function getLine_id() {
      $("#line_id").empty();
      var query1 = new Parse.Query(Cities);
      
      query1.find({
        success: function(results1) {
          
          for(var i=0; i<results1.length; i++) {
          $("#line_id").append(' <optgroup label="'+results1[i].get("name")+'">');
          var query2 = new Parse.Query(Bus_lines);
          query2.equalTo("city_id",results1[i].id);
          query2.find({
          success: function(results2) {
            
            for(var j=0; j<results2.length; j++) {
              $("#line_id").append('<option value="' + results2[j].id + '">'+results2[j].get("name")+'</option>');
            }
            
          }, error: function(results2, error) {
            alert("Error when getting Cities!");
          }
        });
          $("#line_id").append('</optgroup>');
        }
            
      }, error: function(results1, err) {

      }
      })
         $("#line_id").trigger("create");
    }

    function query_city() {
      var query = new Parse.Query(Cities);
      $("#show1").empty();
      query.find({
        success:function(results) {
          var s ='';
          console.dir(results);
          for(var i=0; i<results.length; i++) {
            var note = results[i];
             $("#show1").append('<li><a href="editcity.html?id='+note.id+'" data-transition="slide"><h2>' + note.get("name") + '</h2></a><a href="delcity.html?id='+note.id+'" data-transition="slide">Delete</a></li>');
          }
          
          $("#show1").trigger('create');
          try {
                $("#show1").listview();
              } catch (ex) {}
              try {
                $("#show1").listview("refresh");
              } catch (ex) {}
        },
        error:function(error) {
          alert("Error when getting Cities!");
        }
      });
    }
    $(document).on("pageshow","#delPage", function() {
        var id=getUrlVars()["id"];
        var query = new Parse.Query(Cities);
    query.get(id, {
      success: function(object) {
        $("#del").on("click",function (e) {
          var query2 = new Parse.Query(Bus_lines);
          query2.equalTo("city_id", id);
          query2.find({
            success: function(ob) {
              for(var i=0; i<ob.length; i++) {
                var query3 = new Parse.Query(Bus_stations);
                var note = ob[i];
                query3.equalTo("line_id", note.id);
                query3.find({
                  success: function(o) {
                    for (var j = 0; j < o.length; j++) {
                       o[j].destroy({ wait : true});
                    }
                  }, error: function(o,er) {

                  }
                })
                note.destroy({wait : true});
              }
              
            }, error: function(ob, err) {
              alert('no');

            }
          });
        object.destroy();
        $.mobile.pageContainer.pagecontainer("change", "data.html");
        query_city();
        getCity_id();
        })
      }, error: function(object, error) {
        alert(error.message);
      }

    })

    })
  $(document).on("pageshow","#editcityPage", function() {
    var id=getUrlVars()["id"];
    var query = new Parse.Query(Cities);
    query.get(id, {
      success: function(object) {
        // object is an instance of Parse.Object.
        $("#name").val(object.get("name"));
        $("#updatecity").submit(function (e) {
        e.preventDefault();
        var update = new Cities();
        var val = $("#name").val();
        update.id = id;
        // Set a new value on quantity
        update.set("name", val);
      
      // Save
      update.save(null, {
        success: function(update) {
          alert('Sửa thành công!');
          query_city();getCity_id();
          // Saved successfully.
        },
        error: function(update, error) {
          alert('Lỗi: '+error.message+'');
          // The save failed.
          // error is a Parse.Error with an error code and description.
        }
      });
    })
      },

      error: function(object, error) {
        alert(error.message);
      }
    });
    
    
  })
$(document).on("pageshow","#dataPage", function (e) {
   $('#tabs').tabs();
    getCity_id();getLine_id();query_city();
    
    $("#cities").submit(function (e) {
      var cities = new Cities();
      e.preventDefault();
      var namecity = $("#city_name").val();
      if(namecity=='') {alert('Vui lòng nhập tên vào!');}
      else {
          cities.save({name: namecity}, {
          success: function(object) {
            $(".notice").html('Xử lý Thành công!').show().fadeOut(2000);
            $("#city_name").val("");
            query_city();getCity_id();
          },
          error: function(model, error) {
            $(".notice").html('Lỗi: '+error.message+'').show().fadeOut(2000);
          }
        });
      }
    })

    $("#buslines").submit(function (e) {
      var buslines = new Bus_lines();
      e.preventDefault();
       var name = $("#busline_name").val();
       var code = $("#busline_code").val();
       var detail = $("#busline_detail").val();
       var city = $("#city_id").val();
      if(name == '' || code == '' || detail == '' || city == '') {
        alert('Vui lòng điền đầy đủ thông tin');
      }
      else {
        buslines.set("name", name);
        buslines.set("code", code);
        buslines.set("detail", detail);
        buslines.set("city_id", city);
        buslines.save({
          success: function() {
          $(".notice").html('Xử lý Thành công!').show().fadeOut(2000);
          $("#busline_name").val("");$("#busline_code").val("");$("#busline_detail").val("");
          getLine_id();
        }, error: function(error) {
          $(".notice").html('Lỗi: '+error.message+'').show().fadeOut(2000);
        }
        });
      }
    })

    
    $("#busstation").submit(function (e) {
      var busstations = new Bus_stations();
      e.preventDefault();
       var name = $("#busstation_name").val();
       var lat = $("#lat").val();
       var longg = $("#long").val();
       var type = $("#type").val();
       var line_id = $("#line_id").val();
      if(name == '' || lat == '' || longg == '' || line_id == '' || type == '') {
        alert('Vui lòng điền đầy đủ thông tin');
      }
      else {
        busstations.set("name", name);
        busstations.set("lat", lat);
        busstations.set("long", longg);
        busstations.set("line_id", line_id);
        busstations.set("type", type);
        busstations.save({
          success: function() {
          $(".notice").html('Xử lý Thành công!').show().fadeOut(2000);
          $("#busstation_name").val("");$("#lat").val("");$("#long").val("");
          
        }, error: function(error) {
          $(".notice").html('Lỗi: '+error.message+'').show().fadeOut(2000);
        }
        });
      }
    })
})

$("#linkdt").on("click",function() {
  $.mobile.changePage("pages/data.html", {
            transition: "none",
            changeHash: false
        });
})

$("#closesearch").on("click",function () {
  $("#box-input-info-search").hide();
})



  function search_line(x) {
  var query = new Parse.Query(Bus_lines);
  if(x) {query.matches("name", "%"+x+"%");}
      $("#listline").empty();
      query.find({
        success:function(results) {
          var s = '';
          for(var i=0; i<results.length; i++) {
            var note = results[i];
             s += '<li><a href="detail.html?id='+note.id+'" data-transition="slide"><h4>Tuyến số ' + note.get("code") + ': ' + note.get("name") + '</h4></a></li>';
          }
          $("#listline").append(s).trigger('create');
          try {
                $("#listline").listview();
              } catch (ex) {}
              try {
                $("#listline").listview("refresh");
              } catch (ex) {}
        }, error:function(results,error) {
          alert("Error when getting Cities!");
        }
      });
}
$(document).on("pageshow","#searchPage",function () {

  search_line();
  $("#search-bus").keyup(function (e) {
    search_line($("#search-bus").val());
  })
})


$(document).on("pageshow","#detailPage",function () {
 

  var id=getUrlVars()["id"];
  $('#map2').css("height",($(window).height()/2-20)+"px");
  var query = new Parse.Query(Bus_stations);
    query.equalTo("line_id",id);
  query.first({
    success: function (ob) {
        var longitude = ob.get("long");
        var latitude = ob.get("lat");
        var latLong = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false
        };
        //create maps
        var map = new google.maps.Map(document.getElementById("map2"), mapOptions);
        var query = new Parse.Query(Bus_stations);
            query.equalTo("line_id",id);
        query.find({
        success:function(results) {
          var markerss = [];
          var image = {
                url: '../img/bus.png',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(32, 37),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
              };
              // Shapes define the clickable region of the icon. The type defines an HTML
              // <area> element 'poly' which traces out a polygon as a series of X,Y points.
              // The final coordinate closes the poly by connecting to the first coordinate.
              var shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
              };
              var infowindow = new google.maps.InfoWindow;
              var marker, i;
              var bu='';
                $('#listbus').on('click', 'li', function() {
                    var x = $( this ).attr("x");
                    var y = $( this ).attr("y");
                    map.panTo(new google.maps.LatLng(Number(x), Number(y)));
                });
           for(i=0; i<results.length; i++) {
                var note = results[i];
                bu +='<li x="'+Number(note.get("lat"))+'" y="'+Number(note.get("long"))+'"><a><h3>'+note.get("name")+'</h3></a></li>';
                 marker = new google.maps.Marker({
                  position: {lat: Number(note.get("lat")), lng: Number(note.get("long"))},
                  map: map,
                  icon: image,
                  shape: shape,
                  title: note.get("name"),
                  zIndex: i
                });
                marker.addListener('click', (function(marker, x,y) {
                     return function() {
                         infowindow.setContent('<p>'+x+'</p><a href="info.html?id='+y+'"  data-transition="slide">Xem thêm</a>');
                         infowindow.open(map, marker);
                     }
                })(marker, note.get("name"),note.id));
                 markerss.push(marker);
              }
              $("#listbus").empty();
              $("#listbus").append(bu).trigger('create');
          try {
                $("#listbus").listview();
              } catch (ex) {}
              try {
                $("#listbus").listview("refresh");
              } catch (ex) {}
              google.maps.event.addListener(map, 'zoom_changed', function() {
                    var zoom = map.getZoom();
                    // iterate over markers and call setVisible
                    for (i = 0; i < markerss.length; i++) {
                        markerss[i].setVisible(zoom > 13);
                    }
                    });
              
        }, error: function(results, error) {
          alert(error.message);
        }
      });

    }, error: function (ob, err) {

    }
  })

})
