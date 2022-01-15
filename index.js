let PORT     = 9064;

var http = require('http');
var url = require('url');
var fs = require('fs');
const crypto = require('crypto');


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
    let answer = {};

    let login = false;


    request
        .on('data', (chunk) => { 
            body.push(chunk); 
        })
        .on('end', () => {
            try { 
                query = JSON.parse(body);
                query.password = crypto.createHash('md5').update(query.password).digest('hex');
                console.log(query);
                let dados = [];
 
                fs.readFile('user.json',function(err,data) {
                    
                    if(!err) {
                        if(data.length !== 0) {
                            dados = JSON.parse(data.toString());
                            console.log("Dados:" + dados);
                            for(let i = 0; i < dados.length; i++) {
                                if(dados[i].nick === query.nick) {
                                    const hashdata = crypto.createHash('md5').update(dados[i].password).digest('hex');
                                    login = true;
                                    console.log(hashdata);
                                    if(hashdata === query.password) {
                                        answer.status = 200;
                                    } else {
                                        answer.status = 401;
                                    }
                                }
                            }
                        }
                        console.log(answer.status)
                        if(!login) {
                            dados.push(query);
                        }
                        dados.sort((a, b) => (a.nick > b.nick) ? 1 : ((b.nick > a.nick) ? -1 : 0));
                        fs.writeFile('user.json', JSON.stringify(dados), function(err) {
                            if(!err) {
                                answer.status = 200;
                            } else {
                                answer.status = 400;
                            }
                        });

                    }
                    
                });
                
            }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });

}
