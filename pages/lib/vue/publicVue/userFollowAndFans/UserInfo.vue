<template lang="pug">
  .userInfo
    .avatar(
      data-global-mouseover="showUserPanel"
      data-global-mouseout="hideUserPanel"
      :data-global-data="objToStr({uid: userData.uid})"
    )
      img(:src="setUrl( userData.avatar )")
    .describe
      .name(
        data-global-mouseover="showUserPanel"
        data-global-mouseout="hideUserPanel"
        :data-global-data="objToStr({uid: userData.uid})"
         )
        a.username( :title="userData.username" :href="'/u/' + userData.uid" target="_blank") {{ userData.username }}
      .grade( :title="userData.info?userData.info.certsName:''" ) {{ userData.info?userData.info.certsName:'' }}
      .introduce( :title="userData.description" ) {{ userData.description || "暂未填写个人简介"}}
    .follow-button(:title=`subUid.includes(userData.uid) ? "取关" : "关注" ` :class="{'active': !subUid.includes(userData.uid)}" @click="subscribe( userData.uid )" v-if="subUid" ) {{ subUid.includes(userData.uid) ? "取关" : "关注" }}
</template>
<script>
import {getUrl} from "../../../js/tools";
import {objToStr} from "../../../js/tools";
export default {
  data: () => ({
    userData: [],
    type: ""
  }),
  props: {
    user: {
      type: Object,
      required: true
    },
    pageType: {
      type: String,
      required: true
    },
    subUid: {
      type: Array,
      required: false,
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(n) {
        if (typeof n === "undefined") {
          console.error("user is undefined");
          return;
        }
        this.userData = n;
      }
    },
    pageType: {
      immediate: true,
      handler(n) {
        if (typeof n === "undefined") {
          console.error("pageType is undefined");
          return;
        }
        this.type = n;
      }
    }
  },
  mounted() {
  },
  methods: {
    objToStr: objToStr,
    subscribe(uid) {
      const self = this;
      if(!self.subUid) return;
      const method = self.subUid.includes(uid) ? "DELETE" : "POST";
      nkcAPI("/u/" + uid + "/subscribe", method, { cid: [] })
        .then(() => {
          sweetSuccess('操作成功');
          // self.$parent.getUserCardInfo();
          if(method === 'DELETE') {
            self.$emit('delete', uid);
          } else {
            self.$emit('add', uid);
          }
        })
        .catch(err => {
          sweetError(err);
        });
    },
    setUrl(avatar) {
      return getUrl("userAvatar", avatar);
    }
  },
};
</script>
<style scoped lang="less">
.name{
  width: 100%;
  .username{
    width: 100%;
    display: inline-block;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    padding-left: 0;
  }
}

.userInfo {
  margin: 1rem;
  height: 6rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  position: relative;
  border: 1px solid #eee;
  //box-shadow: 0 1px 3px 1px #f1d196 ;
  transition: all .5s linear;
  // &:hover{
    // box-shadow: 0 2px 5px 1px #bdac8e;
    // transform: translateY(-7px);
  // }
  /*display: -webkit-flex;*/
}
.userInfo .avatar {
  display: table-cell;
}
.userInfo .avatar img {
  height: 5rem;
  border-radius: 3px;
  width: 5rem;
}
.userInfo .describe {
  word-break: break-all;
  padding-left: 1rem;
  vertical-align: top;
  display: table-cell;
  /*flex-grow: 1;
  -webkit-flex: 1;*/
}
.userInfo .name {
  width: 70%;
  height: 1.6rem;
  font-size: 1.3rem;
  margin-right: 4rem;
  color: #2b90d9;
  display: inline-block;
}
.userInfo .follow-button {
  // height: 1.6rem;
  padding: 0.25rem 1rem;
  // line-height: 1.6rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  background-color: #9baec8;
  border-color: #9baec8;
  float: right;
  font-size: 1rem;
}
.userInfo .grade {
  font-size: 1rem;
  height: 1.4rem;
  color: #e85a71;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.userInfo .introduce {
  width: 100%;
  height: 1.6rem;
  padding-top: 0.2rem;
  font-size: 1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.active {
  background-color: #2b90d9!important;
}
</style>
