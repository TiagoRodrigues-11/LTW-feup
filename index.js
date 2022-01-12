let PORT     = 9064;

var http = require('http');
var url = require('url');
var fs = require('fs');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'  ,
        'Access-Control-Allow-Credentials' : true       
    },
};

http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};

    switch(request.method) {
        case 'POST':
            answer.body = doPost(pathname);
            break;
        default:
            answer.status = 400;
    }
    
    if(answer.status === undefined)
        answer.status = 200;
    if(answer.style === undefined)
        answer.style = 'plain';

    console.log(answer);

    response.writeHead(answer.status, headers[answer.style]);
    response.write(answer.body);
    
    if(answer.style === 'plain')
        response.end();

}).listen(PORT);

function doPost(pathname){
    var answer = {};

    switch(pathname) {
        case '/ranking':
            answer=ranking();
            console.log(answer);
            break;
        case '/register':
        
            break;
        default:
            answer.status = 400;
            break;
    }

    return answer;
}

function ranking(){
    let ranking={};
    fs.readFile('ranking.json',function(err,data){
        if(!err){
            ranking=JSON.parse(data.toString());
            console.log(ranking);
            return ranking;
        }
    });
}