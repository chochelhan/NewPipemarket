<template>
    <div class="home-page-contents" id="homeSlide">

        <div class="carousel relative relative overflow-hidden" id="main_banner">
            <div class="carousel-inner relative overflow-hidden w-full" @touchstart="onMouse" @touchend="outMouse">
                <swiper :options="swiperBannerOptions" ref="bannerSwiper"
                        @slideChangeTransitionStart="updateSwiperIndex" @slideChange="sliderEnd"  @click-slide="clickSlide">
                    <swiper-slide v-for="(banner,index) in bannerList">
                        <div  :style="{'width':'100%','height':'auto'}">
                            <img :src="banner.img" style="width:100%">
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="banner-count flex flex-row" style="z-index:80;">
                <div class="wrap-number">
                    <div>{{ swiperIndex }} / {{ bannerList.length }}</div>
                </div>
                <div class="wrap-icon" @click="bannerShow()">
                    <img src="../../../assets/images/bannerPopup.png" alt=""/>
                </div>
            </div>
        </div>
        <div>
            <div class="category-section">
                <div class="category-section-title">#카테고리별 인기상품</div>
                <div class="flex flex-wrap wrap-category-item justify-center wide-category">
                    <div :class="'category-item '+cate.gclass" v-for="cate in categorys"
                         @click="getCategoryGoods(cate.cid)">
                        <div>{{ cate.cname }}</div>
                    </div>

                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="wrap-cate-img" v-for="(goods,index) in cateGoodsList">
                        <div @click="goGoodsDetail(goods.id)" style="width:100%;height:109px;overflow: hidden;">
                            <img :src="goods.image_src" style="width:100%;">
                        </div>
                        <img @click="myWish(index)"
                             :src="goods.wish"
                             class="absolute bottom-0 right-0"
                             style="width:40px;bottom:-35px;"
                        />

                    </div>


                </div>
                <div class="wrap-best-seller">
                    <div class="title">이번주 베스트 상품👍</div>
                    <div v-for="goodsList in bestGoodsList" style="margin-bottom:20px;">
                        <swiper :options="swiperBestGoodsOptions">
                            <swiper-slide v-for="goods in goodsList" style="width:164px;">
                                <div class="wrap-post">
                                    <div class="relative">
                                        <div @click="goGoodsDetail(goods.id)"
                                             style="width:144px;height:144px;overflow: hidden">
                                            <img :src="goods.image_src" style="width:100%;">
                                        </div>
                                        <!--img
                                            :src="goods.wish"
                                            class="absolute bottom-0 right-0"
                                            style="right:30px;bottom:10px;width:30px;height:30px;"
                                        /-->
                                    </div>
                                    <h4 @click="goGoodsDetail(goods.id)" class="mt-4">{{ goods.pname }}</h4>
                                    <div @click="goGoodsDetail(goods.id)">
                                        <span class="product-discount font-semibold"
                                              v-if="parseInt(goods.discount_rate)>0">{{ goods.discount_rate }}%</span>
                                        <span class="product-price font-semibold">{{
                                                util.numberFormat(goods.dcprice)
                                            }}원</span>
                                        <span class="product-original-price font-extralight"
                                              v-if="parseInt(goods.discount_rate)>0">{{
                                                util.numberFormat(goods.listprice)
                                            }}원</span
                                        >
                                    </div>
                                    <div class="flex flex-row items-center">
                                        <img src="../../../assets/icons/starMark.svg"/>
                                        <span class="product-rate">{{
                                                goods.avg.goodsAvg
                                            }} ({{ goods.avgCount }})</span>
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>

                    </div>

                </div>
            </div>
            <div class="banner-img flex items-center justify-center" style="margin-top:-10px;"
                 v-if="specialBanner && specialBanner.banner_ix" id="native_banner">
                <div @click="goBannerLink(specialBanner.bd_link)"
                     :style="{'width':'100%','height':'120px','background':'url('+specialBanner.imgSrc+') no-repeat','background-position':'center center','background-size':'cover'}">
                </div>
            </div>
            <div class="list-gallery-section">
                <div
                    style="border:solid 1px #000;color:#000;margin-bottom:10px;border-radius:6px;width:50px;height:22px;text-align:center;font-size:12px;font-weight:600;line-height:22px;">
                    기획전
                </div>
                <div class="title">피리부가 준비했어요😘</div>
                <div class="gallery-section"
                     style="padding-bottom:27px;border:solid 1px #eaeaea;margin-bottom:50px;border-radius: 20px;margin-top:20px;"
                     v-for="item in specialList">
                    <div @click="goPlanDetail(item.event_ix)">
                        <img class="banner" :src="item.mainPath" alt=""/>
                        <div class="space-box">
                            <div class="title-post-1">{{ item.manage_title }}</div>
                            <div class="title-post-2">{{ item.event_title }}</div>
                            <div class="title-post-1" v-html="item.event_text"></div>
                            <div class="card-time flex" style="padding-top:10px;">
                                <img src="../../../assets/icons/date.svg"/>
                                <div style="padding-left:5px;"> {{ item.startDate }} - {{ item.endDate }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="specail-goods-list" v-if="item.productInfo" @touchstart="onMouse" @touchend="outMouse">
                        <swiper :options="swiperSpecialGoodsOptions" @slideChange="sliderEnd">
                            <swiper-slide v-for="goods in item.productInfo" class="goods-item">
                                <div @click="goGoodsDetail(goods.id)"
                                     :style="{'width':'66px','height':'66px','background':'url('+goods.image_src+') no-repeat','background-position':'center center','background-size':'100% auto'}">
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>

                <div class="other-post-title" @click="goSpecial()">기획전 더보기</div>
            </div>
            <div class="footer-store">
                <div class="policy flex items-center">
                    <div class="mr-2" @click="goPage('/vcustomer/agree/use')">이용약관</div>
                    <div>|</div>
                    <div class="mx-2" @click="goPage('/vcustomer/agree/private')">개인정보 처리방침</div>
                    <div>|</div>
                    <div class="ml-2" @click="goPage('/vcustomer/directNoticeList')">공지사항</div>
                </div>
                <div>서비스센터 : 070 - 4027 - 1031</div>
                <div>전화 상담 : AM 09:00 - PM 18:00 (점심 PM 12:00 - 13:00)</div>
                <div>카카오톡 상담 : 24시 연중무휴</div>
                <div class="info-sale" @click="showGuide()">
                    사업자 정보 <i v-if="!guideShow" class="fa fa-angle-down" aria-hidden="true"></i><i v-else
                                                                                                   class="fa fa-angle-up"
                                                                                                   aria-hidden="true"></i>
                </div>
                <div class="busi-guide-box-layout">
                    <ul class="busi-guide-box">
                        <li>• 상호 : 주식회사 게임베리</li>
                        <li>• 소재지 : 서울특별시 반포대로26길 15</li>
                        <li>• 대표: 임형철</li>
                        <li>• 사업자번호: 2148880047</li>
                        <li>• 사업자번호조회 통신판매업신고번호: 2020-서울서초-0988</li>
                        <li>• 개인정보관리자 : 신규섭</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import AUTH from '../../../api/auth'
import UTIL from '../../../api/util'
import {
    API_URL_GET_MAIN_INFO, API_URL_SET_GOODS_WISH
} from '../../../api/urls';
import apiService from '../../../api/apiService'
import JQ from "jquery";

export default {
    name: 'slideHome',
    components: {
        Swiper,
        SwiperSlide,

    },
    data() {
        return {
            util: UTIL,
            isLogin: false,
            bannerList: [],
            swiperIndex: 1,
            swiperBannerOptions: {
                slidesPerView: 1,
                loop: false,
            },
            categorys: [],
            cateGoodsList: [],
            allCateGoodsList: {},
            bestGoodsList: [],
            swiperBestGoodsOptions: {
                slidesPerView: 'auto',
                loop: true,
            },
            swiperSpecialGoodsOptions: {
                slidesPerView: 'auto',
            },
            specialBanner: {},
            specialList: [],
            guideShow: false,

        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        if (localStorage.getItem('homeMainBanners')) {
            this.bannerList = JSON.parse(localStorage.getItem('homeMainBanners'));

        }


        this.getData()
    },
    activated() {
        if (sessionStorage.getItem('homeSlideTop')) {
            JQ('#homeSlide').scrollTop(sessionStorage.getItem('homeSlideTop'));
            sessionStorage.setItem('homeSlideTop', '');
        }

    },
    methods: {
        clickSlide(obj) {
            let index = this.swiperIndex - 1;
            let banner = this.bannerList[index];
            this.goBannerLink(banner.link);
        },
        getData() {
            const frm = {}
            apiService.get(API_URL_GET_MAIN_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.mainBanners) {
                        this.bannerList = [];
                        for (let banner of res.data.mainBanners) {
                            let item = {
                                link: banner.bd_link,
                                img: banner.imgSrc
                            }
                            this.bannerList.push(item)
                        }
                        localStorage.setItem('homeMainBanners', JSON.stringify(this.bannerList));
                    }

                    if (res.data.specialBanner) {

                        this.specialBanner = res.data.specialBanner[0];
                    }
                    let k = 1;
                    let baseCid = '';
                    for (let item of res.data.categorys) {
                        if (k <= 8) {
                            item.cid = item.cid.substring(0, 3);
                            if (k < 2) {
                                baseCid = item.cid;
                                item.gclass = 'active';
                            } else item.gclass = '';
                            this.allCateGoodsList[item.cid] = [];
                            this.categorys.push(item)
                        }
                        k++;
                    }
                    this.cateGoodsList = [];
                    const onWish = require('../../../assets/icons/heartOn.svg');
                    const offWish = require('../../../assets/icons/heartOff.svg');


                    for (let item of res.data.categoryGoods) {
                        item.cid = item.cid.substring(0, 3);
                        if (this.allCateGoodsList[item.cid].length > 5) continue;

                        if (item.alreadyWish) {
                            item.wish = onWish;
                        } else item.wish = offWish;
                        this.allCateGoodsList[item.cid].push(item)
                        if (baseCid == item.cid) this.cateGoodsList.push(item);
                    }
                    this.bestGoodsList = res.data.bestGoodsList
                    if (res.data.specialList) {
                        this.specialList = [];
                        for (let item of res.data.specialList.list) {
                            item.event_text = UTIL.nl2brContent(item.event_text)
                            this.specialList.push(item)
                        }
                    }


                }
            });
        },
        goPage(url) {
            sessionStorage.setItem('homeSlideTop', JQ('#homeSlide').scrollTop());
            this.$router.push(url);
        },
        goSpecial() {
            this.$emit('goSpecial');
        },
        getCategoryGoods(cid) {
            for (let item of this.categorys) {
                if (item.cid == cid) {
                    item.gclass = 'active'
                } else item.gclass = ''
            }
            this.cateGoodsList = [];
            for (let goods of this.allCateGoodsList[cid]) {
                this.cateGoodsList.push(goods);
            }
        },
        updateSwiperIndex(obj) {
            this.swiperIndex = obj.activeIndex +1;

        },
        sliderEnd(obj) {
            this.$emit('menuSlideEnable');
        },
        goBannerLink(link) {
            if (link) {
                sessionStorage.setItem('homeSlideTop', JQ('#homeSlide').scrollTop());
                this.$router.push(link);
            }
        },
        goGoodsDetail(id) {
            sessionStorage.setItem('homeSlideTop', JQ('#homeSlide').scrollTop());
            this.$router.push('/vgoods/goodsView/' + id);
        },
        myWish(index) {
            if (this.isLogin) {
                let item = this.cateGoodsList[index];
                const frm = new FormData();
                frm.append('pid', item.id);
                apiService.post(API_URL_SET_GOODS_WISH, frm, (res) => {
                    const onWish = require('../../../assets/icons/heartOn.svg');
                    const offWish = require('../../../assets/icons/heartOff.svg');

                    if (res.data == 'delete') {
                        item.wish = offWish;
                    } else if (res.data == 'insert') {
                        item.wish = onWish;
                    } else {
                        let params = {
                            message: '잘못된 접근입니다'
                        }
                        this.$eventBus.$emit('modalOpen', params)
                        return;
                    }
                    this.$set(this.cateGoodsList, index, item);

                });
            } else {
                let params = {
                    message: '먼저 로그인하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
            }
        },
        bannerShow() {
            this.$eventBus.$emit('setBannerList', {list: this.bannerList});
        },
        goPlanDetail(ix) {
            sessionStorage.setItem('homeSlideTop', JQ('#homeSlide').scrollTop());
            this.$router.push('/vevent/planView/' + ix)
        },
        showGuide() {
            if (this.guideShow) {
                this.guideShow = false;
                JQ('.busi-guide-box-layout').slideUp(100);
            } else {
                this.guideShow = true;
                JQ('.busi-guide-box-layout').slideDown(100);
            }

        },
        onMouse(obj) {
            this.$emit('menuSlideDisable');
        },
        outMouse(obj) {
            this.$emit('menuSlideEnable');

        },
    }

}
</script>


