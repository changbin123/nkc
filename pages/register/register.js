var app;
$(function() {
	app = new Vue({
		el: '#app',
		data: {
			warning: {
				mobile: '',
				code: '',
				username: '',
				password: '',
				password1: ''
			},
			mobile: '',
			password: '',
			nationCodes: nationCodes,
			nationCode: '86',
			timeNumber: 0,
			code: '',
			password1: '',
			username: '',
			btnText: '注册',
			btnText1: '提交'
		},
		methods: {
			clearWarning: clearWarning,
			sendCode: function() {
				if(app.timeNumber > 0) return;
				app.timeNumber = 120;
				timeOut();
				// 发送短信接口
			},
			submit: function() {
				if(app.btnText !== '注册') return;
				app.btnText = '注册中...';
				if(!app.nationCode) {
					app.warning.error = '请选择国际区号';
					app.btnText = '注册';
					return;
				}
				if(!app.mobile) {
					app.warning.mobile = '请输入手机号码';
					app.btnText = '注册';
					return;
				}
				if(!app.code) {
					app.warning.code = '请输入验证码';
					app.btnText = '注册';
					return;
				}
				var obj = {
					nationCode: app.nationCode,
					mobile: app.mobile,
					code: app.code
				};
				nkcAPI('/register', 'POST', obj)
					.then(function() {
						window.location.reload();
					})
					.catch(function(data) {
						app.warning.error = data.error || data;
						app.btnText = '注册';
					})

			},
			submit1: function() {
				if(app.btnText1 !== '提交') return;
				app.btnText1 = '提交中...';
				if(!app.username) {
					app.warning.username = '请输入用户名';
					app.btnText1 = '提交';
					return;
				}
				if(!app.password) {
					app.warning.password= '请输入密码';
					app.btnText1 = '提交';
					return;
				}
				if(!app.password1) {
					app.warning.password1= '请输入密码';
					app.btnText1 = '提交';
					return;
				}
				if(app.password !== app.password1) {
					app.warning.error = '两次输入的密码不一致';
					app.btnText1 = '提交';
					return;
				}
				var obj = {
					username: app.username,
					password: app.password
				};
				nkcAPI('/register/information', 'POST', obj)
					.then(function(data) {
						window.location.href = '/u/' + data.user.uid + '/subscribe/register?type=register'
					})
					.catch(function(data) {
						app.warning.error = data.error || data;
						app.btnText1 = '提交';
					})
			}

		},
		directives: {
			focus: {
				inserted: focus,
			}
		}
	});
});
function focus(el, {value}) {
	if(value) {
		el.focus();
	}
}

function clearWarning() {
	app.warning.username = '';
	app.warning.password = '';
	app.warning.mobile = '';
	app.warning.code = '';
	app.warning.error = '';
}

/*function changeFocus() {
	var appDom = document.getElementById('app');
	var input = appDom.getElementsByTagName('input')[0];
	input.focus();
}*/
function timeOut(){
	setTimeout(function() {
		if(app.timeNumber === 0) return;
		app.timeNumber--;
		timeOut();
	}, 1000);
}