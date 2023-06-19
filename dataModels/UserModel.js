const settings = require('../settings');
const mongoose = settings.database;
const Schema = mongoose.Schema;
const getRedisKeys = require('../nkcModules/getRedisKeys');
const redisClient = require('../settings/redisClient');
const { defaultCerts } = require('../settings/userCerts');
const {
  ThrowCommonError,
  ThrowServerInternalError,
} = require('../nkcModules/error');
const filterResult = require('../nkcModules/xssFilters/filterResult');

const userSchema = new Schema(
  {
    // 是否注销
    destroyed: {
      type: Boolean,
      default: false,
      index: 1,
    },
    kcb: {
      type: Number,
      default: 0,
    },
    oldKcb: {
      type: Number,
      default: 0,
    },
    toc: {
      type: Date,
      default: Date.now,
      index: 1,
    },
    xsf: {
      type: Number,
      default: 0,
    },
    tlv: {
      type: Date,
      index: 1,
      default: Date.now,
    },
    disabledPostsCount: {
      type: Number,
      default: 0,
    },
    disabledThreadsCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    threadCount: {
      type: Number,
      default: 0,
    },
    recCount: {
      type: Number,
      default: 0,
    },
    toppedThreadsCount: {
      type: Number,
      default: 0,
    },
    digestThreadsCount: {
      type: Number,
      default: 0,
    },
    digestPostsCount: {
      type: Number,
      default: 0,
    },
    // 在线天数
    dailyLoginCount: {
      type: Number,
      default: 0,
    },
    // 违规数
    violationCount: {
      type: Number,
      default: 0,
    },
    score: {
      default: 0,
      type: Number,
    },
    lastVisitSelf: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      index: 1,
      default: '',
      maxlength: 30,
      trim: true,
    },
    usernameLowerCase: {
      type: String,
      index: 1,
      default: '',
      trim: true,
      lowercase: true,
    },
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    cart: [String],
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    certs: {
      type: [String],
      default: [],
      index: 1,
    },
    // 用户名片是否被屏蔽
    hidden: {
      type: Boolean,
      default: false,
      index: 1,
    },
    postSign: String,
    volumeA: {
      type: Boolean,
      default: false,
    },
    volumeB: {
      type: Boolean,
      default: false,
    },
    online: {
      type: String,
      default: '',
      index: 1,
    },
    // 头像文件hash
    avatar: {
      type: String,
      default: '',
    },
    // 背景文件名hash
    banner: {
      type: String,
      default: '',
    },
    //用户个人主页背景
    homeBanner: {
      type: String,
      default: '',
    },
    // 支持数
    voteUpCount: {
      type: Number,
      default: 0,
      index: 1,
    },
    // 反对数
    voteDownCount: {
      type: Number,
      default: 0,
      index: 1,
    },
  },
  {
    toObject: {
      getters: true,
      virtuals: true,
    },
  },
);

userSchema.pre('save', function (next) {
  try {
    this.usernameLowerCase = this.username;
    const arr = ['default', 'scholar'];
    const certs = [];
    for (let cert of this.certs) {
      if (!arr.includes(cert) && !certs.includes(cert)) {
        certs.push(cert);
      }
    }
    this.certs = certs;
    return next();
  } catch (e) {
    return next(e);
  }
});

userSchema
  .virtual('operations')
  .get(function () {
    return this._operations;
  })
  .set(function (operations) {
    this._operations = operations;
  });

userSchema
  .virtual('setPassword')
  .get(function () {
    return this._setPassword;
  })
  .set(function (setPassword) {
    this._setPassword = setPassword;
  });

userSchema
  .virtual('boundMobile')
  .get(function () {
    return this._boundMobile;
  })
  .set(function (boundMobile) {
    this._boundMobile = boundMobile;
  });

userSchema
  .virtual('boundEmail')
  .get(function () {
    return this._boundEmail;
  })
  .set(function (boundEmail) {
    this._boundEmail = boundEmail;
  });

userSchema
  .virtual('havePassword')
  .get(function () {
    return this._havePassword;
  })
  .set(function (havePassword) {
    this._havePassword = havePassword;
  });

userSchema
  .virtual('subUid')
  .get(function () {
    return this._subUid;
  })
  .set(function (subUid) {
    this._subUid = subUid;
  });

userSchema
  .virtual('registerType')
  .get(function () {
    return this._registerType;
  })
  .set(function (registerType) {
    this._registerType = registerType;
  });

userSchema
  .virtual('paperA')
  .get(function () {
    return this._paperA;
  })
  .set(function (paperA) {
    this._paperA = paperA;
  });

userSchema
  .virtual('paperB')
  .get(function () {
    return this._paperB;
  })
  .set(function (paperB) {
    this._paperB = paperB;
  });

userSchema
  .virtual('regPort')
  .get(function () {
    return this._regPort;
  })
  .set(function (p) {
    this._regPort = p;
  });

userSchema
  .virtual('draftCount')
  .get(function () {
    return this._draftCount;
  })
  .set(function (draftCount) {
    this._draftCount = draftCount;
  });
userSchema
  .virtual('zoneThreadCount')
  .get(function () {
    return this._zoneThreadCount;
  })
  .set(function (zoneThreadCount) {
    this._zoneThreadCount = zoneThreadCount;
  });

userSchema
  .virtual('timelineCount')
  .get(function () {
    return this._timelineCount;
  })
  .set(function (timelineCount) {
    this._timelineCount = timelineCount;
  });

userSchema
  .virtual('disabledZoneThreadCount')
  .get(function () {
    return this._disabledZoneThreadCount;
  })
  .set(function (disabledZoneThreadCount) {
    this._disabledZoneThreadCount = disabledZoneThreadCount;
  });

userSchema
  .virtual('commentCount')
  .get(function () {
    return this._commentCount;
  })
  .set(function (commentCount) {
    this._commentCount = commentCount;
  });

userSchema
  .virtual('momentCount')
  .get(function () {
    return this._momentCount;
  })
  .set(function (momentCount) {
    this._momentCount = momentCount;
  });

userSchema
  .virtual('columnThreadCount')
  .get(function () {
    return this._columnThreadCount;
  })
  .set(function (columnThreadCount) {
    this._columnThreadCount = columnThreadCount;
  });

userSchema
  .virtual('disabledColumnThreadCount')
  .get(function () {
    return this._disabledColumnThreadCount;
  })
  .set(function (disabledColumnThreadCount) {
    this._disabledColumnThreadCount = disabledColumnThreadCount;
  });

userSchema
  .virtual('subscribeUsers')
  .get(function () {
    return this._subscribeUsers;
  })
  .set(function (subscribeUsers) {
    this._subscribeUsers = subscribeUsers;
  });

userSchema
  .virtual('regIP')
  .get(function () {
    return this._regIP;
  })
  .set(function (ip) {
    this._regIP = ip;
  });

userSchema
  .virtual('mobile')
  .get(function () {
    return this._mobile;
  })
  .set(function (m) {
    this._mobile = m;
  });

userSchema
  .virtual('nationCode')
  .get(function () {
    return this._nationCode;
  })
  .set(function (m) {
    this._nationCode = m;
  });

userSchema
  .virtual('email')
  .get(function () {
    return this._email;
  })
  .set(function (e) {
    this._email = e;
  });

userSchema
  .virtual('roles')
  .get(function () {
    return this._roles;
  })
  .set(function (e) {
    this._roles = e;
  });

userSchema
  .virtual('group')
  .get(function () {
    return this._group;
  })
  .set(function (g) {
    this._group = g;
  });

userSchema
  .virtual('column')
  .get(function () {
    return this._column;
  })
  .set(function (g) {
    this._column = g;
  });

userSchema
  .virtual('threads')
  .get(function () {
    return this._threads;
  })
  .set(function (t) {
    this._threads = t;
  });

userSchema
  .virtual('generalSettings')
  .get(function () {
    return this._generalSettings;
  })
  .set(function (s) {
    this._generalSettings = s;
  });

userSchema
  .virtual('newMessage')
  .get(function () {
    return this._newMessage;
  })
  .set(function (newMessage) {
    this._newMessage = newMessage;
  });

userSchema
  .virtual('grade')
  .get(function () {
    return this._grade;
  })
  .set(function (grade) {
    this._grade = grade;
  });

userSchema
  .virtual('authLevel')
  .get(function () {
    return this._authLevel;
  })
  .set(function (authLevel) {
    this._authLevel = authLevel;
  });
userSchema
  .virtual('newVoteUp')
  .get(function () {
    return this._newVoteUp;
  })
  .set(function (newVoteUp) {
    this._newVoteUp = newVoteUp;
  });
userSchema
  .virtual('info')
  .get(function () {
    return this._info;
  })
  .set(function (info) {
    this._info = info;
  });
userSchema
  .virtual('user')
  .get(function () {
    return this._user;
  })
  .set(function (user) {
    this._user = user;
  });

userSchema.methods.extendThreads = async function () {
  const ThreadModel = mongoose.model('threads');
  const recycleId = await mongoose.model('settings').getRecycleId();
  let threads = await ThreadModel.find({
    uid: this.uid,
    fid: { $ne: recycleId },
  })
    .sort({ toc: -1 })
    .limit(8);
  return (this.threads = threads);
};

userSchema.methods.getUsersThreads = async function () {
  const ThreadModel = mongoose.model('threads');
  const recycleId = await mongoose.model('settings').getRecycleId();
  let threads = await ThreadModel.find({
    uid: this.uid,
    fid: { $ne: recycleId },
    recycleMark: { $nin: [true] },
  })
    .sort({ toc: -1 })
    .limit(8);
  return await ThreadModel.extendThreads(threads);
};

/*
 * 拓展多个用户的隐私信息 手机号、邮箱等
 * @param {[Object]} 用户对象组成的数组
 * @return {[Object]} 用户对象组成的数组
 * @author pengxiguaa 2020-9-18
 * */
userSchema.statics.extendUsersSecretInfo = async (users) => {
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const ExamsCategoryModel = mongoose.model('examsCategories');
  const ExamsPaperModel = mongoose.model('examsPapers');
  const proExamsCategories = await ExamsCategoryModel.find({ volume: 'B' });
  const proExamsCategoriesObj = {},
    proExamsCategoriesId = [];
  for (const p of proExamsCategories) {
    proExamsCategoriesId.push(p._id);
    proExamsCategoriesObj[p._id] = p;
  }
  const pubExamsCategories = await ExamsCategoryModel.find({ volume: 'A' });
  const pubExamsCategoriesObj = {},
    pubExamsCategoriesId = [];
  for (const p of pubExamsCategories) {
    pubExamsCategoriesId.push(p._id);
    pubExamsCategoriesObj[p._id] = p;
  }
  const usersId = [],
    usersObj = {};
  for (const user of users) {
    usersId.push(user.uid);
    usersObj[user.uid] = user;
  }
  const usersPersonal = await UsersPersonalModel.find(
    { uid: { $in: usersId } },
    {
      uid: 1,
      mobile: 1,
      nationCode: 1,
      email: 1,
      regIP: 1,
      regPort: 1,
      unverifiedEmail: 1,
      unverifiedMobile: 1,
    },
  );
  const upObj = {};
  usersPersonal.map((up) => (upObj[up.uid] = up));
  const results = [];
  for (const u of users) {
    const user = u.toObject();
    const up = upObj[user.uid];
    if (!up) {
      ThrowServerInternalError(`usersPersonal not found. uid: ${user.uid}`);
    }
    const {
      mobile,
      nationCode,
      email,
      regIP,
      regPort,
      unverifiedEmail,
      unverifiedMobile,
    } = up;
    user.mobile = mobile;
    user.nationCode = nationCode;
    user.email = email;
    user.regIP = regIP;
    user.regPort = regPort;
    user.unverifiedEmail = unverifiedEmail;
    user.unverifiedMobile = unverifiedMobile;
    if (user.volumeA) {
      const paperA = await ExamsPaperModel.findOne({
        uid: user.uid,
        passed: true,
        cid: { $in: pubExamsCategoriesId },
      }).sort({ toc: 1 });
      if (paperA) {
        user.paperA = pubExamsCategoriesObj[paperA.cid];
      }
    }
    if (user.volumeB) {
      const paperB = await ExamsPaperModel.findOne({
        uid: user.uid,
        passed: true,
        cid: { $in: proExamsCategoriesId },
      }).sort({ toc: 1 });
      if (paperB) {
        user.paperB = proExamsCategoriesObj[paperB.cid];
      }
    }
    results.push(user);
  }
  return results;
};
/*
 * 拓展单个用户的隐私信息 手机号、邮箱等
 * @param {Object} 用户对象
 * @return {Object} 用户对象
 * @author pengxiguaa 2020-9-18
 * */