<style lang="scss" scoped>

.home-page-contents {
    .product-price {
        font-size: 13px;
        color: #000;
        font-weight: bold;
        margin: 0 10px 0 0;
    }

    .product-discount {
        margin-right: 5px;
    }

    .category-item {
        &.active {
            background: #000;
            color: #fff;
        }
    }

    .menu {
        padding: 0 25px;
        overflow-x: scroll;
        display: grid;
        grid-auto-columns: max-content;
        grid-auto-flow: column;
        column-gap: 25px;
        height: 60px;
    }

    .menu .menu-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #555;
    }

    .menu-item-active {
        border-bottom: 2px solid #000;
        color: #000 !important;
    }

    .menu-title-active {
        font-weight: 600;
    }

    .carousel-open:checked + .carousel-item {
        position: static;
        opacity: 100;
    }

    .carousel-item {
        -webkit-transition: opacity 0.6s ease-out;
        transition: opacity 0.6s ease-out;
    }

    #carousel-1:checked ~ .control-1,
    #carousel-2:checked ~ .control-2,
    #carousel-3:checked ~ .control-3 {
        display: block;
    }

    .carousel-indicators {
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        bottom: 2%;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 10;
    }

    #carousel-1:checked
    ~ .control-1
    ~ .carousel-indicators
    li:nth-child(1)
    .carousel-bullet,
    #carousel-2:checked
    ~ .control-2
    ~ .carousel-indicators
    li:nth-child(2)
    .carousel-bullet,
    #carousel-3:checked
    ~ .control-3
    ~ .carousel-indicators
    li:nth-child(3)
    .carousel-bullet {
        color: #2b6cb0;
        /*Set to match the Tailwind colour you want the active one to be */
    }

    .banner-count {
        position: absolute;
        right: 11px;
        bottom: 11px;
    }

    .wrap-number {
        background-color: #8c867c;
        color: white;
        padding: 5px 10px;
        border-radius: 16px;
        opacity: 0.8;
        margin-right: 10px;
    }

    .banner-count .wrap-icon {
        background-color: #8c867c;
        opacity: 0.8;
        color: white;
        width: 33px;
        height: 33px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .category-section {
        padding: 45px 16px;
    }

    .category-section-title {
        font-size: 15px;
        font-weight: 600;
        text-align: center;
    }

    .category-item {
        padding: 5px 14px;
        border: 1px solid #777;
        border-radius: 15px;
        margin-right: 10px;
        margin-bottom: 12px;
        color: #777;
        font-size: 13px;
        border-color: #ccc;
    }

    .wrap-category-item {
        margin: 25px 0;
    }

    .wrap-cate-img {
        position: relative;
        width: 109px;
        height: 109px;
    }

    .wrap-cate-img img {
        width: 100%;
        height: 100%;
    }

    .wrap-best-seller {
        border-top: 1px solid #eee;
        padding: 50px 0px 10px 0px;
        margin-top: 45px;
    }

    .best-seller-list {
        overflow-x: scroll;
        display: grid;
        grid-auto-columns: max-content;
        grid-auto-flow: column;
        column-gap: 25px;
    }

    .wrap-best-seller .title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 20px;
    }

    .product-discount {
        color: #d80c0c;
        font-size: 12px;
        font-weight: bold;
    }

    .product-price {
        color: #000;
        font-weight: bold;
        margin: 0 10px 0 0;
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

    .wrap-post {
        width: 144px;
    }

    .img-post {
        width: 100%;
        height: 144px;
    }

    .banner-img {
        width: 100%;
        height: 120px;
        margin-bottom: 50px;
        background-color: #eee;
    }

    .gallery-section {
        margin-bottom: 35px;
    }

    .list-gallery-section {
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .list-gallery-section .title {
        font-size: 20px;
        font-weight: 600;
    }

    .gallery-section .banner {
        width: 100%;
        height: 190px;
        margin: 0 0 20px 0;
        border-radius: 20px 20px 0 0;
    }

    .gallery-section .title-post-1 {
        color: #555;
        font-size: 13px;
    }

    .gallery-section .title-post-2 {
        color: #333;
        font-weight: 600;
        font-size: 23px;
        margin: 9px 0;
    }

    .space-box {
        padding: 0 20px;
    }

    .specail-goods-list {
        /*overflow-x: scroll;
        display: grid;
        grid-auto-columns: max-content;
        grid-auto-flow: column;
        column-gap: 11px;
         */
        margin: 17px 20px 0 20px;
        max-width: calc(100vw - 80px);
        overflow: hidden;
        .goods-item {
            width: 77px;
        }

    }

    .post-relate-img {
        width: 66px;
        height: 66px;
        background: #eee;
    }


    .other-post-title {
        margin-bottom: 10px;
        text-align: center;
        color: #737373;
    }

    .footer-store {
        padding: 20px;
        border-top: 1px solid #eee;
        padding-bottom: 100px;
    }

    .footer-store p {
        color: #888;
        font-size: 12px;
    }

    .policy {
        margin-bottom: 20px;
    }

    .info-sale {
        margin-top: 20px;
    }

    .scroll-up {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        align-items: center;
        display: flex;
        justify-content: center;
        color: #949494;
        background-color: white;
        position: fixed;
        right: 20px;
        bottom: 100px;
    }

    .scroll-up i {
        font-size: 18px;
    }

    .busi-guide-box-layout {
        display: none;
        background: #f1f1f1;
        border-radius: 10px;
        padding: 17px 20px;
        margin-top: 13px;

        .busi-guide-box {
            padding: 0;
            font-size: 12px;
            color: #888888;

            li {
                padding: 3px 0;
            }

        }
    }


}

.wide-category {
    min-width: calc(100vw) !important;
    margin-left: -15px !important;
    flex-wrap: nowrap !important;
    justify-content: center !important;

    .category-item {
        margin-right: 5px;

        &:last-child {
            margin-right: 0;
        }

        &:first-child {
            margin-left: 0;
        }

        padding-left: 10px;
        padding-right: 10px;
    }
}
</style>