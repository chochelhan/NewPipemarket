<template>
    <div class="page-container goods-detail-box">
        <div style="margin-bottom: 100px; background-color: #eeeeee">
            <div id="sticky-top-box" >
                <div class="carousel relative rounded relative">
                    <swiper :options="swiperOptions" ref="contentSwiper"
                            @slideChangeTransitionStart="updateSwiperIndex">
                        <swiper-slide v-for="(img,index) in imgList" :key="index">
                            <div
                                :style="{'background':'url('+img+') no-repeat','background-size':'cover','background-position':'center center','width':'100%','height':'350px'}">
                            </div>

                        </swiper-slide>
                    </swiper>
                    <div class="wrap-number swiper-pagination">
                        <p>{{ swiperIndex }} / {{ imgList.length }}</p>
                    </div>
                </div>

                <div class="product-info">
                    <div class="product-breadcrumb flex items-center justify-between">
                        <div class="product-breadcrumb-left flex">
                            <p>{{ categoryNames[0] }}</p>
                            <img v-if="categoryNames[1]" src="../../assets/icons/arrow-right.svg" class="mx-2"/>
                            <p v-if="categoryNames[1]">{{ categoryNames[1] }}</p>
                        </div>
                        <div class="product-breadcrumb-right" style="padding-top:0;margin-top:-15px;">
                            <!-- {{ info.com_name }} -->
                        </div>
                    </div>
                    <div class="product-title font-semibold">{{ info.pname }}</div>
                    <div class="product-prices flex items-center">
                        <div class="product-sale" v-if="parseInt(info.discount_amount)>0">{{
                                info.discount_rate
                            }}%
                        </div>
                        <div class="view-product-price" v-if="info.dcprice">{{ util.numberFormat(info.dcprice) }}원</div>
                        <div class="product-origin-price" v-if="parseInt(info.discount_amount)>0">
                            {{ util.numberFormat(info.listprice) }}원
                        </div>
                    </div>
                    <div class="product-description">
                        {{ info.shotinfo }}
                    </div>
                    <div class="flex" style="justify-content: flex-start">
                        <div class="flex goods-star" style="max-width:90px;">
                            <img v-for="avgImg in avgList" :src="avgImg"/>
                        </div>
                        <div class="mx-3" style="font-weight:bold;">{{ goodsAvg }}</div>
                    </div>
                </div>
            </div>
            <div class="product-tab flex sticky-tab" style="max-width:500px;">
                <div :class="'product-tab-item '+tabClass['info']" @click="showContent('info')" id="product_info_select">상품정보</div>
                <div :class="'product-tab-item '+tabClass['review']" @click="showContent('review')"  id="product_review_select">리뷰({{
                        setting.allReviewTotal
                    }}개)
                </div>
                <div :class="'product-tab-item '+tabClass['qna']" @click="showContent('qna')" id="product_inquiry_select">문의</div>
            </div>
            <div class="content-box" id="info-content">
                <div class="description">
                    <div class="basicinfo-content" :style="contentStyle" v-html="info.basicinfo"></div>
                    <div class="flex items-center justify-center more-content-button" @click="moreContent()">
                        <p class="mr-3">상품 정보 펼쳐보기</p>
                        <img v-if="contentStyle.height!='auto'" src="../../assets/icons/expand.svg"/>
                        <img v-else src="../../assets/icons/arrow-up.svg"/>
                    </div>
                </div>
                <div class="recommend-product" v-if="relationGoodsList.length>0">
                    <p class="recommend-title">이런 상품 어때요?</p>
                    <div class="flex overflow-x-scroll hide-scrollbar">
                        <div class="recommend-item" v-for="goods in relationGoodsList" @click="goGoodsView(goods.id)">
                            <div class="recommend-item-img">
                                <img :src="goods.image_src" style="max-width:100%;" alt=""/>
                            </div>
                            <div class="recommend-item-info">
                                <div class="recommend-item-name">{{ goods.pname }}</div>
                                <div class="flex">
                                    <div class="recommend-item-sale" v-if="parseInt(goods.discount_rate)>0">{{
                                            goods.discount_rate
                                        }}%
                                    </div>
                                    <div class="recommend-item-price">{{ util.numberFormat(goods.dcprice) }}원</div>
                                </div>
                                <div class="recommend-item-rate flex items-center my-1">
                                    <img src="../../assets/icons/starOn.svg" alt=""/>
                                    <div>{{ goods.avg.goodsAvg }} ({{ goods.avgCount }})</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="content-box" id="review-content" style="display: none;">
                <ReviewListComponent :pid="id" type="goodsDetail" :avgTotal="goodsAvg" :reviewSortCode="reviewSortCode"
                                     @sortReviewShow="sortReviewShow"></ReviewListComponent>
            </div>
            <div class="content-box" id="qna-content" style="display: none;min-height:280px;">
                <QnaListComponent :pid="id" type="goodsDetail"></QnaListComponent>
            </div>

            <div class="product-footer bg-white p-6">
                <div class="flex justify-between mb-5 items-center" @click="etcInfoToggle('return')">
                    <p class="text-sm text-gray-500">배송/교환/환불 안내</p>
                    <img v-if="!etcInfos['return']" src="../../assets/icons/arrow-down.svg"/>
                    <img v-else src="../../assets/icons/arrow-up.svg"/>
                </div>
                <v-expand-transition>
                    <div v-if="etcInfos['return']" class="guide-box">
                        <div class="guide-content">
                            <div class="gud-title">배송 안내</div>
                            <br>
                            • 배송 방법 : 택배<br>
                            • 배송 지역 : 전국지역<br>
                            • 배송 비용 : 3,000원<br>
                            • 배송 기간 : 3일 ~ 7일<br>
                            • 배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야
                            하는 경우가 있습니다.<br>
                            <br>
                            고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다.
                            다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.
                            <div class="gud-title">교환/반품 안내</div>
                            <div class="gud-m-title" style="padding-top:10px;">[교환 및 반품 주소]</div>
                            - [17158] 경기도 용인시 처인구 양지면 남평로 111-73 아레나스 지하2층, 품고

                            <div class="gud-m-title">[교환 및 반품이 가능한 경우]</div>
                            - 상품을 공급 받으신 날로부터 7일이내 단, 가전제품의
                            경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.<br>
                            - 공급받으신 상품 및 용역의 내용이 표시.광고 내용과
                            다르거나 다르게 이행된 경우에는 공급받은 날로부터 3월이내, 그사실을 알게 된 날로부터 30일이내

                            <div class="gud-m-title"> [교환 및 반품이 불가능한 경우]</div>
                            - 고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우.<br>
                            단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외<br>
                            - 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우<br>
                            (예 : 가전제품, 식품, 음반 등, 단 액정화면이 부착된 노트북, LCD모니터, 디지털 카메라 등의 불량화소에 따른 반품/교환은 제조사 기준에 따릅니다.)<br>
                            - 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우. 단, 화장품등의 경우 시용제품을 제공한 경우에 한 합니다.<br>
                            - 시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가 현저히 감소한 경우<br>
                            - 복제가 가능한 상품등의 포장을 훼손한 경우<br>
                            (자세한 내용은 고객만족센터 1:1 E-MAIL상담을 이용해 주시기 바랍니다.)<br><br>

                            ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다. (색상 교환, 사이즈 교환 등 포함)


                        </div>
                    </div>
                </v-expand-transition>
                <!--div class="flex justify-between mb-5 mt-5 items-center" @click="etcInfoToggle('mandatory')">
                    <p class="text-sm text-gray-500">상품 고시 정보</p>
                    <img v-if="!etcInfos['mandatory']" src="../../assets/icons/arrow-down.svg"/>
                    <img v-else src="../../assets/icons/arrow-up.svg"/>
                </div>
                <v-expand-transition>
                    <div class="guide-box" v-if="etcInfos['mandatory']">
                        <div class="guide-content" style="padding-top:30px;">
                            <ul class="setting-ul" v-if="setting.mandatoryInfos">
                                <li v-for="item in setting.mandatoryInfos">
                                    <div class="g-title">
                                        {{ item.pmi_title }}
                                    </div>
                                    <div class="g-desc">
                                        {{ item.pmi_desc }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </v-expand-transition>
                <div class="flex justify-between mb-5 mt-5  items-center" @click="etcInfoToggle('seller')">
                    <p class="text-sm text-gray-500">판매자 정보</p>
                    <img v-if="!etcInfos['seller']" src="../../assets/icons/arrow-down.svg"/>
                    <img v-else src="../../assets/icons/arrow-up.svg"/>
                </div>
                <v-expand-transition>
                    <div v-if="etcInfos['seller']" class="guide-box">
                        <div class="guide-content">
                            <div class="gud-title">{{ info.com_name }}</div>
                        </div>
                    </div>
                </v-expand-transition-->
                <div class="flex justify-between mb-5 mt-5  items-center" @click="etcInfoToggle('payment')">
                    <p class="text-sm text-gray-500">결제 안내</p>
                    <img v-if="!etcInfos['payment']" src="../../assets/icons/arrow-down.svg"/>
                    <img v-else src="../../assets/icons/arrow-up.svg"/>
                </div>
                <v-expand-transition>
                    <div v-if="etcInfos['payment']" class="guide-box">
                        <div class="guide-content">
                            <br><br>
                            고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도
                            있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는
                            취소할 수 있습니다.<br><br>

                            무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹
                            혹은 가까운 은행에서 직접 입금하시면 됩니다.
                            주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야
                            하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은
                            자동취소 됩니다.
                        </div>
                    </div>
                </v-expand-transition>
                <div class="flex justify-between mb-5 mt-5 items-center" @click="etcInfoToggle('customer')">
                    <p class="text-sm text-gray-500">고객 센터</p>
                    <img v-if="!etcInfos['customer']" src="../../assets/icons/arrow-down.svg"/>
                    <img v-else src="../../assets/icons/arrow-up.svg"/>
                </div>
                <v-expand-transition>
                    <div v-if="etcInfos['customer']" class="guide-box">
                        <div class="guide-content">
                            <div class="gud-title">구매 전 상품 문의는 상품문의(Q&A)를 이용해주세요.</div>
                            <div class="gud-tel-title">070-4027-1031</div>
                            평일 : 9:00 ~ 18:00 / 토, 일, 공휴일 휴무
                        </div>
                    </div>
                </v-expand-transition>
                <div class="flex mt-10 fixed w-full bottom-0 left-0 bg-white px-4 py-2 bottom-button-box" style="z-index:10;width:100%;max-width:500px">
                    <div class="flex flex-col items-center justify-center" style="max-width:50px;"
                         @click="favoriteToggle()" id="check_heart">
                        <img v-if="wish" src="../../assets/icons/heartOn2.svg"/>
                        <img v-else src="../../assets/icons/heartOff2.svg"/>
                        <p class="text-xs text-gray-500" style="width:40px;text-align:center;">
                            {{ util.numberFormat(wishCount) }}</p>
                    </div>
                    <v-btn depressed rounded class="shop-button buy-btn" id="buy-btn" style="width:80%;"
                           @click="showOrderBox()">
                        <span id="start_purchase">구매하기</span>
                    </v-btn>
                </div>
            </div>
        </div>

        <div class="purchase flex flex-col justify-end" id="order-box" style="max-width:500px">
            <v-expand-transition>
                <div class="purchase-box bg-white p-6 rounded-t-2xl relative" v-if="orderShow" style="max-width:500px">

                    <div class="purchase-items border rounded-lg p-4">
                        <div class="purchase-items-heading flex items-center justify-between" @click="optionToggle()">
                            <p class="text-base" style="color: #999999">
                                상품을 선택해주세요 *
                            </p>
                            <img v-if="optionShow" src="../../assets/icons/arrow-up.svg" alt=""/>
                            <img v-else src="../../assets/icons/arrow-down.svg" alt=""/>
                        </div>
                        <v-expand-transition>
                            <div v-if="optionShow" class="option-list-box">
                                <div class="purchase-item flex items-center justify-between mt-3"
                                     v-for="(option,index) in optionList" :key="option.option_id"
                                     @click="selectOption(index)">
                                    <p class="text-sm" style="color: #222">{{ option.option_div }}</p>
                                    <p class="fix-top" v-if="parseInt(option.option_stock)<1">[품절]</p>
                                    <p class="fix-top" style="min-width:80px;text-align:right;" v-else>
                                        {{ util.numberFormat(option.option_dcprice) }}원</p>
                                </div>

                            </div>
                        </v-expand-transition>
                    </div>
                    <div class="selected-option-box" v-if="selectedOptionList.length>0">
                        <div class="mt-4" v-for="(option,index) in selectedOptionList">
                            <p class="mb-3">{{ option.option_div }}</p>
                            <div class="flex justify-between items-center border-b pb-4" style="margin-top:-8px;">
                                <div class="flex" style="max-width:74px;">
                                    <div class="border flex items-center justify-center"
                                         style="width: 22px; height: 22px;padding-top:15px;"
                                         @click="updateAmt(index,'minus')">
                                        <p class="text-gray-500 text-xs">-</p>
                                    </div>
                                    <div class="border-b border-t text-xs px-3" style="height: 22px;">
                                        <p style="line-height: 22px">{{ option.amt }}</p>
                                    </div>
                                    <div class="border flex items-center justify-center"
                                         style="width: 22px; height: 22px;padding-top:15px;"
                                         @click="updateAmt(index,'plus')">
                                        <p class="text-gray-500 text-xs">+</p>
                                    </div>
                                </div>
                                <div class="flex"
                                     style="max-width:100px;justify-content: flex-end;position:relative;top:8px;">
                                    <p class="mr-2">{{ util.numberFormat(option.option_dcprice) }}원</p>
                                    <div style="max-width: 22px; height: 22px; background-color: #eee"
                                         class="rounded-full flex justify-center items-center"
                                         @click="selectedOptionDelete(index)">
                                        <img src="../../assets/icons/close-gray.svg" alt="" width="10px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between  mt-6">
                        <p class="font-light">상품 {{ totalAmt }}개</p>
                        <div class="flex" style="justify-content: flex-end">
                            <span class="bg-red-500 rounded-lg" style="padding:3px 8px;height:23px;margin-right:10px;"
                                  v-if="totalDiscountRate>0">
                                <p class="text-xs text-white" style="padding:0;margin:0;">{{
                                        totalDiscountRate
                                    }}% 할인</p>
                            </span>
                            <p class="font-semibold">{{ totalPrice }}원</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="" style="width:50px;" @click="favoriteToggle()">
                            <img v-if="wish" src="../../assets/icons/heartOn2.svg"/>
                            <img v-else src="../../assets/icons/heartOff2.svg"/>
                            <div class="text-xs text-gray-500" style="width:40px;margin-left:-10px;text-align:center;">
                                {{ util.numberFormat(wishCount) }}
                            </div>
                        </div>
                        <div class="flex flex-1 justify-between">
                            <v-btn depressed rounded
                                   :class="'shop-button flex-1 p-3 bg-gray-200  text-center text-gray-800 '+cartButton"
                                   @click="pushCart()">
                                장바구니 담기
                            </v-btn>
                            <v-btn depressed rounded
                                   :class="'shop-button flex-1 p-3 bg-gray-200  text-center text-gray-800 '+orderButton"
                                   @click="goOrder()">
                              <span id="process_purchase">구매하기</span>
                            </v-btn>
                        </div>
                    </div>
                    <div id="close-purchase"
                         class="absolute bg-white rounded-xl flex items-center justify-center"
                         style="width: 100px;height: 30px;top: -20px;right: 0;left: 0;margin: auto;">
                        <img @click="hideOrderBox()" src="../../assets/icons/arrow-down.svg"/>
                    </div>
                </div>
            </v-expand-transition>
        </div>
        <div class="purchase flex flex-col justify-end" id="cart-box" style="max-width:500px">
            <v-expand-transition>
                <div class="purchase-box bg-white p-6 relative" v-if="cartShow" style="max-width:500px">
                    <div class="flex items-center justify-center pb-4 border-b">
                        <p class="text-lg">장바구니에 담겼습니다.</p>
                    </div>
                    <div class="p-3 border-b">
                        <div class="text-sm mb-3">함께 많이 구매한 상품</div>
                        <div class="flex items-center" @click="goGoodsView(basketGoods.id)">
                            <div
                                style="width: 55px;height: 55px;overflow:hidden;border-radius: 5px;background-color: #dfdfdf;">
                                <img :src="basketGoods.image_src" style="max-width:100%;" alt=""/>
                            </div>
                            <div class="flex-1 ml-4">
                                <div>{{ basketGoods.pname }}</div>
                            </div>
                            <img src="../../assets/icons/arrow-right.svg" alt=""/>
                        </div>
                    </div>
                    <div class="flex mt-4" style="justify-content: space-between;">
                        <v-btn class="text-thin border border-black"
                               style="height:45px;width:48%;margin-left:0;background: #fff;color:#000;border: solid 1px #000"
                               depressed rounded @click="goCart()">
                            <span id="view_cart_button"> 장바구니 보기</span>
                        </v-btn>
                        <v-btn class="text-thin bg-black text-white"
                               style="height:45px;width:48%;background: #000;color:#fff;" depressed rounded
                               @click="hideCartBox()">
                            <span  id="continue_shopping"> 계속 쇼핑하기</span>
                        </v-btn>
                    </div>
                </div>
            </v-expand-transition>
        </div>
        <div
            style="z-index:30;max-width:500px;"
            v-if="sortView"
            class="
        flex flex-col
        justify-end
        fixed
        z-10
        bg-black bg-opacity-70
        top-0
        left-0
        w-full
        h-full
        sortBgBox">
            <div
                class="purchase-box bg-white relative rounded-t-2xl"
                style="transform: translateY(0);max-width:500px;"
            >
                <div class="flex justify-between py-5 px-6 border-b items-center" @click="sortReview(item.code)"
                     v-for="item in sortList">
                    <div :class="item.gclass">{{ item.name }}</div>
                    <img v-if="item.gclass=='font-semibold'" src="../../assets/icons/check-blue.svg"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import QnaListComponent from '../components/qnaList'
import ReviewListComponent from '../components/reviewList'

import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import {mapActions, mapGetters} from "vuex";
import AUTH from '../../api/auth'
import UTIL from '../../api/util'
import JQ from 'jquery'
import {
    IMGHOST,
    API_URL_GET_GOODS_VIEW,
    API_URL_INSERT_CART, API_URL_SET_GOODS_WISH
} from '../../api/urls';
import apiService from '../../api/apiService'
import offStarImg from "../../assets/icons/starOff.svg";

export default {
    name: 'goodsView',
    components: {
        Swiper,
        SwiperSlide,
        QnaListComponent,
        ReviewListComponent
    },
    watch: {
        '$route'(to, from) {
            if (to.name == from.name) {
                this.hideCartBox();
                this.reloadData(this.$route.params.id);
            }

        }
    },
    data() {
        return {
            util: UTIL,
            swiperIndex: 1,
            id: '',
            serverInit: false,
            info: {},
            cartButton: 'disabled',
            orderButton: 'disabled',
            setting: {},
            contentStyle: {
                'height': '700px',
                'overflow': 'hidden',
            },
            categoryNames: [],
            imgList: [],
            swiperOptions: {
                slidesPerView: 1,
            },
            total: 0,
            tabClass: {
                info: 'product-tab-item-active',
                review: '',
                qna: '',
            },
            orderShow: false,
            optionList: [],
            etcInfos: {
                mandatory: false,
                return: false,
                payment: false,
                customer: false,
                seller: false,
            },
            sortView: false,
            reviewSortCode: 'regdate',
            sortList: [
                {code: 'regdate', name: '최신순', gclass: 'font-semibold'},
                {code: 'star', name: '평점순', gclass: ''},
            ],
            goodsAvg: '0.0',
            optionShow: false,
            selectedOptionList: [],
            totalDiscountRate: 0,
            totalAmt: 0,
            totalPrice: 0,
            cartShow: false,
            wish: false,
            isLogin: false,
            avgList: [],
            relationGoodsList: [],
            wishCount: 0,
            basketGoods: {},
            memberInfo:{},
            intTotalPrice:0,
        }
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('');
        this.setBackUrl('');
        this.id = this.$route.params.id;
        if (this.id) {
            this.getData();
        } else {
            this.$router.back();
        }
        const memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
            this.memberInfo = memberInfo;
        }

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('config', ["setNewCartCnt"]),
        getData() {
            const frm = new FormData();
            frm.append('id', this.id);
            apiService.post(API_URL_GET_GOODS_VIEW, frm, (res) => {
                if (res.data.result == 'appOnly') {
                    let params = {
                        message: '해당 상품은 앱에서만 볼수있는 상품입니다',
                        doAction: () => {
                            this.$router.back();
                        }
                    }
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                if (res.data.out || !res.data.info.id) {
                    let params = {
                        message: '잘못된 접근입니다'
                    }
                    this.$eventBus.$emit('modalOpen', params);
                } else {
                    this.info = res.data.info;
                    if (this.info.wishCount) this.wishCount = parseInt(this.info.wishCount);
                    this.optionList = res.data.devOptionData.options;

                    this.setting = res.data.setting;
                    let onStarImg = require('../../assets/icons/starOn.svg');
                    let offStarImg = require('../../assets/icons/starOff.svg');
                    for (let k = 1; k <= 5; k++) {
                        if (k <= parseInt(this.setting.avg.goodsAvg)) {
                            this.avgList.push(onStarImg)
                        } else {
                            this.avgList.push(offStarImg)
                        }

                    }
                    this.basketGoods = res.data.basketGoods;
                    this.goodsAvg = this.setting.avg.goodsAvg;

                    if (this.info.add_image_src) {
                        for (let img of this.info.add_image_src) {
                            this.imgList.push(IMGHOST + img.bigImg);
                        }
                    }
                    this.wish = this.info.alreadyWish;
                    this.categoryNames = this.info.cname.split(' ');
                    if (this.setting.relationInfos) {
                        this.relationGoodsList = this.setting.relationInfos;
                    }
                    this.setGViewGoogleTracker();
                }


            });
        },
        setGViewGoogleTracker() {
            window.dataLayer = window.dataLayer || [];
            let uid = (this.memberInfo.id)?this.memberInfo.id:'';
            let name = (this.memberInfo.name)?this.memberInfo.name:'';
            let brand_name = (this.info.brand_name)?this.info.brand_name:'브랜드 없음';
            window.dataLayer.push({
                event: "view_item",
                user_id: uid,
                user_name: name,
                ecommerce: {
                    items: [
                        {
                            item_id: this.info.id,
                            item_name: this.info.pname,
                            currency: "KRW",
                            item_brand: brand_name,
                            item_category: this.info.cname,
                            price: parseInt(this.info.dcprice),
                        }
                    ]
                }
            });
            window.dataLayer.push({ ecommerce:null})

        },
        setAddCartGoogleTracker() {
            window.dataLayer = window.dataLayer || [];
            let uid = (this.memberInfo.id)?this.memberInfo.id:'';
            let name = (this.memberInfo.name)?this.memberInfo.name:'';
            let brand_name = (this.info.brand_name)?this.info.brand_name:'브랜드 없음';

            let options = [];
            for(let option of this.selectedOptionList) {
                let pname = this.info.pname+' '+option.option_div;
                let optionItem = {
                    item_id: this.info.id,
                    item_name: pname,
                    currency: "KRW",
                    discount:parseInt(option.option_discount_amount),
                    item_brand: brand_name,
                    item_category: this.info.cname,
                    price: parseInt(option.option_dcprice),

                }
                options.push(optionItem);
            }


            window.dataLayer.push({
                event: "add_to_cart",
                user_id: uid,
                user_name : name,
                ecommerce: {
                    items: options
                }
            });
            window.dataLayer.push({ ecommerce:null})

        //    console.log(window.dataLayer);
        },
        sortReviewShow() {
            this.sortView = true;
            for (let item of this.sortList) {
                if (this.reviewSortCode == item.code) item.gclass = 'font-semibold';
                else item.gclass = '';
            }
        },
        sortReview(code) {
            this.reviewSortCode = code;
            this.sortView = false;
        },
        goGoodsView(id) {

            this.$router.push('/vgoods/goodsView/' + id)
        },
        reloadData(id) {
            this.id = id;
            this.swiperIndex = 1;
            this.info = {};
            this.cartButton = 'disabled';
            this.orderButton = 'disabled';
            this.setting = {};
            this.contentStyle = {
                'height': '700px',
                'overflow': 'hidden',
            };
            this.categoryNames = [];
            this.imgList = [];
            this.swiperOptions = {
                slidesPerView: 1,
            };
            this.total = 0;
            this.tabClass = {
                info: 'product-tab-item-active',
                review: '',
                qna: '',
            };
            this.orderShow = false;
            this.optionList = [];
            this.etcInfos = {
                mandatory: false,
                return: false,
                payment: false,
                customer: false,
                seller: false,
            };
            this.goodsAvg = '0.0';
            this.optionShow = false;
            this.selectedOptionList = [];
            this.totalDiscountRate = 0;
            this.totalAmt = 0;
            this.totalPrice = 0;
            this.cartShow = false;
            this.wish = false;
            this.avgList = [];
            this.relationGoodsList = [];
            this.wishCount = 0;
            this.basketGoods = {};
            this.intTotalPrice = 0;
            this.getData();
        },
        favoriteToggle() {
            if (this.isLogin) {
                const frm = new FormData();
                frm.append('pid', this.id);
                apiService.post(API_URL_SET_GOODS_WISH, frm, (res) => {
                    if (res.data == 'delete') {
                        this.wish = false;
                        const wishCount = this.wishCount - 1;
                        this.wishCount = (wishCount < 0) ? 0 : wishCount;

                    } else if (res.data == 'insert') {
                        this.wish = true;
                        this.wishCount = this.wishCount + 1;

                    } else {
                        let params = {
                            message: '잘못된 접근입니다'
                        }
                        this.$eventBus.$emit('modalOpen', params)
                    }


                });
            } else {
                let params = {
                    message: '먼저 로그인하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
            }

        },
        updateSwiperIndex(obj) {
            this.swiperIndex = obj.activeIndex + 1;
        },
        showContent(cmd) {
            JQ('.content-box').hide();
            JQ('#' + cmd + '-content').show();
            for (let key in this.tabClass) {
                if (key == cmd) this.tabClass[key] = 'product-tab-item-active';
                else this.tabClass[key] = '';
            }
            console.log(JQ('.goods-detail-box').scrollTop());
            const top = JQ('#sticky-top-box').height() -29;
            JQ('.goods-detail-box').animate({
                scrollTop:top
            },100);



        },
        moreContent() {
            if (this.contentStyle.height == '700px') {
                this.contentStyle.height = 'auto';
                this.contentStyle.overflow = 'visible';

            } else {
                this.contentStyle.height = '700px';
                this.contentStyle.overflow = 'hidden';
            }
        },
        showOrderBox() {
            var height = JQ(window).height();
            JQ('body').css({'max-height': height + 'px', 'overflow': 'hidden'})
            JQ('#order-box').show();
            this.orderShow = true;
        },
        hideOrderBox() {

            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
            this.orderShow = false;
            JQ('#order-box').hide();
        },
        etcInfoToggle(cmd) {

            if (this.etcInfos[cmd]) {
                this.etcInfos[cmd] = false;
            } else {
                for (let key in this.etcInfos) {
                    if (key == cmd) this.etcInfos[key] = true;
                    else this.etcInfos[key] = false;
                }
            }
        },
        optionToggle() {
            if (this.optionShow) this.optionShow = false;
            else this.optionShow = true;
        },
        selectedOptionDelete(index) {
            this.selectedOptionList.splice(index, 1)
            this.setTotalPrice();

        },
        selectOption(index) {
            let item = this.optionList[index];
            if (parseInt(item.option_stock) < 1) {
                return;
            }

            for (let option of this.selectedOptionList) {
                if (option.option_id == item.option_id) {
                    this.optionShow = false;
                    return;
                }

            }
            item.amt = 1;
            this.selectedOptionList.unshift(item);
            this.optionShow = false;
            this.setTotalPrice();
        },
        updateAmt(index, cmd) {
            let item = this.selectedOptionList[index];
            let amt = parseInt(item.amt);
            switch (cmd) {
                case 'minus':
                    if (amt <= 1) return;
                    amt--;
                    break;
                case 'plus':
                    amt++;
                    break;
            }
            item.amt = amt;
            this.$set(this.selectedOptionList, index, item);
            this.setTotalPrice();
        },
        setTotalPrice() {
            let orgPrice = 0;
            let dcPrice = 0;
            let totalAmt = 0;
            for (let option of this.selectedOptionList) {
                let amt = parseInt(option.amt);
                orgPrice = orgPrice + parseInt(option.option_listprice) * amt;
                dcPrice = dcPrice + parseInt(option.option_dcprice) * amt;
                totalAmt += amt;

            }
            let salePriceTerm = orgPrice - dcPrice;
            //this.salePriceTermPrice = salePriceTerm;

            if (salePriceTerm > 0) {

                let totalDiscountRate = (dcPrice / orgPrice) * 100;
                this.totalDiscountRate = 100 - parseInt(totalDiscountRate.toFixed(0));
            } else {
                this.totalDiscountRate = 0;
            }
            this.totalAmt = totalAmt;
            if (this.totalAmt < 1) {
                this.orderButton = 'disabled';
                this.cartButton = 'disabled';
            } else {
                this.orderButton = 'order-button';
                this.cartButton = 'cart-button';
            }
            this.intTotalPrice = dcPrice;
            this.totalPrice = this.util.numberFormat(dcPrice);
        },
        pushCart() {
            if (this.cartButton == 'disabled') return;
            const frm = new FormData();
            frm.append('pid', this.id);
            frm.append('optionData', JSON.stringify(this.selectedOptionList));
            this.$eventBus.$emit('overlay', 'show');

            apiService.post(API_URL_INSERT_CART, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data.result == 'success') {

                    this.setNewCartCnt(res.data.data[0].deliveryTemplateList[0].productList.length);
                    this.orderShow = false;
                    JQ('#order-box').hide();
                    JQ('#cart-box').show();
                    this.cartShow = true;
                    this.setAddCartGoogleTracker();

                } else {
                    let msg = '잘못된 접근입니다';
                    switch (res.data.result) {
                        case 'minlimit':
                            msg = '선택된 상품중 최소구매수량 이하인 상품이 있습니다';
                            break;
                        case 'failStockLack':
                            msg = '선택된 상품중 재고수량보다 구매수량이 많은 상품이 있습니다';
                            break;
                        case 'failByOnePersonCount':
                            msg = '선택된 상품중 최대구매수량을 초과한 상품이 있습니다';
                            break;
                        case 'noLogin':
                            msg = '먼저 로그인 하세요';
                            break;
                    }
                    let params = {
                        message: msg
                    }
                    this.$eventBus.$emit('modalOpen', params);
                }


            });

        },
        hideCartBox() {
            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
            JQ('#cart-box').hide();
            this.cartShow = false;
        },
        goCart() {
            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
            this.$router.push('/vcart')
        },
        goOrder() {
            if (this.orderButton == 'disabled') return;
            const frm = new FormData();
            frm.append('pid', this.id);
            frm.append('optionData', JSON.stringify(this.selectedOptionList));
            this.$eventBus.$emit('overlay', 'show');

            apiService.post(API_URL_INSERT_CART, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data.result == 'success') {
                    this.$router.push('/vorder/' + res.data.cartIxs.join(','));
                } else {
                    let msg = '잘못된 접근입니다';
                    switch (res.data.result) {
                        case 'minlimit':
                            msg = '선택된 상품중 최소구매수량 이하인 상품이 있습니다';
                            break;
                        case 'failStockLack':
                            msg = '선택된 상품중 재고수량보다 구매수량이 많은 상품이 있습니다';
                            break;
                        case 'failByOnePersonCount':
                            msg = '선택된 상품중 최대구매수량을 초과한 상품이 있습니다';
                            break;

                    }
                    let params = {
                        message: msg
                    }
                    this.$eventBus.$emit('modalOpen', params);
                }


            });


        }

    },
    mounted() {
        JQ('.goods-detail-box').on('scroll',function(e) {
            e.preventDefault();
            let top = e.target.scrollTop;
            const taptop = JQ('#sticky-top-box').height() -30;
            if(top>taptop) {
                JQ('.sticky-tab').css({'position':'fixed','top':'62px'})
            } else {
                JQ('.sticky-tab').css({'position':'static','top':0})
            }

        });
        JQ('.basicinfo-content img').css({'height':'auto','max-width':'100%'});
    },
    updated() {
        JQ('.basicinfo-content img').css({'height':'auto','max-width':'100%'});
    },
    destroyed() {
        JQ('.goods-detail-box').off('scroll');
        JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
    }


}
</script>


