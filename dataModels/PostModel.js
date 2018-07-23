const settings = require('../settings');
const mongoose = settings.database;
const {Schema} = mongoose;
const {indexPost, updatePost} = settings.elastic;

const postSchema = new Schema({
  pid: {
    type: String,
    unique: true,
    required: true
  },
  atUsers: {
    type: [Schema.Types.Mixed],
    default: []
  },
  c: {
    type: String,
    default: ''
  },
  credits: {
    type: [Schema.Types.Mixed],
    default: []
  },
  disabled: {
    type: Boolean,
    default: false,
    index: 1
  },
	// 是否被退回修改。true: 被退回， false: 被彻底屏蔽
	toDraft: {
		type: Boolean,
		default: null,
		index: 1
	},
  ipoc: {
    type: String,
    default: '0.0.0.0'
  },
  iplm: {
    type: String,
  },
  l: {
    type: String,
    required: true
  },
  recUsers: {
    type: [String],
	  index: 1,
    default: []
  },
  rpid: {
    type: [String],
    default: []
  },
  t: {
    type: String,
    default: ''
  },
  fid: {
    type: String,
    required: true,
    index: 1
  },
  tid: {
    type: String,
    required: true,
    index: 1
  },
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  tlm: {
    type: Date,
    default: Date.now,
    index: 1
  },
  uid: {
    type: String,
    required: true,
    index: 1
  },
  uidlm: {
    type: String,
    index: 1
  },
  hasImage: {
    type: Boolean,
    index: 1,
    default: false
  },
	hideHistories: {
  	type: Boolean,
		default: false
	},
	digest: {
  	type: Boolean,
		default: false,
		index: 1
	}
}, {toObject: {
  getters: true,
  virtuals: true
}});

postSchema.pre('save' , function(next) {
  if(!this.iplm) {
    this.iplm = this.ipoc;
  }
  if(!this.tlm) {
    this.tlm = this.toc;
  }
  if(!this.uidlm) {
    this.uidlm = this.uid;
  }
  next();
});

postSchema.virtual('reason')
	.get(function() {
		return this._reason
	})
	.set(function(reason) {
		this._reason = reason
	});

postSchema.virtual('user')
  .get(function() {
    return this._user
  })
  .set(function(u) {
    this._user = u
  });

postSchema.virtual('resources')
  .get(function() {
    return this._resources
  })
  .set(function(rs) {
    this._resources = rs
  });

postSchema.virtual('thread')
  .get(function() {
    return this._thread
  })
  .set(function(t) {
    this._thread = t
  });

postSchema.methods.extendThread = async function() {
  const ThreadModel = mongoose.model('threads');
  return this.thread = await ThreadModel.findOnly({tid: this.tid})
};

postSchema.methods.extendResources = async function() {
  const ResourceModel = mongoose.model('resources');
  return this.resources = await ResourceModel.find({references: this.pid})
};

postSchema.methods.extendUser = async function() {
  const UserModel = mongoose.model('users');
  return this.user = await UserModel.findOnly({uid: this.uid});
};

postSchema.methods.ensurePermissionNew = async function(options) {
	await this.thread.ensurePermission(options);
	const {isModerator, userOperationsId, uid} = options;
	if(this.disabled) {
		if(!isModerator) {
			if(this.toDraft && !userOperationsId.includes('displayRecycleMarkThreads')) {
				if(!uid || uid.uid !== this.uid) {
					const err = new Error('权限不足');
					err.status = 403;
					throw err;
				}
			}
			if(!this.toDraft && !userOperationsId.includes('displayDisabledPosts')) {
				const err = new Error('权限不足');
				err.status = 403;
				throw err;
			}
		}
	}
};

postSchema.methods.ensurePermission = async function(ctx) {
  const {ThreadModel} = ctx.db;
  const thread = await ThreadModel.findOnly({tid: this.tid});
  // 同时满足以下条件返回true
  // 1、能浏览所在帖子
  // 2、post没有被禁 或 用户为该板块的版主 或 具有比版主更高的权限
  return (await thread.ensurePermission(ctx) && (!this.disabled || await thread.ensurePermissionOfModerators(ctx)));
};


