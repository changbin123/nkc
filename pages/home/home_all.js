window.ForumSelector = undefined;
window.data = NKC.methods.getDataById('data');
const commonModel = new NKC.modules.CommonModal();
const fixBlockHeightClass = 'fix-block-height';
import Sortable from 'sortablejs';

$(function () {
  // 轮播图
  var swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
  swiper.el.onmouseover = function () {
    swiper.autoplay.stop();
  };
  swiper.el.onmouseleave = function () {
    swiper.autoplay.start();
  };
  // 监听页面滚动 更改header样式
  $(window).scroll(function (event) {
    const scrollTop = $(window).scrollTop();
    const header = $('.navbar-default.nkcshade');
    if (scrollTop > 10) {
      header.addClass('home-fixed-header');
    } else {
      header.removeClass('home-fixed-header');
    }
  });
});
function initSortable() {
  //在手机端不可拖动元素
  if (NKC.configs.isApp) {
    return;
  }
  const masterContainerL = document.getElementsByClassName(
    'home-categories-left',
  )[0];
  new Sortable(masterContainerL, {
    group: 'master',
    invertSwap: true,
    handle: '.home-category-master-handle',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: changeOrder,
  });
  const masterContainerR = document.getElementsByClassName(
    'home-categories-right',
  )[0];
  new Sortable(masterContainerR, {
    group: 'master',
    invertSwap: true,
    handle: '.home-category-master-handle',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: changeOrder,
  });
}
function changeOrder() {
  const leftDom = $('.home-categories-left>.home-forums-list');
  const rightDom = $('.home-categories-right>.home-forums-list');
  const left = [];
  const right = [];
  for (let i = 0; i < leftDom.length; i++) {
    const m = leftDom.eq(i);
    let cid = m.attr('id');
    if (cid.indexOf('new_') === 0) {
      continue;
    }
    cid = cid.split('_').pop();
    left.push(cid);
  }
  for (let i = 0; i < rightDom.length; i++) {
    const m = rightDom.eq(i);
    let cid = m.attr('id');
    if (cid.indexOf('new_') === 0) {
      continue;
    }
    cid = cid.split('_').pop();
    right.push(cid);
  }
  nkcAPI(`/nkc/home/block`, 'PUT', {
    homeBlocksId: {
      left,
      right,
    },
  })
    .then(() => {
      console.log(`顺序已保存`);
    })
    .catch(sweetError);
}

function create() {
  scrollToTop();
  const vueAppId = getVueAppId('new_blockForm');
  let app = apps[vueAppId];
  if (!app) {
    app = initVue(`blockForm`, 'new');
    apps[vueAppId] = app;
  }
  app.showForm();
}