<style lang="scss" scoped>
.goods-detail-box {
    position: relative;
    overflow-y:auto;
    padding-top:3px;
    max-height:calc(100vh);
    padding-bottom:150px;
    overflow-x: hidden;
    .sticky-tab {
        width:100%;
        z-index:9;
    }
    .product-info {
        padding: 25px;
        background-color: #fff;
    }

    .product-breadcrumb-left p {
        font-size: 13px;
        color: #848484;
        font-family: 'Noto sans';
    }

    .product-title {
        font-weight: bold;
        font-size: 25px;
        margin-top: 10px;
    }

    .product-sale {
        font-size: 18px;
        color: #d80c0c;
        font-weight: bold;
    }

    .view-product-price {
        font-size: 18px;
        color: #000;
        font-weight: bold;
        margin: 0 10px;
    }

    .product-origin-price {
        font-size: 18px;
        color: #999;
        text-decoration: line-through;
    }

    .product-description {
        margin: 15px 0;
        font-size: 14px;
        color: #848484;
    }

    .product-tab {
        border-top: 1px #eee solid;
        background-color: #fff;
    }

    .product-tab-item {
        width: 33.33%;
        text-align: center;
        line-height: 49px;
        height: 49px;
        color: #6f6f6f;
    }

    .product-tab-item-active {
        border-bottom: 1px #000 solid;
        color: #000 !important;
    }

    .banner {
        background-color: #e56969;
        width: 100%;
        height: 120px;
    }

    .banner p {
        font-weight: bold;
        font-size: 25px;
        color: #fff;
        height: max-content;
    }

    .description {
        margin-bottom: 10px;
    }

    .description div {
        color: #8097e6;
        font-size: 13px;
        background-color: #fff;
        height: 60px;
    }

    .recommend-product {
        background-color: #fff;
        padding: 25px;
        margin-bottom: 10px;
    }

    .recommend-title {
        font-size: 20px;
        font-weight: bold;
    }

    .recommend-item {
        margin-right: 20px;
        margin-top: 20px;
    }

    .recommend-item-img {
        width: 120px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .recommend-item-img img {
        width: 100%;
        height: 100%;
    }

    .recommend-item-name {
        font-size: 12px;
    }

    .recommend-item-sale {
        font-size: 12px;
        color: #d80c0c;
        font-weight: bold;
    }

    .text-cut {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        line-height: 1.2em;
        height: 1.2em;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .recommend-item-price {
        font-size: 12px;
        color: #000;
        font-weight: bold;
        margin-left: 10px;
    }

    .recommend-item-rate img {
        width: 10px;
        height: 10px;
    }

    .recommend-item-rate p {
        font-size: 11px;
        margin-left: 10px;
    }

    .review-rating {
        background-color: #fff;
        width: 100%;
        padding: 25px;
    }

    .rating-title {
        font-size: 20px;
        font-weight: bold;
    }

    .rating-total-box {
        padding: 25px;
        border: 1px #eeeeee solid;
        margin-top: 20px;
        border-radius: 20px;
    }

    .rating-total-box img {
        width: 12px;
        height: 12px;
        margin-right: 2px;
    }

    .rating-line {
        position: relative;
        width: 90px;
        background-color: #dddddd;
        border-radius: 20px;
        height: 2px;
        margin: 0 15px;
        overflow: hidden;
    }

    .rating-line-yellow {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #ffac00;
    }

    .rating-total-box p {
        font-size: 11px;
        font-weight: bold;
        width: 50px;
    }

    .review-list {
        background-color: #fff;
        width: 100%;
    }

    .review-item {
        padding: 25px;
        border-bottom: 1px #ddd solid;
    }

    .review-item-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
    }

    .review-item-user p {
        font-size: 12px;
    }

    .review-item-user p:first-child {
        color: #000;
        font-weight: bold;
    }

    .review-item-user p:last-child {
        color: #797979;
    }

    .review-item-date {
        color: #797979;
        font-size: 12px;
    }

    .review-item-img {
        width: 120px;
        height: 120px;
        background-color: #eeeeee;
    }

    .view-more {
        padding: 25px;
        background-color: #fff;
    }

    .view-more p {
        border: 1px #ddd solid;
        border-radius: 10px;
        font-size: 12px;
        color: #949494;
        padding: 10px;
        text-align: center;
    }

    .qa {
        padding: 25px;
    }

    .qa-contact-btn {
        padding: 5px 10px;
        background-color: #000;
        border-radius: 15px;
        color: #fff;
        font-size: 12px;
    }

    .qa-item {
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
    }

    .qa-btn-green {
        padding: 2px 15px;
        border: #68c1a6 1px solid;
        border-radius: 10px;
        color: #68c1a6;
    }

    .qa-btn-red {
        padding: 2px 15px;
        border-radius: 10px;
        background: #ef7379;
        color: #fff;
    }

    .buy-btn {
        text-align: center;
        flex: 1;
        height: 50px;
        background-color: #ffbb53;
        border-radius: 25px;
        margin-left: 20px;
        color: #fff;
        line-height: 50px;
        width: 80%;
    }


    .purchase-box {

    }

    .page-container {
        padding: 0;
        margin-top: -22px;
    }

    .container {
        padding: 0;
    }

    .swiper-pagination {
        position: absolute;
        bottom: 12px;
        right: 7px;
        z-index: 3;
        height: 33px;
    }

    .product-breadcrumb {
        img {
            position: relative;
            top: -7px;

        }
    }

    .cart-button {
        width: 48%;
        background: #f9efdf !important;
        color: #e19b1d !important;
    }

    .order-button {
        width: 48%;
        background-color: #ffbb53 !important;
        color: #fff !important;
    }

    .disabled {
        width: 48%;
        color: #aaa !important;
        background: #eee !important;
    }


    .basicinfo-content {
        img {
            max-width: 100%;
            height: auto;
        }

        color: #666;
    }

    .more-content-button {
        padding-top: 20px;

        img {
            margin-top: -15px;
        }
    }

    .bottom-button-box {
        & > div {
            width: 50px;

            img {
                position: relative;
                top: 7px;
            }

            .text-xs {
                position: relative;
                top: 7px;
            }
        }

        #buy-btn {
            width: 50%;
            background: #ffbb53;
            color: #fff;
        }
    }

    .purchase {
        display: none;
        position: fixed;
        z-index: 10;
        background: rgba(0, 0, 0, 0.6);
        width:100% !important;
        height: calc(100vh) !important;
        top: 0;
        left: 0;
    }

    .purchase-box {
        position: fixed;
        z-index: 10;
        bottom: 0;
        width: 100%;
        left: 0;
    }

    .purchase-items {
        height: auto;
        padding-bottom: 0;

        .purchase-items-heading {
            img {
                margin-top: -10px;
            }
        }
    }

    .setting-ul {
        margin-top: -10px;
        padding: 0;

        li {
            .g-title {
                font-weight: 500;
                color: #333;
            }

            .g-desc {
                font-weight: normal;
                color: #888;
                margin-bottom: 10px;
            }
        }
    }

    .option-list-box {
        max-height: 300px;
        overflow: auto;
        width: calc(100vw - 40px);
        margin-left: -20px;
        padding: 0 20px;
    }

    .purchase-item {
        position: relative;

        .text-sm {
            margin-right: 80px;
        }

        .fix-top {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    .selected-option-box {
        max-height: 190px;
        overflow: auto;
        width: calc(100vw - 26px);
        margin-left: -10px;
        padding: 0 15px;
    }

    .goods-star img {
        width: 17px;
        height: 17px;
    }

    .guide-box {
        background: #f1f1f1;
        width:100%;
        margin-left: -24px;

        .guide-content {
            padding: 0 24px 30px 24px;
            color: #777;
            font-size: 12px;

            .gud-title {
                font-size: 13px;
                color: #000;
                font-weight: 600;
                padding-top: 30px;
            }

            .gud-m-title {
                color: #000;
                font-weight: 500;
                padding-top: 15px;
            }

            .gud-tel-title {
                font-size: 24px;
                color: #000;
                font-weight: 600;
                padding-top: 25px;
            }
        }
    }
}
@media only all and (min-width: 500px) {
    .purchase {
        margin-left:calc((100vw /2) - 260px);
    }
    .purchase-box {
        margin-left:calc((100vw /2) - 260px);
    }
    .bottom-button-box {
        margin-left:calc((100vw /2) - 260px);
    }
    .sortBgBox {
        margin-left:calc((100vw /2) - 260px);
    }
}
</style>