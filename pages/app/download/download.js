var app = new Vue({
  el: '#app',
  data() {
    return {
      files: [
        // {status: 'success', "ext": "pdf", "id": 1638436152651, "name": "毛主席永远活在我们心中_1638436152657.pdf", "path": "/storage/emulated/0/Download/毛主席永远活在我们心中.pdf", "progress": 100, "size": 12019993, "url": "http://192.168.11.250/r/324768?c=resourceDownload&d=attachment&time=1638436151705"},
        // {status: 'success', "ext": "pdf", "id": 1638436152651, "name": "毛主席永远活在我们心中_1638436152657.pdf", "path": "/storage/emulated/0/Download/毛主席永远活在我们心中.pdf", "progress": 100, "size": 12019993, "url": "http://192.168.11.250/r/324768?c=resourceDownload&d=attachment&time=1638436151705"}
      ],
      fileExt: {
        video: ['mp4', 'mov', '3gp', 'avi'],
        picture: ['png', 'jpg', 'jpeg', 'bmp', 'svg', 'gif'],
      },
      loading: true,
    }
  },
  mounted() {
    this.getDownloadFiles();
    // NKC.methods.appConsoleLog({files:this.files})
    window.onerror = function(err) {
      NKC.methods.appConsoleLog({err: err})
    };
  },
  computed: {
  },
  methods: {
    getUrl: NKC.methods.tools.getUrl,
    getSize: NKC.methods.tools.getSize,
    reloadFile(item) {
      NKC.methods.rn.downloadFile(item.name, item.url);
    },
    openFile(item){
      if(item){
        if(item.progress === '100'){
          NKC.methods.rn.emit('openFile', {item: item}, function () {
          })
        }
      }
    },
    // app删除文件
    delFile(item){
      if(item){
        const delId = Date.now();
        return asyncSweetSelf('确定要执行当前操作？', `
          <div>
            <h4>确认要进行操作？</h4>
            </div>
          <div>
            <input name="${delId}" type="radio" value="true"/>
            <span>同时删除文件</span>
          </div>
          `)
          .then(() => {
            let isDelSource = false;
            const val = $(`input[name='${delId}']:checked`).val();
            if(val){
              isDelSource = true;
            }
            item.isDelSource = isDelSource;
            NKC.methods.rn.emit('delFile', {file: item}, function () {
            })
          })
          .then(() => {
          })
          .catch(sweetError)
      }
    },
    //格式化时间
    fromNow(time){
      return NKC.methods.tools.fromNowTwo(new Date(time));
    },
    //获取下载信息
    getDownloadFiles(){
      const _this = this;
      NKC.methods.rn.emit('getFiles', [], function (res){
        if(res.files.length === 0) {
          _this.file = null;
        } else {
          _this.files = res.files.reverse();
        }
        _this.loading = false;
        setTimeout(() => {
          _this.getDownloadFiles();
        }, 1000);
      });
    }
  }
});
