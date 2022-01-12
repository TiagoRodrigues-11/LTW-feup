let PORT     = 9064;

let http = require('http');
let url = require('url');
let fs = require('fs');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};

    switch(request.method) {
        case 'POST':
            answer = doPost(pathname);
        default:
            answer.status = 400;
    }
    
    if(answer.status === undefined)
        answer.status = 200;
    if(answer.style === undefined)
        answer.style = 'plain';

    response.writeHead(answer.status, headers[answer.style]);
    response.write(answer.mensagem);
    if(answer.style === 'plain')
        response.end();

}).listen(PORT);

function doPost(pathname){
    var answer = {};

    switch(pathname) {
        case '/ranking':
            answer.mensagem="hello";
            break;
        case '/register':
        
            break;
        default:
            answer.status = 400;
            break;
    }

    return answer;
}
