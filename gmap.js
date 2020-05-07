function typeOf() {
    'use strict';
    console.log(typeof this);
}

function initMap() {
    'use strict';

    var target = document.getElementById('target');
    

    var geocoder = new google.maps.Geocoder();

    document.getElementById('search').addEventListener('click', function() {
        var address = document.getElementById('address').value;
        console.log(address);       //要素確認
        typeOf.call(address);       //型確認
        geocoder.geocode({
            address: address //ここは文字列が入る．
            }, function(results, status) {
                if (status !== 'OK') {
                alert('Failed: ' + status);
                return;
            }
            // results[0].geometry.location
            if (results[0]) {
                new google.maps.Map(target, {
                    center: results[0].geometry.location,
                    zoom: 15
                });
                
                console.log(results[0]);
                console.log("住所：",results[0].formatted_address);
                console.log("緯度：",results[0].geometry.location.lat());
                console.log("経度：",results[0].geometry.location.lng());
            } else {
                alert('No results found');
                return;
            }
        });
    });
}