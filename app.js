const mainRouter = require('./routes');
const Koa = require('koa');
require('colors');
const loggerModule = require('./nkcModules/logger');
const path = require('path');
const koaBody = require('koa-body');
const koaCompress = require('koa-compress');
const koaRewrite = require('koa-rewrite');
const settings = require('./settings');
const helmet = require('koa-helmet');
const { getCookieKeys } = require('./nkcModules/cookie');
const awesomeStatic = require('awesome-static');
const { getUrl } = require('./nkcModules/tools');
const staticServe = (path) => {
  return require('koa-static')(path, {
    setHeaders: function (response) {
      response.setHeader(
        'Cache-Control',
        `public, ${
          global.NKC.NODE_ENV === 'production' ? 'max-age=604800' : 'no-cache'
        }`,
      );
    },
  });
};
const app = new Koa();
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
app.on('error', (err) => {
  loggerModule.error(`KOA ERROR:`);
  loggerModule.error(err);
  /*if(!['read ECONNRESET', 'write ECONNABORTED', 'write ECANCELED', 'write ECONNRESET'].includes(err.message)) {
		logger.info(err);
	}*/
});

const {
  rateLimit,
  stayLogin,
  init,
  initState,
  initAddress,
  initCtxMethods,
  body,
  urlRewrite,
  permission,
  logger,
  cache,
  IPLimit,
  filterDomain,
  apiData,
} = require('./middlewares');

const uploadConfig = require('./config/upload');

const koaBodySetting = settings.upload.koaBodySetting;
koaBodySetting.formidable.maxFileSize = uploadConfig.maxFileSize;
app.keys = getCookieKeys();
app
  .use(rateLimit.total)
  // gzip
  .use(koaCompress({ threshold: 2048 }))
  // 静态文件映射
  .use(staticServe(path.resolve('./nkcModules')))
  .use(staticServe(path.resolve('./public')))
  .use(staticServe(path.resolve('./node_modules')))
  .use(staticServe(path.resolve('./dist/pages')))
  .use(awesomeStatic('./resources/tools', { route: '/tools' }))
  // 请求头安全设置
  .use(helmet())
  .use(koaBody(koaBodySetting))
  // 视频段支持
  .use(conditional())
  .use(etag())
  .use(urlRewrite)
  .use(koaRewrite('/favicon.ico', getUrl('siteIcon', 'ico')))
  .use(initAddress)
  .use(init)
  .use(initState)
  .use(initCtxMethods)
  .use(filterDomain)
  // IP 黑名单
  .use(IPLimit)
  // 全局 频次限制 文件
  .use(rateLimit.totalFile)
  .use(rateLimit.totalHtml)

  .use(rateLimit.userFile)
  .use(rateLimit.userHtml)

  .use(stayLogin)
  .use(cache)
  .use(permission.permission)
  .use(logger)
  .use(mainRouter.routes())
  .use(apiData)
  .use(body);
module.exports = app.callback();