const apps = {};
function getVueAppId(cid) {
  return `vue_app_${cid}`;
}
function editorBlock(bid) {
  const vueAppId = getVueAppId(bid);
  let app = apps[vueAppId];
  if (!app) {
    //创建vue实例
    app = initVue(bid, 'edit');
    apps[vueAppId] = app;
  }
  app.showForm();
}
//创建vue实例
function initVue(bid, type) {
  let cid;
  if (type === 'new') {
    cid = `new_${bid}`;
  } else {
    cid = `block_${bid}`;
  }
  const app = new Vue({
    el: `#${cid}`,
    data: {
      bid,
      type,
      show: false,
      showTid: true,
      loading: true,
      //已选择的专业
      forums: [],
      threads: [],
      form: {
        name: '',
        forumsId: [],
        tcId: [],
        digest: false,
        origin: false,
        postCountMin: 0,
        voteUpMin: 0,
        voteUpTotalMin: 0,
        voteDownMax: 0,
        updateInterval: 1,
        timeOfPostMin: 0,
        timeOfPostMax: 365,
        threadStyle: 'brief',
        blockStyle: {
          headerTitleColor: '#000',
          backgroundColor: '#fff',
          usernameColor: '',
          forumColor: '',
          titleColor: '',
          abstractColor: '',
          infoColor: '',
        },
        coverPosition: 'left',
        threadCount: 10,
        disabled: false,
        fixedThreadCount: 0,
        autoThreadCount: 50,
        autoThread: [
          {
            sort: 'random',
            count: 20,
          },
        ],
        autoThreadsId: [],
        fixedThreadsId: [],
        sort: 'random',
      },
      threadCategories: data.threadCategories || [],
      selectedHomeCategoriesId: [],
    },
    computed: {
      isNewForm() {
        return this.type === 'new';
      },
      categoriesId() {
        const { selectedHomeCategoriesId } = this;
        for (const tc of selectedHomeCategoriesId) {
          if (tc.nodeId === 'default') {
            continue;
          }
          this.form.tcId.push(tc.nodeId);
        }
        return arr;
      },
      forumsObj() {
        const { forums } = this;
        const obj = {};
        for (const forum of forums) {
          obj[forum.fid] = forum;
        }
        return obj;
      },
      selectedForums() {
        const { forumsObj, form } = this;
        const arr = [];
        for (const fid of form.forumsId) {
          const forum = forumsObj[fid];
          if (!forum) {
            continue;
          }
          arr.push(forum);
        }
        return arr;
      },
      threadObj() {
        const { threads } = this;
        const obj = {};
        for (const thread of threads) {
          obj[thread.tid] = thread;
        }
        return obj;
      },
      selectedFixThreads() {
        const { threadObj, form } = this;
        const arr = [];
        for (const tid of form.fixedThreadsId) {
          const thread = threadObj[tid];
          if (!thread) {
            continue;
          }
          arr.push(thread);
        }
        return arr;
      },
      selectedAutoThreads() {
        const { threadObj, form } = this;
        const arr = [];
        for (const tid of form.autoThreadsId) {
          const thread = threadObj[tid];
          if (!thread) {
            continue;
          }
          arr.push(thread);
        }
        return arr;
      },
    },
    methods: {
      delThreadId(tid, threadsId) {
        const index = threadsId.indexOf(tid);
        if (index === -1) {
          return;
        }
        threadsId.splice(index, 1);
      },
      getUrl: NKC.methods.tools.getUrl,
      showForm() {
        const { bid } = this;
        this.loading = true;
        this.show = true;
        if (this.isNewForm) {
          this.loading = false;
          this.showTid = false;
        } else {
          const oldContainer = $(`#block_${bid}>.home-threads`);
          const editorBlockDom = $(
            `#block_${bid}>.panel-header>.home-forums-list-options>.btn-editor-block`,
          );
          const saveBlockDom = $(
            `#block_${bid}>.panel-header>.home-forums-list-options>.btn-save-editor`,
          );
          saveBlockDom.show();
          editorBlockDom.hide();
          oldContainer.hide();
          this.getData();
        }
      },
      hideForm() {
        const { bid } = this;
        this.show = false;
        if (!this.isNewForm) {
          const oldContainer = $(`#block_${bid}>.home-threads`);
          const editorBlockDom = $(
            `#block_${bid}>.panel-header>.home-forums-list-options>.btn-editor-block`,
          );
          const saveBlockDom = $(
            `#block_${bid}>.panel-header>.home-forums-list-options>.btn-save-editor`,
          );
          saveBlockDom.hide();
          editorBlockDom.show();
          oldContainer.show();
        }
      },
      saveForm() {
        const { form, isNewForm, bid } = this;
        let url = `/nkc/home/block/${bid}`;
        let method = `PUT`;

        if (isNewForm) {
          url = `/nkc/home/block`;
          method = 'POST';
        }
        const _this = this;

        nkcAPI(url, method, {
          block: form,
        })
          .then((data) => {
            if (isNewForm) {
              screenTopAlert(`保存成功`);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              sweetSuccess(`保存成功`);
              _this.hideForm();
            }
          })
          .catch((err) => {
            sweetError(err);
          });
      },
      getData() {
        const { bid } = this;
        nkcAPI('nkc/home/block/' + bid, 'GET', {})
          .then((data) => {
            this.form = data.homeBlock;
            this.forums = data.forums;
            this.selectedHomeCategoriesId = data.homeBlock.tcId;
            this.threadCategories = data.threadCategories;
            this.loading = false;
            this.threads = data.threads;
          })
          .catch((err) => {
            sweetError(err);
          });
      },
      //选择文章列表样式
      selectBlockStyle() {
        const self = this;
        commonModel.open(
          (data) => {
            this.form.blockStyle.headerTitleColor = data[0].value;
            this.form.blockStyle.backgroundColor = data[1].value;
            /*this.form.blockStyle.forumColor = data[2].value;
          this.form.blockStyle.titleColor = data[3].value;
          this.form.blockStyle.abstractColor = data[4].value;
          this.form.blockStyle.infoColor = data[5].value;*/
            commonModel.close();
          },
          {
            title: '文章列表样式',
            data: [
              {
                dom: 'input',
                label: '模块名称颜色',
                value: this.form.blockStyle.headerTitleColor,
              },
              {
                dom: 'input',
                label: '模块背景颜色',
                value: this.form.blockStyle.backgroundColor,
              },
              /*{
              dom: 'input',
              label: '用户名颜色',
              value: this.form.blockStyle.usernameColor
            },
            {
              dom: 'input',
              label: '专业名颜色',
              value: this.form.blockStyle.forumColor
            },
            {
              dom: 'input',
              label: '文章标题颜色',
              value: this.form.blockStyle.titleColor
            },
            {
              dom: 'input',
              label: '文章摘要颜色',
              value: this.form.blockStyle.abstractColor
            },
            {
              dom: 'input',
              label: '时间等其他信息颜色',
              value: this.form.blockStyle.infoColor
            }*/
            ],
          },
        );
      },
      addAutoThreadItem() {
        this.form.autoThread.push({
          sort: 'random',
          count: 20,
        });
      },
      removeFromArray(arr, index) {
        arr.splice(index, 1);
      },
      //移除选中的专业
      removeForum(fid) {
        // this.form.forumsId = this.form.forumsId.filter(id => fid !== id);
        const index = this.form.forumsId.indexOf(fid);
        if (index === -1) {
          return;
        }
        this.form.forumsId.splice(index, 1);
      },
      // 获取已选择文章分类ID组成的数组
      selectedCategoriesId() {
        var arr = [];
        var selectedForums = this.selectedForums;
        for (var i = 0; i < selectedForums.length; i++) {
          var forum = selectedForums[i];
          if (forum.fid) {
            arr.push(forum.fid);
          }
        }
        return arr;
      },
      //选择专业
      selectForums() {
        var self = this;
        if (!window.MoveThread) {
          window.MoveThread = new NKC.modules.MoveThread();
        }
        window.MoveThread.open(
          function (res) {
            const { originForums, forumsId } = res;
            self.forums.push(...originForums);
            self.form.forumsId = forumsId;
            /*for(const fid of forumsId) {
            if(self.form.forumsId.includes(fid)) continue;
            self.form.forumsId.push(fid);
          }*/
            window.MoveThread.close();
          },
          {
            hideMoveType: true,
            forumCountLimit: 999,
            mode: 'selector',
            selectForumCategory: false,
            selectedForumsId: self.form.forumsId,
          },
        );
      },
    },
  });
  return app;
}
//删除
function deleteHomeBlock(homeBlockId) {
  return sweetQuestion(`确定要删除当前模块吗？`)
    .then(() => {
      return nkcAPI(`/nkc/home/block/${homeBlockId}`, 'DELETE', {});
    })
    .then(() => {
      window.location.reload();
    })
    .catch(sweetError);
}
//屏蔽
function disabledHomeBlock(homeBlockId, disabled) {
  nkcAPI(`/nkc/home/block/${homeBlockId}/disabled`, 'PUT', {
    disabled,
  })
    .then(() => {
      sweetSuccess(`执行成功`);
    })
    .catch(sweetError);
}

