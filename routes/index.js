const Router = require('koa-router');
const router = new Router();
const routers = require('../requireFolder')(__dirname);
const userRouter = routers.user;
const meRouter = routers.me;
const threadRouter = routers.thread;
const postRouter = routers.post;
const forumRouter = routers.forum;
const otherRouter = routers.other;
const experimentalRouter = routers.experimental;
const resourceRouter = routers.resource;
const fundRouter = routers.fund;
const registerRouter = routers.register;
const downloadRouter = routers.download;
const problemRouter = routers.problem;
const loginRouter = routers.login;
const appRouter = routers.app;
const messageRouter = routers.message;
const activityRouter = routers.activity;
const friendRouter = routers.friend;
const friendCategoryRouter = routers.friendCategory;
const homeRouter = routers.home;
const shareRouter = routers.share;
const lotteryRouter = routers.lottery;
const columnRouter = routers.column;
const columnsRouter = routers.columns;
const examRouter = routers.exam;
const forgotPasswordRouter = routers.forgotPassword;
const shopRouter = routers.shop;
const accountRouter = routers.account;
const imageEditRouter = routers.imageEdit;
const complaintRouter = routers.complaint;
const searchRouter = routers.search;
const protocolRouter = routers.protocol;
const reviewRouter = routers.review;
const threadsRouter = routers.threads;
const userAvatarRouter = routers.userAvatar;
const userBannerRouter = routers.userBanner;

router.use('/', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/lottery', lotteryRouter.routes(), lotteryRouter.allowedMethods());
router.use('/app', appRouter.routes(), appRouter.allowedMethods());
router.use('/', otherRouter.routes(), otherRouter.allowedMethods());
router.use("/search", searchRouter.routes(), searchRouter.allowedMethods());
router.use('/u', userRouter.routes(), userRouter.allowedMethods());
router.use('/me', meRouter.routes(), meRouter.allowedMethods());
router.use('/t', threadRouter.routes(), threadRouter.allowedMethods());
router.use('/p', postRouter.routes(), postRouter.allowedMethods());
router.use('/f', forumRouter.routes(), forumRouter.allowedMethods());
router.use('/e', experimentalRouter.routes(), experimentalRouter.allowedMethods());
router.use('/r', resourceRouter.routes(), resourceRouter.allowedMethods());
// router.use('/m', personalForumRouter.routes(), personalForumRouter.allowedMethods());
router.use('/fund', fundRouter.routes(), fundRouter.allowedMethods());
router.use('/register', registerRouter.routes(), registerRouter.allowedMethods());
router.use('/download', downloadRouter.routes(), downloadRouter.allowedMethods());
router.use('/problem', problemRouter.routes(), problemRouter.allowedMethods());
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/message', messageRouter.routes(), messageRouter.allowedMethods());
router.use('/activity', activityRouter.routes(),activityRouter.allowedMethods());
router.use('/friend', friendRouter.routes(), friendRouter.allowedMethods());
router.use('/friend_category', friendCategoryRouter.routes(), friendCategoryRouter.allowedMethods());
router.use("/complaint" ,complaintRouter.routes(), complaintRouter.allowedMethods());
//router.use('/share', shareRouter.routes(), shareRouter.allowedMethods());
router.use('/exam', examRouter.routes(), examRouter.allowedMethods());
router.use('/s', shareRouter.routes(), shareRouter.allowedMethods());
router.use('/forgotPassword', forgotPasswordRouter.routes(), forgotPasswordRouter.allowedMethods());
router.use('/shop', shopRouter.routes(), shopRouter.allowedMethods());
router.use('/account', accountRouter.routes(), accountRouter.allowedMethods());
router.use("/review", reviewRouter.routes(), reviewRouter.allowedMethods());
router.use("/m", columnsRouter.routes(), columnsRouter.allowedMethods());
router.use("/column", columnRouter.routes(), columnRouter.allowedMethods());
router.use('/imageEdit', imageEditRouter.routes(), imageEditRouter.allowedMethods());
router.use('/protocol', protocolRouter.routes(), protocolRouter.allowedMethods());
router.use("/threads", threadsRouter.routes(), threadsRouter.allowedMethods());
router.use("/avatar", userAvatarRouter.routes(), userAvatarRouter.allowedMethods());
router.use("/banner", userBannerRouter.routes(), userBannerRouter.allowedMethods());
module.exports = router;