postSchema.pre('save', async function(next) {
  // analyzing the content(post.c) to find p.atUsers change

  try {
    const UserModel = mongoose.model('users');

    const {c} = this;
    const atUsers = []; //user info {username, uid}
    const existedUsers = []; //real User mongoose data model
    // 根据虎哥建议，重写@功能
    // 截取所有@起向后15字符的字符串
    var positions = [];
    var d = c.replace(/<[^>]+>/g,"");
    var pos = d.indexOf("@");
    while(pos > -1){
      positions.push(d.substr(pos+1, 30));
      pos = d.indexOf("@",pos+1)
    }
    // 验证每个@是否含有特殊字符
    for(var i in positions){
      var atPos = positions[i].indexOf("@"); // @符号位置
      var semiPos = positions[i].indexOf(";"); // 分号位置
      var colonPos = positions[i].indexOf(":"); // 冒号位置
      var ltPos = positions[i].indexOf("<"); // 左尖括号位置
      var comPos = positions[i].indexOf("，"); // 逗号位置
      var perPos = positions[i].indexOf("。"); // 句号位置
      if(atPos > -1){
        positions[i] = positions[i].substr(0,atPos)
      }else if(semiPos > -1){
        positions[i] = positions[i].substr(0,semiPos)
      }else if(colonPos > -1){
        positions[i] = positions[i].substr(0,colonPos)
      }else if(ltPos > -1){
        positions[i] = positions[i].substr(0,ltPos)
      }else if(comPos > -1){
        positions[i] = positions[i].substr(0,comPos)
      }else if(perPos > -1){
        positions[i] = positions[i].substr(0,perPos)
      }
      // 用户名从最后一个字符开始，逐个向前在数据库中查询
      var evePos = positions[i].toLowerCase();
      for(var num = evePos.length;num >= 0;num--){
        var factName = await UserModel.findOne({usernameLowerCase:evePos.substr(0,num)});
        if(factName){
          // positions[i] = factName.username;
          positions[i] = positions[i].substr(0,num);
          break;
        }
        if(num === 0 && factName === null){
          // positions[i] = "@科创论坛";
          positions.splice(i,0)
        }
      }
    }
    // 这是之前的，先屏蔽掉
    //  const matchedUsernames = c.match(/@([^@\s]*)\s/g);
    //  console.log(matchedUsernames)
    if (positions) {
      await Promise.all(positions.map(async str => {
        // const username = str.slice(1, -1); //slice the @ and [\s] in reg
        const usernameLowerCase = str.toLowerCase();
        // console.log(username)
        const user = await UserModel.findOne({usernameLowerCase});
        if (user) {
          const {uid} = user;
          const username = str;
          let flag = true; //which means this user does not in existedUsers[]
          for (const u of atUsers) {
            if (u.username === username)
              flag = false;
          }
          if (flag) {
            atUsers.push({username, uid});
            existedUsers.push(user)
          }
        }
      }))
    }
    // 被AT用户名单
    this.atUsers = atUsers;
    return next()
  } catch(e) {
    return next(e)
  }
});

// postSchema.pre('save', async function(next) {
//   // analyzing the content(post.c) to find p.atUsers change

//   try {
//     const UserModel = mongoose.model('users');

//     const {c} = this;
//     const atUsers = []; //user info {username, uid}
//     const existedUsers = []; //real User mongoose data model
//     const matchedUsernames = c.match(/@([^@\s]*)\s/g);
//     if (matchedUsernames) {
//       await Promise.all(matchedUsernames.map(async str => {
//         const username = str.slice(1, -1); //slice the @ and [\s] in reg
//         const user = await UserModel.findOne({username});
//         if (user) {
//           const {username, uid} = user;
//           let flag = true; //which means this user does not in existedUsers[]
//           for (const u of atUsers) {
//             if (u.username === username)
//               flag = false;
//           }
//           if (flag) {
//             atUsers.push({username, uid});
//             existedUsers.push(user)
//           }
//         }
//       }))
//     }
//     this.atUsers = atUsers;
//     return next()
//   } catch(e) {
//     return next(e)
//   }
// });

