const axios = require('axios');
var request = require('sync-request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const fs = require('fs');
const { exit } = require('process');
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const myPlist = createCsvWriter({
    path: 'playlist.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'id', title: 'PlaylistID' },
    ]
});
const mySongsList = createCsvWriter({
    path: 'songsList.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'id', title: 'SongID' },
    ]
});

const mySongsFeatures = createCsvWriter({
    path: 'songsFeatures.csv',
    header: [
        { id: 'id', title: 'SongID' },
        { id: 'duration_ms', title: 'Duration(ms)' },
        { id: 'key', title: 'Key' },
        { id: 'mode', title: 'Mode' },
        { id: 'time_signature', title: 'Time Signature' },
        { id: 'acousticness', title: 'Acousticsness' },
        { id: 'danceability', title: 'Danceability' },
        { id: 'energy', title: 'Energy' },
        { id: 'instrumentalness', title: 'Instrumentalness' },
        { id: 'liveness', title: 'Liveness' },
        { id: 'loudness', title: 'Loudness' },
        { id: 'speechiness', title: 'Speechiness' },
        { id: 'valence', title: 'Valence' },
        { id: 'tempo', title: 'Tempo' },
    ]
});

var code = '';
var res; var pList = []; var dat; var a = [];
var ids = '';
var clientid = '17d46850a53d4966a9c67e2639076714';
var clientsecret = '2bb8eb5bb6014ba8a691887978a12342';
var tempvar1;
const getToken = async () => {
    var tempvar2;
    var btoa = require('btoa');
    try {


        res = await request('POST', 'https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientid + ':' + clientsecret)
            },
            body: 'grant_type=client_credentials'

        });
        await getNumFruit();
        tempvar2 = JSON.parse((res.body).toString('utf8'));
        console.log(tempvar2.access_token);
        code = tempvar2.access_token;
    } catch (error) {
        console.log(error)
        console.log('unable to generate access token ')
        process.exit(1)
    }

}

const getPlayList = async _ => {
    try {
        res = await request('GET', 'https://api.spotify.com/v1/users/spotify/playlists?limit=50&offset=0', {
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + code
            },
        });

    } catch (error) {
        console.log(error)
    }
    tempvar1 = JSON.parse(res.getBody('utf8'));
    for (let i in tempvar1["items"]) {
        pList.push({ id: tempvar1["items"][i]["id"], name: tempvar1["items"][i]["name"] });
    }
    console.log(tempvar1["items"][0]["id"]);
    console.log('waitin')
    for (let i = 1; i < 20; i++) {
        try {
            res = await request('GET', `${tempvar1["next"]}`, {
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + code
                },
            });
            tempvar1 = JSON.parse(res.getBody('utf8'));
            for (let i in tempvar1["items"]) {
                pList.push({ id: tempvar1["items"][i]["id"], name: tempvar1["items"][i]["name"] });
            }

            console.log(tempvar1["items"][0]["id"]);
            await getNumFruit();
        } catch (error) {
            console.log(error)
        }
    }
    await myPlist.writeRecords(pList).then(() => console.log('The CSV file was written successfully'));
}



const getNumFruit3 = () => {
    return sleep(4000).then()
}
const getSleep = () => {
    console.log('We were on a break!')
    return sleep(30000).then()
}

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

const getNumFruit = () => {
    return sleep(3000).then()
}