userSchema.statics.extendUserSecretInfo = async (user) => {
  const UserModel = mongoose.model('users');
  const users = await UserModel.extendUsersSecretInfo([user]);
  return users[0];
};

userSchema.methods.extendRoles = async function () {
  const UserModel = mongoose.model('users');
  const RoleModel = mongoose.model('roles');
  const certs = await UserModel.getUserCertsByXSF(this.certs, this.xsf);
  const roles = [];
  for (let cert of certs) {
    const role = await RoleModel.extendRole(cert);
    if (role) {
      roles.push(role);
    }
  }
  return (this.roles = roles);
};

// 用户数据更新
userSchema.methods.updateUserMessage = async function () {
  const PostModel = mongoose.model('posts');
  const ThreadModel = mongoose.model('threads');
  const PostsVoteModel = mongoose.model('postsVotes');
  const UsersScoreLogModel = mongoose.model('usersScoreLogs');

  const { uid } = this;
  // 发帖回帖统计
  const threadCount = await ThreadModel.countDocuments({ uid });
  // const threads = await ThreadModel.find({uid}, {oc: 1, _id: 0});
  // const threadsOc = threads.map(t => t.oc);
  // const threadCount = threads.length;
  const disabledThreadsCount = await ThreadModel.countDocuments({
    uid,
    $or: [
      {
        disabled: true,
      },
      {
        reviewed: { $ne: true },
      },
    ],
  });
  const digestThreadsCount = await ThreadModel.countDocuments({
    uid,
    digest: true,
  });
  const toppedThreadsCount = await ThreadModel.countDocuments({
    uid,
    topped: true,
  });
  const allDigestPostsCount = await PostModel.countDocuments({
    uid,
    digest: true,
  });
  const digestPostsCount = allDigestPostsCount - digestThreadsCount;
  const postCount = await PostModel.countDocuments({ uid, type: 'post' });
  const disabledPostsCount = await PostModel.countDocuments({
    uid,
    type: 'post',
    $or: [
      {
        disabled: true,
      },
      {
        reviewed: { $ne: true },
      },
    ],
  });
  // const postCount = await PostModel.countDocuments({pid: {$nin: threadsOc}, uid});
  // const disabledPostsCount = await PostModel.countDocuments({pid: {$nin: threadsOc}, uid, disabled: true});
  // 日常登录统计
  const dailyLoginCount = await UsersScoreLogModel.countDocuments({
    uid,
    type: 'score',
    operationId: 'dailyLogin',
  });
  // 被赞统计
  /*const recommendCount = await UsersScoreLogModel.countDocuments({
		targetUid: uid,
		type: 'score',
		operationId: 'recommendPost'
	});
	const unRecommendCount = await UsersScoreLogModel.countDocuments({
		targetUid: uid,
		type: 'score',
		operationId: 'UNRecommendPost'
	});
	const recCount = recommendCount - unRecommendCount;*/
  const results = await PostModel.aggregate([
    {
      $match: {
        uid,
        disabled: false,
        'recUsers.0': { $exists: 1 },
      },
    },
    {
      $unwind: '$recUsers',
    },
    {
      $count: 'recCount',
    },
  ]);
  let recCount = 0;
  if (results.length !== 0) {
    recCount = results[0].recCount;
  }
  // 违规统计
  const violationCount = await UsersScoreLogModel.countDocuments({
    uid,
    type: 'score',
    operationId: 'violation',
  });

  const { post: postSource } = await PostsVoteModel.getVoteSources();

  let voteUpCount = await PostsVoteModel.aggregate([
    {
      $match: {
        source: postSource,
        tUid: this.uid,
        type: 'up',
      },
    },
    {
      $group: {
        _id: '$uid',
        count: { $sum: '$num' },
      },
    },
  ]);

  let voteDownCount = await PostsVoteModel.aggregate([
    {
      $match: {
        source: postSource,
        tUid: this.uid,
        type: 'down',
      },
    },
    {
      $group: {
        _id: '$uid',
        count: { $sum: '$num' },
      },
    },
  ]);

  if (!voteUpCount.length) {
    voteUpCount = 0;
  } else {
    voteUpCount = voteUpCount[0].count || 0;
  }
  if (!voteDownCount.length) {
    voteDownCount = 0;
  } else {
    voteDownCount = voteDownCount[0].count || 0;
  }

  const updateObj = {
    threadCount,
    postCount,
    digestPostsCount,
    disabledPostsCount,
    disabledThreadsCount,
    digestThreadsCount,
    toppedThreadsCount,
    recCount,
    dailyLoginCount,
    violationCount,
    voteUpCount,
    voteDownCount,
  };

  await this.updateOne(updateObj);
  for (const key in updateObj) {
    this[key] = updateObj[key];
  }
  await this.calculateScore();
  // await this.tryUpdateNumberOfOtherUserOperation();
};

// 参与用户等级计算的积分
userSchema.methods.calculateScore = async function () {
  const SettingModel = mongoose.model('settings');
  // 积分设置
  const gradeSettings = await SettingModel.getSettings('grade');
  const { coefficients } = gradeSettings;

  const {
    xsf,
    postCount,
    threadCount,
    disabledPostsCount,
    disabledThreadsCount,
    violationCount,
    dailyLoginCount,
    digestThreadsCount,
    digestPostsCount,
    recCount,
  } = this;
  // 积分计算
  const scoreOfPostToThread =
    coefficients.postToThread * (postCount - disabledPostsCount);
  const scoreOfPostToForum =
    coefficients.postToForum * (threadCount - disabledThreadsCount);
  const scoreOfDigestThreadCount = coefficients.digest * digestThreadsCount;
  const scoreOfDigestPostCount = coefficients.digestPost * digestPostsCount;
  const scoreOfXsf = coefficients.xsf * xsf;
  const scoreOfDailyLogin = coefficients.dailyLogin * dailyLoginCount;
  const scoreOfViolation = coefficients.violation * violationCount;
  let scoreOfRecommend = 0;
  if (recCount >= 0) {
    scoreOfRecommend = coefficients.thumbsUp * Math.sqrt(recCount);
  }
  const score =
    scoreOfDailyLogin +
    scoreOfDigestThreadCount +
    scoreOfDigestPostCount +
    scoreOfPostToForum +
    scoreOfPostToThread +
    scoreOfXsf +
    scoreOfRecommend +
    scoreOfViolation;
  await this.updateOne({ score });
};

/*
 * 保存用户时向搜索数据库存入用户数据
 * @author pengxiguaa 2019-8-16
 * */
userSchema.pre('save', async function (next) {
  const UserModel = mongoose.model('users');
  await UserModel.saveUserToElasticSearch(this);
  await next();
});

/*
 * 创建用户
 * @param {Object} option 三张表（users, usersPersonal, usersGenera）的属性
 * @return {Object} user对象
 * @author pengxiguaa 2019-8-16
 * */
userSchema.statics.createUser = async (option) => {
  const apiFunction = require('../nkcModules/apiFunction');
  const UserModel = mongoose.model('users');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const SubscribeModel = mongoose.model('subscribes');
  const SettingModel = mongoose.model('settings');
  const UsersGeneraModel = mongoose.model('usersGeneral');
  const SubscribeTypeModel = mongoose.model('subscribeTypes');
  const SystemInfoLogModel = mongoose.model('systemInfoLogs');
  const serverSettings = await SettingModel.getSettings('server');
  const userObj = Object.assign({}, option);

  const toc = Date.now();

  // 支持手动传uid，应对批量导入用户
  if (!Reflect.has(userObj, 'uid')) {
    userObj.uid = await SettingModel.operateSystemID('users', 1);
  }
  let { uid } = userObj;
  userObj.toc = toc;
  userObj.tlv = toc;
  userObj.tlm = toc;
  userObj.secret = apiFunction.getRandomString('aA0', 64);
  userObj.certs = [];
  // 生成默认用户名，符号"-"和uid保证此用户名全局唯一
  if (!userObj.username) {
    userObj.username = `${serverSettings.websiteCode}-${uid}`;
  }
  userObj.usernameLowerCase = userObj.username.toLowerCase();
  if (userObj.password) {
    const newPassword = apiFunction.newPasswordObject(userObj.password);
    userObj.password = newPassword.password;
    userObj.secret = newPassword.secret;
    userObj.hashType = newPassword.hashType;
  }

  const user = UserModel(userObj);
  const userPersonal = UsersPersonalModel({
    ...userObj,
    secret: [userObj.secret],
  });
  const userGeneral = UsersGeneraModel({ uid });

  // 生成关注专业记录
  const { defaultSubscribeForumsId } = await SettingModel.getSettings(
    'register',
  );
  try {
    await user.save();
    await userPersonal.save();
    await userGeneral.save();

    // 创建默认关注分类
    // 2019/11/21 创建“个人中心”时移除
    // await SubscribeModel.createDefaultType("post", uid);
    // await SubscribeModel.createDefaultType("replay", uid);

    // 创建默认数据 关注专业
    for (const fid of defaultSubscribeForumsId) {
      const sub = SubscribeModel({
        _id: await SettingModel.operateSystemID('subscribes', 1),
        uid,
        type: 'forum',
        fid,
      });
      await sub.save();
    }
    // 创建默认数据 查看系统通知的记录
    /*const systemInfo = await MessageModel.find({ty: 'STE'}, {_id: 1});
		for(const s of systemInfo) {
      const log = SystemInfoLogModel({
        mid: s._id,
        uid
      });
      await log.save();
    }*/
  } catch (error) {
    await UserModel.deleteOne({ uid });
    await UsersPersonalModel.deleteOne({ uid });
    await UsersGeneraModel.deleteOne({ uid });
    await SystemInfoLogModel.deleteOne({ uid });
    await SubscribeModel.deleteMany({
      uid,
      type: 'forum',
      fid: { $in: defaultSubscribeForumsId },
    });
    await SubscribeTypeModel.deleteMany({ uid });
    ThrowServerInternalError(
      `Failed to create user: ${error.message || error}`,
    );
  }
  return user;
};

userSchema.methods.extendDraftCount = async function () {
  return (this.draftCount = await mongoose
    .model('drafts')
    .countDocuments({ uid: this.uid }));
};

/*
 * 拓展用户专栏文章数量
 * */
userSchema.methods.extendColumnAndZoneThreadCount = async function () {
  const ArticleModel = mongoose.model('articles');
  const CommentModel = mongoose.model('comments');
  const MomentModel = mongoose.model('moments');
  const ColumnPostModel = mongoose.model('columnPosts');
  await this.updateUserMessage();
  const { zone: zoneSource } = await ArticleModel.getArticleSources();
  const { normal, disabled } = await ArticleModel.getArticleStatus();
  const momentStatus = await MomentModel.getMomentStatus();
  const momentQuoteType = await MomentModel.getMomentQuoteTypes();
  this.momentCount = await MomentModel.countDocuments({
    uid: this.uid,
    status: momentStatus.normal,
    parent: '',
    quoteType: {
      $in: ['', momentQuoteType.article, momentQuoteType.moment],
    },
  });
  this.timelineCount = await MomentModel.countDocuments({
    uid: this.uid,
    status: momentStatus.normal,
    parent: '',
  });
  this.columnThreadCount = 0;
  this.disabledColumnThreadCount = 0;
  //查找用户专栏信息
  if (this.column) {
    this.columnThreadCount = await ColumnPostModel.countDocuments({
      tUid: this.uid,
      hidden: false,
      columnId: this.column._id,
    });
    this.disabledColumnThreadCount = await ColumnPostModel.countDocuments({
      tUid: this.uid,
      hidden: true,
      columnId: this.column._id,
    });
  }
  this.zoneThreadCount = await ArticleModel.countDocuments({
    uid: this.uid,
    source: zoneSource,
    status: normal,
  });
  this.disabledZoneThreadCount = await ArticleModel.countDocuments({
    uid: this.uid,
    source: zoneSource,
    status: disabled,
  });
  this.commentCount = await CommentModel.countDocuments({
    uid: this.uid,
    status: normal,
  });
};

