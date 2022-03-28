<template>
    <div class="page-contents" style="background-color: #fff;min-height:calc(100vh - 50px);padding-top:24px;">
        <div style="padding-bottom:100px">
            <div class="review-list">
                <div class="review-item p-6">
                    <div class="review-item-heading flex items-center justify-between">
                        <div class="profile-img">
                            <img v-if="profileImg" :src="profileImg" alt=""/>
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <div class="review-item-user flex-1">
                            <div class="bbs-title">{{ info.name }}</div>
                            <div class="bbs-msg">{{ info.viewName }}</div>
                        </div>
                        <div class="review-item-date">{{ info.reg_date }}</div>
                    </div>
                    <div class="flex overflow-x-scroll hide-scrollbar mt-4" v-if="info.anotherImgs">
                        <div @click="goImageView(index)" class="bg-gray-200 mr-2" v-for="(img,index) in info.anotherImgs"
                             :style="{'background-image':'url('+img+')','background-repeat':'no-repeat','background-size':'cover','width':'130px','min-width':'130px','height':'130px'}">

                        </div>
                     </div>
                    <div v-if="info.option_name" class="
              px-4
              py-2
              h-6
              mt-4
              border
              flex
              items-center
              justify-center
              rounded-md
            "
                        style="width: max-content"
                    >

                        <div  class="text-xs text-gray-500">{{ info.option_name }}</div>
                    </div>
                    <p class="mt-4 text-sm" style="color: #222222" v-html="info.bbs_contents">
                    </p>
                    <div class="flex mt-4 justify-between w-full" style="justify-content:space-between">
                        <div class="flex star-img" style="width:50%;">
                            <img v-for="starImg in starList" :src="starImg" style="width:17px;" alt=""/>
                        </div>
                        <div class="flex" style="width:90px;justify-content: flex-end;">
                            <div class="mx-2 text-xs text-gray-400" style="padding-right:0;margin-right:0;">댓글 {{ cmtCount }}개</div>
                            <div class="flex items-center ml-3"
                                 style="justify-content: flex-end;max-width:40px;padding:0;margin:0;" v-if="likeCheck"
                                 @click="setLikeToggle()">
                                <img src="../../assets/icons/like-blue.svg" alt=""/>
                                <div class="ml-2 text-xs text-gray-400" style="color: #617bea">{{likeTotal }}</div>


                            </div>
                            <div class="flex items-center ml-3"
                                 style="justify-content: flex-end;max-width:40px;padding:0;margin:0;" v-else
                                 @click="setLikeToggle()">

                                <img src="../../assets/icons/unlike.svg" alt=""/>
                                <div class="ml-2 text-xs text-gray-400">{{ likeTotal }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="review-item p-6 pb-0 border-0" style="border-bottom:none;" v-for="item in cmtList">
                    <div class="review-item-heading flex items-center justify-between">
                        <div class="profile-img">
                            <img v-if="item.profile_img" :src="item.profile_img" alt=""/>
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <div class="review-item-user flex-1">
                            <div class="bbs-title">{{ item.name }}</div>
                            <div class="bbs-msg">{{ item.petName }}</div>
                        </div>
                        <div class="review-item-date">{{ item.regdate.replace('-','.').replace('-','.') }}</div>
                    </div>
                    <p class="mt-4 text-sm" style="color: #222222" >
                        {{item.cmt_contents}}
                    </p>
                </div>
                <div class="w-full fixed p-2 px-4 mt-14 bg-white bottom-0">
                    <form novalidate @submit.prevent="validate">
                    <input
                        v-model="contents"
                        placeholder="댓글을 입력해주세요"
                        class="w-full border rounded-3xl px-4 text-xs"
                        style="height: 44px;border:solid 1px #ddd;"
                    />
                        <input type="submit" style="display: none" ref="submitBtn">
                    <img
                        src="../../assets/icons/enter.svg"
                        class="absolute right-8 top-0 bottom-0 m-auto"
                        @click="cmtSubmit()"
                    />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {API_URL_GET_REVIEW_INFO, API_URL_INSERT_REVIEW_COMMENT, API_URL_UPDATE_REVIEW_LIKE} from "../../api/urls";
import onStarImg from "../../assets/icons/starOn.svg";
import offStarImg from "../../assets/icons/starOff.svg";
import UTIL from "@/api/util";

export default {
    data() {
        return {
            isLogin: false,
            ix: '',
            profileImg: '',
            info: {},
            starList: [],
            contents:'',
            cmtList:[],
            cmtCount:0,
            likeCheck:false,
            likeTotal:0,
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('리뷰 상세');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        this.ix = this.$route.params.ix;
        this.getData()
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('bbs_ix', this.ix)
            apiService.post(API_URL_GET_REVIEW_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    let onStarImg = require('../../assets/icons/starOn.svg');
                    let offStarImg = require('../../assets/icons/starOff.svg');
                    let starList = [];
                    for (let k = 1; k <= 5; k++) {
                        if (k <= parseInt(res.data.info.review.valuation_goods)) {
                            starList.push(onStarImg);
                        } else starList.push(offStarImg);
                    }
                    this.info = res.data.info.review;

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = parseInt(now.getMonth())+1;
                    if(this.info.petBirthdate) {
                        this.info.viewName = UTIL.getDogInfo(this.info);

                    } else {
                        this.info.viewName = this.info.petName;
                    }
                    this.cmtCount = res.data.info.cmtCount;
                    this.likeCheck = this.info.likeCheck
                    this.likeTotal = this.info.likeTotal
                    this.starList = starList;
                    if (this.info.profile_img) this.profileImg = this.info.profile_img;
                    this.cmtList = [];
                    for(let item of res.data.info.cmt) {

                        let pets = item.pets[0];
                        item.petName =UTIL.getDogInfo(pets);
                        this.cmtList.push(item);
                    }

                } else {
                    this.$router.back();
                }
            });
        },
        cmtSubmit() {
            this.$refs.submitBtn.click();
        },
        goImageView(index) {
            sessionStorage.setItem('reviewImgs',JSON.stringify(this.info.anotherImgs));
            this.$router.push('/vgoods/reviewImg/'+index)
        },
        validate() {
            if(!this.isLogin) {
                let params = {
                    message:'먼저 로그인 하세요'
                }
                this.$eventBus.$emit('modalOpen',params)
                return;
            }

            if(!this.contents) {
                let params = {
                    message:'댓글을 입력하세요'
                }
                this.$eventBus.$emit('modalOpen',params)
            }
            const frm = new FormData();
            frm.append('bbs_ix', this.ix)
            frm.append('contents', this.contents)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_REVIEW_COMMENT, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                this.contents = '';
                if (res.data.result == 'success') {
                    this.cmtCount = parseInt(this.cmtCount)+1;

                    this.cmtList = [];
                    for(let item of res.data.list) {

                        let age = '';
                        const now = new Date();
                        const year = now.getFullYear();
                        let pets = item.pets[0];
                        let date = pets.birthDate.split('-');
                        age = year - parseInt(date[0]) + 1;
                        item.petName = pets.name + '・' + age + '살・' + pets.weight + 'kg';
                        this.cmtList.push(item);
                    }
                    scrollTo(0,0)
                } else {

                }
            });
        },
        setLikeToggle() {
            if (!this.isLogin) {
                let params = {
                    message: '먼저 로그인 하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
                return;
            }
            const frm = new FormData();
            frm.append('bbsIx', this.ix)
            apiService.post(API_URL_UPDATE_REVIEW_LIKE, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.likeCheck == 'del') {
                        this.likeCheck = false;
                        this.likeTotal = parseInt(this.likeTotal) - 1;
                    } else {
                        this.likeCheck = true;
                        this.likeTotal = parseInt(this.likeTotal) + 1;
                    }
                }
            });
        }
    }

}
</script>
<style lang="scss" scoped>
@import "../../assets/style/product_detail.css";

.profile-img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    overflow: hidden;
    font-size: 17pt;
    text-align: center;
    background: #eee;

    img {
        width: 40px;
        min-height: 40px;
    }

    i {
        margin-top: 10px;
    }
}

.bbs-title {
    color: #111;
    font-weight: bold;
}

.bbs-msg {
    color: #797979;
}
</style>