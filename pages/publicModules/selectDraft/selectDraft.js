(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

NKC.modules.SelectDraft = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);

    var self = this;
    self.dom = $("#moduleSelectDraft");
    self.app = new Vue({
      el: "#moduleSelectDraftApp",
      data: {
        uid: NKC.configs.uid,
        paging: {},
        perpage: 7,
        loading: true,
        drafts: []
      },
      methods: {
        fromNow: NKC.methods.fromNow,
        initDom: function initDom() {
          var height = "43.5rem";
          self.dom.css({
            height: height
          });
          self.dom.draggable({
            scroll: false,
            handle: ".module-sd-title",
            drag: function drag(event, ui) {
              if (ui.position.top < 0) ui.position.top = 0;
              var height = $(window).height();
              if (ui.position.top > height - 30) ui.position.top = height - 30;
              var width = self.dom.width();
              if (ui.position.left < 100 - width) ui.position.left = 100 - width;
              var winWidth = $(window).width();
              if (ui.position.left > winWidth - 100) ui.position.left = winWidth - 100;
            }
          });
          var width = $(window).width();

          if (width < 700) {
            // 小屏幕
            self.dom.css({
              "width": width * 0.8,
              "top": 0,
              "right": 0
            });
          } else {
            // 宽屏
            self.dom.css("left", (width - self.dom.width()) * 0.5 - 20);
          }

          self.dom.show();
        },
        getDraftInfo: function getDraftInfo(draft) {
          var type = draft.type,
              thread = draft.thread,
              forum = draft.forum;
          var info = "";

          if (type === "newThread") {
            info = "\u53D1\u8868\u6587\u7AE0";
          } else if (type === "newPost") {
            info = "\u5728\u6587\u7AE0\u300A".concat(thread.title, "\u300B\u4E0B\u53D1\u8868\u56DE\u590D");
          } else if (type === "modifyPost") {
            info = "\u4FEE\u6539\u6587\u7AE0\u300A".concat(thread.title, "\u300B\u4E0B\u7684\u56DE\u590D");
          } else if (type === "modifyThread") {
            info = "\u4FEE\u6539\u6587\u7AE0\u300A".concat(thread.title, "\u300B");
          } else {
            info = "\u4FEE\u6539\u4E13\u4E1A\u300A".concat(forum.title, "\u300B\u7684\u4E13\u4E1A\u8BF4\u660E");
          }

          return info;
        },
        insert: function insert(data) {
          var content = NKC.methods.ueditor.setContent(data.content);
          self.callback({
            content: content
          });
          data.delay = 3;

          var func = function func() {
            setTimeout(function () {
              data.delay--;

              if (data.delay > 0) {
                func();
              }
            }, 1000);
          };

          func();
        },
        removeDraft: function removeDraft(draft) {
          var _this = this;

          sweetQuestion("确定要删除草稿吗？").then(function () {
            nkcAPI('/u/' + _this.uid + "/drafts/" + draft.did, "DELETE").then(function () {
              self.app.getDrafts(self.app.paging.page);
            })["catch"](function (data) {
              sweetError(data);
            });
          });
        },
        getDrafts: function getDrafts() {
          var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          nkcAPI("/u/".concat(this.uid, "/profile/draft?page=").concat(page, "&perpage=").concat(this.perpage), "GET").then(function (data) {
            data.drafts.map(function (d) {
              d.delay = 0;
            });
            self.app.drafts = data.drafts;
            self.app.paging = data.paging;
            self.app.loading = false;
          })["catch"](sweetError);
        },
        loadDraft: function loadDraft(d) {
          sweetQuestion("\u7EE7\u7EED\u521B\u4F5C\u5C06\u4F1A\u8986\u76D6\u7F16\u8F91\u5668\u4E2D\u5168\u90E8\u5185\u5BB9\uFF0C\u786E\u5B9A\u7EE7\u7EED\uFF1F").then(function () {
            if (window.PostInfo && window.PostInfo.showCloseInfo) {
              window.PostInfo.showCloseInfo = false;
            }

            window.location.href = "/editor?type=redit&id=".concat(d.did);
          })["catch"](sweetError);
        },
        refresh: function refresh() {
          this.getDrafts(self.app.paging.page);
        },
        open: function open(callback) {
          self.callback = callback;
          this.initDom();
          this.getDrafts();
        },
        close: function close() {
          self.dom.hide();
        }
      }
    });
    self.open = self.app.open;
    self.close = self.app.close;
  }

  return _class;
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3B1YmxpY01vZHVsZXMvc2VsZWN0RHJhZnQvc2VsZWN0RHJhZnQubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBWjtBQUNFLG9CQUFjO0FBQUE7O0FBQ1osUUFBTSxJQUFJLEdBQUcsSUFBYjtBQUNBLElBQUEsSUFBSSxDQUFDLEdBQUwsR0FBVyxDQUFDLENBQUMsb0JBQUQsQ0FBWjtBQUNBLElBQUEsSUFBSSxDQUFDLEdBQUwsR0FBVyxJQUFJLEdBQUosQ0FBUTtBQUNqQixNQUFBLEVBQUUsRUFBRSx1QkFEYTtBQUVqQixNQUFBLElBQUksRUFBRTtBQUNKLFFBQUEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FEYjtBQUVKLFFBQUEsTUFBTSxFQUFFLEVBRko7QUFHSixRQUFBLE9BQU8sRUFBRSxDQUhMO0FBSUosUUFBQSxPQUFPLEVBQUUsSUFKTDtBQUtKLFFBQUEsTUFBTSxFQUFFO0FBTEosT0FGVztBQVNqQixNQUFBLE9BQU8sRUFBRTtBQUNQLFFBQUEsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksT0FEZDtBQUVQLFFBQUEsT0FGTyxxQkFFRztBQUNSLGNBQU0sTUFBTSxHQUFHLFNBQWY7QUFDQSxVQUFBLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFhO0FBQ1gsWUFBQSxNQUFNLEVBQU47QUFEVyxXQUFiO0FBR0EsVUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsQ0FBbUI7QUFDakIsWUFBQSxNQUFNLEVBQUUsS0FEUztBQUVqQixZQUFBLE1BQU0sRUFBRSxrQkFGUztBQUdqQixZQUFBLElBQUksRUFBRSxjQUFTLEtBQVQsRUFBZ0IsRUFBaEIsRUFBb0I7QUFDeEIsa0JBQUcsRUFBRSxDQUFDLFFBQUgsQ0FBWSxHQUFaLEdBQWtC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SUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULEdBQW1CLEtBQW5CO0FBQ0QsV0FSSCxXQVNTLFVBVFQ7QUFVRCxTQXZGTTtBQXdGUCxRQUFBLFNBeEZPLHFCQXdGRyxDQXhGSCxFQXdGTTtBQUNYLFVBQUEsYUFBYSx3SUFBYixDQUNHLElBREgsQ0FDUSxZQUFNO0FBQ1YsZ0JBQUcsTUFBTSxDQUFDLFFBQVAsSUFBbUIsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsYUFBdEMsRUFBcUQ7QUFDbkQsY0FBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixhQUFoQixHQUFnQyxLQUFoQztBQUNEOztBQUNELFlBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsSUFBaEIsbUNBQWdELENBQUMsQ0FBQyxHQUFsRDtBQUNELFdBTkgsV0FPUyxVQVBUO0FBUUQsU0FqR007QUFrR1AsUUFBQSxPQWxHTyxxQkFrR0c7QUFDUixlQUFLLFNBQUwsQ0FBZSxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQVQsQ0FBZ0IsSUFBL0I7QUFDRCxTQXBHTTtBQXFHUCxRQUFBLElBckdPLGdCQXFHRixRQXJHRSxFQXFHUTtBQUNiLFVBQUEsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxlQUFLLE9BQUw7QUFDQSxlQUFLLFNBQUw7QUFDRCxTQXpHTTtBQTBHUCxRQUFBLEtBMUdPLG1CQTBHQztBQUNOLFVBQUEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFUO0FBQ0Q7QUE1R007QUFUUSxLQUFSLENBQVg7QUF3SEEsSUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBckI7QUFDQSxJQUFBLElBQUksQ0FBQyxLQUFMLEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUF0QjtBQUNEOztBQTlISDtBQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiTktDLm1vZHVsZXMuU2VsZWN0RHJhZnQgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIHNlbGYuZG9tID0gJChcIiNtb2R1bGVTZWxlY3REcmFmdFwiKTtcclxuICAgIHNlbGYuYXBwID0gbmV3IFZ1ZSh7XHJcbiAgICAgIGVsOiBcIiNtb2R1bGVTZWxlY3REcmFmdEFwcFwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgdWlkOiBOS0MuY29uZmlncy51aWQsXHJcbiAgICAgICAgcGFnaW5nOiB7fSxcclxuICAgICAgICBwZXJwYWdlOiA3LFxyXG4gICAgICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICAgICAgZHJhZnRzOiBbXVxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgZnJvbU5vdzogTktDLm1ldGhvZHMuZnJvbU5vdyxcclxuICAgICAgICBpbml0RG9tKCkge1xyXG4gICAgICAgICAgY29uc3QgaGVpZ2h0ID0gXCI0My41cmVtXCI7XHJcbiAgICAgICAgICBzZWxmLmRvbS5jc3Moe1xyXG4gICAgICAgICAgICBoZWlnaHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2VsZi5kb20uZHJhZ2dhYmxlKHtcclxuICAgICAgICAgICAgc2Nyb2xsOiBmYWxzZSxcclxuICAgICAgICAgICAgaGFuZGxlOiBcIi5tb2R1bGUtc2QtdGl0bGVcIixcclxuICAgICAgICAgICAgZHJhZzogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgaWYodWkucG9zaXRpb24udG9wIDwgMCkgdWkucG9zaXRpb24udG9wID0gMDtcclxuICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgaWYodWkucG9zaXRpb24udG9wID4gaGVpZ2h0IC0gMzApIHVpLnBvc2l0aW9uLnRvcCA9IGhlaWdodCAtIDMwO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gc2VsZi5kb20ud2lkdGgoKTtcclxuICAgICAgICAgICAgICBpZih1aS5wb3NpdGlvbi5sZWZ0IDwgMTAwIC0gd2lkdGgpIHVpLnBvc2l0aW9uLmxlZnQgPSAxMDAgLSB3aWR0aDtcclxuICAgICAgICAgICAgICBjb25zdCB3aW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgIGlmKHVpLnBvc2l0aW9uLmxlZnQgPiB3aW5XaWR0aCAtIDEwMCkgdWkucG9zaXRpb24ubGVmdCA9IHdpbldpZHRoIC0gMTAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnN0IHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICBpZih3aWR0aCA8IDcwMCkge1xyXG4gICAgICAgICAgICAvLyDlsI/lsY/luZVcclxuICAgICAgICAgICAgc2VsZi5kb20uY3NzKHtcclxuICAgICAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoICogMC44LFxyXG4gICAgICAgICAgICAgIFwidG9wXCI6IDAsXHJcbiAgICAgICAgICAgICAgXCJyaWdodFwiOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8g5a695bGPXHJcbiAgICAgICAgICAgIHNlbGYuZG9tLmNzcyhcImxlZnRcIiwgKHdpZHRoIC0gc2VsZi5kb20ud2lkdGgoKSkqMC41IC0gMjApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VsZi5kb20uc2hvdygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RHJhZnRJbmZvKGRyYWZ0KSB7XHJcbiAgICAgICAgICBjb25zdCB7dHlwZSwgdGhyZWFkLCBmb3J1bX0gPSBkcmFmdDtcclxuICAgICAgICAgIGxldCBpbmZvID0gXCJcIjtcclxuICAgICAgICAgIGlmKHR5cGUgPT09IFwibmV3VGhyZWFkXCIpIHtcclxuICAgICAgICAgICAgaW5mbyA9IGDlj5Hooajmlofnq6BgO1xyXG4gICAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwibmV3UG9zdFwiKSB7XHJcbiAgICAgICAgICAgIGluZm8gPSBg5Zyo5paH56ug44CKJHt0aHJlYWQudGl0bGV944CL5LiL5Y+R6KGo5Zue5aSNYDtcclxuICAgICAgICAgIH0gZWxzZSBpZih0eXBlID09PSBcIm1vZGlmeVBvc3RcIikge1xyXG4gICAgICAgICAgICBpbmZvID0gYOS/ruaUueaWh+eroOOAiiR7dGhyZWFkLnRpdGxlfeOAi+S4i+eahOWbnuWkjWA7XHJcbiAgICAgICAgICB9IGVsc2UgaWYodHlwZSA9PT0gXCJtb2RpZnlUaHJlYWRcIikge1xyXG4gICAgICAgICAgICBpbmZvID0gYOS/ruaUueaWh+eroOOAiiR7dGhyZWFkLnRpdGxlfeOAi2A7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbmZvID0gYOS/ruaUueS4k+S4muOAiiR7Zm9ydW0udGl0bGV944CL55qE5LiT5Lia6K+05piOYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5zZXJ0KGRhdGEpIHtcclxuICAgICAgICAgIHZhciBjb250ZW50ID0gTktDLm1ldGhvZHMudWVkaXRvci5zZXRDb250ZW50KGRhdGEuY29udGVudCk7XHJcbiAgICAgICAgICBzZWxmLmNhbGxiYWNrKHtjb250ZW50OmNvbnRlbnR9KTtcclxuICAgICAgICAgIGRhdGEuZGVsYXkgPSAzO1xyXG4gICAgICAgICAgY29uc3QgZnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgZGF0YS5kZWxheSAtLTtcclxuICAgICAgICAgICAgICBpZihkYXRhLmRlbGF5ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmVEcmFmdChkcmFmdCkge1xyXG4gICAgICAgICAgc3dlZXRRdWVzdGlvbihcIuehruWumuimgeWIoOmZpOiNieeov+WQl++8n1wiKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgbmtjQVBJKCcvdS8nICsgdGhpcy51aWQgKyBcIi9kcmFmdHMvXCIgKyBkcmFmdC5kaWQsIFwiREVMRVRFXCIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuZ2V0RHJhZnRzKHNlbGYuYXBwLnBhZ2luZy5wYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICBzd2VldEVycm9yKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldERyYWZ0cyhwYWdlID0gMCkge1xyXG4gICAgICAgICAgbmtjQVBJKGAvdS8ke3RoaXMudWlkfS9wcm9maWxlL2RyYWZ0P3BhZ2U9JHtwYWdlfSZwZXJwYWdlPSR7dGhpcy5wZXJwYWdlfWAsIFwiR0VUXCIpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGRhdGEuZHJhZnRzLm1hcChkID0+IHtcclxuICAgICAgICAgICAgICAgIGQuZGVsYXkgPSAwO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHNlbGYuYXBwLmRyYWZ0cyA9IGRhdGEuZHJhZnRzO1xyXG4gICAgICAgICAgICAgIHNlbGYuYXBwLnBhZ2luZyA9IGRhdGEucGFnaW5nO1xyXG4gICAgICAgICAgICAgIHNlbGYuYXBwLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9hZERyYWZ0KGQpIHtcclxuICAgICAgICAgIHN3ZWV0UXVlc3Rpb24oYOe7p+e7reWIm+S9nOWwhuS8muimhueblue8lui+keWZqOS4reWFqOmDqOWGheWuue+8jOehruWumue7p+e7re+8n2ApXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBpZih3aW5kb3cuUG9zdEluZm8gJiYgd2luZG93LlBvc3RJbmZvLnNob3dDbG9zZUluZm8pIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5Qb3N0SW5mby5zaG93Q2xvc2VJbmZvID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYC9lZGl0b3I/dHlwZT1yZWRpdCZpZD0ke2QuZGlkfWA7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgICB0aGlzLmdldERyYWZ0cyhzZWxmLmFwcC5wYWdpbmcucGFnZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcGVuKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICBzZWxmLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICB0aGlzLmluaXREb20oKTtcclxuICAgICAgICAgIHRoaXMuZ2V0RHJhZnRzKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZSgpIHtcclxuICAgICAgICAgIHNlbGYuZG9tLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgc2VsZi5vcGVuID0gc2VsZi5hcHAub3BlbjtcclxuICAgIHNlbGYuY2xvc2UgPSBzZWxmLmFwcC5jbG9zZTtcclxuICB9XHJcbn07Il19
