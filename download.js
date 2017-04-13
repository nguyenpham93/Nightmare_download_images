const Nightmare = require('nightmare');		
const async = require('async');
const shortid = require('shortid');
let nightmare = Nightmare({ show: true });
const downloader = require('image-downloader');

nightmare
    .goto('https://www.foody.vn/ha-noi#/places')
    .click('.signin')
    .wait(1000)
    .insert('#Email','systemec2017@gmail.com')
    .type('#Password','rootvn')
    .click('#signin_submit')
    .wait(2000)
    .type('#pkeywords', 'Cafe Hai Bà Trưng')
    .click('.ico-search')
    .wait(1000)
    // .click('#scrollLoadingPage')
    // .wait(1000)
    // .click('#scrollLoadingPage')
    // .wait(1000)
    .evaluate(function () {
        let res = document.querySelectorAll('.filter-result-item .result-image');
        let arrImg = [];
        for(let i = 0; i < res.length;i++){
            let srcImg = res[i].querySelector('a > img').getAttribute('src');
            arrImg.push(srcImg);
        }
        return arrImg;
    })
    .end()
    .then(function (imgs){
        async.mapLimit( imgs , 2 , download , function(err,res){
            console.log(res);
        });
    })
    .catch(function (error) {
        console.error('Search failed:', error);
    });


function download(url,cb){
    let dest = __dirname + '/image/' + shortid.generate() + '.jpg';
    let option = setPath(url,dest);
    downloader.image(option)
    .then(({ filename, image }) => {
        console.log('File saved to', filename);
        cb(null,filename);
    }).catch((err) => {
        cb("error",null);
        throw err;
    })
}

function setPath(url,dest){
    options = {
        url: url,
        dest : dest,        
        done: function(err, filename, image) {
            if (err) {
                throw err
            }
            console.log('File saved to', filename)
        }
    }
    return options;
}