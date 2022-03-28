<template>
    <div class="review-page-contents">
        <div class="w-full wrap">
            <div class="review-item" v-for="item in reviewList">
                <div class="user-review flex flex-row justify-between items-center"  style="padding-top:10px;">
                    <div class="user-info flex flex-row items-center">
                        <div class="profile-img">
                            <img v-if="item.profile_img" :src="item.profile_img" alt=""/>
                            <i v-else class="fa fa-user"></i>
                        </div>

                        <div class="bbs-info">
                            <div class="bbs-title">{{ item.name }}</div>
                            <div class="bbs-msg">{{item.viewName}}</div>
                        </div>
                    </div>
                    <div class="time">
                        {{ item.regdate }}
                    </div>
                </div>
                <div class="product-item flex flex-row" @click="goProduct(item.pid)">
                    <div
                        :style="{'background-image':'url('+item.pimg+')','background-repeat':'no-repeat','background-size':'cover','width':'46px','height':'46px'}"></div>
                    <div style="padding-left:10px;">
                        <div>{{ item.pname }}</div>
                        <div class="flex flex-row wrap-info-product">
                            <div style="font-weight: 600; color: #d80c0c" v-if="item.discount_rate>0">{{ item.discount_rate }}%</div>
                            <div style="font-weight: 600; margin: 0 5px">{{ util.numberFormat(item.dcprice) }}원</div>
                            <div style="text-decoration: line-through; color: #999"  v-if="item.discount_rate>0">{{ util.numberFormat(item.listprice) }}원</div>
                        </div>
                    </div>
                </div>
                <div class="post-item-info">
                    <div class="review-img" v-for="img in item.anotherImgs">
                        <img style="min-width:auto;min-height:auto;width:auto;height:auto;max-width:100%;" :src="img">
                    </div>

                    <div class="tag-product" v-if="item.option_name">
                        {{ item.option_name }}
                    </div>

                    <p class="text-sm mb-3" v-html="item.bbs_contents">
                    <div class="flex flex-row justify-between wrap-review">
                        <div class="flex flex-row">

                            <i v-for="star in item.starList" :class="'fa fa-star '+star" aria-hidden="true"></i>

                        </div>
                        <p style="color: #777">
                            <i class="fa fa-thumbs-o-up"></i>
                            {{ item.likeTotal }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import UTIL from "../../api/util";
import apiService from "../../api/apiService";
import {
    API_URL_GET_REVIEW_LIST
} from "../../api/urls";
import JQ from "jquery";

export default {
    data() {
        return {
            util: UTIL,
            reviewList: [],
            page: 1,
            max: 20,
            total: 0,
            nextPage: 1,
            curPage: 1,
            lastPage: 1,

        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('리뷰');
        this.setBackUrl('');
        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('page', this.page)
            frm.append('max', this.max)
            apiService.post(API_URL_GET_REVIEW_LIST, frm, (res) => {
                if (res.data.result == 'success') {

                    this.nextPage = res.data.reviewList.paging.next_page;
                    this.lastPage = res.data.reviewList.paging.last_page;
                    this.curPage = res.data.reviewList.paging.cur_page;

                    this.total = parseInt(res.data.reviewList.total);
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = parseInt(now.getMonth())+1;
                    for (let item of res.data.reviewList.list) {
                        let starList = [];
                        for (let k = 1; k <= 5; k++) {
                            if (k <= parseInt(item.valuation_goods)) {
                                starList.push('star-selected');
                            } else starList.push('star-unselected');
                        }
                        item.discount_rate = 0;
                        if(item.listprice) {
                            let discount_rate = 100 - ((item.dcprice/item.listprice) *100);
                            item.discount_rate = discount_rate.toFixed(0);


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
        goProduct(id) {
            this.$router.push('/vgoods/goodsView/'+id);
        }

    },
    destroyed() {
        JQ('.review-page-contents').off('scroll');
    },
    updated() {
        let winHeight = JQ(window).height();
        let obj = this;
        JQ('.review-page-contents').on('scroll',function(e) {
            e.preventDefault();
            let top = e.target.scrollTop;
            let targetHeight = JQ(this).prop('scrollHeight') - JQ(this).height() -120;

            if(targetHeight < top) {

                if (obj.total > 0) {
                    if (obj.nextPage != obj.curPage) {
                        obj.page = obj.nextPage;
                        obj.getData();
                    }
                }
            }


        })
    }

}
</script>

<style lang="scss" scoped>
.review-page-contents {
    padding-top:20px;
    height:calc(100vh - 20px);
    overflow-y:auto;
    background:#fff;
    .review-img {
        padding: 10px 0;

        img {
            width: auto !important;
            min-width: auto !important;
            max-width: 100% !important;
            height: auto !important;
        }
    }

    .wrap {
        padding: 16px 21px;
    }

    .review-item .user-review img {
        width: 40px;
        height: 40x;
        border-radius: 50%;
        margin: 8px;
    }

    .review-item {
        padding-bottom: 34px;
        border-bottom: 1px solid #eee;
    }

    .review-item:last-child {
        padding-bottom: 34px;
        border-bottom: 0px solid #eee;
    }

    .review-item .user-review .info p {
        font-size: 12px;
    }

    .review-item .user-review .info .title {
        font-weight: 600;
    }

    .review-item .user-review .info .content {
        color: #797979;
    }

    .review-item .user-review .time {
        color: #797979;
        font-size: 12px;
    }

    .review-item .product-item {
        padding: 9px;
        border: 1px dashed #ddd;
        border-radius: 5px;
        margin-bottom: 12px;
        margin-top: 5px;
    }

    .review-item .product-item img {
        width: 46px;
        height: 46px;
        margin-right: 9px;
        border-radius: 7px;
    }

    .review-item .wrap-info-product {
        font-size: 12px;
    }

    .post-item-info img {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 5px;
        margin-bottom: 14px;
    }

    .post-item-info .tag-product {
        border-radius: 4px;
        border: 1px solid #ddd;
        padding: 2px 7px;
        color: #888;
        display: inline-block;
        margin-bottom: 12px;
        font-size: 12px;
    }

    .wrap-review .star-selected {
        color: rgb(255, 180, 13);
    }

    .wrap-review .star-unselected {
        color: rgb(226, 226, 226);
    }

    .wrap-review {
        margin-top: 14px;
    }

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
}
</style>