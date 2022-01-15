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
    switch(request.method) {
        case 'POST':
            switch(pathname){
                case '/ranking':
                    ranking(response);
                    break;
                case '/register':
                    register(request, response);
                    break;
                default:
                    response.writeHead(404, headers['plain']);
                    response.end;
                    break;
            }
        break;

        default:
            response.writeHead(400, headers['plain']);
            response.end;
            break;
    }

    

}).listen(PORT);

function ranking(response){

    let answer = {};
    fs.readFile('ranking.json',function(err,data){
        if(!err){

            if(answer.status === undefined)
                answer.status = 200;
            if(answer.style === undefined)
                answer.style = 'plain';

            response.writeHead(answer.status, headers[answer.style]);
            response.write(data.toString());

            if(answer.style === 'plain')
                response.end();
        }
    });

}

function register(request, response){
    const body = [];
    request
        .on('data', (chunk) => { 
            body.push(chunk); 
        })
        .on('end', () => {
            try { 
                query = JSON.parse(body);
                fs.readFile('user.json',function(err,data){
                    if(!err){
                        let dados = JSON.parse(data.toString());
                        for(let i=0; i<dados.length; i++) 
                            console.log(dados[i].nick);
                        
                    }
                });
                /*fs.writeFile('user.json', JSON.stringify(query),function(err){
                    if(!err){

                    }
                })*/
             }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });

}