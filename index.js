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

const sos = new SOS();
sos.listen(9009);

sos.use((next) =>async (ctx) => {
    console.log('\npathname::',url.parse(ctx.req.url).pathname);
    ctx.res.write(new Date()+'');
    console.log('before 111');
    ctx.res.write('before 111\n');
    await next();
    console.log('after 111');
    ctx.res.write('after 111\n');
});
sos.use((next) =>async (ctx) => {
    console.log('before 222');
    ctx.res.write('before 222\n');
    await next();
    console.log('after 222');
    ctx.res.write('end test222\n');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('timeout 222 ');
        ctx.res.write('timeout 222 \n');
        return resolve();
      }, 3000);
    });
});
sos.use((next) =>async (ctx) => {
    console.log('before 333');
    ctx.res.write('before 333\n');
    await next();
    console.log('after 333');
    ctx.res.write('end test333\n');
});
