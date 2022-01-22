let PORT     = 9064;

var http = require('http');
var url = require('url');
var fs = require('fs');
const crypto = require('crypto');

function hash(psw) {
    return crypto.createHash('md5').update(psw).digest('hex');
}

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
                case '/updaterank':
                    update_rank(request, response);
                    break;
                default:
                    response.writeHead(404, headers['plain']);
                    response.end();
                    break;

            }
        break;

        default:
            response.writeHead(400, headers['plain']);
            response.end();
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

            console.log(data);

            if(answer.style === 'plain')
                response.end();
        } else {
            let dados = [{nick:"Jogador", win: 0, games: 0}];
            fs.writeFile('user.json', JSON.stringify(dados), function(err) {
                if(!err) 
                    answer.status = 200;
                else 
                    answer.status = 400;

            });
        }
    });

}

function update_rank(request, response){
    const body = [];
    let query = {};

    request
        .on('data', (chunk) => { body.push(chunk)  })
        .on('end', () => {
            try { 
                query = JSON.parse(body);
                console.log("query: ");  
                console.log(query); 
    
                let dados = [];
                let user = false;
                let answer = {status: 200};
                fs.readFile('ranking.json',function(err,data){
                    if(!err){
                        if(data.length !== 0){
                            dados = JSON.parse(data.toString());
                            for(let i=0; i<dados.length; i++){
                                if(dados[i].nick===query.nick){
                                    user = true;
                                    dados[i].game++;
                                    if(query.win===true)
                                        dados[i].win++;
                                    break;
                                }
                            }
                            if(!user) {
                                let r = {nick: query.nick, win:query.win ? 1 : 0, game: 1}
                                dados.push(r);
                            }

                        }
                        console.log(dados);
                        dados.sort((a, b) => ((a.win/a.game) > (b.win/b.game)) ? 1 : (((b.win/b.game) < (a.win/a.game)) ? -1 : 0));
                        fs.writeFile('ranking.json', JSON.stringify(dados.slice(0, 10)), function(err){
                            if(!err){
                                answer.status=200;
                            }
                            else answer.status=400;
                        });
                        response.writeHead(answer.status, headers['plain']);
                        response.end();
                    }
                    else{
                        let r = {nick: query.nick, win:query.win ? 1 : 0, game: 1}
                        dados.push(r);
                        console.log(dados);
                        fs.writeFile('ranking.json', JSON.stringify(dados.slice(0, 10)), function(err){
                            if(!err){
                                answer.status=200;
                            }
                            else answer.status=400;
                        });
                        response.writeHead(answer.status, headers['plain']);
                        response.end();
                    }
                });
            }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });
}

function register(request, response){
    const body = [];
    let answer = {status: 200};
    let query = {};
    let login = false;


    request
        .on('data', (chunk) => { 
            body.push(chunk); 
        })
        .on('end', () => {
            try { 
                query = JSON.parse(body);
                query.password = hash(query.password);

                let dados = [];
 
                fs.readFile('user.json',function(err,data) {
                    
                    if(!err) {
                        if(data.length !== 0) {
                            dados = JSON.parse(data.toString());

                            for(let i = 0; i < dados.length && !login; i++) {

                                if(dados[i].nick === query.nick) {
                                    
                                    login = true;
                                    if(dados[i].password === query.password) {
                                        answer.status = 200;
                                    } else {
                                        answer.status = 401;
                                    }
                                }
                            }
                        }

                        if(answer.status !== 401) {
                            if(!login) {
                                dados.push(query);
                            }
                            dados.sort((a, b) => (a.nick > b.nick) ? 1 : ((b.nick > a.nick) ? -1 : 0));

                            fs.writeFile('user.json', JSON.stringify(dados), function(err) {
                                if(err) {
                                    answer.status = 400;
                                } else {
                                    answer.status = 200;
                                }
                            });
                        }

                        response.writeHead(answer.status, headers['plain']);
                        response.end();

                    }
                    else{
                        console.log("Don't exist file!");
                        if(!login) {
                            dados.push(query);
                        }
                        dados.sort((a, b) => (a.nick > b.nick) ? 1 : ((b.nick > a.nick) ? -1 : 0));

                        fs.writeFile('user.json', JSON.stringify(dados), function(err) {
                            if(!err) 
                                answer.status = 200;
                            else 
                                answer.status = 400;
 
                        });
                        
                        response.writeHead(answer.status, headers['plain']);
                        response.end();
                    }

                    
                });
                
            }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });

}
