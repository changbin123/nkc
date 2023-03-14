/*
 * 启动时缓存必要数据到redis
 * */
const db = require('../dataModels');
const tasks = require('../tasks');
const cacheForums = require('./cacheForums');
const {
  sensitiveSettingService,
} = require('../services/sensitive/sensitiveSetting.service');
const {
  sensitiveCheckerService,
} = require('../services/sensitive/sensitiveChecker.service');
module.exports = async () => {
  // 清空redis数据库
  // await client.flushdbAsync();
  // 清空缓存表
  // await CacheModel.remove();

  // 缓存用户等级
  await db.UsersGradeModel.saveGradesToRedis();
  // 专业权限相关
  await cacheForums();
  // 专业信息
  await db.ForumModel.saveAllForumsToRedis();
  // 用户等级
  await db.RoleModel.saveRolesToRedis();
  // 一周活跃用户
  await db.ActiveUserModel.saveActiveUsersToCache();
  // 最新注册用户
  await db.ActiveUserModel.saveNewUsersToCache();
  // 专业分类
  await db.ForumCategoryModel.saveCategoryToRedis();
  // 专业最新文章
  // await db.ForumModel.saveAllForumLatestThreadToRedisAsync();
  await tasks.saveAllForumLatestThreadToRedis();
  // 后台设置
  await db.SettingModel.saveAllSettingsToRedis();
  // 操作权限
  await db.OperationModel.saveAllOperationsToRedisAsync();
  // 积分操作相关配置
  await db.ScoreOperationModel.saveAllScoreOperationToRedis();
  // IP 黑名单
  await db.IPBlacklistModel.saveIPBlacklistToRedis();
  // 访问控制
  await db.AccessControlModel.saveToCache();
  // 敏感词设置
  await sensitiveSettingService.saveAllSettingsToCache();
  await sensitiveCheckerService.setAllCheckerLogStatusToFailed();
};
