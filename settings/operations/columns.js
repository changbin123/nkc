module.exports = {
  GET: 'column_get',
  PARAMETER: {
    a: {
      PARAMETER: {
        GET: 'column_article_get',
      },
    },
    GET: 'column_single_get',
    PUT: 'column_single_settings',
    hot: {
      POST: 'homeHotColumn',
      DELETE: 'homeHotColumn',
    },
    top: {
      POST: 'homeToppedColumn',
      DELETE: 'homeToppedColumn',
    },
    category: {
      GET: 'column_single_settings_post',
      POST: 'column_single_settings_post',
      PUT: 'column_single_settings_post',
      PARAMETER: {
        DELETE: 'column_single_settings_post',
        PUT: 'column_single_settings_post',
      },
    },
    post: {
      POST: 'column_single_settings_post',
      GET: 'column_single_settings_post',
    },
    subscribe: {
      POST: 'column_single_subscribe',
    },
    settings: {
      GET: 'column_single_settings',
      post: {
        GET: 'column_single_settings_post',
        POST: 'column_single_settings_post',
        add: {
          GET: 'column_single_settings_post',
          POST: 'column_single_settings_post',
        },
      },
      contribute: {
        GET: 'column_single_settings_contribute',
        POST: 'column_single_settings_contribute',
      },
      category: {
        GET: 'column_single_settings_post',
        PUT: 'column_single_settings_post',
        PARAMETER: {
          GET: 'column_single_settings_post',
        },
      },
      transfer: {
        GET: 'column_single_settings_transfer',
        POST: 'column_single_settings_transfer',
      },
      close: {
        GET: 'column_single_settings_close',
        POST: 'column_single_settings_close',
      },
      page: {
        GET: 'column_single_settings_page',
        editor: {
          GET: 'column_single_settings_page',
        },
      },
      fans: {
        GET: 'column_single_settings_fans',
        DELETE: 'column_single_settings_fans',
      },
    },
    contribute: {
      GET: 'column_single_contribute',
      POST: 'column_single_contribute',
    },
    status: {
      GET: 'column_single_status',
    },
    disabled: {
      POST: 'column_single_disabled',
    },
    contact: {
      POST: 'column_single_contact',
    },
    page: {
      POST: 'column_single_settings_page',
      PARAMETER: {
        GET: 'column_single_page',
        PUT: 'column_single_settings_page',
        DELETE: 'column_single_settings_page',
      },
    },
  },
};
