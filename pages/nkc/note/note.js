(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.disableNote = function (id, disable) {
  nkcAPI("/nkc/note", "POST", {
    type: disable ? "disable" : "cancelDisable",
    noteContentId: id
  }).then(function () {
    window.location.reload();
  })["catch"](sweetError);
};

window.editNote = function (id, content) {
  if (!window.commonModal) {
    window.commonModal = new NKC.modules.CommonModal();
  }

  window.commonModal.open(function (data) {
    nkcAPI("/nkc/note", "POST", {
      type: "modify",
      noteContentId: id,
      content: data[0].value
    }).then(function () {
      window.commonModal.close();
      window.location.reload();
    })["catch"](sweetError);
  }, {
    title: "编辑笔记",
    data: [{
      dom: "textarea",
      value: NKC.methods.strToObj(content).content
    }]
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9ua2Mvbm90ZS9ub3RlLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBQyxFQUFELEVBQUssT0FBTCxFQUFpQjtBQUNwQyxFQUFBLE1BQU0sY0FBYyxNQUFkLEVBQXNCO0FBQzFCLElBQUEsSUFBSSxFQUFFLE9BQU8sR0FBRSxTQUFGLEdBQWEsZUFEQTtBQUUxQixJQUFBLGFBQWEsRUFBRTtBQUZXLEdBQXRCLENBQU4sQ0FJRyxJQUpILENBSVEsWUFBTTtBQUNWLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsTUFBaEI7QUFDRCxHQU5ILFdBT1MsVUFQVDtBQVFELENBVEQ7O0FBVUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsVUFBQyxFQUFELEVBQUssT0FBTCxFQUFpQjtBQUNqQyxNQUFHLENBQUMsTUFBTSxDQUFDLFdBQVgsRUFBd0I7QUFDdEIsSUFBQSxNQUFNLENBQUMsV0FBUCxHQUFxQixJQUFJLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBaEIsRUFBckI7QUFDRDs7QUFDRCxFQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLElBQW5CLENBQXdCLFVBQUEsSUFBSSxFQUFJO0FBQzlCLElBQUEsTUFBTSxDQUFDLFdBQUQsRUFBYyxNQUFkLEVBQXNCO0FBQzFCLE1BQUEsSUFBSSxFQUFFLFFBRG9CO0FBRTFCLE1BQUEsYUFBYSxFQUFFLEVBRlc7QUFHMUIsTUFBQSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUQsQ0FBSixDQUFRO0FBSFMsS0FBdEIsQ0FBTixDQUtHLElBTEgsQ0FLUSxZQUFNO0FBQ1YsTUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQjtBQUNBLE1BQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsTUFBaEI7QUFDRCxLQVJILFdBU1MsVUFUVDtBQVVELEdBWEQsRUFXRztBQUNELElBQUEsS0FBSyxFQUFFLE1BRE47QUFFRCxJQUFBLElBQUksRUFBRSxDQUNKO0FBQ0UsTUFBQSxHQUFHLEVBQUUsVUFEUDtBQUVFLE1BQUEsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFBWixDQUFxQixPQUFyQixFQUE4QjtBQUZ2QyxLQURJO0FBRkwsR0FYSDtBQW9CRCxDQXhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIndpbmRvdy5kaXNhYmxlTm90ZSA9IChpZCwgZGlzYWJsZSkgPT4ge1xyXG4gIG5rY0FQSShgL25rYy9ub3RlYCwgXCJQT1NUXCIsIHtcclxuICAgIHR5cGU6IGRpc2FibGU/IFwiZGlzYWJsZVwiOiBcImNhbmNlbERpc2FibGVcIixcclxuICAgIG5vdGVDb250ZW50SWQ6IGlkXHJcbiAgfSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG59O1xyXG53aW5kb3cuZWRpdE5vdGUgPSAoaWQsIGNvbnRlbnQpID0+IHtcclxuICBpZighd2luZG93LmNvbW1vbk1vZGFsKSB7XHJcbiAgICB3aW5kb3cuY29tbW9uTW9kYWwgPSBuZXcgTktDLm1vZHVsZXMuQ29tbW9uTW9kYWwoKTtcclxuICB9XHJcbiAgd2luZG93LmNvbW1vbk1vZGFsLm9wZW4oZGF0YSA9PiB7XHJcbiAgICBua2NBUEkoXCIvbmtjL25vdGVcIiwgXCJQT1NUXCIsIHtcclxuICAgICAgdHlwZTogXCJtb2RpZnlcIixcclxuICAgICAgbm90ZUNvbnRlbnRJZDogaWQsXHJcbiAgICAgIGNvbnRlbnQ6IGRhdGFbMF0udmFsdWVcclxuICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB3aW5kb3cuY29tbW9uTW9kYWwuY2xvc2UoKTtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG4gIH0sIHtcclxuICAgIHRpdGxlOiBcIue8lui+keeslOiusFwiLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZG9tOiBcInRleHRhcmVhXCIsXHJcbiAgICAgICAgdmFsdWU6IE5LQy5tZXRob2RzLnN0clRvT2JqKGNvbnRlbnQpLmNvbnRlbnRcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0pO1xyXG59OyJdfQ==
