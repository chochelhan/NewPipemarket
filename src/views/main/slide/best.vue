<template>
    <div class="best-page-container" id="bestSlide">
        <div class="overlay-box" v-if="!serverInit">
            <v-progress-circular
                :size="40"
                color="indigo darken-1"
                indeterminate
            ></v-progress-circular>
        </div>
        <div v-else>
            <div class="wrap-list-item">
                <div class="text-order" id="filter" @click="sortOpen()">
                    {{ sortName }} <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <div class="list-item-section">
                    <div class="wrap-post w-full flex flex-row justify-between" style="width:100%;"
                         v-for="(goods,index) in goodsList" :id="'best'+(index+1)">
                        <img class="order-img" src="../../../assets/images/best1.png" v-if="index<1" alt=""/>
                        <img class="order-img" src="../../../assets/images/best2.png" v-else-if="index==1" alt=""/>
                        <img class="order-img" src="../../../assets/images/best3.png" v-else-if="index==2" alt=""/>
                        <div class="order-number" v-else>{{ index + 1 }}</div>
                        <div class="relative wrap-img-post" style="min-width:106px;position: relative;">
                            <img @click="goGoodsDetail(goods.id)"
                                 class="img-post"
                                 :src="goods.image_src"
                                 alt="#"
                            />
                            <div class="wish-box" @click="myWish(index)" v-if="!goods.alreadyWish"
                                 :style="{'background':'url('+offw+') no-repeat','background-position': 'center center','background-size':'cover'}">
                            </div>
                            <div class="wish-box" @click="myWish(index)" v-else
                                 :style="{'background':'url('+onw+') no-repeat','background-position': 'center center','background-size':'cover'}">
                            </div>
                        </div>
                        <div class="flex-1" style="min-width:150px;" @click="goGoodsDetail(goods.id)">
                            <h4 class="mt-4 product-name">{{ goods.pname }}</h4>
                            <div>
                            <span class="product-discount font-semibold"
                                  v-if="parseInt(goods.discount_rate)>0">{{ goods.discount_rate }}%</span>
                                <span class="product-price font-semibold">{{ util.numberFormat(goods.dcprice) }}원</span>
                                <span class="product-original-price font-extralight"
                                      v-if="parseInt(goods.discount_rate)>0">{{
                                        util.numberFormat(goods.listprice)
                                    }}원</span>
                            </div>
                            <div class="flex flex-row items-center wrap-rate">
                                <img src="../../../assets/icons/starMark.svg"/>
                                <span class="product-rate"> {{ goods.avg.goodsAvg }} ({{ goods.avgCount }})</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>


import AUTH from '../../../api/auth'
import {
    API_URL_GET_BEST_LIST,
    API_URL_SET_GOODS_WISH,
} from '../../../api/urls';
import apiService from '../../../api/apiService'
import UTIL from "../../../api/util";
import JQ from "jquery";
import offWish from '../../../assets/icons/heartOff.svg';
import onWish from '../../../assets/icons/heartOn.svg';

export default {
    name: 'slideBest',
    props: ["sortCode","currentSlideIndex", "activeContentIndex"],
    watch: {
        activeContentIndex(val) {
            if (this.currentSlideIndex == val) {
                if (!this.serverInit) {
                    this.getData();
                }

            }
        },
        sortCode(val) {
            this.getData();
            switch (val) {
                case '1day':
                    this.sortName = '1일';
                    break;
                case '1week':
                    this.sortName = '1주일';
                    break;
                case '1mon':
                    this.sortName = '1개월';
                    break;
                case '3mon':
                    this.sortName = '3개월';
                    break;
                case '6mon':
                    this.sortName = '6개월';
                    break;
                case 'all':
                    this.sortName = '전체';
                    break;
            }

        }
    },
    data() {
        return {
            util: UTIL,
            isLogin: false,
            goodsList: [],
            sortName: '3개월',
            offw: offWish,
            onw: onWish,
            serverInit:false,
        }
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }

    },
    activated() {
        if (sessionStorage.getItem('mainSlideTop')) {
            JQ('#bestSlide').scrollTop(sessionStorage.getItem('mainSlideTop'));
            sessionStorage.setItem('mainSlideTop', '');
        }

    },
    methods: {
        getData() {
            const frm = {
                sort: this.sortCode
            }
            apiService.get(API_URL_GET_BEST_LIST, frm, (res) => {

                if (res.data.result == 'success') {
                    this.goodsList = res.data.goodsList;
                    this.serverInit = true;
                }
            });
        },
        goGoodsDetail(id) {
            sessionStorage.setItem('mainSlideTop', JQ('#bestSlide').scrollTop());
            this.$router.push('/vgoods/goodsView/' + id);
        },
        myWish(index) {
            if (this.isLogin) {
                let item = this.goodsList[index];
                const frm = new FormData();
                frm.append('pid', item.id);
                apiService.post(API_URL_SET_GOODS_WISH, frm, (res) => {
                    if (res.data == 'delete') {
                        item.alreadyWish = false;
                    } else if (res.data == 'insert') {
                        item.alreadyWish = true;
                    } else {
                        let params = {
                            message: '잘못된 접근입니다'
                        }
                        this.$eventBus.$emit('modalOpen', params)
                        return;
                    }
                    this.$set(this.goodsList, index, item);

                });
            } else {
                let params = {
                    message: '먼저 로그인하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
            }
        },
        sortOpen() {
            let params = {
                pageCode: 'best',
            }
            this.$eventBus.$emit('setSort', params);
        }
    }

}
</script>


<style lang="scss" scoped>

.best-page-container {
    width: calc(100vw) !important;
    background-color: #f1f1f1;

    .wrap-list-item {
        padding: 15px;
        background-color: #f1f1f1;
    }

    .text-order {
        color: #333;
        font-size: 13px;
        text-align: center;
    }

    .text-order i {
        font-size: 15px;
    }

    .list-item-section {
        background-color: white;
        border-radius: 30px;
        padding: 19px;
        margin-top: 16px;
        margin-bottom: 16px;
        margin-bottom: 100px;
    }

    .wrap-post {
        padding-bottom: 18px;
        margin-bottom: 16px;
        border-bottom: 1px solid #eee;
    }

    .wrap-post:last-child {
        padding-bottom: 0;
        margin-bottom: 16px;
        border-bottom: 0;
    }

    .img-post {
        width: 100%;
        border-radius: 15px;
    }

    .product-discount {
        color: #d80c0c;
        font-size: 12px;
        font-weight: bold;
    }

    .product-price {
        font-size: 12px;
        font-weight: bold;
    }

    .product-original-price {
        font-size: 12px;
        color: #999;
        text-decoration-line: line-through;
    }

    .product-rate {
        margin-left: 3px;
        font-size: 11px;
        color: #6e6e6e;
    }

    .wrap-img-post {
        width: 106px;
        height: 106px;
        margin-right: 16px;
    }

    .wrap-img-post img {
        width: 106px;
        height: 106px;
    }

    .order-img {
        align-self: center;
        margin-right: 14px;
    }

    .order-number {
        align-self: center;
        margin-right: 14px;
        width: 28px;
        text-align: center;
    }

    .wrap-rate {
        margin-top: 12px;
    }

}

.wish-box {
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    padding: 0;


}

.product-name {
    display: inline-block;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    height: 1.2em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;


}
.overlay-box {
    width: 100%;
    text-align: center;
    padding-top: 200px;

}
</style>