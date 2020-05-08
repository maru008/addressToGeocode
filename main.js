'use strict';
var { Client } = require('pg');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    //fetch: customFetchImplementation,
    apiKey: '*******************************',
    formatter: null
};

const geocoder = NodeGeocoder(options);

//型確認関数======================================================================
function typeOf() {
    'use strict';
    console.log(typeof this);
}
//======================================================================

var client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'rakutentravel',
    password: '422341ssbbU',
    port: 5432
})


//SQLとの接続======================================================================
client.connect()

const query = {
    name: 'fetch-hotel',
    text: "SELECT * FROM hotelmaster limit 4",    
    //************limit10を外すときは要注意！！！！！！！********/
}



client.query(query)
    .then(res => {
        console.log("ホテル数：",Object.keys(res.rows).length);
        console.log("=================(1)=================");
        var hotel =[];//ホテル配列の定義
        //施設ごとの繰り返し処理
        for (let i = 0 ;i < Object.keys(res.rows).length ; i++){ 
            console.log("=================(2)=================");
            var address = res.rows[i].施設名;   //SQLにあるホテル名を文字列として格納
            var hotel_id = res.rows[i].施設id;
            console.log("-------------施設id",hotel_id);
            console.log("-------------施設名：",address);
            var hotel_infomation = [];
            //ジオコーダーに問い合わせ======================================================================
            geocoder.geocode(address , function (err , data) {
                console.log("=================(3)=================");
                if (data[0]){
                    //console.log(data);
                    hotel_infomation = [
                        hotel_id,
                        address,
                        data[0].formattedAddress,
                        data[0].latitude,
                        data[0].longitude,
                        data[0].extra.googlePlaceId,
                        data[0].extra.confidence,
                        data[0].extra.premise,
                        data[0].extra.subpremise,
                        data[0].extra.neighborhood,
                        data[0].extra.establishment,
                        data[0].administrativeLevels.level1long,
                        data[0].administrativeLevels.level1short,
                        data[0].administrativeLevels.level2long,
                        data[0].administrativeLevels.level2short,
                        data[0].city,
                        data[0].country,
                        data[0].countryCode,
                        data[0].zipcode,
                        data[0].provider                  
                    ];
                    console.log("=================(4)=================");
                    hotel.push(hotel_infomation); //最後に本配列に追加

                }else{      //探せなかった時
                    console.log("そんな所ないよ！");
                    hotel_infomation = [
                        res.rows[i].施設id,
                        address,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ];
                    hotel.push(hotel_infomation); //最後に本配列に追加
                    return;
                }
            });
            console.log("=================(6)=================");
            console.log(hotel_infomation);
        }
        

        // 配列をcsvで保存するfunction=============================================
        var fs = require('fs');
        var formatCSV = '';

        function exportCSV(content){
            for (var i = 0; i < content.length; i++) {
                var value = content[i];
        
                for (var j = 0; j < value.length; j++) {
                    var innerValue = value[j]===null?'':value[j].toString(); 
                    var result = innerValue.replace(/"/g, '""'); 
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                        if (j > 0)
                            formatCSV += ',';
                            formatCSV += result;
                        }
                    formatCSV += '\n';
            }
            fs.writeFile('formList.csv', formatCSV, 'utf8', function (err) {
                if (err) {
                    console.log('保存できませんでした');
                } else {
                    console.log('保存できました');
                }
            });
        }

        //二次元配列をCSVへ==============================================================
        
        console.log("=================(7)=================");
        console.log("csv焼き前:",hotel);
        exportCSV(hotel);

        client.end()

    })
    .catch(e => console.error(e.stack))