userSchema.methods.extendGrade = async function () {
  const UsersGradeModel = mongoose.model('usersGrades');
  let userScore = this.score || 0;
  const grades = await UsersGradeModel.getGradesSortByScore(-1);

  let grade = null;
  for (const g of grades) {
    if (userScore > g.score) {
      grade = g;
      break;
    }
  }

  if (grade === null) {
    grade = grades[grades.length - 1];
  }

  grade.iconUrl = await UsersGradeModel.getIconUrl(grade._id);

  return (this.grade = grade);
};
/*
  拓展全局设置
  @author pengxiguaa 2019/3/6
*/
userSchema.methods.extendGeneralSettings = async function () {
  return (this.generalSettings = await mongoose
    .model('usersGeneral')
    .findOnly({ uid: this.uid }));
};
/*
  验证用户是否完善资料，包括：用户名、密码
  未完善则会抛出错误
  @author pengxiguaa 2019/3/7
*/
userSchema.methods.ensureUserInfo = async function () {
  if (!this.username) {
    ThrowCommonError(
      403,
      '你的账号还未完善资料，请前往资料设置页完善必要资料。',
    );
  }
};

/*
 * 获取用户未读消息总数
 * */
userSchema.methods.getUnreadMessageCount = async function () {
  const {
    newSystemInfoCount,
    newApplicationsCount,
    newReminderCount,
    newUsersMessagesCount,
  } = await this.getNewMessagesCount();
  return (
    newSystemInfoCount +
    newApplicationsCount +
    newReminderCount +
    newUsersMessagesCount
  );
};

