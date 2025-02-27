module.exports = [
  {
    _id: 'dev',
    color: '#000000',
    description: '管理人员，拥有至高无上的权利',
    abbr: '运',
    displayName: '运维',
    contentClass: [],
    defaultRole: true,
    modifyPostTimeLimit: -1,
    type: 'system',
    operationsId: []
  },
  {
    _id: 'default',
    color: '#234233',
    description: '普通用户',
    abbr: '普',
    displayName: '普通用户',
    contentClass: [],
    modifyPostTimeLimit: 0.5,
    defaultRole: true,
    type: 'system',
    operationsId: [
      "linkToTarget",
      "reportLinkToTarget",
      "getVerifications",
      "getAttachment",
      "APPGetNav",
      "APPcheckout",
      "APPgetScoreChange",
      "accountRecharge",
      "accountWithdraw",
      "account_subscribe",
      "activityApplyPost",
      "activityEditPost",
      "activityListIndex",
      "activityReleaseIndex",
      "activityReleasePost",
      "addDraft",
      "addFriendsCategory",
      "addFundApplicationReport",
      "addNote",
      "addProductToCart",
      "addStoreClassFeatured",
      "addStoreClassify",
      "addStoreSingleClassify",
      "addUserToBlacklist",
      "agreeApplicationToAddAFriend",
      "agreeFundTerms",
      "billParamAddOne",
      "billParamPlusOne",
      "bindEmail",
      "bindMobile",
      "cancelActivityApply",
      "cancelSubmitVerify",
      "changeEmail",
      "changeProductParams",
      "checkBlacklist",
      "closeRedEnvelope",
      "collectThread",
      "column_apply",
      "column_single_avatar_get",
      "column_single_banner_get",
      "column_single_contact",
      "column_single_contribute",
      "column_single_get",
      "column_single_page",
      "column_single_settings",
      "column_single_settings_close",
      "column_single_settings_contribute",
      "column_single_settings_page",
      "column_single_settings_post",
      "column_single_settings_transfer",
      "column_single_subscribe",
      "complaintPost",
      "confirmOrderReceipt",
      "confirmationFundRemittance",
      "createLibraryFolder",
      "creditKcb",
      "delActivityModify",
      "delStoreClassFeatured",
      "delStoreClassify",
      "deleteApplicationForm",
      "deleteDraft",
      "deleteFriend",
      "deleteFundApplicationReport",
      "deleteLibraryFolder",
      "deleteNote",
      "deletePhoto",
      "destroyAccount",
      "disagreeApplicationToAddAFriend",
      "downloadApp",
      "editCostRecord",
      "editGoodsLogositics",
      "editOrder",
      "editOrderPrice",
      "editOrderTrackNumber",
      "editSellMessage",
      "editorAutoUploadImage",
      "faq",
      "fundApplicationFormExcellent",
      "fundDonation",
      "getActivityModify",
      "getActivityPoster",
      "getAlipayUrl",
      "getAttachmentIcon",
      "getDefaultImage",
      "getExamsPaper",
      "getForumAvatar",
      "getFriendNotePicture",
      "getFriendsApplication",
      "getFundBanner",
      "getFundLogo",
      "getLibraryInfo",
      "getMediums",
      "getMessageFile",
      "getMessageVideoFrame",
      "getNewMessages",
      "getOriginId",
      "getOrigins",
      "getPersonalForumAvatar",
      "getPersonalForumBanner",
      "getPersonalLifePhotos",
      "getPersonalMedia",
      "getPersonalResources",
      "getPhoto",
      "getPostResources",
      "getQuestionImage",
      "getRedEnvelope",
      "getResourceInfo",
      "getResources",
      "getShareToken",
      "getSharedStickers",
      "getShopLogo",
      "getSiteSpecific",
      "getSmallPhoto",
      "getSticker",
      "getStoreSingleClassify",
      "getThreadByQuery",
      "getThreadCover",
      "getThumbs",
      "getUserAvatar",
      "getUserBanner",
      "getVideoImg",
      "hidePost",
      "ipinfo",
      "kcbPay",
      "libraryUpload",
      "logout",
      "messageBlackList",
      "messageCategory",
      "messageDataGet",
      "messageSearchUser",
      "modifyApplicationForm",
      "modifyCartData",
      "modifyFriendCategory",
      "modifyFriendNotePicture",
      "modifyFundApplicationFormStatus",
      "modifyFundApplicationMember",
      "modifyLibraryFolder",
      "modifyMessageSettings",
      "modifyMessageSettingsForUser",
      "modifyMessageStatus",
      "modifyMobile",
      "modifyNote",
      "modifyPassword",
      "modifyPost",
      "modifySticker",
      "modifyStoreDecoration",
      "modifyStoreDecorationFeatured",
      "modifyStoreDecorationSearch",
      "modifyStoreDecorationService",
      "modifyStoreDecorationSign",
      "modifyStoreInfo",
      "modifyUserBanner",
      "modifyUserCertPhotoSettings",
      "modifyUserInfo",
      "modifyUserPhotoSettings",
      "modifyUserRedEnvelopeSettings",
      "modifyUserResume",
      "modifyUserSocial",
      "modifyUserTransaction",
      "modifyUserWaterSettings",
      "modifyUsername",
      "moveLibraryFolder",
      "myActivityApplyIndex",
      "myActivityReleaseIndex",
      "openStoreApply",
      "orderListToExcel",
      "pdfReader",
      "post-vote-down",
      "post-vote-up",
      "postActivityModify",
      "postExamsPaper",
      "postToActivity",
      "postToForum",
      "postToThread",
      "productGoonSale",
      "productShelfRightNow",
      "productStopSale",
      "productToShelf",
      "quotePost",
      "registerSubscribe",
      "removeFriendCategory",
      "removeMessageChat",
      "removeQuestion",
      "removeUserFromBlacklist",
      "restoreFundApplicationForm",
      "saveFreightTemplate",
      "saveNewEditPicture",
      "saveShopCerts",
      "search",
      "searchUser",
      "selectLocation",
      "sendActivityMessage",
      "sendAnApplicationToAddAFriend",
      "sendBindMobileMessage",
      "sendChangeMobileMessage",
      "sendDestroyMessage",
      "sendEmail",
      "sendGoods",
      "sendGoodsNoLog",
      "sendLoginMessage",
      "sendMessageFile",
      "sendMessageToUser",
      "sendUnbindMobileMessage",
      "sendWithdrawMessage",
      "shopDeleteCert",
      "shopGetCert",
      "shopUploadCert",
      "stickerCenter",
      "storeCancelOrder",
      "subThread",
      "submitEditToParam",
      "submitEditToProduct",
      "submitFundApplicationAudit",
      "submitFundApplicationComplete",
      "submitFundApplicationCompleteAudit",
      "submitFundApplicationForm",
      "submitFundApplicationRemittance",
      "submitFundApplicationReportAudit",
      "submitFundApplicationVote",
      "submitFundApplyRemittance",
      "submitProblem",
      "submitShopBill",
      "submitStoreOrderRefund",
      "submitSubscribeForums",
      "submitToPay",
      "submitVerify",
      "subscribeForum",
      "subscribeUser",
      "survey_get",
      "survey_post",
      "survey_single_get",
      "survey_single_post",
      "topPost",
      "transferKcbToUser",
      "unSubThread",
      "unSubscribeForum",
      "unSubscribeUser",
      "unbindEmail",
      "unbindMobile",
      "uploadActivityPoster",
      "uploadPhoto",
      "uploadResources",
      "uploadShopLogo",
      "uploadUserAvatar",
      "userApplyRefund",
      "userBindAlipayAccounts",
      "userBindBankAccounts",
      "userDisplaySettings",
      "userProfile",
      "userWithdrawnMessage",
      "viewForumFollowers",
      "viewForumVisitors",
      "viewNote",
      "viewPaperRecord",
      "visitActivityIndex",
      "visitActivitySingle",
      "visitAddProblem",
      "visitAppDownload",
      "visitDraftList",
      "visitEditor",
      "visitEmailSettings",
      "visitExamPaperList",
      "visitFeaturedProductList",
      "visitForumBanner",
      "visitForumCard",
      "visitForumHome",
      "visitForumLatest",
      "visitForumLibrary",
      "visitForumsCategory",
      "visitFreightTemplate",
      "visitFundApplicationAudit",
      "visitFundApplicationComplete",
      "visitFundApplicationCompleteAudit",
      "visitFundApplicationForm",
      "visitFundApplicationFormSettings",
      "visitFundApplicationRemittance",
      "visitFundApplicationReport",
      "visitFundApplicationReportAudit",
      "visitFundApplyRemittance",
      "visitFundBills",
      "visitFundHome",
      "visitFundInfo",
      "visitFundObjectBills",
      "visitFundObjectHome",
      "visitFundObjectList",
      "visitHistoryFund",
      "visitHistoryFundList",
      "visitHome",
      "visitLogin",
      "visitManageHome",
      "visitManageIndex",
      "visitManageRouter",
      "visitMessagePage",
      "visitMobileRegister",
      "visitMobileSettings",
      "visitMyFund",
      "visitOpenStoreIndex",
      "visitOrderLogistics",
      "visitPasswordSettings",
      "visitPost",
      "visitProductSingle",
      "visitProtocol",
      "visitSelfProblemDetails",
      "visitSelfProblems",
      "visitShareLink",
      "visitShelfIndex",
      "visitShopBill",
      "visitShopCart",
      "visitShopClassifyIndex",
      "visitShopIndex",
      "visitShopOrderIndex",
      "visitShopPay",
      "visitSingleOrderDetail",
      "visitStoreDecorationIndex",
      "visitStoreGoodsList",
      "visitStoreGoodsParamEdit",
      "visitStoreGoodsProductEdit",
      "visitStoreIndex",
      "visitStoreInfoIndex",
      "visitStoreOrderDetail",
      "visitStoreOrderLogositics",
      "visitStoreOrderRefund",
      "visitSubscribeForums",
      "visitThread",
      "visitTool",
      "visitToolsList",
      "visitUserCard",
      "visitUserCertPhotoSettings",
      "visitUserContribute",
      "visitUserInfoSettings",
      "visitUserKcb",
      "visitUserOrder",
      "visitUserOrderRefund",
      "visitUserPhotoSettings",
      "visitUserRedEnvelopeSettings",
      "visitUserResumeSettings",
      "visitUserSocialSettings",
      "visitUserSubThreads",
      "visitUserTransactionSettings",
      "visitUserWaterSettings",
      "visitVerifySettings",
      "verify3VideoUpload",
      "verify2ImageUpload"
    ]
  },
  {
    _id: 'banned',
    color: '#a23422',
    description: '被封禁的用户',
    abbr: '禁',
    displayName: '被封用户',
    contentClass: [],
    defaultRole: true,
    modifyPostTimeLimit: 0,
    type: 'system',
    operationsId: [
      "linkToTarget",
      "reportLinkToTarget",
      "getVerifications",
      "getAttachment",
      "APPGetNav",
      "APPcheckout",
      "activityListIndex",
      "bindEmail",
      "closeRedEnvelope",
      "collectThread",
      "deleteApplicationForm",
      "downloadApp",
      "faq",
      "fundDonation",
      "getActivityPoster",
      "getAttachmentIcon",
      "getDefaultImage",
      "getForumAvatar",
      "getFundBanner",
      "getFundLogo",
      "getHomeLogo",
      "getMessageFile",
      "getNewMessages",
      "getPersonalForumAvatar",
      "getPersonalForumBanner",
      "getPersonalLifePhotos",
      "getPersonalMedia",
      "getPersonalResources",
      "getPhoto",
      "getRedEnvelope",
      "getSiteSpecific",
      "getSmallPhoto",
      "getThreadCover",
      "getUserAvatar",
      "logout",
      "messageDataGet",
      "modifyMessageSettings",
      "modifyMessageStatus",
      "modifyPassword",
      "modifyUserCertPhotoSettings",
      "modifyUserInfo",
      "modifyUserPhotoSettings",
      "modifyUsername",
      "removeMessageChat",
      "search",
      "sendEmail",
      "subThread",
      "submitFundApplicationComplete",
      "submitFundApplyRemittance",
      "submitProblem",
      "submitSubscribeForums",
      "submitVerify",
      "subscribeForum",
      "subscribeUser",
      "unSubThread",
      "unSubscribeForum",
      "unSubscribeUser",
      "uploadPhoto",
      "uploadUserAvatar",
      "viewForumFollowers",
      "viewForumVisitors",
      "visitActivityIndex",
      "visitActivitySingle",
      "visitAddProblem",
      "visitAppDownload",
      "visitDraftList",
      "visitEmailSettings",
      "visitForumBanner",
      "visitForumHome",
      "visitForumLatest",
      "visitForumsCategory",
      "visitFundApplicationComplete",
      "visitFundBills",
      "visitFundHome",
      "visitFundInfo",
      "visitFundObjectHome",
      "visitFundObjectList",
      "visitHistoryFundList",
      "visitHome",
      "visitLottery",
      "visitMessagePage",
      "visitMyFund",
      "visitPasswordSettings",
      "visitPost",
      "visitThread",
      "visitUserCard",
      "visitUserCertPhotoSettings",
      "visitUserInfoSettings",
      "visitUserPhotoSettings",
      "visitUserResumeSettings",
      "visitUserSocialSettings",
      "visitUserTransactionSettings",
      "visitVerifySettings"
    ]
  },
  {
    _id: 'visitor',
    color: '#a23422',
    description: '未登录用户',
    abbr: '游',
    displayName: '游客',
    contentClass: [],
    modifyPostTimeLimit: 0,
    defaultRole: true,
    type: 'system',
    operationsId: [
      "getOAuthToken",
      "linkToTarget",
      "reportLinkToTarget",
      "getAttachment",
      "getVerifications",
      "APPcheckout",
      "APPgetScoreChange",
      "activityApplyPost",
      "activityListIndex",
      "changeProductParams",
      "column_single_avatar_get",
      "column_single_banner_get",
      "column_single_get",
      "column_single_page",
      "downloadApp",
      "faq",
      "findPasswordSendVerifyEmail",
      "findPasswordVerifyEmail",
      "findPasswordVerifyMobile",
      "fundDonation",
      "getActivityPoster",
      "getAttachmentIcon",
      "getDefaultImage",
      "getForumAvatar",
      "getFundBanner",
      "getFundLogo",
      "getLibraryInfo",
      "getMediums",
      "getPersonalForumAvatar",
      "getPersonalForumBanner",
      "getPhoto",
      "getPostResources",
      "getRegisterCode",
      "getResourceInfo",
      "getResources",
      "getShareToken",
      "getSiteSpecific",
      "getSmallPhoto",
      "getSticker",
      "getThreadCover",
      "getThumbs",
      "getUserAvatar",
      "getUserBanner",
      "getVideoImg",
      "logout",
      "modifyPasswordByEmail",
      "modifyPasswordByMobile",
      "pdfReader",
      "rechargePost",
      "search",
      "sendGetBackPasswordMessage",
      "sendLoginMessage",
      "sendRegisterMessage",
      "submitLogin",
      "submitProblem",
      "submitRegister",
      "survey_single_get",
      "survey_single_post",
      "viewForumFollowers",
      "viewForumVisitors",
      "visitActivityIndex",
      "visitActivitySingle",
      "visitAddProblem",
      "visitAppDownload",
      "visitFindPasswordByEmail",
      "visitFindPasswordByMobile",
      "visitForumBanner",
      "visitForumCard",
      "visitForumHome",
      "visitForumLatest",
      "visitForumLibrary",
      "visitForumsCategory",
      "visitFundApplicationForm",
      "visitFundApplicationReport",
      "visitFundBills",
      "visitFundHome",
      "visitFundInfo",
      "visitFundObjectBills",
      "visitFundObjectHome",
      "visitFundObjectList",
      "visitHistoryFund",
      "visitHistoryFundList",
      "visitHome",
      "visitLogin",
      "visitManageRouter",
      "visitMobileRegister",
      "visitPost",
      "visitProductSingle",
      "visitProtocol",
      "visitShareLink",
      "visitShopIndex",
      "visitThread",
      "visitTool",
      "visitToolsList",
      "visitUserCard",
      "visitUserOrder"
    ]
  },
  {
    _id: 'moderator',
    color: '#aaaaaa',
    description: '专家',
    abbr: '专',
    displayName: '专家',
    contentClass: [],
    defaultRole: true,
    modifyPostTimeLimit: 0,
    type: 'system',
    operationsId: [
      "addDraft",
      "addForumCategory",
      "addFundApplicationReport",
      "agreeFundTerms",
      "bindEmail",
      "bindMobile",
      "cancelSubmitVerify",
      "changeEmail",
      "collectThread",
      "confirmationFundRemittance",
      "creditKcb",
      "creditXsf",
      "deleteApplicationForm",
      "deleteDraft",
      "deletePhoto",
      "digestPost",
      "editorAutoUploadImage",
      "faq",
      "fundDonation",
      "getDefaultImage",
      "getForumAvatar",
      "getFundBanner",
      "getFundLogo",
      "getLibraryLogs",
      "getPersonalForumAvatar",
      "getPersonalForumBanner",
      "getPersonalLifePhotos",
      "getPersonalResources",
      "getPhoto",
      "getResources",
      "getSiteSpecific",
      "getSmallPhoto",
      "getThreadByQuery",
      "getThreadCover",
      "getUserAvatar",
      "hidePost",
      "logout",
      "modifyApplicationForm",
      "modifyForumCategory",
      "modifyForumInfo",
      "modifyFundApplicationMember",
      "modifyMobile",
      "modifyPassword",
      "modifyPost",
      "modifyUserCertPhotoSettings",
      "modifyUserInfo",
      "modifyUserPhotoSettings",
      "modifyUserResume",
      "modifyUserSocial",
      "modifyUserTransaction",
      "modifyUsername",
      "moveLibraryFolder",
      "movePostsToDraft",
      "moveThreads",
      "nkcManagementSticker",
      "postToForum",
      "postToThread",
      "postWarningPost",
      "quotePost",
      "review",
      "search",
      "sendBindMobileMessage",
      "sendChangeMobileMessage",
      "sendEmail",
      "showSurveyCertLimit",
      "submitFundApplicationComplete",
      "submitFundApplicationForm",
      "submitFundApplicationReportAudit",
      "submitFundApplicationVote",
      "submitFundApplyRemittance",
      "submitProblem",
      "submitSubscribeForums",
      "submitVerify",
      "subscribeForum",
      "subscribeUser",
      "topPost",
      "toppedThread",
      "unDigestPost",
      "unSubscribeForum",
      "unSubscribeUser",
      "unToppedThread",
      "unblockPosts",
      "updateForumAvatar",
      "uploadPhoto",
      "uploadResources",
      "uploadUserAvatar",
      "viewForumFollowers",
      "viewForumVisitors",
      "violationRecord",
      "visitAddProblem",
      "visitDraftList",
      "visitEditor",
      "visitEmailSettings",
      "visitExamPaperList",
      "visitForumCategorySettings",
      "visitForumHome",
      "visitForumImageSettings",
      "visitForumInfoSettings",
      "visitForumLatest",
      "visitForumsCategory",
      "visitFundApplicationComplete",
      "visitFundApplicationForm",
      "visitFundApplicationRemittance",
      "visitFundApplicationReport",
      "visitFundApplyRemittance",
      "visitFundBills",
      "visitFundHome",
      "visitFundInfo",
      "visitFundObjectBills",
      "visitFundObjectHome",
      "visitFundObjectList",
      "visitHistoryFund",
      "visitHistoryFundList",
      "visitHome",
      "visitMobileSettings",
      "visitMyFund",
      "visitPasswordSettings",
      "visitPost",
      "visitPostHistory",
      "visitSubscribeForums",
      "visitThread",
      "visitUserCard",
      "visitUserCertPhotoSettings",
      "visitUserInfoSettings",
      "visitUserPhotoSettings",
      "visitUserResumeSettings",
      "visitUserSocialSettings",
      "visitUserTransactionSettings",
      "visitVerifySettings"
    ]
  }
];
