var myModule = require('./const');
const request = require('request');
var name=myModule.val;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out2.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'id', title: 'SongID'},
    {id: 'duration_ms', title: 'Duration(ms)'},
    {id: 'key', title: 'Key'},
    {id: 'mode', title: 'Mode'},
    {id: 'time_signature', title: 'Time Signature'},
    {id: 'acousticness', title: 'Acousticsness'},
    {id: 'danceability', title: 'Danceability'},
    {id: 'energy', title: 'Energy'},
    {id: 'instrumentalness', title: 'Instrumentalness'},
    {id: 'liveness', title: 'Liveness'},
    {id: 'loudness', title: 'Loudness'},
    {id: 'speechiness', title: 'Speechiness'},
    {id: 'valence', title: 'Valence'},
    {id: 'tempo', title: 'Tempo'},
  ]
});
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
var access_token="BQBNCK4v2tx2_hYxE3nUF3uHstCvlXDC14JZQ9XERApWCkFXO0ry3uW2-ee8oaiSbCaH06Zsm5-8-pTlq16hNg2u942Qa3EkKc4Ga6_VE4I0pbCRD3wIxlWea_GklS_9jL7kpFefWEMHl2eKG3Oj_bkheCQ";

// use the access token to access the Spotify Web API
// request.get(options, function(error, response, body) {
//   console.log(body["audio_features"][0]);
  
// });



var dat=[];
var count=0;
var ids="";
var options;
var count=0;
for(var i in name)
{ids="";
    if(i==0){for( var k of name[0]["items"]){
    ids=ids+k["track"]["id"]+",";

        //dat.push({name: k["track"]["name"], id: k["track"]["id"]});
    }
    ids=ids.slice(0, -1);
     options = {
      url: `https://api.spotify.com/v1/audio-features/?ids=${ids}`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
  }
    setTimeout( function timer(){
      request.get(options,function(error, response, body)
      {
     console.log(ids);
         console.log(body);
         console.log("Percent Compeleted: "+Math.round(((count+1)/name.length)*100)+"%");
         if(name[count]["items"].length=body["audio_features"].length)
         {
           for(var k in body["audio_features"]){
              dat.push({name: name[count]["items"][k]["track"]["name"], 
              id: body["audio_features"][k]["id"],
              key:body["audio_features"][k]["key"],
              mode:body["audio_features"][k]["mode"],
              time_signature:body["audio_features"][k]["time_signature"],
              acousticness:body["audio_features"][k]["acousticness"],
              danceability:body["audio_features"][k]["danceability"],
              energy:body["audio_features"][k]["energy"],
              instrumentalness:body["audio_features"][k]["instrumentalness"],
              liveness:body["audio_features"][k]["liveness"],
              loudness:body["audio_features"][k]["loudness"],
              speechiness:body["audio_features"][k]["speechiness"],
              valence:body["audio_features"][k]["valence"],
              tempo:body["audio_features"][k]["tempo"],
              duration_ms: body["audio_features"][k]["duration_ms"]
         });
           }
           
         }
         else{
           console.log("oooooeeeeeeeeee ERROR");
         }

         count++;
         ids="";
if(count>0&&count<name.length)
{
  for( var k of name[count]["items"]){
    ids=ids+k["track"]["id"]+",";

        //dat.push({name: k["track"]["name"], id: k["track"]["id"]});
    }
    ids=ids.slice(0, -1);
     options = {
      url: `https://api.spotify.com/v1/audio-features/?ids=${ids}`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
}
  if(count==64){
    csvWriter
    .writeRecords(dat)
    .then(()=> console.log('The CSV file was written successfully'));
  
     

  } 
});
       
  }, i*5000 );


}