userSchema.methods.getNewMessagesCount = async function () {
  const MessageModel = mongoose.model('messages');
  const FriendsApplicationModel = mongoose.model('friendsApplications');
  const SystemInfoLogModel = mongoose.model('systemInfoLogs');
  const UsersGeneralSettings = mongoose.model('usersGeneral');
  const { messageSettings } = await UsersGeneralSettings.findOnly(
    {
      uid: this.uid,
    },
    {
      messageSettings: 1,
    },
  );
  const { newFriends, systemInfo, reminder } = messageSettings.chat;
  // 系统通知
  let newSystemInfoCount = 0;
  let newApplicationsCount = 0;
  let newReminderCount = 0;
  if (systemInfo) {
    const mySystemInfoMessagesId =
      await MessageModel.getUserSystemInfoMessagesId(this.uid);
    const allMySystemInfoMessageCount = mySystemInfoMessagesId.length;
    const viewedSystemInfoCount = await SystemInfoLogModel.countDocuments({
      uid: this.uid,
      mid: {
        $in: mySystemInfoMessagesId,
      },
    });
    newSystemInfoCount = allMySystemInfoMessageCount - viewedSystemInfoCount;
    // 可能会生成多条相同的阅读记录 以下判断用于消除重复的数据
    if (newSystemInfoCount < 0) {
      const systemInfoLog = await SystemInfoLogModel.aggregate([
        {
          $match: {
            uid: this.uid,
          },
        },
        {
          $group: {
            _id: '$mid',
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      for (const log of systemInfoLog) {
        if (log.count <= 1) {
          continue;
        }
        const logs = await SystemInfoLogModel.find({
          mid: log._id,
          uid: this.uid,
        });
        for (let i = 0; i < logs.length; i++) {
          if (i > 0) {
            await logs[i].deleteOne();
          }
        }
      }
    }
  }

  // 系统提醒
  if (reminder) {
    newReminderCount = await MessageModel.countDocuments({
      ty: 'STU',
      r: this.uid,
      vd: false,
    });
  }
  // 添加好友
  if (newFriends) {
    newApplicationsCount = await FriendsApplicationModel.countDocuments({
      agree: 'null',
      respondentId: this.uid,
    });
  }
  // 用户信息
  const newUsersMessagesCount = await MessageModel.countDocuments({
    ty: 'UTU',
    s: { $ne: this.uid },
    r: this.uid,
    vd: false,
  });
  return {
    newSystemInfoCount,
    newApplicationsCount,
    newReminderCount,
    newUsersMessagesCount,
  };
};

userSchema.methods.getMessageLimit = async function () {
  const grade = await this.extendGrade();
  const roles = await this.extendRoles();
  let { messagePersonCountLimit, messageCountLimit } = grade;
  for (const role of roles) {
    const personLimit = role.messagePersonCountLimit;
    const messageLimit = role.messageCountLimit;
    if (personLimit > messagePersonCountLimit) {
      messagePersonCountLimit = personLimit;
    }
    if (messageLimit > messageCountLimit) {
      messageCountLimit = messageLimit;
    }
  }
  return {
    messagePersonCountLimit,
    messageCountLimit,
  };
};
/*
 * 根据用户等级以及拥有的证书获取用户每天发表内容的最大条数和发表的最小间隔时间。
 * @author pengxiguaa 2019-9-27
 * */
userSchema.methods.getPostLimit = async function () {
  const grade = await this.extendGrade();
  const roles = await this.extendRoles();
  let arr = [];

  for (const role of roles) {
    if (role._id === 'default') {
      arr.push(grade);
    } else {
      arr.push(role);
    }
  }
  let postToForumCountLimit = 0,
    postToForumTimeLimit = 9999999999,
    postToThreadCountLimit = 0,
    postToThreadTimeLimit = 9999999999;

  for (const item of arr) {
    // 读取"发表文章次数"最大值。
    if (item.postToForum.countLimit.unlimited) {
      postToForumCountLimit = 9999999999;
    } else if (postToForumCountLimit < item.postToForum.countLimit.num) {
      postToForumCountLimit = item.postToForum.countLimit.num;
    }
    // 读取"发表回复次数"最大值。
    if (item.postToThread.countLimit.unlimited) {
      postToThreadCountLimit = 9999999999;
    } else if (postToThreadCountLimit < item.postToThread.countLimit.num) {
      postToThreadCountLimit = item.postToThread.countLimit.num;
    }
    // 读取"发表文章间隔时间"最小值。
    if (item.postToForum.timeLimit.unlimited) {
      postToForumTimeLimit = 0;
    } else if (postToForumTimeLimit > item.postToForum.timeLimit.num) {
      postToForumTimeLimit = item.postToForum.timeLimit.num;
    }
    // 读取"发表回复间隔时间"最小值。
    if (item.postToThread.timeLimit.unlimited) {
      postToThreadTimeLimit = 0;
    } else if (postToThreadTimeLimit > item.postToThread.timeLimit.num) {
      postToThreadTimeLimit = item.postToThread.timeLimit.num;
    }
  }

  return {
    postToForumTimeLimit,
    postToForumCountLimit,
    postToThreadCountLimit,
    postToThreadTimeLimit,
  };
};

/*
  拓展用户基本信息，显示在用户面板中，任何人可见的内容
  @param users: 用户对象数组
  @author pengxiguaa 2019/2/27
*/
userSchema.statics.extendUsersInfo = async (users) => {
  const UserModel = mongoose.model('users');
  const ColumnModel = mongoose.model('columns');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const nkcRender = require('../nkcModules/nkcRender');
  const { getUrl } = require('../nkcModules/tools');
  const uid = new Set(),
    personalObj = {};
  for (const user of users) {
    uid.add(user.uid);
  }
  const usersPersonal = await UsersPersonalModel.find(
    { uid: { $in: [...uid] } },
    { uid: 1, mobile: 1, nationCode: 1, email: 1 },
  );
  for (const personal of usersPersonal) {
    personalObj[personal.uid] = personal;
  }

  const columns = await ColumnModel.find({ uid: { $in: [...uid] } });
  const columnsObj = {};
  for (const column of columns) {
    columnsObj[column.uid] = column;
  }
  const users_ = []; // 普通对象
  for (const user of users) {
    const userPersonal = personalObj[user.uid];
    const hasMobile =
      !!userPersonal && !!userPersonal.mobile && !!userPersonal.nationCode;
    const hasEmail = !!userPersonal && !!userPersonal.email;
    const certs = await UserModel.getUserCertsByXSF(user.certs, user.xsf);
    const certsName = await UserModel.getUserCertsNameByCerts(
      certs,
      hasMobile,
      hasEmail,
    );
    const column = columnsObj[user.uid];
    if (column) {
      user.column = {
        _id: column._id,
        name: column.name,
        banner: column.banner,
        avatar: column.avatar,
        abbr: column.abbr,
        subCount: column.subCount,
        closed: column.closed,
      };
    }
    user.info = {
      certsName: certsName.join(' '),
    };

    if (!user.grade && user.extendGrade) {
      await user.extendGrade();
    }
    const _user = user.toObject ? user.toObject() : user;
    _user.description = nkcRender.replaceLink(_user.description);
    users_.push({ ..._user, avatarUrl: getUrl('userAvatar', _user.avatar) });
  }
  return users_;
};

userSchema.methods.extendUserColumn = async function () {
  const ColumnModel = mongoose.model('columns');
  const column = await ColumnModel.findOne(
    { uid: this.uid },
    {
      _id: 1,
      name: 1,
      banner: 1,
      avatar: 1,
      abbr: 1,
      subCount: 1,
      closed: 1,
    },
  );
  if (column) {
    this.column = column;
  }
  return column;
};

userSchema.statics.extendUserInfo = async function (user) {
  const UserModel = mongoose.model('users');
  const users = await UserModel.extendUsersInfo([user]);
  return users[0];
};

/*
 * 拓展并返回用户的身份认证等级
 * @return {Number} 身份认证等级
 * @author pengxiguaa 2019-8-16
 * */
userSchema.methods.extendAuthLevel = async function () {
  const userPersonal = await mongoose
    .model('usersPersonal')
    .findUsersPersonalById(this.uid);
  return (this.authLevel = await userPersonal.getAuthLevel());
};

/*
  通过uid查找单一用户
  @param uid: 用户ID
  @author pengxiguaa 2019/3/7
*/
userSchema.statics.findById = async (uid) => {
  const UserModel = mongoose.model('users');
  const user = await UserModel.findOne({ uid });
  if (!user) {
    ThrowCommonError(404, `未找到ID为【${uid}】的用户`);
  }
  return user;
};

/*
 * 根据用户的kcb转账记录 计算用户的科创币总量 并将计算结果写到user.kcb
 * @param {String} uid 用户ID
 * @author pengxiguaa 2019-4-4
 * */
userSchema.statics.updateUserKcb = async (uid) => {
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  const KcbsRecordModel = mongoose.model('kcbsRecords');
  // 聚合 查找出用户的科创币转账记录并将num全部相加输出为total
  // 查找出当前用户的所有科创币转账记录
  const fromRecords = await KcbsRecordModel.aggregate([
    {
      $match: {
        from: uid,
        verify: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$num',
        },
      },
    },
  ]);
  const toRecords = await KcbsRecordModel.aggregate([
    {
      $match: {
        to: uid,
        verify: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$num',
        },
      },
    },
  ]);
  const expenses = fromRecords.length ? fromRecords[0].total : 0;
  const income = toRecords.length ? toRecords[0].total : 0;
  const total = income - expenses;
  if (uid === 'bank') {
    await SettingModel.updateOne(
      { _id: 'kcb' },
      {
        $set: {
          'c.totalMoney': total,
        },
      },
    );
  } else {
    await UserModel.updateOne(
      {
        uid,
      },
      {
        $set: {
          kcb: total,
        },
      },
    );
  }
  return total;
};
/*
 * 更新用户的kcb
 * 该方法位于user对象
 * @author pengxiguaa 2019-4-15
 * */
userSchema.methods.updateKcb = async function () {
  const UserModel = mongoose.model('users');
  this.kcb = await UserModel.updateUserKcb(this.uid);
};
/*
 * 验证用户是否还能关注相应的内容
 * @param {String} type 关注的类型 user: 关注用户, forum: 关注专业, thread: 关注文章
 * @author pengxiguaa 2019-4-24
 * */
userSchema.methods.ensureSubLimit = async function (type) {
  const SubscribeModel = mongoose.model('subscribes');
  const SettingModel = mongoose.model('settings');
  const subSettings = await SettingModel.findById('subscribe');
  const {
    subUserCountLimit,
    subForumCountLimit,
    subThreadCountLimit,
    subColumnCountLimit,
  } = subSettings.c;
  if (type === 'user') {
    if (subUserCountLimit <= 0) {
      ThrowCommonError(400, '关注用户功能已关闭');
    }
    const userCount = await SubscribeModel.countDocuments({
      uid: this.uid,
      cancel: false,
      type: 'user',
    });
    if (userCount >= subUserCountLimit) {
      ThrowCommonError(400, '关注用户数量已达上限');
    }
  } else if (type === 'forum') {
    if (subForumCountLimit <= 0) {
      ThrowCommonError(400, '关注专业已关闭');
    }
    const forumCount = await SubscribeModel.countDocuments({
      uid: this.uid,
      cancel: false,
      type: 'forum',
    });
    if (forumCount >= subForumCountLimit) {
      ThrowCommonError(400, '关注专业数量已达上限');
    }
  } else if (type === 'thread') {
    if (subThreadCountLimit <= 0) {
      ThrowCommonError(400, '关注文章功能已关闭');
    }
    const threadCount = await SubscribeModel.countDocuments({
      uid: this.uid,
      cancel: false,
      type: 'thread',
    });
    if (threadCount >= subThreadCountLimit) {
      ThrowCommonError(400, '关注文章数量已达上限');
    }
  } else if (type === 'column') {
    if (subColumnCountLimit <= 0) {
      ThrowCommonError(400, '关注专栏功能已关闭');
    }
    const columnCount = await SubscribeModel.countDocuments({
      uid: this.uid,
      cancel: false,
      type: 'column',
    });
    if (columnCount >= subColumnCountLimit) {
      ThrowCommonError(400, '关注专栏数量已达上限');
    }
  } else {
    ThrowCommonError(500, `未知的type类型：${type}`);
  }
};

userSchema.statics.getUserPostSummary = async (uid) => {
  const PostModel = mongoose.model('posts');
  const recycleId = await mongoose.model('settings').getRecycleId();
  const data = await PostModel.aggregate([
    {
      $match: {
        mainForumsId: {
          $nin: [recycleId],
        },
        uid,
        disabled: false,
      },
    },
    {
      $unwind: '$mainForumsId',
    },
    {
      $group: {
        _id: '$mainForumsId',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
  const forumsId = data.map((d) => d._id);
  const forums = await mongoose.model('forums').find(
    { fid: { $in: forumsId } },
    {
      displayName: 1,
      fid: 1,
      color: 1,
    },
  );
  const forumsObj = {};
  for (const forum of forums) {
    forumsObj[forum.fid] = forum;
  }
  const results = [];
  let otherCount = 0;
  for (const d of data) {
    const forum = forumsObj[d._id];
    if (!forum) {
      continue;
    }
    // 超过10 则归为"其他"分类
    if (results.length >= 20) {
      otherCount += d.count;
    } else {
      results.push({
        forumName: forum.displayName,
        fid: forum.fid,
        count: d.count,
        color: forum.color || '#aaa',
      });
    }
  }
  if (otherCount > 0) {
    results.push({
      forumName: '其他',
      fid: '',
      count: otherCount,
      color: '#aaa',
    });
  }
  return results;
};
/*
 * 获取用户的信息好友ID
 * @param {String} uid 用户ID
 * @return {[String]} 好友ID数组
 * @author pengxiguaa 2019-5-9
 * */
userSchema.statics.getUsersFriendsId = async (uid) => {
  const FriendModel = mongoose.model('friends');
  const friends = await FriendModel.find({ uid });
  return friends.map((c) => c.tUid);
};

/**
 * 判断用户是否上传了头像
 * @param {String} attachId 附件id
 * @return {Boolean} 是否上传
 */
userSchema.statics.uploadedAvatar = async (attachId) => {
  if (!attachId) {
    return false;
  }
  const AM = mongoose.model('attachments');
  return await AM.findOne({ _id: attachId });

  /*try{
    const filePath = await attachment.getFilePath();
    return await FILE.access(filePath);
    // existsSync(filePath);
  } catch(err) {
    return false;
  }*/
};

/**
 * 判断用户是否上传了背景
 * @param {String} attachId 附件id
 * @return {Boolean} 是否上传
 */
userSchema.statics.uploadedBanner = async (attachId) => {
  if (!attachId) {
    return false;
  }
  const AM = mongoose.model('attachments');
  const FILE = require('../nkcModules/file');
  const attachment = await AM.findOne({ _id: attachId });
  if (!attachment) {
    return false;
  }
  try {
    const filePath = await attachment.getFilePath();
    // return existsSync(filePath);
    return await FILE.access(filePath);
  } catch (err) {
    return false;
  }
};

/*
 * 验证用户是否已完善基本信息
 * 信息种类：用户名、头像、绑定手机号
 * @param {String/Object} uid 用户id/用户对象
 * @author pengxiguaa 2019-5-13
 * */
userSchema.statics.checkUserBaseInfo = async (uid, singleError) => {
  const UserModel = mongoose.model('users');
  const baseInfoStatus = await UserModel.getUserBaseInfoStatus(uid);
  if (!baseInfoStatus.status) {
    if (singleError) {
      let errorInfo = '';
      if (!baseInfoStatus.avatar) {
        errorInfo = '未上传头像';
      }
      if (!baseInfoStatus.username) {
        errorInfo = '未设置用户名';
      }
      if (!baseInfoStatus.mobile) {
        errorInfo = '未绑定手机号';
      }
      ThrowCommonError(403, errorInfo);
    } else {
      const TE = require('../nkcModules/throwError');
      TE(403, baseInfoStatus, 'userBaseInfo');
    }
  }
};
/*
 * 检测用户基本信息的完善状态
 * @param {String/Object} uid 用户id/用户对象
 * @return {Object} 各种信息的状态
 * @author pengxiguaa 2019-8-21
 * */
userSchema.statics.getUserBaseInfoStatus = async (uid) => {
  let user;
  const UserModel = mongoose.model('users');
  if (uid instanceof String) {
    user = await UserModel.findById(uid);
  } else {
    user = uid;
  }
  const userPersonal = await mongoose
    .model('usersPersonal')
    .findOnly({ uid: user.uid });
  const result = {
    username: !!user.username,
    // description: !!user.description,
    avatar: await UserModel.uploadedAvatar(user.avatar),
    // banner: await UserModel.uploadedBanner(user.banner),
    mobile: !!(userPersonal.mobile && userPersonal.nationCode),
    // email: !!userPersonal.email,
    // password: !!(userPersonal.password.hash && userPersonal.password.salt)
  };
  result.status = result.username && result.avatar && result.mobile;
  return result;
};

/*
 * 获取用户能修改post的最大时间
 * @param {String/Object} uid 用户ID或用户对象
 * @return {Number} 最大时间（-1为不限制）
 * @author pengxiguaa 2019-6-10
 * */
userSchema.statics.getModifyPostTimeLimit = async (uid) => {
  if (!uid) {
    return 0;
  }
  let user;
  if (uid instanceof String) {
    user = await mongoose.model('users').findById(uid);
  } else {
    user = uid;
  }
  if (!user.roles) {
    await user.extendRoles();
  }
  if (!user.grade) {
    await user.extendGrade();
  }
  let modifyPostTimeLimit = 0;
  for (const role of user.roles) {
    if (role.modifyPostTimeLimit === -1) {
      return -1;
    } else if (role.modifyPostTimeLimit > modifyPostTimeLimit) {
      modifyPostTimeLimit = role.modifyPostTimeLimit;
    }
  }
  return modifyPostTimeLimit;
};

/*
 * 判断用户发表的文章或回复是否需要审核
 * @param {String} uid 用户ID
 * @param {String} type 内容类型 post: 回复，thread: 文章
 * @return {Boolean} 是否需要审核
 * @author pengxiguaa 2019-5-31
 * */
userSchema.statics.contentNeedReview = async (uid, type) => {
  if (!['post', 'thread'].includes(type)) {
    ThrowServerInternalError(`未知的审核类型: ${type}`);
  }
  const UserModel = mongoose.model('users');
  const ThreadModel = mongoose.model('threads');
  const PostModel = mongoose.model('posts');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const SettingModel = mongoose.model('settings');
  const recycleId = await SettingModel.getRecycleId();

  const user = await UserModel.findOne({ uid });
  if (!user) {
    ThrowServerInternalError('在判断内容是否需要审核的时候，发现未知的uid');
  }
  const reviewSettings = (await SettingModel.findById('review')).c;
  const review = reviewSettings[type];

  // 一、特殊限制
  const { whitelistUid, blacklistUid } = review.special;
  // 1. 白名单
  if (whitelistUid.includes(uid)) {
    return false;
  }
  // 2. 黑名单
  if (blacklistUid.includes(uid)) {
    return true;
  }

  // 二、白名单（用户证书和用户等级）
  const { gradesId, certsId } = review.whitelist;
  await user.extendGrade();
  if (gradesId.includes(user.grade._id)) {
    return false;
  }
  await user.extendRoles();
  for (const role of user.roles) {
    if (certsId.includes(role._id)) {
      return false;
    }
  }

  // 三、黑名单（海外手机号、未通过A卷和用户等级）
  let passedCount;
  if (type === 'post') {
    passedCount = await PostModel.countDocuments({
      disabled: false,
      reviewed: true,
      uid,
    });
  } else {
    passedCount = await ThreadModel.countDocuments({
      disabled: false,
      reviewed: true,
      mainForumsId: { $ne: recycleId },
      uid,
    });
  }
  const { grades, notPassedA, foreign } = review.blacklist;
  const userPersonal = await UsersPersonalModel.findOnly({ uid });

  // 开启了海外手机号用户发表需审核
  // 用户绑定了海外手机号
  // 用户通过审核的数量小于设置的数量
  // 满足的用户所发表的文章 需要审核
  if (foreign.status && userPersonal.nationCode !== '86') {
    if (foreign.type === 'all' || foreign.count > passedCount) {
      return true;
    }
  }

  // 开启了未通过A卷考试的用户发表需审核
  // 用户没有通过A卷考试
  // 用户通过审核的数量小于设置的数量
  // 满足以上的用户所发表的文章 需要审核
  if (notPassedA.status && !user.volumeA) {
    if (notPassedA.type === 'all' || notPassedA.count > passedCount) {
      return true;
    }
  }

  let grade;
  for (const g of grades) {
    if (g.gradeId === user.grade._id) {
      grade = g;
    }
  }
  if (!grade) {
    ThrowServerInternalError(
      '系统无法确定您账号的等级信息，请点击页脚下的报告问题，告知网站管理员。',
    );
  }
  if (grade.status) {
    // 目前调取的地方都在发表相应内容之后，所以用户已发表内容的数量需要-1
    if (grade.type === 'all' || grade.count > passedCount - 1) {
      return true;
    }
  }

  // 四、未验证手机号码的用户发表文章要送审
  return !!(await UsersPersonalModel.shouldVerifyPhoneNumber(uid));
};

/**
 * 发表限制检测
 * @param {Object} user 用户Id
 */
userSchema.statics.publishingCheck = async (user) => {
  const SettingModel = mongoose.model('settings');
  const ThreadModel = mongoose.model('threads');
  const postSettings = await SettingModel.findOnly({ _id: 'post' });
  const { authLevelMin, exam } = postSettings.c.postToForum;
  const { volumeA, volumeB, notPass } = exam;
  const { status, countLimit, unlimited } = notPass;
  const apiFunction = require('../nkcModules/apiFunction');
  const today = apiFunction.today();
  const todayThreadCount = await ThreadModel.countDocuments({
    toc: { $gt: today },
    uid: user.uid,
  });
  await user.extendAuthLevel();
  if (authLevelMin > user.authLevel) {
    ThrowCommonError(
      403,
      `身份认证等级未达要求，发表文章至少需要完成身份认证 ${authLevelMin}`,
    );
  }
  // ab卷考试是否开启或通过
  if ((!volumeB || !user.authLevel) && (!volumeA || !user.volumeA)) {
    if (!status) {
      ThrowCommonError(403, '权限不足，请提升账号等级');
    }
    if (!unlimited && countLimit <= todayThreadCount) {
      ThrowCommonError(403, `今日发表文章次数已用完，请明天再试。`);
    }
  }
  // 发表回复时间、条数限制检查
  const { postToForumCountLimit, postToForumTimeLimit } =
    await user.getPostLimit();
  if (todayThreadCount >= postToForumCountLimit) {
    ThrowCommonError(
      400,
      `您当前的账号等级每天最多只能发表${postToForumCountLimit}篇文章，请明天再试。`,
    );
  }
  const latestThread = await ThreadModel.findOne({
    uid: user.uid,
    toc: { $gt: Date.now() - postToForumTimeLimit * 60 * 1000 },
  });
  if (latestThread) {
    ThrowCommonError(
      400,
      `您当前的账号等级限定发表文章间隔时间不能小于${postToForumTimeLimit}分钟，请稍后再试。`,
    );
  }
};

/*
 * 验证用户是否有权限开设专栏
 * @param {String/Object} uid 用户ID/用户对象
 * @return {Boolean} 是否有权限
 * @author pengxiguaa 2019-6-26
 * */
userSchema.statics.ensureApplyColumnPermission = async (uid) => {
  let user;
  if (typeof uid === 'string') {
    user = await mongoose.model('users').findOne({ uid });
  } else {
    user = uid;
  }
  if (!user) {
    return false;
  }
  const columnSettings = await mongoose.model('settings').getSettings('column');
  const { xsfCount, digestCount, userGrade, threadCount } = columnSettings;
  if (user.xsf < xsfCount) {
    return false;
  }
  if (!user.grade) {
    await user.extendGrade();
  }
  if (!userGrade.includes(user.grade._id)) {
    return false;
  }
  const userThreadCount = await mongoose.model('threads').countDocuments({
    uid: user.uid,
    disabled: false,
    recycleMark: { $ne: true },
    reviewed: true,
  });
  if (userThreadCount < threadCount) {
    return false;
  }
  const count = await mongoose.model('threads').countDocuments({
    uid: user.uid,
    digest: true,
    disabled: false,
    recycleMark: { $ne: true },
    reviewed: true,
  });
  return count >= digestCount;
};
/*
 * 验证用户是否有权限发表匿名内容
 * @param {String} uid 用户ID
 * @param {String} type thread: 发表文章, post: 发表回复
 * @param {[String]} forumsId 专业ID组成的数组, 若不传该参数则默认全部专业都允许发表匿名内容
 * @return {Boolean} 是否有权
 * @author pengxiguaa 2019-8-8
 * */
userSchema.statics.havePermissionToSendAnonymousPost = async (
  type,
  userId,
  forumsId,
) => {
  if (!['postToForum', 'postToThread'].includes(type)) {
    return false;
  }
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  const ForumModel = mongoose.model('forums');
  if (!userId) {
    return false;
  }
  const postSettings = await SettingModel.getSettings('post');
  const { uid, status, defaultCertGradesId, rolesId } =
    postSettings[type].anonymous;
  if (!status) {
    return false;
  }
  if (forumsId) {
    const forumCount = await ForumModel.countDocuments({
      fid: { $in: forumsId },
      allowedAnonymousPost: true,
    });
    if (forumCount === 0) {
      return false;
    }
  }
  const user = await UserModel.findOne({ uid: userId });
  if (!user) {
    return false;
  }
  if (uid.includes(userId)) {
    return true;
  }
  for (const certId of user.certs) {
    if (certId !== 'default' && rolesId.includes(certId)) {
      return true;
    }
  }
  if (rolesId.includes('default')) {
    await user.extendGrade();
    return defaultCertGradesId.includes(user.grade._id);
  } else {
    return false;
  }
};

/*
 * 获取用户的专栏
 * @param {String} uid 用户ID
 * @return {Object} 专栏对象
 * */
userSchema.statics.getUserColumn = async (uid) => {
  if (!uid) {
    return null;
  }
  return await mongoose.model('columns').findOne({ uid, closed: false });
};

/*
 * 判断用户是否有足够的科创币修改用户名
 * @param {String} uid 用户ID
 * @return {Number} 花费的科创币
 * @author pengxiguaa 2019-8-21
 * */
/*userSchema.statics.checkModifyUsername = async (uid) => {
  const user = await mongoose.model("users").findOnly({uid});
  user.kcb = await mongoose.model("users").updateUserKcb(uid);
  const usersGeneral = await mongoose.model("usersGeneral").findOnly({uid});
  const usernameSettings = await mongoose.model("settings").getSettings("username");
  if(usernameSettings.free) return 0;
  const reduce = usersGeneral.modifyUsernameCount + 1 - usernameSettings.freeCount;
  if(reduce <= 0) return 0;
  let kcb;
  if(reduce*usernameSettings.onceKcb < usernameSettings.maxKcb) {
    kcb = reduce*usernameSettings.onceKcb;
  } else {
    kcb = usernameSettings.maxKcb;
  }
  if(user.kcb < kcb)
    throwErr(400, "科创币不足");
  return kcb;
};*/

/**
 * 判断用户是否有足够的积分修改用户名，并返回花费的积分和所需积分数
 * @param {String} uid 用户id
 */
userSchema.statics.checkModifyUsernameScore = async (uid) => {
  let UserModel = mongoose.model('users');
  let SettingModel = await mongoose.model('settings');
  // 全局用户名设置
  let usernameSettings = await SettingModel.getSettings('username');
  let usersGeneral = await mongoose.model('usersGeneral').findOnly({ uid });
  // 如果是免费修改用户名
  if (usernameSettings.free) {
    return 0;
  }
  // 花积分改名的次数
  const reduce =
    usersGeneral.modifyUsernameCount + 1 - usernameSettings.freeCount;
  // 如果从来没有花积分改名
  if (reduce <= 0) {
    return 0;
  }
  // 更新此用户的各项积分
  await UserModel.updateUserScores(uid);
  // 修改用户名需要使用哪种积分
  let scoreObject = await SettingModel.getScoreByOperationType('usernameScore');
  // 此用户此类型积分剩余多少
  let myScore = await UserModel.getUserScore(uid, scoreObject.type);
  // 此次改名需要花费
  let score;
  if (reduce * usernameSettings.onceKcb < usernameSettings.maxKcb) {
    score = reduce * usernameSettings.onceKcb;
  } else {
    score = usernameSettings.maxKcb;
  }
  if (myScore < score) {
    ThrowCommonError(400, `${scoreObject.name}不足`);
  }
  return {
    scoreObject,
    needScore: score, // 此次改名所需积分数
  };
};

/*
 * 验证发表文章权限，编辑器提示。
 * */
userSchema.statics.ensurePostThreadPermission = async (uid) => {
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  const ThreadModel = mongoose.model('threads');
  const apiFunction = require('../nkcModules/apiFunction');
  const user = await UserModel.findOne({ uid });
  if (!user) {
    return ThrowServerInternalError(`未找到ID为${uid}的用户信息`);
  }
  await user.extendAuthLevel();
  const postSettings = await SettingModel.getSettings('post');
  let { authLevelMin, exam } = postSettings.postToForum;
  authLevelMin = Number(authLevelMin);
  const { volumeA, volumeB, notPass } = exam;
  const { status, countLimit, unlimited } = notPass;
  const today = apiFunction.today();
  const todayCount = await ThreadModel.countDocuments({
    toc: { $gt: today },
    uid: user.uid,
  });
  if (authLevelMin > user.authLevel) {
    if (authLevelMin === 1) {
      ThrowCommonError(403, '你还未绑定手机号');
    }
    if (authLevelMin === 2) {
      ThrowCommonError(403, '你还未完成身份认证2');
    }
    if (authLevelMin === 3) {
      ThrowCommonError(403, '你还未完成身份认证3');
    }
  }
  if (user.volumeB) {
    if (!volumeB) {
      ThrowCommonError(403, '发表文章功能已关闭');
    }
  } else if (user.volumeA) {
    if (!volumeA) {
      if (!volumeB) {
        ThrowCommonError(403, '发表文章功能已关闭');
      } else {
        ThrowCommonError(403, '你还未通过B卷考试');
      }
    }
  } else {
    if (!status) {
      if (volumeA) {
        ThrowCommonError(403, '你还未通过A卷考试');
      } else if (volumeB) {
        ThrowCommonError(403, '你还未通过B卷考试');
      } else {
        ThrowCommonError(403, '发表文章功能已关闭');
      }
    } else if (!unlimited) {
      if (todayCount >= countLimit) {
        ThrowCommonError(403, '你今日发表文章次数已达上限');
      }
    }
  }
  // 发表回复时间、条数限制
  const { postToForumCountLimit } = await user.getPostLimit();
  if (todayCount >= postToForumCountLimit) {
    ThrowCommonError(
      403,
      `你当前的账号等级每天最多只能发表${postToForumCountLimit}篇文章`,
    );
  }
};

/*
 * 验证用户是否有权限操作文库
 * */
userSchema.statics.ensurePostLibraryPermission = async (uid) => {
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  const user = await UserModel.findOne({ uid });
  if (!user) {
    return ThrowServerInternalError(`未找到ID为${uid}的用户信息`);
  }
  await user.extendAuthLevel();
  const librarySettings = await SettingModel.getSettings('library');
  let { authLevelMin, exam } = librarySettings;
  authLevelMin = Number(authLevelMin);
  const { volumeA, volumeB, notPass } = exam;
  const { status } = notPass;
  if (authLevelMin > user.authLevel) {
    if (authLevelMin === 1) {
      ThrowCommonError(403, '你还未绑定手机号');
    }
    if (authLevelMin === 2) {
      ThrowCommonError(403, '你还未完成身份认证2');
    }
    if (authLevelMin === 3) {
      ThrowCommonError(403, '你还未完成身份认证3');
    }
  }
  if (user.volumeB) {
    if (!volumeB) {
      ThrowCommonError(403, '文库处于只读模式');
    }
  } else if (user.volumeA) {
    if (!volumeA) {
      if (!volumeB) {
        ThrowCommonError(403, '文库处于只读模式');
      } else {
        ThrowCommonError(403, '你还未通过B卷考试');
      }
    }
  } else {
    if (!status) {
      if (volumeA) {
        ThrowCommonError(403, '你还未通过A卷考试');
      } else if (volumeB) {
        ThrowCommonError(403, '你还未通过B卷考试');
      } else {
        ThrowCommonError(403, '文库处于只读模式');
      }
    }
  }
};

/*
 * 判断用户所发表的回复是否会折叠
 * return {Boolean} true: 会折叠, false: 不会折叠
 * @author pengxiguaa 2019-10-9
 * */
userSchema.methods.ensureHidePostPermission = async function (post) {
  const { voteUp, digest, hide } = post;
  if (hide !== 'null') {
    return hide;
  }
  const hidePostSettings = await mongoose
    .model('settings')
    .getSettings('hidePost');
  const {
    rolesId,
    defaultRoleGradesId,
    voteUpCount = 0,
    hideDigestPost,
  } = hidePostSettings;
  if (digest && !hideDigestPost) {
    return 'not';
  }
  if (voteUp >= voteUpCount) {
    return 'not';
  }
  if (!this.roles) {
    await this.extendRoles();
  }
  for (const r of this.roles) {
    if (rolesId.includes(r._id) && r._id !== 'default') {
      return 'not';
    }
  }
  if (rolesId.includes('default')) {
    if (!this.grade) {
      await this.extendGrade();
    }
    if (!defaultRoleGradesId.includes(this.grade._id)) {
      return 'not';
    } else {
      return 'half';
    }
  } else {
    return 'half';
  }
};

/*
 * 检测账号是否符合注销条件，符合以下条件即可注销
 * 1. 账号下不存在正常开放的专栏
 * 2. 账号下不存在正在出售的商品且不存在未完成的出售订单
 * 3. 账号下不存在未完成的购买订单
 * 4. 账号下不存在未完成的基金申请
 * 5. 账号未担任任一专业的专家
 * 6. 账号下不存在正在进行的活动
 * */

userSchema.statics.checkStatusForDestroyAccount = async (uid) => {
  const status = {
    column: true,
    shopSeller: true,
    shopBuyer: true,
    fund: true,
    forum: true,
    activity: true,
  };
  const UserModel = mongoose.model('users');
  const ShopGoodsModel = mongoose.model('shopGoods');
  const ShopOrdersModel = mongoose.model('shopOrders');
  const ForumModel = mongoose.model('forums');
  const ActivityModel = mongoose.model('activity');
  const FundApplicationFormModel = mongoose.model('fundApplicationForms');
  const user = await UserModel.findOnly({ uid });
  // 拓展用户信息 判断账号下是否有正常开发的专栏
  await UserModel.extendUserInfo(user);
  if (user.column && !user.column.closed) {
    status.column = false;
  }
  // 判断用户出售的商品是否均停售，订单是否都已完成
  const productCount = await ShopGoodsModel.countDocuments({
    uid,
    productStatus: 'insale',
  });
  if (productCount > 0) {
    status.shopSeller = false;
  }
  const sellOrderCount = await ShopOrdersModel.countDocuments({
    sellUid: uid,
    closeStatus: { $ne: true },
    orderStatus: { $ne: 'finish' },
  });
  if (sellOrderCount > 0) {
    status.shopSeller = false;
  }
  // 判断用户购买的商品是否都已完成
  const buyOrderCount = await ShopOrdersModel.countDocuments({
    buyUid: uid,
    closeStatus: { $ne: true },
    orderStatus: { $ne: 'finish' },
  });
  if (buyOrderCount > 0) {
    status.shopBuyer = false;
  }
  // 判断用户申请的基金是否都已完成
  const fundApplicationCount = await FundApplicationFormModel.countDocuments({
    uid,
    useless: null,
    disabled: false,
    'status.completed': null,
  });
  if (fundApplicationCount > 0) {
    status.fund = false;
  }
  const forumCount = await ForumModel.countDocuments({ moderators: uid });
  if (forumCount > 0) {
    status.forum = false;
  }
  // 判断用户发布的活动是否都已完成
  const activityCount = await ActivityModel.countDocuments({
    uid,
    activityType: { $ne: 'close' },
    isBlock: { $ne: true },
    holdEndTime: { $gte: Date.now() },
  });
  if (activityCount > 0) {
    status.activity = false;
  }
  return {
    passed:
      status.column &&
      status.forum &&
      status.activity &&
      status.fund &&
      status.shopBuyer &&
      status.shopSeller,
    status: status,
  };
};

/*
 * 账号注销
 * @param {String} uid 需要注销的用户ID
 * @author pengxiguaa 2020-3-4
 * */
userSchema.statics.destroyAccount = async (options) => {
  const { uid, ip, port } = options;
  const UserModel = mongoose.model('users');
  const { passed } = await UserModel.checkStatusForDestroyAccount(uid);
  if (!passed) {
    ThrowCommonError(403, '账号暂未满足注销要求');
  }
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const SecretBehaviorModel = mongoose.model('secretBehaviors');
  const user = await UserModel.findOnly({ uid });
  const usersPersonal = await UsersPersonalModel.findOnly({ uid });
  // 备份用户信息
  // 请除用户信息
  // 用户名修改为默认用户名
  // 清除个人简介、文章签名
  // 清除头像、背景
  // 清除手机号、邮箱
  // 清除密码
  const oldUsername = user.username;
  const oldDescription = user.description;
  const oldPostSign = user.postSign;
  const newUsername = `zx-${user.uid}`;
  const newDescription = '';
  const newPostSign = '';
  const oldMobile = usersPersonal.mobile;
  const newMobile = '';
  const oldNationCode = usersPersonal.nationCode;
  const newNationCode = '';
  const oldEmail = usersPersonal.email;
  const newEmail = '';
  const oldHashType = usersPersonal.hashType;
  const newHashType = '';
  const oldHash = usersPersonal.password.hash;
  const newHash = '';
  const oldSalt = usersPersonal.password.salt;
  const newSalt = '';
  const oldAvatar = user.avatar;
  const newAvatar = '';
  const oldBanner = user.banner;
  const newBanner = '';

  const secret = SecretBehaviorModel({
    type: 'destroy',
    uid,
    ip,
    port,
    oldMobile,
    oldNationCode,
    newMobile,
    newNationCode,
    oldEmail,
    newEmail,
    oldUsername,
    newUsername,
    oldUsernameLowerCase: oldUsername.toLowerCase(),
    newUsernameLowerCase: newUsername.toLowerCase(),
    oldDescription,
    newDescription,
    oldPostSign,
    newPostSign,
    oldHashType,
    newHashType,
    oldHash,
    newHash,
    oldSalt,
    newSalt,
    oldAvatar,
    newAvatar,
    oldBanner,
    newBanner,
  });
  await secret.save();
  await user.updateOne({
    avatar: newAvatar,
    banner: newBanner,
    username: newUsername,
    usernameLowerCase: newUsername.toLowerCase(),
    description: newDescription,
    postSign: newPostSign,
    destroyed: true,
  });
  await usersPersonal.updateOne({
    mobile: newMobile,
    nationCode: newNationCode,
    email: newEmail,
    hashType: newHashType,
    password: {
      hash: newHash,
      salt: newSalt,
    },
  });
};

// 红包奖励
userSchema.methods.setRedEnvelope = async function () {
  const PostModel = mongoose.model('posts');
  const SettingModel = mongoose.model('settings');
  const apiFn = require('../nkcModules/apiFunction');
  const postCountToday = await PostModel.countDocuments({
    uid: this.uid,
    toc: { $gte: apiFn.today() },
  });
  if (postCountToday !== 1) {
    return;
  }

  if (!this.generalSettings) {
    await this.extendGeneralSettings();
  }
  if (this.generalSettings.lotterySettings.close) {
    return;
  }
  const redEnvelopeSettings = await SettingModel.getSettings('redEnvelope');
  if (redEnvelopeSettings.random.close) {
    return;
  }
  const { chance } = redEnvelopeSettings.random;
  const number = Math.ceil(Math.random() * 100);
  if (number <= chance) {
    await this.generalSettings.updateOne({ 'lotterySettings.status': true });
  }
};

/*
 * 根据积分记录更新用户的指定积分值
 * @param {String} uid 用户ID
 * @param {String} scoreType 积分类型
 * @return {Number} 新的积分值
 * @author pengxiguaa 2020/6/24
 * */
userSchema.statics.updateUserScore = async (uid, scoreType) => {
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const KcbsRecordModel = mongoose.model('kcbsRecords');
  const scoresType = await SettingModel.getScoresType();
  const user = await UserModel.findOne({ uid }, { uid: 1 });
  if (!user) {
    ThrowServerInternalError(`用户未找到 uid:${uid}`);
  }
  if (!scoresType.includes(scoreType)) {
    ThrowServerInternalError(`积分类型错误 type: ${scoreType}`);
  }
  const fromRecords = await KcbsRecordModel.aggregate([
    {
      $match: {
        scoreType,
        from: uid,
        verify: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$num',
        },
      },
    },
  ]);
  const toRecords = await KcbsRecordModel.aggregate([
    {
      $match: {
        scoreType,
        to: uid,
        verify: true,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$num',
        },
      },
    },
  ]);
  const expenses = fromRecords.length ? fromRecords[0].total : 0;
  const income = toRecords.length ? toRecords[0].total : 0;
  const total = income - expenses;
  const obj = {};
  obj[scoreType] = total;
  await UsersPersonalModel.updateOne(
    { uid },
    {
      $set: obj,
    },
  );
  return total;
};
/*
 * 获取用户的指定积分
 * @param {String} uid 用户ID
 * @param {String} scoreType 积分类型
 * @return {Number} 积分值
 * @author pengxiguaa 2020/06/24
 * */
userSchema.statics.getUserScore = async (uid, scoreType) => {
  const SettingModel = mongoose.model('settings');
  const scoresType = await SettingModel.getScoresType();
  if (!scoresType.includes(scoreType)) {
    ThrowServerInternalError(`积分类型错误 type: ${scoreType}`);
  }
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const obj = {};
  for (const s of scoresType) {
    obj[s] = 1;
  }
  const usersPersonal = await UsersPersonalModel.findOne({ uid }, obj);
  if (!usersPersonal) {
    ThrowCommonError(400, `用户未找到 uid: ${uid}`);
  }
  return usersPersonal[scoreType];
};
/*
 * 获取用户的交易积分
 * @param {String} uid 用户ID
 * @return {Number} 积分值
 * @author pengxiguaa 2020/6/24
 * */
userSchema.statics.getUserMainScore = async (uid) => {
  const UserModel = mongoose.model('users');
  return await UserModel.getUserScore(uid, 'score1');
};

/*
 * 获取用户所有已开启的积分
 * @param {String} uid 用户ID
 * @return {Object} {score1: Number, score2: Number, ...}
 * @author pengxiguaa 2020/6/24
 * */
userSchema.statics.getUserScores = async (uid) => {
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const SettingModel = mongoose.model('settings');
  const enabledScores = await SettingModel.getEnabledScores();
  const obj = {};
  for (const s of enabledScores) {
    obj[s.type] = 1;
  }
  const usersPersonal = await UsersPersonalModel.findOnly({ uid }, obj);
  const arr = [];
  for (const score of enabledScores) {
    const { type, name, unit, icon } = score;
    arr.push({
      icon,
      type,
      name,
      unit,
      number: usersPersonal[type],
    });
  }
  return arr;
};

userSchema.statics.getUserScoresInfo = async (uid) => {
  const UserModel = mongoose.model('users');
  const { getUrl } = require('../nkcModules/tools');
  const scores = await UserModel.getUserScores(uid);
  return scores.map((score) => {
    return {
      ...score,
      icon: getUrl('scoreIcon', score.icon),
    };
  });
};

/*
 * 更新用户所有积分
 * @param {String} uid 用户ID
 * @return {Object} {score1: Number, score2: Number, ...}
 * @author pengxiguaa 2020/6/24
 * */
userSchema.statics.updateUserScores = async (uid) => {
  const UserModel = mongoose.model('users');
  const SettingModel = mongoose.model('settings');
  // const enabledScores = await SettingModel.getEnabledScores();
  const scores = await SettingModel.getScores();
  const arr = [];
  for (const score of scores) {
    const { type, name, unit, icon } = score;
    arr.push({
      icon,
      type,
      name,
      unit,
      number: await UserModel.updateUserScore(uid, type),
    });
  }
  const enabledScoresType = await SettingModel.getEnabledScoresType();
  return arr.filter((a) => enabledScoresType.includes(a.type));
};

/*
 * 同步所有用户信息到ES数据库
 * @author pengxiguaa 2020/7/7
 * */
userSchema.statics.saveAllUserToElasticSearch = async () => {
  const UserModel = mongoose.model('users');
  const count = await UserModel.countDocuments();
  const limit = 2000;
  for (let i = 0; i <= count; i += limit) {
    const users = await UserModel.find().sort({ toc: 1 }).skip(i).limit(limit);
    for (const user of users) {
      await UserModel.saveUserToElasticSearch(user);
    }
    console.log(`【同步User到ES】 总：${count}, 当前：${i} - ${i + limit}`);
  }
  console.log(`【同步User到ES】完成`);
};

/*
 * 同步用户信息到ES数据库
 * @param {Object} user 用户对象
 * @author pengxiguaa 2020/7/7
 * */
userSchema.statics.saveUserToElasticSearch = async (user) => {
  const elasticSearch = require('../nkcModules/elasticSearch');
  try {
    await elasticSearch.save('user', user);
  } catch (err) {
    console.log(err);
  }
};

/*
 * 尝试缓存用户的被阅读、被点赞、被回复/被评论的数量到redis
 * */
userSchema.statics.tryUpdateNumberOfOtherUserOperation = async (uid) => {
  let time = await redisClient.getAsync(
    getRedisKeys(`timeToSetOtherUserOperationNumber`),
  );
  time = Number(time) || 0;
  const now = Date.now();
  if (now - time < 24 * 60 * 60 * 1000) {
    return;
  }
  const UserModel = mongoose.model('users');
  await UserModel.updateNumberOfOtherUserOperation(uid);
};

/*
 * 更新用户的被阅读量、被点赞量、被回复/评论量到redis
 * @param {String} uid 用户ID
 * @author pengxiguaa 2020/9/4
 * */
userSchema.statics.updateNumberOfOtherUserOperation = async (uid) => {
  const UsersBehaviorModel = mongoose.model('usersBehaviors');
  const now = Date.now();
  const match = {
    timeStamp: {
      $gte: now - 24 * 60 * 60 * 1000,
    },
    tUid: uid,
  };
  const timeKey = getRedisKeys(`timeToSetOtherUserOperationNumber`);
  const numberKey = getRedisKeys(`numberOfOtherUserOperation`, uid);
  match.operationId = 'visitThread';
  const numberOfRead = await UsersBehaviorModel.countDocuments(match);
  match.opeartionId = 'post-vote-up';
  const numberOfVoteUp = await UsersBehaviorModel.countDocuments(match);
  match.operationId = 'postToThread';
  const numberOfPost = await UsersBehaviorModel.countDocuments(match);
  await redisClient.setAsync(
    numberKey,
    JSON.stringify({
      read: numberOfRead,
      voteUp: numberOfVoteUp,
      post: numberOfPost,
    }),
  );
  await redisClient.setAsync(timeKey, now.toString());
};
/*
 * 从redis中获取用户的被阅读、被点赞、被回复或评论的数量
 * @param {String} uid 用户ID
 * @author pengxiguaa 2020/9/4
 * */
userSchema.statics.getNumberOfOtherUserOperation = async (uid) => {
  const numberKey = getRedisKeys(`numberOfOtherUserOperation`, uid);
  const data = await redisClient.getAsync(numberKey);
  return !data
    ? {
        read: 0,
        voteUp: 0,
        post: 0,
      }
    : JSON.parse(data);
};

/*
 * 获取用户违规记录
 * @param {String} uid 用户ID
 * @return {[]}
 * @author pengxiguaa 2020-9-18
 * */
userSchema.statics.getUserBadRecords = async (uid) => {
  const UsersScoreLogModel = mongoose.model('usersScoreLogs');
  const DelPostLogModel = mongoose.model('delPostLog');
  const violationRecords = await UsersScoreLogModel.find(
    {
      uid,
      operationId: 'violation',
    },
    {
      toc: 1,
      description: 1,
    },
  );
  const toDraftOrRecycle = await DelPostLogModel.find(
    {
      delUserId: uid,
      delType: {
        $in: ['toDraft', 'toRecycle'],
      },
    },
    {
      toc: 1,
      reason: 1,
      delType: 1,
    },
  );
  const results = [];
  for (const r of violationRecords) {
    const { toc, description } = r;
    results.push({
      toc,
      reason: description,
      type: '违规',
    });
  }
  for (const d of toDraftOrRecycle) {
    const { toc, delType, reason } = d;
    results.push({
      toc,
      reason,
      type: { toDraft: '退修', toRecycle: '删除' }[delType],
    });
  }
  return results;
};

/*
 * 检测密码
 * @param {String} password 密码
 * @author pengxiguaa 2020-10-13
 * */
userSchema.statics.checkNewPassword = async (password) => {
  const { checkPass } = require('../tools/checkString');
  if (password.length < 8) {
    ThrowCommonError(400, `密码长度不能小于8位`);
  }
  if (!checkPass(password)) {
    ThrowCommonError(400, `密码要具有数字、字母和符号三者中的至少两者`);
  }
};

/*
 * 获取用户所拥有的权限ID
 * @return {[String]}
 * @author pengxiguaa 2020-10-23
 * */
userSchema.methods.getUserOperationsId = async function () {
  if (!this.roles) {
    await this.extendRoles();
  }
  let operations = [];
  for (const role of this.roles) {
    operations = operations.concat(role.operationsId);
  }
  return [...new Set(operations)];
};

/*
 * 判断用户是否拥有某个权限
 * @param {String} operationId 权限名
 * @return {Boolean}
 * */
userSchema.methods.hasPermission = async function (operationId) {
  const operationsId = await this.getUserOperationsId();
  return operationsId.includes(operationId);
};

/*
 * 判断用户是拥有指定权限集合中的某一个权限
 * @param {[String]} operationsId 权限名组成的数组
 * @return {Boolean}
 * */
userSchema.methods.hasPermissionOr = async function (operationsId = []) {
  const userOperationsId = await this.getUserOperationsId();
  const newOperationsId = new Set(userOperationsId.concat(operationsId));
  return newOperationsId.size !== userOperationsId.length + operationsId.length;
};

/*
 * 判断用户是否拥有指定的所有权限
 * @param {[String]} operationsId 权限名组成的数组
 * @return {Boolean}
 * */
userSchema.methods.hasPermissionAnd = async function (operationsId = []) {
  const userOperationsId = await this.getUserOperationsId();
  const newOperationsId = new Set(userOperationsId.concat(operationsId));
  return newOperationsId.size === userOperationsId.length;
};

/*
 * 判断用户是否为顶级专家
 * @return {Boolean}
 * @author pengxiguaa 2020-12-21
 * */
userSchema.methods.isSuperModerator = async function () {
  const userOperationsId = await this.getUserOperationsId();
  return userOperationsId.includes(`superModerator`);
};
/*
 * 获取用户修改post的最长时间
 * @param {String} uid user ID
 * @return {Number} 毫秒数
 * @author pengxiguaa 2020-12-15
 * */
userSchema.statics.getModifyPostTimeLimitMS = async (uid) => {
  const UserModel = mongoose.model('users');
  const user = await UserModel.findOnly({ uid });
  await user.extendRoles();
  let modifyPostTimeLimit = 0;
  for (const role of user.roles) {
    if (role.modifyPostTimeLimit === -1) {
      modifyPostTimeLimit = 876000;
      break;
    }
    if (role.modifyPostTimeLimit > modifyPostTimeLimit) {
      modifyPostTimeLimit = role.modifyPostTimeLimit;
    }
  }
  return modifyPostTimeLimit * 60 * 60 * 1000;
};

/*
 * 根据用户的等级以及身份认证信息
 * 判断用户是否有权加载编辑器以及发表相关说明
 * @param {String} uid 用户ID
 * @param {String} type 发表类型 thread文章，post回复
 * @param {String} fids 内容所在的专业
 * @return {Object}
 *   @param {Boolean} permit 是否有权发表
 *   @param {HTML String} warning 提示信息
 * @author pengxiguaa 20200-12-18
 * */
userSchema.statics.getPostPermission = async (uid, type, fids = []) => {
  const SettingModel = mongoose.model('settings');
  const UserModel = mongoose.model('users');
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const ForumModel = mongoose.model('forums');
  const PostModel = mongoose.model('posts');
  const filterResult = require('../nkcModules/xssFilters/filterResult');
  let result = {
    permit: false,
    warning: null,
  };
  if (!uid) {
    return result;
  }
  const user = await UserModel.findOnly({ uid });
  const postSettings = await SettingModel.getSettings('post');
  let settings, postType;
  if (type === 'thread') {
    settings = postSettings.postToForum;
    postType = '文章';
  } else {
    settings = postSettings.postToThread;
    postType = '回复/评论';
  }
  const { exam } = settings;
  const authLevelMin = Number(settings.authLevelMin);
  const { volumeA, volumeB, notPass } = exam;
  const { status, unlimited, countLimit } = notPass;
  const authLevel = await user.extendAuthLevel();

  if (authLevel < authLevelMin) {
    result = {
      permit: false,
      warning: `<div>你还未完成身份认证${authLevelMin}，点击<a href="/u/${uid}/settings/verify">这里</a>去完成。</div>`,
    };
  } else {
    if (user.volumeB) {
      if (!volumeB) {
        result = {
          permit: false,
          warning: `<div>发表${postType}功能已关闭</div>`,
        };
      } else {
        result = {
          permit: true,
          warning: null,
        };
      }
    } else if (user.volumeA) {
      if (!volumeA) {
        if (!volumeB) {
          result = {
            permit: false,
            warning: `<div>发表${postType}功能已关闭</div>`,
          };
        } else {
          result = {
            permit: false,
            warning: `<div>你暂未通过B卷考试，不能发表${postType}。</div>`,
          };
        }
      } else {
        result = {
          permit: true,
          warning: null,
        };
      }
    } else {
      if (!status) {
        if (volumeA) {
          result = {
            permit: false,
            warning: `<div>你暂未通过A卷考试，不能发表${postType}。</div>`,
          };
        } else if (volumeB) {
          result = {
            permit: false,
            warning: `<div>你暂未通过B卷考试，不能发表${postType}。</div>`,
          };
        } else {
          result = {
            permit: false,
            warning: `<div>发表${postType}功能已关闭</div>`,
          };
        }
      } else if (unlimited) {
        result = {
          permit: true,
          warning: null,
        };
      } else {
        const today = require('../nkcModules/apiFunction').today();
        const count = await PostModel.countDocuments({
          type,
          uid,
          toc: { $gte: today },
        });
        const contentName = `${type === 'post' ? '条' : '篇'}${postType}`;
        result = {
          permit: count < countLimit,
          warning: `<div>你还未参加考试，每天仅能发表${countLimit}${contentName}。今日已发表${count}${contentName}。
<br>点击<a href="/exam" target="_blank">这里</a>参加考试，通过后将获得更多发言权限。</div>`,
        };
      }
    }
  }
  if (fids.length > 0) {
    try {
      if (type === 'thread') {
        await ForumModel.checkWritePermission(uid, fids);
      } else {
        await ForumModel.checkWritePostPermission(uid, fids);
      }
    } catch (err) {
      try {
        const {
          args: { message },
        } = JSON.parse(err.message);
        result = {
          permit: false,
          warning: `<div>${message}</div>`,
        };
      } catch (_err) {
        result = {
          permit: false,
          warning: `<div>${err.message}</div>`,
        };
      }
    }
  }
  const shouldVerifyPhoneNumber =
    await UsersPersonalModel.shouldVerifyPhoneNumber(uid);
  if (shouldVerifyPhoneNumber) {
    result.warning = result.warning || '';
    result.warning += `<div>您的账号可能存在安全风险，请点击 <a href="/u/${uid}/settings/security" target="_blank">这里</a> 去验证手机号，验证前你所发表的内容需通过审核后才能显示。</div>`;
  }
  //过滤result内部是否有其他的脚本标签
  if (result.warning) {
    result.warning = filterResult(result.warning);
  }
  return result;
};

/*
 * 是否能够接受所有人的消息
 * */
userSchema.statics.allowAllMessage = async function (uid) {
  const UsersGeneralModel = mongoose.model('usersGeneral');
  const ShopGoodsModel = mongoose.model('shopGoods');
  // 确定是否有商品正在出售
  const count = await ShopGoodsModel.countDocuments({
    uid,
    disabled: false,
    productStatus: 'insale',
  });
  const onSale = count > 0;
  const targetUserGeneral = await UsersGeneralModel.findOnly(
    { uid },
    { messageSettings: 1 },
  );
  return targetUserGeneral.messageSettings.allowAllMessageWhenSale && onSale;
};

/*
 * 拓展多个用户的等级
 * @param {[Object]} users 用户对象组成的数组 必要字段: score
 * */
userSchema.statics.extendUsersGrade = async (users) => {
  const UsersGradeModel = mongoose.model('usersGrades');
  const grades = await UsersGradeModel.find({}).sort({ score: -1 });
  for (const user of users) {
    let score = user.score;
    if (!score || score < 0) {
      score = 0;
    }
    let g;
    for (const grade of grades) {
      if (grade.score > score) {
        continue;
      }
      g = grade;
      break;
    }
    if (!g) {
      g = grades[grades.length - 1];
    }
    user.grade = g;
  }
  return users;
};

/*
 * 获取用户的在线状态
 * @param {String} uid 用户ID
 * @return {String}
 * */
userSchema.statics.getUserOnlineStatus = async (uid) => {
  const UserModel = mongoose.model('users');
  const user = await UserModel.findOne({ uid });
  return await user.getOnlineStatus();
};
/*
 * 获取用户的在线状态
 * @return {String}
 * */
userSchema.methods.getOnlineStatus = async function () {
  if (this.online === 'web') {
    return '网页在线';
  }
  if (this.online === 'app') {
    return '手机在线';
  }
  return '离线';
};
/*
 * 设置用户在线状态
 * @param {Boolean} online
 * @return {String} 在线状态
 * */
userSchema.methods.setOnlineStatus = async function (online) {
  if (!['', 'web', 'app'].includes(online)) {
    ThrowServerInternalError(`用户在线状态设置错误`);
  }
  this.online = online;
  await this.updateOne({
    $set: {
      online: this.online,
    },
  });
  return this.getOnlineStatus();
};

/*
 * 获取消息通知音链接
 * @param {String} 用户UID
 * @param {String} type 消息类型 UTU/STU/STE/newFriends
 * */
userSchema.statics.getMessageBeep = async (uid, type) => {
  const { getUrl } = require('../nkcModules/tools');
  const UsersGeneralModel = mongoose.model('usersGeneral');
  const usersGeneral = await UsersGeneralModel.findOnly(
    { uid },
    { messageSettings: 1 },
  );
  const { systemInfo, reminder, usersMessage } =
    usersGeneral.messageSettings.beep || {};
  let beep = null;
  if (
    (['UTU', 'newFriends'].includes(type) && usersMessage) ||
    (type === 'STE' && systemInfo) ||
    (type === 'STU' && reminder)
  ) {
    beep = getUrl('messageTone');
  }
  return beep;
};

/*
 * 获取用户动态码
 * @return {String} code
 * */
userSchema.statics.getCode = async (uid) => {
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const { getRandomString } = require('../nkcModules/apiFunction');
  const usersPersonal = await UsersPersonalModel.findOne({ uid }, { code: 1 });
  const now = new Date();
  let { t, c = [] } = usersPersonal.code;
  t = t || new Date(0);
  if (
    // 动态码有效时间为 12 个小时
    now.getTime() - new Date(t).getTime() >
    12 * 60 * 60 * 1000
  ) {
    t = now;
    const newCode = getRandomString(`0`, 6);
    c.push(newCode);
    c = c.slice(-4);
    await UsersPersonalModel.updateOne(
      { uid },
      {
        $set: {
          code: {
            t,
            c,
          },
        },
      },
    );
  }
  return c;
};

/*
 * 验证用户的验证码
 * @param {String} code
 * @return {Boolean} 是否有效
 * */
userSchema.statics.checkCode = async (uid, code) => {
  const UserModel = mongoose.model('users');
  const codes = await UserModel.getCode(uid);
  return codes.includes(code);
};

/*
 * 获取以用户 ID 为键，以用户对象为值得对象
 * @param {[String]} 用户 ID 组成的数组
 * */
userSchema.statics.getUsersObjectByUsersId = async (usersId) => {
  const UserModel = mongoose.model('users');
  const users = await UserModel.find(
    { uid: { $in: usersId } },
    { uid: 1, avatar: 1, username: 1 },
  );
  const usersObj = {};
  for (let i = 0; i < users.length; i++) {
    usersObj[users[i].uid] = users[i];
  }
  return usersObj;
};

userSchema.statics.getUsersBaseObjectByUsersId = async (usersId) => {
  const { getUrl } = require('../nkcModules/tools');
  const UserModel = mongoose.model('users');
  const users = await UserModel.find(
    { uid: { $in: usersId } },
    { uid: 1, avatar: 1, username: 1 },
  );
  const usersObj = {};
  for (let i = 0; i < users.length; i++) {
    const { uid, avatar, username } = users[i];
    usersObj[uid] = {
      uid,
      avatar: getUrl('userAvatar', avatar),
      username,
    };
  }
  return usersObj;
};

userSchema.statics.getImproveUserInfoByMiddlewareUser = async function (user) {
  if (!user) {
    return null;
  }
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const SettingModel = mongoose.model('settings');
  const serverSettings = await SettingModel.getSettings('server');
  const { uid, username, avatar, banner, description } = user;
  const userSecuritySettings = await UsersPersonalModel.getUserSecuritySettings(
    uid,
  );
  const reg = new RegExp(`^${serverSettings.websiteCode}-`);
  const setUsername = username && !reg.test(username);
  const needVerifyPhoneNumber =
    await UsersPersonalModel.shouldVerifyPhoneNumber(uid);
  return {
    uid,
    setUsername: !!setUsername,
    setPassword: userSecuritySettings.setPassword,
    boundEmail: userSecuritySettings.boundEmail,
    boundMobile: userSecuritySettings.boundMobile,
    setAvatar: !!avatar,
    setBanner: !!banner,
    setDescription: !!description,
    verifyPhoneNumber: !needVerifyPhoneNumber,
  };
};

userSchema.statics.checkAccessControlPermissionWithThrowError = async (
  props,
) => {
  const AccessControlModel = mongoose.model('accessControl');
  const sources = await AccessControlModel.getSources();
  const { uid, rolesId, gradeId, isApp } = props;
  await AccessControlModel.checkAccessControlPermissionWithThrowError({
    uid,
    rolesId,
    gradeId,
    isApp,
    source: sources.user,
  });
};

/*
 * 获取账号注册信息
 * @param {{
 *    uid: string
 *    ipId: string
 *    ip: string
 * }} props
 * @return {{
 *   addr: string ip归属地
 *   authType: string 认证方式
 *   field: string 领域信息
 *   subject: string 主体类型
 * }}
 * */
userSchema.statics.getAccountRegisterInfo = async (props) => {
  const { uid, ipId, ip } = props;
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const IPModel = mongoose.model('ips');
  const up = await UsersPersonalModel.findOne(
    { uid },
    { email: 1, uid: 1, regIP: 1 },
  );
  const authLevel = await up.getAuthLevel();
  let authType = '未同步';
  if ([2, 3].includes(authLevel)) {
    authType = '身份证号';
  } else if (authLevel === 1) {
    authType = '手机号';
  } else if (up.email) {
    authType = '邮箱';
  }
  let targetIp = up.regIP;
  if (!targetIp) {
    if (ipId) {
      targetIp = await IPModel.getIpByIpId(ipId);
    } else if (ip) {
      targetIp = ip;
    }
  }
  const addr = await IPModel.getIpAddr(targetIp);
  return {
    addr,
    authType,
    field: '无',
    subject: '个人',
  };
};

userSchema.statics.getVisitorRoles = async () => {
  const RoleModel = mongoose.model('roles');
  const visitorRole = await RoleModel.extendRole('visitor');
  return [visitorRole];
};

userSchema.statics.getVisitorOperationsId = async () => {
  const UserModel = mongoose.model('users');
  const roles = await UserModel.getVisitorRoles();
  return await UserModel.getOperationsIdByRoles(roles);
};

userSchema.statics.getOperationsIdByRoles = async (roles) => {
  let operationsId = [];
  for (const role of roles) {
    operationsId = operationsId.concat(role.operationsId);
  }
  return [...new Set(operationsId)];
};

userSchema.statics.getUserCertsByXSF = async (certs, xsf) => {
  let newCerts = [...certs];
  if (xsf && xsf > 0 && !newCerts.includes(defaultCerts.scholar)) {
    newCerts.push(defaultCerts.scholar);
  }
  if (!newCerts.includes(defaultCerts.default)) {
    newCerts.push(defaultCerts.default);
  }
  if (newCerts.includes(defaultCerts.banned)) {
    newCerts = [defaultCerts.banned];
  }
  return newCerts;
};

userSchema.statics.getUserCertsNameByCerts = async (
  certs,
  hasMobile,
  hasEmail,
) => {
  const RoleModel = mongoose.model('roles');
  const names = [];
  for (const cert of certs) {
    const role = await RoleModel.extendRole(cert);
    if (role && role.displayName && !role.hidden) {
      names.push(role.displayName);
    }
  }
  if (!certs.includes(defaultCerts.banned)) {
    if (hasMobile) {
      names.push('机友');
    }
    if (hasEmail) {
      names.push('笔友');
    }
  }
  return names;
};

userSchema.methods.getRolesId = async function () {
  const roles = await this.extendRoles();
  return roles.map((role) => role._id);
};

userSchema.methods.getCertsName = async function () {
  const UsersPersonalModel = mongoose.model('usersPersonal');
  const UserModel = mongoose.model('users');
  const { uid, certs, xsf } = this;
  const userCerts = await UserModel.getUserCertsByXSF(certs, xsf);
  const userSecuritySettings = await UsersPersonalModel.getUserSecuritySettings(
    uid,
  );
  return await UserModel.getUserCertsNameByCerts(
    userCerts,
    userSecuritySettings.boundMobile,
    userSecuritySettings.boundEmail,
  );
};

userSchema.methods.getCertsNameString = async function () {
  const certsName = await this.getCertsName();
  return certsName.join(' ');
};

userSchema.statics.getDefaultUsernameById = async function (uid) {
  const SettingModel = mongoose.model('settings');
  const serverSettings = await SettingModel.getSettings('server');
  return `${serverSettings.websiteCode}-${uid}`;
};

userSchema.statics.clearUsername = async function (props) {
  const SecretBehaviorModel = mongoose.model('secretBehaviors');
  const elasticSearch = require('../nkcModules/elasticSearch');
  const { uid, ip, port } = props;
  const UserModel = mongoose.model('users');
  const targetUser = await UserModel.findOnly({ uid });
  const newUsername = await UserModel.getDefaultUsernameById(targetUser.uid);
  const newUsernameLowerCase = newUsername.toLowerCase();
  await SecretBehaviorModel({
    operationId: 'modifyUsername',
    type: 'modifyUsername',
    uid,
    ip,
    port,
    oldUsername: targetUser.username,
    oldUsernameLowerCase: targetUser.usernameLowerCase,
    newUsername: newUsername,
    newUsernameLowerCase: newUsernameLowerCase,
  }).save();
  await UserModel.updateOne(
    { uid },
    {
      $set: {
        username: newUsername,
        usernameLowerCase: newUsernameLowerCase,
      },
    },
  );
  targetUser.username = newUsername;
  targetUser.usernameLowerCase = newUsernameLowerCase;
  await elasticSearch.save('user', targetUser);
};

userSchema.statics.clearUserDescription = async function (uid) {
  const elasticSearch = require('../nkcModules/elasticSearch');
  const UserModel = mongoose.model('users');
  const targetUser = await UserModel.findOnly({ uid });
  await UserModel.updateOne({ uid }, { $set: { description: '' } });
  targetUser.description = '';
  await elasticSearch.save('user', targetUser);
};

module.exports = mongoose.model('users', userSchema);
