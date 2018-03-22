const Router = require('koa-router');
const billsRouter = new Router();
const apiFn = require('../../nkcModules/apiFunction');
billsRouter
	.get('/', async (ctx, next) => {
		const {query, data, db} = ctx;
		const {type} = query;
		data.type = type;
		const page = query.page? parseInt(query.page): 0;
		const q = {};
		if(data.userLevel < 7) {
			q.verify = true;
		}
		if(type !== 'all') {
			q.$or = [
				{
					'from.type': 'fundPool'
				},
				{
					'to.type': 'fundPool'
				}
			];
		}
		let bills = await db.FundBillModel.find(q).sort({toc: 1});
		let total = 0;
		const arr = ['fund', 'fundPool'];
		bills.map(b => {
			if(type !== 'all') {
				if(b.from.type === 'fundPool') {
					total += b.money*-1;
				} else {
					total += b.money;
				}
			} else {
				if(!arr.includes(b.from.type) && arr.includes(b.to.type)) {
					total += b.money;
				}
				if(arr.includes(b.from.type) && !arr.includes(b.to.type)) {
					total += b.money*-1;
				}
			}
			b.balance = total;
		});
		const count = bills.length;
		const paging = apiFn.paging(page, count);
		data.paging = paging;
		bills = bills.reverse();
		data.balance = total;
		const targetBills = bills.slice(paging.start, (paging.start + paging.perpage));
		data.bills = await Promise.all(targetBills.map(async b => {
			await b.extendUser();
			await b.extendToInfo();
			await b.extendFromInfo();
			return b;
		}));
		ctx.template = 'interface_fund_general_bills.pug';
		await next();
	})
	.post('/', async (ctx, next) => {
		const {data, db, body} = ctx;
		const {user} = data;
		if(data.userLevel < 7) ctx.throw(400, '权限不足');
		const {billObj} = body;
		const {from, to, notes, money} = billObj;

		if(money <= 0) {
			ctx.throw(400, '金额不能小于0。');
		}

		//来自用户且匿名为否 未输入uid
		if(to.type === 'user' && !to.id && !to.anonymous) ctx.throw(400, '请输入用户UID。');
		if(from.type === 'user' && !from.id && !from.anonymous) ctx.throw(400, '请输入用户UID。');

		if(from.type === 'user') {
			if(!['fundPool', 'fund'].includes(to.type)) ctx.throw(400, '用户可执行的操作有：捐款给基金项目、捐款给资金池、退还剩余款项。');
			if(!from.anonymous && !from.id) ctx.throw(400, '请输入用户UID。');
			if(from.id) {
				const user = await db.UserModel.findOne({uid: from.id});
				if(!user) ctx.throw(400, '来源的用户不存在。');
			}
		} else if(from.type === 'fund') {
			const fund = await db.FundModel.findOne({_id: from.id});
			if(!fund) ctx.throw(400, '请选择正确的基金项目。');
			if(to.type === 'fund') {
				if(fund._id === to.id) ctx.throw(400, '资金来源与作用的基金项目不能相同。');
				const toFund = await db.FundModel.findOne({_id: to.id});
				if(!toFund) ctx.throw(400, '请选择正确的基金项目。');
			}
			if(to.type === 'other') {
				if(!to.id) ctx.throw(400, '请输入资金用途。');
			}
			const total = await db.FundBillModel.getBalance('fund', from.id);
			if(total < money) ctx.throw(400, '余额不足。');
		} else if(from.type === 'fundPool') {
			const total = await db.FundBillModel.getBalance('fundPool');
			if(total < money) ctx.throw(400, '余额不足。');
		} else if(from.type === 'other') {
			if(!from.id) ctx.throw(400, '请输入资金来源。')
		} else {
			ctx.throw(400, '未知的操作类型。');
		}

		if(!notes) {
			ctx.throw(400, '请输入备注。');
		}

		billObj.uid = user? user.uid: '';
		const newBill = db.FundBillModel(billObj);
		await newBill.save();
		await next();
	})
	.use('/:billId', async (ctx, next) => {
		const {data, db, params} = ctx;
		const {billId} = params;
		data.bill = await db.FundBillModel.findOnly({_id: billId});
		await next();
	})
	.get('/:billId', async (ctx, next) => {
		ctx.template = 'interface_fund_bill.pug';
		ctx.data.funds = await ctx.db.FundModel.find({disabled: false, history: false}).sort({toc: 1});
		await next();
	})
	.use('/:billId', async (ctx, next) => {
		const {data} = ctx;
		if(data.userLevel < 7) ctx.throw(401, '权限不足');
		await next();
	})
	.del('/:billId', async (ctx, next) => {
		const {bill} = ctx.data;
		await bill.remove();
		await next();
	})
	.patch('/:billId', async(ctx, next) => {
		const {body, data} = ctx;
		const {billObj} = body;
		const {from, to} = billObj;
		const {user} = data;
		if(to.type === 'user' && !to.id && !to.anonymous) ctx.throw(400, '请输入用户UID。');
		if(from.type === 'user' && !from.id && !from.anonymous) ctx.throw(400, '请输入用户UID。');

		const {bill} = ctx.data;
		bill.uid = user.uid;
		bill.tlm = Date.now();
		await bill.update(billObj);
		await next();
	});
module.exports = billsRouter;