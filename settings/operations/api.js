module.exports = {
  v1: {
    server: {
      info: {
        GET: 'api_get_server_info',
      },
    },
    account: {
      info: {
        GET: 'api_get_account_info',
      },
      card: {
        GET: 'api_get_account_card',
      },
      drawer: {
        GET: 'api_get_account_drawer',
      },
    },
    threads: {
      selector: {
        GET: 'getUserArticles',
      },
    },
    articles: {
      selector: {
        GET: 'getUserArticles',
      },
    },
    column: {
      PARAMETER: {
        articles: {
          POST: 'columnManage',
        },
      },
    },
    recycle: {
      'recycle-bin': {
        GET: 'api_get_recycle_recycleBin',
      },
    },
    review: {
      GET: 'api_get_review_data',
    },
    user: {
      PARAMETER: {
        'public-info': {
          GET: 'api_get_user_public_info',
        },
      },
    },
    users: {
      memo: {
        PUT: 'api_put_user_memo',
        GET: 'api_get_user_memo',
      },
    },
  },
};
