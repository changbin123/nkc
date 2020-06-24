(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById('data');
var app = new Vue({
  el: '#app',
  data: {
    defaultKCB: [10, 20, 50, 100, 500, 1000, 5000],
    money: 10,
    error: '',
    payment: 'aliPay',
    input: '',
    mainScore: data.mainScore,
    rechargeSettings: data.rechargeSettings
  },
  computed: {
    payments: function payments() {
      var arr = [];
      var _this$rechargeSetting = this.rechargeSettings,
          weChat = _this$rechargeSetting.weChat,
          aliPay = _this$rechargeSetting.aliPay;
      if (aliPay.enabled) arr.push({
        type: 'aliPay',
        name: '支付宝'
      });
      if (weChat.enabled) arr.push({
        type: 'weChat',
        name: '微信支付'
      });
      return arr;
    },
    payInfo: function payInfo() {
      var payment = this.payment,
          rechargeSettings = this.rechargeSettings;
      var fee = rechargeSettings[payment].fee;
      if (fee) fee = NKC.modules.math.chain(NKC.modules.math.bignumber(fee)).multiply(100).done().toNumber();
      return "\u670D\u52A1\u5546\uFF08\u975E\u672C\u7AD9\uFF09\u5C06\u6536\u53D6 ".concat(fee, "% \u7684\u624B\u7EED\u8D39");
    }
  },
  methods: {
    select: function select(m) {
      this.money = m;
    },
    selectPayment: function selectPayment(t) {
      this.payment = t;
    },
    pay: function pay() {
      this.error = '';
      var money = 0;

      if (this.money) {
        money = this.money;
      } else {
        money = this.input;
      }

      if (money > 0) {} else {
        return this.error = '充值数额必须大于0';
      }

      var newWindow;

      if (NKC.configs.platform !== 'reactNative') {
        newWindow = window.open();
      }

      nkcAPI('/account/finance/recharge?type=get_url&money=' + money, 'GET').then(function (data) {
        if (NKC.configs.platform === 'reactNative') {
          NKC.methods.visitUrl(data.url, true);
        } else {
          newWindow.location = data.url;
        }

        app.error = '请在浏览器新打开的窗口完成支付！若没有新窗口打开，请检查新窗口是否已被浏览器拦截。';
      })["catch"](function (data) {
        app.error = data.error || data;
        newWindow.document.body.innerHTML = data.error || data;
      });
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9hY2NvdW50L2ZpbmFuY2UvcmVjaGFyZ2UubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVosQ0FBd0IsTUFBeEIsQ0FBYjtBQUNBLElBQUksR0FBRyxHQUFHLElBQUksR0FBSixDQUFRO0FBQ2hCLEVBQUEsRUFBRSxFQUFFLE1BRFk7QUFFaEIsRUFBQSxJQUFJLEVBQUU7QUFDSixJQUFBLFVBQVUsRUFBRSxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsQ0FEUjtBQUVKLElBQUEsS0FBSyxFQUFFLEVBRkg7QUFHSixJQUFBLEtBQUssRUFBRSxFQUhIO0FBSUosSUFBQSxPQUFPLEVBQUUsUUFKTDtBQUtKLElBQUEsS0FBSyxFQUFFLEVBTEg7QUFNSixJQUFBLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FOWjtBQU9KLElBQUEsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO0FBUG5CLEdBRlU7QUFXaEIsRUFBQSxRQUFRLEVBQUU7QUFDUixJQUFBLFFBRFEsc0JBQ0c7QUFDVCxVQUFNLEdBQUcsR0FBRyxFQUFaO0FBRFMsa0NBRWdCLEtBQUssZ0JBRnJCO0FBQUEsVUFFRixNQUZFLHlCQUVGLE1BRkU7QUFBQSxVQUVNLE1BRk4seUJBRU0sTUFGTjtBQUdULFVBQUcsTUFBTSxDQUFDLE9BQVYsRUFBbUIsR0FBRyxDQUFDLElBQUosQ0FBUztBQUMxQixRQUFBLElBQUksRUFBRSxRQURvQjtBQUUxQixRQUFBLElBQUksRUFBRTtBQUZvQixPQUFUO0FBSW5CLFVBQUcsTUFBTSxDQUFDLE9BQVYsRUFBbUIsR0FBRyxDQUFDLElBQUosQ0FBUztBQUMxQixRQUFBLElBQUksRUFBRSxRQURvQjtBQUUxQixRQUFBLElBQUksRUFBRTtBQUZvQixPQUFUO0FBSW5CLGFBQU8sR0FBUDtBQUNELEtBYk87QUFjUixJQUFBLE9BZFEscUJBY0U7QUFBQSxVQUNELE9BREMsR0FDNEIsSUFENUIsQ0FDRCxPQURDO0FBQUEsVUFDUSxnQkFEUixHQUM0QixJQUQ1QixDQUNRLGdCQURSO0FBRVIsVUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsT0FBRCxDQUFoQixDQUEwQixHQUFwQztBQUNBLFVBQUcsR0FBSCxFQUNFLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBdUIsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFaLENBQWlCLFNBQWpCLENBQTJCLEdBQTNCLENBQXZCLEVBQXdELFFBQXhELENBQWlFLEdBQWpFLEVBQXNFLElBQXRFLEdBQTZFLFFBQTdFLEVBQU47QUFDQSwwRkFBc0IsR0FBdEI7QUFDSDtBQXBCTyxHQVhNO0FBaUNoQixFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsTUFBTSxFQUFFLGdCQUFTLENBQVQsRUFBWTtBQUNsQixXQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0QsS0FITTtBQUlQLElBQUEsYUFBYSxFQUFFLHVCQUFTLENBQVQsRUFBWTtBQUN6QixXQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0QsS0FOTTtBQU9QLElBQUEsR0FBRyxFQUFFLGVBQVc7QUFDZCxXQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0EsVUFBSSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxVQUFHLEtBQUssS0FBUixFQUFlO0FBQ2IsUUFBQSxLQUFLLEdBQUcsS0FBSyxLQUFiO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxLQUFLLEdBQUcsS0FBSyxLQUFiO0FBQ0Q7O0FBQ0QsVUFBRyxLQUFLLEdBQUcsQ0FBWCxFQUFhLENBQUUsQ0FBZixNQUNLO0FBQ0gsZUFBTyxLQUFLLEtBQUwsR0FBYSxXQUFwQjtBQUNEOztBQUNELFVBQUksU0FBSjs7QUFDQSxVQUFHLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFBWixLQUF5QixhQUE1QixFQUEyQztBQUN6QyxRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBUCxFQUFaO0FBQ0Q7O0FBQ0QsTUFBQSxNQUFNLENBQUMsa0RBQWtELEtBQW5ELEVBQTBELEtBQTFELENBQU4sQ0FDRyxJQURILENBQ1EsVUFBUyxJQUFULEVBQWU7QUFDbkIsWUFBRyxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosS0FBeUIsYUFBNUIsRUFBMkM7QUFDekMsVUFBQSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosQ0FBcUIsSUFBSSxDQUFDLEdBQTFCLEVBQStCLElBQS9CO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsVUFBQSxTQUFTLENBQUMsUUFBVixHQUFxQixJQUFJLENBQUMsR0FBMUI7QUFDRDs7QUFDRCxRQUFBLEdBQUcsQ0FBQyxLQUFKLEdBQVksMkNBQVo7QUFDRCxPQVJILFdBU1MsVUFBUyxJQUFULEVBQWU7QUFDcEIsUUFBQSxHQUFHLENBQUMsS0FBSixHQUFZLElBQUksQ0FBQyxLQUFMLElBQWMsSUFBMUI7QUFDQSxRQUFBLFNBQVMsQ0FBQyxRQUFWLENBQW1CLElBQW5CLENBQXdCLFNBQXhCLEdBQW9DLElBQUksQ0FBQyxLQUFMLElBQWMsSUFBbEQ7QUFDRCxPQVpIO0FBYUQ7QUFwQ007QUFqQ08sQ0FBUixDQUFWIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZGF0YSA9IE5LQy5tZXRob2RzLmdldERhdGFCeUlkKCdkYXRhJyk7XG52YXIgYXBwID0gbmV3IFZ1ZSh7XG4gIGVsOiAnI2FwcCcsXG4gIGRhdGE6IHtcbiAgICBkZWZhdWx0S0NCOiBbMTAsIDIwLCA1MCwgMTAwLCA1MDAsIDEwMDAsIDUwMDBdLFxuICAgIG1vbmV5OiAxMCxcbiAgICBlcnJvcjogJycsXG4gICAgcGF5bWVudDogJ2FsaVBheScsXG4gICAgaW5wdXQ6ICcnLFxuICAgIG1haW5TY29yZTogZGF0YS5tYWluU2NvcmUsXG4gICAgcmVjaGFyZ2VTZXR0aW5nczogZGF0YS5yZWNoYXJnZVNldHRpbmdzLFxuICB9LFxuICBjb21wdXRlZDoge1xuICAgIHBheW1lbnRzKCkge1xuICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICBjb25zdCB7d2VDaGF0LCBhbGlQYXl9ID0gdGhpcy5yZWNoYXJnZVNldHRpbmdzO1xuICAgICAgaWYoYWxpUGF5LmVuYWJsZWQpIGFyci5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2FsaVBheScsXG4gICAgICAgIG5hbWU6ICfmlK/ku5jlrp0nXG4gICAgICB9KTtcbiAgICAgIGlmKHdlQ2hhdC5lbmFibGVkKSBhcnIucHVzaCh7XG4gICAgICAgIHR5cGU6ICd3ZUNoYXQnLFxuICAgICAgICBuYW1lOiAn5b6u5L+h5pSv5LuYJ1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0sXG4gICAgcGF5SW5mbygpIHtcbiAgICAgIGNvbnN0IHtwYXltZW50LCByZWNoYXJnZVNldHRpbmdzfSA9IHRoaXM7XG4gICAgICBsZXQgZmVlID0gcmVjaGFyZ2VTZXR0aW5nc1twYXltZW50XS5mZWU7XG4gICAgICBpZihmZWUpXG4gICAgICAgIGZlZSA9IE5LQy5tb2R1bGVzLm1hdGguY2hhaW4oTktDLm1vZHVsZXMubWF0aC5iaWdudW1iZXIoZmVlKSkubXVsdGlwbHkoMTAwKS5kb25lKCkudG9OdW1iZXIoKTtcbiAgICAgICAgcmV0dXJuIGDmnI3liqHllYbvvIjpnZ7mnKznq5nvvInlsIbmlLblj5YgJHtmZWV9JSDnmoTmiYvnu63otLlgXG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgc2VsZWN0OiBmdW5jdGlvbihtKSB7XG4gICAgICB0aGlzLm1vbmV5ID0gbTtcbiAgICB9LFxuICAgIHNlbGVjdFBheW1lbnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgIHRoaXMucGF5bWVudCA9IHQ7XG4gICAgfSxcbiAgICBwYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5lcnJvciA9ICcnO1xuICAgICAgdmFyIG1vbmV5ID0gMDtcbiAgICAgIGlmKHRoaXMubW9uZXkpIHtcbiAgICAgICAgbW9uZXkgPSB0aGlzLm1vbmV5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9uZXkgPSB0aGlzLmlucHV0O1xuICAgICAgfVxuICAgICAgaWYobW9uZXkgPiAwKXt9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IgPSAn5YWF5YC85pWw6aKd5b+F6aG75aSn5LqOMCc7XG4gICAgICB9XG4gICAgICB2YXIgbmV3V2luZG93O1xuICAgICAgaWYoTktDLmNvbmZpZ3MucGxhdGZvcm0gIT09ICdyZWFjdE5hdGl2ZScpIHtcbiAgICAgICAgbmV3V2luZG93ID0gd2luZG93Lm9wZW4oKTtcbiAgICAgIH1cbiAgICAgIG5rY0FQSSgnL2FjY291bnQvZmluYW5jZS9yZWNoYXJnZT90eXBlPWdldF91cmwmbW9uZXk9JyArIG1vbmV5LCAnR0VUJylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmKE5LQy5jb25maWdzLnBsYXRmb3JtID09PSAncmVhY3ROYXRpdmUnKSB7XG4gICAgICAgICAgICBOS0MubWV0aG9kcy52aXNpdFVybChkYXRhLnVybCwgdHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dpbmRvdy5sb2NhdGlvbiA9IGRhdGEudXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhcHAuZXJyb3IgPSAn6K+35Zyo5rWP6KeI5Zmo5paw5omT5byA55qE56qX5Y+j5a6M5oiQ5pSv5LuY77yB6Iul5rKh5pyJ5paw56qX5Y+j5omT5byA77yM6K+35qOA5p+l5paw56qX5Y+j5piv5ZCm5bey6KKr5rWP6KeI5Zmo5oum5oiq44CCJ1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGFwcC5lcnJvciA9IGRhdGEuZXJyb3IgfHwgZGF0YTtcbiAgICAgICAgICBuZXdXaW5kb3cuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBkYXRhLmVycm9yIHx8IGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=
