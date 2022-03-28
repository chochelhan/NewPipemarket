<template>
    <div class="page-contents">
        <div class="review-rating border-gray-200 border" v-if="type=='goodsDetail'">
            <div class="rating-total">
                <div class="rating-heading flex justify-between" style="justify-content: space-between;width:100%;">
                    <div class="rating-title" style="width:50%;padding-left:10px;">리뷰 ({{ reviewTotal }}개)</div>
                    <div class="flex items-center" style="width:50%;justify-content: flex-end;padding-right:10px;">
                        <img v-for="aimg in avgList" :src="aimg" alt=""/>
                        <div class="ml-2 font-semibold">{{ avgTotal }}</div>
                    </div>
                </div>
                <div class="rating-total-box">
                    <div class="flex items-center justify-center my-1">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                        </div>
                        <div class="rating-line">
                            <div class="rating-line-yellow" :style="totalReviewInfo.star5.style"></div>
                        </div>
                        <div class="rating-text">{{ totalReviewInfo.star5.per }}%</div>
                    </div>
                    <div class="flex items-center justify-center my-1">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                        </div>
                        <div class="rating-line">
                            <div class="rating-line-yellow" :style="totalReviewInfo.star4.style"></div>
                        </div>
                        <div class="rating-text">{{ totalReviewInfo.star4.per }}%</div>
                    </div>
                    <div class="flex items-center justify-center my-1">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                        </div>
                        <div class="rating-line">
                            <div class="rating-line-yellow" :style="totalReviewInfo.star3.style"></div>
                        </div>
                        <div class="rating-text">{{ totalReviewInfo.star3.per }}%</div>
                    </div>
                    <div class="flex items-center justify-center my-1">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                        </div>
                        <div class="rating-line">
                            <div class="rating-line-yellow" :style="totalReviewInfo.star2.style"></div>
                        </div>
                        <div class="rating-text">{{ totalReviewInfo.star2.per }}%</div>
                    </div>
                    <div class="flex items-center justify-center my-1">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                            <img src="../../assets/icons/starOff.svg" alt=""/>
                        </div>
                        <div class="rating-line">
                            <div class="rating-line-yellow" :style="totalReviewInfo.star1.style"></div>
                        </div>
                        <div class="rating-text">{{ totalReviewInfo.star1.per }}%</div>
                    </div>
                </div>
            </div>
            <div class="flex mt-5 justify-between">
                <div class="flex items-center" @click="setPhotoReview()">
                    <div
                        style="
                width: 20px;
                height: 20px;
                text-align:center;
                line-height:16px;
                border: 2px #000 solid;
                border-radius: 5px;">
                        <i class="fas fa-check" v-if="checkPhotoReview"></i>
                    </div>
                    <div style="font-size: 14px; color: #2f2f2f" class="ml-2">
                        포토 리뷰만
                    </div>
                </div>
                <div class="flex items-center" style="justify-content: flex-end"  @click="setSortReview()">
                    <div style="font-size: 14px; color: #2f2f2f" class="mr-2">{{ sortName }}</div>
                    <img src="../../assets/icons/arrow-down-gray.svg" alt=""/>
                </div>
            </div>
        </div>
        <div class="flex mt-5" style="justify-content: flex-end" v-else>
            <div class="flex" style="justify-content: flex-end;padding-right:25px;" @click="setPhotoReview()">
                <div
                    style="
                width: 20px;
                height: 20px;
                text-align:center;
                line-height:16px;
                border: 2px #000 solid;
                border-radius: 5px;">
                    <i class="fas fa-check" v-if="checkPhotoReview"></i>
                </div>
                <div style="font-size: 14px; color: #2f2f2f" class="ml-2">
                    포토 리뷰만
                </div>
            </div>

        </div>
        <div class="review-list">
            <div class="review-item" v-for="(item,index) in reviewList" style="border-bottom:none;">
                <div class="review-item-heading flex items-center justify-between" @click="goDetail(item.bbs_ix)">
                    <div class="profile-img">
                        <img v-if="item.profile_img" :src="item.profile_img" alt=""/>
                        <i v-else class="fa fa-user"></i>
                    </div>
                    <div class="review-item-user flex-1">
                        <div class="bbs-title">{{ item.name }}</div>
                        <div class="bbs-msg">{{item.viewName}}</div>

                    </div>
                    <div class="review-item-date">{{ item.regdate }}</div>
                </div>
                <div class="flex overflow-x-scroll hide-scrollbar mt-4" v-if="item.anotherImgs"
                     @click="goDetail(item.bbs_ix)">
                    <div class="bg-gray-200 mr-2" v-for="img in item.anotherImgs"
                         :style="{'background-image':'url('+img+')','background-repeat':'no-repeat','background-size':'cover','width':'130px','min-width':'130px','height':'130px'}"></div>
                </div>
                <div class="p-2 h-6 mt-4 border flex items-center justify-center rounded-md"
                     style="width: max-content" @click="goDetail(item.bbs_ix)" v-if="item.option_name">
                    <div class="text-xs text-gray-500"> {{ item.option_name }}</div>
                </div>
                <p class="mt-4 text-sm" style="color: #222222" v-html="item.bbs_contents"
                   @click="goDetail(item.bbs_ix)">
                </p>
                <div class="flex mt-4 justify-between w-full" style="justify-content:space-between">
                    <div class="flex star-img" style="width:50%;" @click="goDetail(item.bbs_ix)">
                        <img v-for="starImg in item.starList" :src="starImg" style="width:17px;" alt=""/>
                    </div>
                    <div class="flex" style="width:90px;justify-content: flex-end;">
                        <div class="mx-2 text-xs text-gray-400" style="padding-right:0;margin-right:0;">댓글
                            {{ item.cmtTotal }}개
                        </div>
                        <div class="flex items-center ml-3"
                             style="justify-content: flex-end;max-width:40px;padding:0;margin:0;" v-if="item.likeCheck"
                             @click="setLikeToggle(item.bbs_ix,index)">
                            <img src="../../assets/icons/like-blue.svg" alt=""/>
                            <div class="ml-2 text-xs text-gray-400" style="color: #617bea">{{ item.likeTotal }}</div>


                        </div>
                        <div class="flex items-center ml-3"
                             style="justify-content: flex-end;max-width:40px;padding:0;margin:0;" v-else
                             @click="setLikeToggle(item.bbs_ix,index)">

                            <img src="../../assets/icons/unlike.svg" alt=""/>
                            <div class="ml-2 text-xs text-gray-400">{{ item.likeTotal }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div style="padding:10px 20px 30px 20px;background:#fff;">
            <v-btn depressed
                   style="border-radius:10px;border:solid 1px #ddd;background:#fff;color:#949494;width:100%;height:40px;"
                   @click="goReviewList()" v-if="type=='goodsDetail'">
                리뷰 전체보기
            </v-btn>
        </div>
    </div>
</template>

<script>

import AUTH from "../../api/auth";
import UTIL from "../../api/util";
import apiService from "../../api/apiService";
import {
    API_URL_GET_REVIEW_LIST,
    API_URL_UPDATE_REVIEW_LIKE
} from "../../api/urls";
import onStarImg from "../../assets/icons/starOn.svg";
import offStarImg from "../../assets/icons/starOff.svg";

export default {
    props: ["pid", "type", "avgTotal","reviewSortCode"],
    data() {
        return {
            util: UTIL,
            reviewList: [],
            isLogin: false,
            page: 1,
            max: 5,
            reviewTotal:0,
            totalReviewInfo: {
                star1: {per: 0, style: {'width': 0}},
                star2: {per: 0, style: {'width': 0}},
                star3: {per: 0, style: {'width': 0}},
                star4: {per: 0, style: {'width': 0}},
                star5: {per: 0, style: {'width': 0}},
            },
            sortName:'최신순',
            avgList: [],
            checkPhotoReview:false,
        };
    },
    watch: {
        reviewSortCode(val) {
            switch(val) {
                case 'star':
                    this.sortName = '평점순';
                    break
                default:
                    this.sortName = '최신순';
                    break
            }
            this.getSortData();
        }
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        if (this.type != 'goodsDetail') this.max = 300;
        this.getData();


    },
    methods: {
        getData() {
            const frm = new FormData();
            frm.append("pid", this.pid)
            if (this.type == 'goodsDetail') {
                frm.append("reviewTotalInfo", 'totalInfo')
            }

            frm.append('page', this.page)
            frm.append('max', this.max)
            apiService.post(API_URL_GET_REVIEW_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    this.reviewList = [];
                    let onStarImg = require('../../assets/icons/starOn.svg');
                    let offStarImg = require('../../assets/icons/starOff.svg');
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = parseInt(now.getMonth())+1;

                    for (let item of res.data.reviewList.list) {
                        let starList = [];
                        for (let k = 1; k <= 5; k++) {
                            if (k <= parseInt(item.valuation_goods)) {
                                starList.push(onStarImg);
                            } else starList.push(offStarImg);
                        }

                        item.starList = starList;

                        if(item.petBirthdate) {
                            item.viewName = UTIL.getDogInfo(item);
                        } else {
                            item.viewName = item.petName;
                        }
                        this.reviewList.push(item)
                    }
                    this.reviewTotal = res.data.reviewList.total;
                    if (this.type == 'goodsDetail') {
                        for (let km = 1; km <= 5; km++) {
                            if (km <= parseInt(this.avgTotal)) {
                                this.avgList.push(onStarImg);
                            } else this.avgList.push(offStarImg);
                        }


                        let perTotal = 0;
                        let keyList = {};
                        for (let item of res.data.reviewTotalInfo) {
                            perTotal += parseInt(item.total)
                            keyList['star' + item.valuation_goods] = item.total;
                        }
                        for (let key in this.totalReviewInfo) {
                            if (keyList[key]) {
                                let per = parseInt(keyList[key]) / perTotal * 100;
                                this.totalReviewInfo[key] = {
                                    per: per.toFixed(0),
                                    style: {'width': per.toFixed(0) + '%'}
                                };

                            }
                        }

                    }
                }
            });

        },
        setPhotoReview() {
            if(this.checkPhotoReview)this.checkPhotoReview = false;
            else this.checkPhotoReview = true;
            this.getSortData()

        },
        setSortReview() {

          this.$emit('sortReviewShow')

        },
        getSortData() {
            const frm = new FormData();
            frm.append("pid", this.pid)
            frm.append('page', this.page)
            frm.append('photo',((this.checkPhotoReview)?1:0))
            frm.append('sort',this.reviewSortCode)
            frm.append('max', this.max)
            apiService.post(API_URL_GET_REVIEW_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    this.reviewList = [];
                    let onStarImg = require('../../assets/icons/starOn.svg');
                    let offStarImg = require('../../assets/icons/starOff.svg');
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = parseInt(now.getMonth())+1;
                    for (let item of res.data.reviewList.list) {
                        let starList = [];
                        for (let k = 1; k <= 5; k++) {
                            if (k <= parseInt(item.valuation_goods)) {
                                starList.push(onStarImg);
                            } else starList.push(offStarImg);
                        }
                        item.starList = starList;

                        if(item.petBirthdate) {
                            item.viewName = UTIL.getDogInfo(item);
                        } else {
                            item.viewName = item.petName;
                        }
                        this.reviewList.push(item)
                    }

                }
            });

        },
        goReviewList() {
            this.$router.push('/vgoods/listReview/' + this.pid);
        },
        goDetail(ix) {
            this.$router.push('/vgoods/reviewView/' + ix);
        },
        setLikeToggle(bbs_ix, index) {
            if (!this.isLogin) {
                let params = {
                    message: '먼저 로그인 하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
                return;
            }
            let item = this.reviewList[index];
            const frm = new FormData();
            frm.append('bbsIx', bbs_ix)
            apiService.post(API_URL_UPDATE_REVIEW_LIKE, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.likeCheck == 'del') {
                        item.likeCheck = false;
                        item.likeTotal = parseInt(item.likeTotal) - 1;
                    } else {
                        item.likeCheck = true;
                        item.likeTotal = parseInt(item.likeTotal) + 1;
                    }
                    this.$set(this.reviewList, index, item);
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

.rating-text {
    width: 35px;
    font-weight: bold;
    font-size: 13px;
}

</style>