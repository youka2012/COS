const http = require('http');
const url = require('url');

const compose = (ctx) => (...funcs) => {
    if (funcs.length === 0) {
        return arg => arg
    }
    
    return  funcs.reduceRight((a, b,index) => b(() => {
        if(index === funcs.length - 1){
            return Promise.resolve();
        }
        try{
            return Promise.resolve(a(ctx));
        }catch(e){
            return Promise.reject(e);
        }
    }), 1);
};


const applyMiddleware = (middles, ctx) => compose(ctx)(...middles);

class SOS {
    constructor() {
        this.middleWares = [];
        this.serve = http.createServer(async (req, res) => {
            const ctx = { req, res };
            const handler = applyMiddleware(this.middleWares, ctx);
            await handler(ctx);
            res.end();
        });
    }

    use(mid) {
        this.middleWares.push(mid);
    }

    listen(...agr) {
        this.serve.listen(...agr);
        console.log('starting');
    }
}
