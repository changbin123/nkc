const Router = require('koa-router');
const nkcModules = require('../../nkcModules');
let apiFn = nkcModules.apiFunction;
let dbFn = nkcModules.dbFunction;
const meRouter = new Router();
meRouter
  .get('/', async (ctx, next) => {
    let db = ctx.db;
    let user = ctx.data.user;
    ctx.data.examinated = ctx.query.examinated;
    if(!user) {
      ctx.throw(401, '您还没有登陆，请登录后再试。');
    }
    ctx.data.replyTarget = 'me';
    ctx.data.personal = await db.UsersPersonalModel.findOnly({uid: user.uid});
    let subscribe = await db.UserSubscribeModel.findOnly({uid: user.uid});
    let subscribeForums = '';
    if(subscribe.subscribeForums) {
      subscribeForums = subscribe.subscribeForums.join(',');
    }else {
      subscribeForums = '';
    }
    ctx.data.user.subscribeForums = subscribeForums;
    ctx.data.forumList = await dbFn.getAvailableForums(ctx);
    let userPersonal = await db.UsersPersonalModel.findOne({uid: user.uid});
    if(userPersonal.mobile) ctx.data.user.mobile = (userPersonal.mobile.slice(0,3) === '0086')? userPersonal.mobile.replace('0086', '+86'): userPersonal.mobile;
    ctx.template = 'interface_me.pug';
    await next();
  })
  .put('/username', async (ctx, next) => {
    //ctx.data = '修改用户名';
    await next();
  })
  .put('/password', async (ctx, next) => {
    let db = ctx.db;
    let params = ctx.body;
    let user = ctx.data.user;
    if(!params.oldPassword) ctx.throw(400, '旧密码不能为空');
    if(!params.newPassword || !params.newPassword2) ctx.throw(400, '新密码不能为空');
    if(params.newPassword !== params.newPassword2) ctx.throw(400, '两次输入的密码不一致！请重新输入');
    let userPersonal = await db.UsersPersonalModel.findOne({uid: user.uid});
    if(!apiFn.testPassword(params.oldPassword, userPersonal.hashType, userPersonal.password)){
      ctx.throw(400, '密码不正确，请重新输入');
    }
    let newPasswordObj = apiFn.newPasswordObject(params.newPassword);
    await db.UsersPersonalModel.updateOne({uid: user.uid}, {$set:newPasswordObj});
    await next();
  })
  .put('/personalsetting', async (ctx, next) => {
    let db = ctx.db;
    let params = ctx.body;
    let user = ctx.data.user;
    let settingObj = {};
    settingObj.postSign = params.post_sign.toString().trim();
    settingObj.description = params.description.toString().trim();
    settingObj.color = params.color.toString().trim();
    let subscribeForums = params.focus_forums.toString().trim() || '';
    subscribeForums = subscribeForums.split(',');
    if(settingObj.postSign.length>300||settingObj.description.length>300||settingObj.color.length>10) {
      ctx.throw(400, '提交的内容字数超出限制，请检查');
    }
    await db.UserModel.update({uid: user.uid}, {$set: settingObj});
    await db.UserSubscribeModel.replaceOne({uid: user.uid},{$set:{subscribeForums: subscribeForums}});
    await next();
  })
  .post('/mobile', async (ctx, next) => {
    let {db} = ctx;
    let {user} = ctx.data;
    let {mobile, areaCode, code} = ctx.body;
    if(!mobile) ctx.throw(400, '电话号码不能为空！');
    if(!areaCode) ctx.throw(400, '国际区号不能为空！');
    if(!code) ctx.throw(400, '手机短信验证码不能为空！');
    let newMobile = (areaCode + mobile).replace('+', '00');
    let userPersonal = await db.UsersPersonalModel.findOne({uid: user.uid});
    if(userPersonal.mobile) ctx.throw(404, `此账号已绑定手机号码： ${userPersonal.mobile}`);
    let mobileCodesNumber = await dbFn.checkMobile(newMobile, mobile);
    if(mobileCodesNumber > 0) ctx.throw(404, '此号码已经用于其他用户注册，请检查或更换');
    let smsCode = await dbFn.checkMobileCode(newMobile, code);
    if(!smsCode) ctx.throw(400, '手机验证码错误或过期，请检查');
    await db.UsersPersonalModel.replaceOne({uid: user.uid}, {$set: {mobile: newMobile}});
    await next();
  })
  .get('/resource', async (ctx, next) => {
    const {user} = ctx.data;
    const {db} = ctx;
    const quota = parseInt(ctx.query.quota);
    let resources = await db.ResourceModel.find({uid: user.uid}).sort({toc: -1}).limit(quota);
    console.log(resources);
    ctx.data.resources = resources;
    await next();
  });
module.exports = meRouter;