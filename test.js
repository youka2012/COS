
import SOS from './index.js';

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