const defaultButtonStatus = {
  editor: true,
  finished: false,
  create: false,
  handle: false,
  // saveEditor: false,
};

const editorButtonStatus = {
  editor: false,
  finished: true,
  create: true,
  handle: true,
  // saveEditor: false,
};

function renderButtons(status) {
  const editor = $('.admin-editor');
  const finished = $('.admin-finished');
  const create = $('.admin-create');
  const moveHandle = $('.move-handle');
  const saveEditor = $('.btn-saveEditor');
  status.editor ? editor.show() : editor.hide();
  status.finished ? finished.show() : finished.hide();
  status.create ? create.show() : create.hide();
  status.handle ? moveHandle.show() : moveHandle.hide();

  if (status.editor) {
    $('.home-forums-list .home-category-master-handle').removeClass('move');
  } else {
    $('.home-forums-list .home-category-master-handle').addClass('move');
  }

  // status.saveEditor? saveEditor.show(): saveEditor.hide()
}

renderButtons(defaultButtonStatus);

//进入编辑模式
function editor() {
  renderButtons(editorButtonStatus);
  initSortable();
}

function expandList(homeBlockId) {
  const blockDom = $(`.home-forums-list[id="block_${homeBlockId}"]`);
  fixBlockHeight(blockDom);
}

function fixBlockHeight(blockDom) {
  const fixed = blockDom.hasClass(fixBlockHeightClass);
  if (!fixed) {
    blockDom.addClass(fixBlockHeightClass);
    blockDom.find('.icon-expand').text('展开');
  } else {
    blockDom.removeClass(fixBlockHeightClass);
    blockDom.find('.icon-expand').text('折叠');
  }
}

function fixAllBlockHeight(fixed) {
  const blocks = $(
    '.home-categories-left>.home-forums-list, .home-categories-right>.home-forums-list',
  );
  if (fixed) {
    blocks.addClass(fixBlockHeightClass);
  } else {
    blocks.removeClass(fixBlockHeightClass);
  }
}

function finished() {
  renderButtons(defaultButtonStatus);
  fixAllBlockHeight(false);
  for (const id in apps) {
    if (!apps.hasOwnProperty(id)) {
      continue;
    }
    apps[id].hideForm();
  }
}

function refresh(homeBlockId) {
  nkcAPI(`/nkc/home/block/${homeBlockId}/refresh`, 'POST', {})
    .then(() => {
      sweetSuccess(`执行成功`);
    })
    .catch(sweetError);
}

Object.assign(window, {
  changeOrder,
  finished,
  refresh,
  create,
  editor,
  initSortable,
  deleteHomeBlock,
  editorBlock,
  disabledHomeBlock,
  expandList,
});