postSchema.pre('save', async function(next) {
  // analyzing the content (post.c) and changing the
  // resource.references to make resource has a
  // correct reference to the post
  try {
    const ResourceModel = mongoose.model('resources');

    const {_initial_state_: initialState} = this;
    const oldContent = initialState ? initialState.c : '';
    let hasImage = initialState ? initialState.hasImage : false;
    const hasImageWhenInitialized = hasImage;

	  const {c, pid, l} = this;
	  let oldResources = [], newResources = [];
	  if(l !== 'html') {
		  oldResources = (oldContent.match(/{r=[0-9]{1,20}}/g) || [])
		    .map(str => str.replace(/{r=([0-9]{1,20})}/, '$1'));
		  newResources = (c.match(/{r=[0-9]{1,20}}/g) || [])
		    .map(str => str.replace(/{r=([0-9]{1,20})}/, '$1'));
	  } else {
		  oldResources = (oldContent.match(/\/r\/[0-9]{1,20}/g) || [])
			  .map(str => str.replace(/\/r\/([0-9]{1,20})/, '$1'));
		  newResources = (c.match(/\/r\/[0-9]{1,20}/g) || [])
			  .map(str => str.replace(/\/r\/([0-9]{1,20})/, '$1'));
	  }

    const additional = newResources.filter(e => oldResources.indexOf(e) === -1);
    const removed = oldResources.filter(e => newResources.indexOf(e) === -1);

    // handle the hasImage property when deleting a resource.
    await Promise.all(removed.map(async rid => {
      const resource = await ResourceModel.findOne({rid});
      if (resource) {
        const index = resource.references.findIndex(e => e === pid);
        if (index) {
          // resource.references.splice(index, 1);
          if (['jpg', 'jpeg', 'bmp', 'svg', 'png', 'gif'].indexOf(resource.ext.toLowerCase()) > -1) {
            hasImage = false
          }
          // await resource.save()
        }
      }
    }));
    // handle additional
    await Promise.all(additional.map(async rid => {
      const resource = await ResourceModel.findOne({rid});
      if (resource) {
        if (!resource.references.includes(pid)) {
          resource.references.push(pid);
          await resource.save()
        }
        // post.hasImage depends on whether the resources has a img extension
        if (['jpg', 'jpeg', 'bmp', 'svg', 'png', 'gif'].indexOf(resource.ext.toLowerCase()) > -1) {
          hasImage = true
        }
      }
    }));

    if (hasImageWhenInitialized && !hasImage) {
      // this case means the request is updating a post and it used to have a image,
      // but after the above codes, it may not have any img, so check it
      const resources = await this.extendResources();
      if (resources.length) {
        const img = resources.find(e => ['jpg', 'jpeg', 'bmp', 'svg', 'png', 'gif'].indexOf(e.ext.toLowerCase()) > -1)
        if (img)
          hasImage = true
      }
    }

    this.hasImage = hasImage;
    return next()
  } catch(e) {
    return next(e)
  }
});

postSchema.pre('save', async function(next) {
  // handle the ElasticSearch index
  try {
    const {_initial_state_: initialState} = this;
    if (!initialState) {
      // if the initial state is undefined , this is a new post, index it
      await indexPost(this);
      return next()
    } else if (initialState.t !== this.t || initialState.c !== this.c) {
      // this is a old post, and we should check if its title or content has changed,
      // update the doc in elasticsearch when the attribute has changed
      await updatePost(this);
      return next()
    } else
      return next()
  } catch(e) {
    return next(e)
  }
});

postSchema.post('save', async function(doc, next) {
  // if p.atUsers has changed, we should generate a invitation

  try {
    const InviteModel = mongoose.model('invites');

    const {_initial_state_, atUsers} = doc;
    const oldAtUsers = _initial_state_ ? _initial_state_.atUsers : [];
    const notInformedUsers = atUsers
      .filter(at => !oldAtUsers // map the user not in oldAtUsers
        .find(oldAt => oldAt.uid === at.uid));
    await Promise.all(notInformedUsers
      .map(at => new InviteModel({
        invitee: at.uid,
        inviter: doc.uid,
        pid: doc.pid
      }).save())
    );
    return next()
  } catch(e) {
    return next(e)
  }
});

module.exports = mongoose.model('posts', postSchema);