const songsinfo = async _ => {
    console.log('Start songsinfo')
    var sList = [];
    var flag = 0
    var k = 0;

    while (k < a.length) {



        try {
            console.log('in try 1')
            res = await request('GET', `https://api.spotify.com/v1/playlists/${a[k]}/tracks?market=IN&fields=items(track(name,id))`, {
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + code
                },
            });
            await getNumFruit();
            tempvar1 = JSON.parse(res.getBody('utf8'));
            console.log(`Percent completed : ${((k + 1) * 100) / a.length}%`);

            for (var i in tempvar1["items"]) {
                try {
                    if (tempvar1["items"][i]["track"] == null || tempvar1["items"][i]["track"] == undefined) {
                        console.log('undefined or null track skipping');

                    }
                    else {
                        sList.push({ id: tempvar1["items"][i]["track"]["id"], name: tempvar1["items"][i]["track"]["name"] });
                        ids = ids + tempvar1["items"][i]["track"]["id"] + ",";

                    }

                } catch (error) {
                    console.log(`its an error 2 ${error} \n stll and error null or undefined`)

                }

            }
            ids = ids.slice(0, -1);
            k++;
            flag = 0;
            if (ids.length > 2) {
                await songsfeature();
                ids = '';
            }
            await mySongsList.writeRecords(sList).then(() => console.log('The songs CSV file was written successfully'));
            sList = [];
            if(k%50==0)await getSleep();
            console.log('in try 1 exit')
        } catch (error) {
            console.log(error.statusCode)
            console.log(`token not generated K = ${k}`)
            if (error.statusCode > 300) {
                flag++;
                if (flag > 3) {
                    console.log('something went wrong');
                    process.exit(1);

                }
                await getToken();

            }
        }




    }

    console.log('End songinfo')
}


const songsfeature = async _ => {
    console.log('Start features')
    var sfList;
    var flag = 0;
    var tempvar3;
    flag = 0;
    sfList = [];
    while (flag < 4) {

        try {
            console.log('in try 2')
            res = await request('GET', `https://api.spotify.com/v1/audio-features/?ids=${ids}`, {
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + code
                },
            });
            await getNumFruit();
            tempvar3 = JSON.parse(res.getBody('utf8'));



            for (var i in tempvar3["audio_features"]) {

                try {
                    sfList.push({
                        id: tempvar3["audio_features"][i]["id"],
                        key: tempvar3["audio_features"][i]["key"],
                        mode: tempvar3["audio_features"][i]["mode"],
                        time_signature: tempvar3["audio_features"][i]["time_signature"],
                        acousticness: tempvar3["audio_features"][i]["acousticness"],
                        danceability: tempvar3["audio_features"][i]["danceability"],
                        energy: tempvar3["audio_features"][i]["energy"],
                        instrumentalness: tempvar3["audio_features"][i]["instrumentalness"],
                        liveness: tempvar3["audio_features"][i]["liveness"],
                        loudness: tempvar3["audio_features"][i]["loudness"],
                        speechiness: tempvar3["audio_features"][i]["speechiness"],
                        valence: tempvar3["audio_features"][i]["valence"],
                        tempo: tempvar3["audio_features"][i]["tempo"],
                        duration_ms: tempvar3["audio_features"][i]["duration_ms"]
                    });
                } catch (error) {
                    console.log('NULL FOUND')

                }

            }
            console.log('sflist pushed');
            await mySongsFeatures.writeRecords(sfList).then(() => console.log('The songs feature CSV file was written successfully'));
            flag = 5;
            sfList = [];
            ids = '';
            console.log('in try 2 exit')
        } catch (error) {
            console.log(error);

            if (error.statusCode > 300) {
                flag++;
                if (flag > 3) {
                    console.log('something went wrong');
                    process.exit(1);

                }
                await getToken();

            }
            else {
                console.log(error)
                flag++;

            }
        }





    }

    console.log('End songfeat')
}

const readplaylist = async _ => {
    fs.createReadStream('playlist.csv').pipe(csv()).on('data', (row) => {

        a.push(row['PlaylistID']);

    }).on('end', () => {
        console.log('PLaylist.csv Read Complete! ')

    });
    await getNumFruit3()
}
const c = async _ => {
    // getToken()
    try {
        if (fs.existsSync('playlist.csv')) {
            console.log('Playlist.csv Exists!')
        }
    } catch (err) {
        console.log(err)
        console.log('File Does Not exist... Creating')
        await getPlayList()
    }

    await readplaylist()
    console.log('after read complete')
    await songsinfo()
    console.log('songinfo compltete')


}
c()