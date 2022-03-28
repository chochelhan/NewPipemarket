<template>
    <div class="page-contents">
        <router-view></router-view>
        <div style="height:25px"></div>
        <div style="margin-bottom: 30px; background-color: #eeeeee;margin-top:32px;" v-if="orderInputShow">
            <div ref="wrap" id="daumFrame">
                <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap"
                     style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" @click="foldDaumPostcode"
                     alt="접기 버튼">
            </div>

            <div v-if="isLogin">
                <div
                    class="px-5 flex bg-white items-center"
                    style="margin-bottom: 10px;justify-content: space-between;padding-bottom:5px;"
                >
                    <p class="flex-1 text-sm font-semibold">주문자 정보</p>
                    <div class="flex items-center" style="justify-content: flex-end" @click="goForm('orderInfo')">
                        <p
                            class="whitespace-nowrap text-xs text-gray-500 mr-2"
                            style="color: #8097e6"
                        >
                            {{ orderName }}
                        </p>
                        <img style="position:relative;top:-7px;" src="../../assets/icons/arrow-right-blue.svg"/>
                    </div>
                </div>
                <div class="bg-white px-5 py-6" style="margin-bottom: 10px;height:auto;" v-if="shippingInfo.ix">
                    <div class="flex justify-between items-center">
                        <p class="font-semibold">배송지 : {{ shippingInfo.shipping_name }}</p>
                        <div class="py-1 px-2 border rounded-md"
                             style="border-color: #aaa;max-height:30px;position:relative;top:-10px;"
                             @click="goForm('receiveInfo')">
                            <p style="color: #aaa;" class="text-13">변경</p>
                        </div>
                    </div>
                    <p class="text-sm mt-1 font-light" style="color: #444">
                        [{{ shippingInfo.zipcode }}] {{ shippingInfo.address1 }}, {{ shippingInfo.address2 }}
                    </p>
                    <div class="flex justify-between items-center" style="height:10px;margin-top:35px;">
                        <p class="text-sm" style="color: #999">{{ shippingInfo.recipient }} / {{
                                shippingInfo.mobile
                            }}</p>
                        <!--div class="flex" style="justify-content: flex-end;">
                            <v-checkbox color="#000"
                                        style="margin:2px 0 0 0;"
                                        v-model="orderUserEqual"
                                        :disabled="orderUserEqualDisabled"
                            ></v-checkbox>
                            <p class="text-sm ml-2" @click="orderUserEqualSync()"
                               style="position:relative;top:7px;left:-12px;">주문자와 동일</p>
                        </div-->
                    </div>
                </div>
                <div class="bg-white px-5 py-6" style="margin-bottom: 10px" v-else>
                    <div class="flex justify-between items-center">
                        <p class="font-semibold">배송지 </p>
                        <div class="py-1 px-2 border rounded-md"
                             style="border-color: #8097e6;max-height:30px;position:relative;top:-10px;"
                             @click="goForm('receiveInfoForm')">
                            <p style="color: #8097e6;" class="text-13">신규 등록</p>
                        </div>
                    </div>
                    <p class="text-sm mt-1 font-light" style="color:#818181">
                        등록된 배송정보가 없습니다
                    </p>
                </div>
            </div>
            <div class="bg-white px-5 py-6 mb-3" v-else>
                <p class="text-basic font-semibold">주문자 정보</p>
                <v-text-field
                    outlined
                    required
                    :error-messages="ordNameErrors"
                    @input="$v.ordName.$touch()"
                    @blur="$v.ordName.$touch()"
                    v-model="ordName"
                    placeholder="주문자 성함을 입력하세요"
                />

                <v-text-field
                    outlined
                    required
                    :error-messages="ordPcsErrors"
                    @input="$v.ordPcs.$touch()"
                    @blur="$v.ordPcs.$touch()"
                    v-model="ordPcs"
                    placeholder="주문자 휴대폰 번호를 입력해주세요"
                />
                <v-text-field
                    outlined
                    required
                    v-model="ordEmail"
                    placeholder="주문자 이메일주소를 입력해주세요(선택)"
                />

                <p class="text-basic font-semibold">수취인 정보</p>
                <v-text-field
                    outlined
                    required
                    :error-messages="recNameErrors"
                    @input="$v.recName.$touch()"
                    @blur="$v.recName.$touch()"
                    v-model="recName"
                    placeholder="성함을 입력해주세요"
                />

                <v-text-field
                    outlined
                    required
                    :error-messages="recPcsErrors"
                    @input="$v.recPcs.$touch()"
                    @blur="$v.recPcs.$touch()"
                    v-model="recPcs"
                    placeholder="휴대폰 번호를 입력해주세요"
                />

                <p class="text-15 mt-8">배송 주소</p>
                <div class="flex mt-4">
                    <v-text-field
                        outlined
                        required
                        :error-messages="postNumErrors"
                        v-model="postNum"
                        readonly
                        placeholder="우편번호를 입력해주세요"
                    />
                    <p class="py-3
                px-4
                text-13
                border
                rounded-md
                whitespace-nowrap
                font-semibold"
                       style="margin-left:10px;color: #8097e6; border-color: #8097e6;max-height:57px;line-height:30px;"
                       @click="openDaumPostcode()">
                        우편번호
                    </p>
                </div>
                <v-text-field
                    outlined
                    v-model="addr1"
                    readonly
                    placeholder="주소를 입력해주세요"
                />
                <v-text-field
                    outlined
                    required
                    :error-messages="addr2Errors"
                    @input="$v.addr2.$touch()"
                    @blur="$v.addr2.$touch()"
                    v-model="addr2"
                    placeholder="상세주소를 입력해주세요"
                />
            </div>
            <div class="bg-white px-5 py-6" style="margin-bottom: 10px">
                <div class="flex justify-between items-center">
                    <p class="font-semibold">배송 시 요청사항</p>
                </div>
                <div class="flex justify-between items-center p-3 border rounded-md mt-1" style="max-height:47px;"
                     @click="goForm('msgForm')">
                    <p class="text-sm font-light text-cut-1" style="padding-top:12px;">
                        {{ deliveryMessage.msg }}
                    </p>
                    <img src="../../assets/icons/arrow-down-gray.svg"/>
                </div>
            </div>
            <div class="bg-white px-5 py-6" style="margin-bottom: 10px">
                <div class="flex justify-between items-center">
                    <p class="font-semibold">상품 정보</p>
                </div>
                <div class="flex items-center mt-3" v-for="goods in goodsList">
                    <div
                        class="bg-gray-200"
                        :style="{'width':'27%','max-width':'27%'}"
                    >
                        <img :src="goods.image_src" style="width:100%;">
                    </div>
                    <div class="ml-3">
                        <div class="text-15 font-light">{{ goods.pname }}</div>
                        <div class="text-13 text-gray-400 font-light my-1">
                            {{ goods.options_text }}
                        </div>
                        <div class="flex items-center">
                            <div class="text-sm font-semibold" style="color: #d80c0c;margin-right:5px;"
                                 v-if="parseInt(goods.discount_rate)>0">
                                {{ goods.discount_rate }}%
                            </div>
                            <div class="text-sm font-semibold">{{
                                    util.numberFormat(goods.dcprice * goods.pcount)
                                }}원
                            </div>
                            <div class="text-sm font-light text-gray-500 line-through" style="margin-left:5px;"
                                 v-if="parseInt(goods.discount_rate)>0">
                                {{ util.numberFormat(goods.listprice * goods.pcount) }}원
                            </div>
                            <div style="color:#999;margin-left:7px;">{{ goods.pcount }}개</div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="bg-white px-5 py-6" style="margin-bottom: 10px" v-if="isLogin && couponList.length>0">
                <div class="flex justify-between items-center">
                    <p class="font-semibold">쿠폰 적용 ({{ couponList.length }}개)</p>
                    <!--div
                        class="py-1 px-2 border rounded-md mr-5"
                        style="border-color: #aaa;max-height:28px;position: relative;top:-9px;"
                    >
                        <p @click="applyCoupon()" style="color: #aaa" class="text-13">적용하기</p>
                    </div-->
                </div>
                <div v-for="(item,cpnIndex) in couponList" class="flex bg-cover bg-no-repeat"
                     :style="{'background-image':'url('+couponBg+')','height':'110px','margin':'0 0 17px 0','background-size':'cover'}"
                     @click="selectCoupon(item.regist_ix)">
                    <div
                        class="flex justify-center items-center rounded-l-xl pb-2"
                        style="max-width: 90px"
                    >
                        <div class="font-semibold text-17" style="color: #c588d4">

                            <i v-if="item.checked" class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="flex-1 py-6 pl-3">
                        <div class="font-semibold text-13">{{ item.publish_name }}</div>
                        <div class="font-semibold text-xl mb-2" style="color: #c588d4">
                            {{ item.price }}
                        </div>
                        <div class="text-xs text-gray-500">• 사용기한 : {{ item.term }}</div>

                    </div>
                </div>
            </div>
            <div class="bg-white px-5 py-6" style="margin-bottom: 10px;" v-if="isLogin">
                <div class="flex justify-between items-center">
                    <p class="font-semibold">적립금 : {{ util.numberFormat(userHavePoint) }}원 보유</p>
                </div>
                <div class="flex justify-between items-center border rounded-md mt-3">
                    <p class="text-sm text-gray-500 font-light text-right flex-1 px-4"
                       style="position:relative;top:8px;">
                        <input type="text" class="font-semibold text-13 text-black use-point"
                               style="width:80px;text-align:right;" v-model="usePoint"/> 원
                    </p>
                    <div class="px-4 py-2 border-l">
                        <div @click="allUsePoint()" class="text-13 text-gray-500" style="line-height:30px;">전액사용</div>
                    </div>
                </div>
                <div class="point-msg" v-if="pointMsg">

                    <!--div>
                        <span v-if="mileageConditionMinMileage > 0">
                            포인트는 &#39;{{ mileageConditionMinMileage }}&#39;원 이상 보유한 경우에만 사용 가능하며</span>
                        '{{ mileageConditionUseUnit }}&#39;원 단위로 사용 가능합니다
                    </div -->
                    <div style="padding-top:5px">
                        포인트는 쿠폰과 중복사용이 가능하며, 최종 주문금액의 10%까지 적용이 가능합니다.
                        <!-- 기본적으로 상품 금액의 '10%'까지 사용이 가능하며,
                        견묘한 생활 상품들의 경우에만 '90%'까지 사용 가능합니다 -->
                        <!-- span v-if="mileageConditionMinBuyAmt > 0">
                            <span v-if="mileageConditionUseLimitType =='noLimit'">
                                상품 구매금액 합계가 &#39;{{ mileageConditionMinBuyAmt }}&#39;원 이상인 경우 사용가능 합니다.
                            </span>
                            <span v-else>
                                <span v-if="mileageConditionUseLimitType =='price'">
                                상품 구매금액 합계가 &#39;{{
                                        mileageConditionMinBuyAmt
                                    }}&#39;원 이상인 경우 최대 &#39;{{ mileageConditionUseLimitValue }}&#39;원 까지 사용 가능합니다.
                                </span>
                                <span v-else>
                                상품 구매금액 합계가 &#39;{{
                                        mileageConditionMinBuyAmt
                                    }}&#39;원 이상인 경우 최대 &#39;{{ mileageConditionUseLimitValue }}&#39; % 까지 사용 가능합니다.
                                </span>
                            </span>
                        </span>
                        <span v-else>
                            <span v-if="mileageConditionUseLimitType =='noLimit'">
                                상품 구매금액과 상관없이 사용가능 합니다.
                            </span>
                            <span v-else-if="mileageConditionUseLimitType =='price'">
                                상품 구매금액과 상관없이 최대 &#39;{{ mileageConditionUseLimitValue }}&#39;원 까지 사용 가능합니다.
                            </span>
                            <span v-else>

                                상품 구매금액과 상관없이 최대 &#39;{{ mileageConditionUseLimitValue }}&#39; % 까지 사용 가능합니다.
                            </span>
                        </span -->
                    </div>
                    <div style="padding-top:5px">
                        포인트는 피리부는강아지 앱의 '도전배지'를 통해
                        지속적인 획득이 가능합니다
                        <!--span v-if="mileageConditionUseDeliverypriceYn =='Y'">
                        포인트로 배송비 사용은 가능 합니다.
                        </span>
                        <span v-else>
                        포인트로 배송비 사용은 불가 합니다.
                        </span -->
                    </div>

                </div>
            </div>

            <div class="bg-white px-5 py-6" style="margin-bottom: 10px">
                <div class="flex justify-between items-center mb-3">
                    <p class="font-semibold">결제 정보</p>
                </div>
                <div class="flex flex-wrap paymethod-box">
                    <div :class="'px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3 '+pg.card" @click="setPg('card')"
                         style="width: calc(33.33% - 8px)">
                        <p class="text-sm text-center">신용카드</p>
                    </div>
                    <div
                        :class="'px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3  '+pg.vbank"
                        @click="setPg('vbank')"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">가상계좌</p>
                    </div>
                    <div
                        :class="'px-4 py-5 border rounded-md text-gray-400 mb-3  '+pg.iche" @click="setPg('iche')"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">계좌이체</p>
                    </div>
                    <!--div
                        class="px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">휴대폰 결제</p>
                    </div>
                    <div
                        class="px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">무통장 입금</p>
                    </div-->
                    <!--div
                        :class="'px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3  '+pg.naver" @click="setPg('naver')"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">네이버 페이</p>
                    </div-->
                    <div
                        :class="'px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3  '+pg.sam" @click="setPg('sam')"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">삼성페이</p>
                    </div>
                    <div :class="'px-4 py-5 border rounded-md text-gray-400 mr-3 mb-3 '+pg.kakao"
                         @click="setPg('kakao')" style="width: calc(33.33% - 8px)">
                        <p class="text-sm text-center">카카오페이</p>

                    </div>
                    <div
                        :class="'px-4 py-5 border rounded-md text-gray-400 mb-3  '+pg.payco" @click="setPg('payco')"
                        style="width: calc(33.33% - 8px)"
                    >
                        <p class="text-sm text-center">페이코</p>
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-6">
                <p class="font-semibold mb-2">최종 결제 금액</p>
                <div>
                    <div
                        class="flex
              items-center
              justify-between
              text-gray-800
              font-light
              border-b
              pb-4">
                        <p class="text-sm">상품금액 ({{ goodsAmt }}개)</p>
                        <p class="text-sm">+ {{ util.numberFormat(cartSummary.product_listprice) }}원</p>
                    </div>
                    <div
                        class="flex
              items-center
              justify-between
              text-gray-800
              font-light
              pt-4"
                    >
                        <p class="text-sm">상품 및 쿠폰할인</p>
                        <p class="text-sm">- {{ util.numberFormat(totalDiscountPrice) }}원</p>
                    </div>
                    <p class="text-11 text-right border-b pb-4" style="color: #8097e6">
                        상품 할인 금액 -{{ util.numberFormat(productDcprice) }}원 <br/>쿠폰 {{ couponName }}
                        - {{ util.numberFormat(couponPrice) }}원
                        <br/>적립금 -{{ util.numberFormat(pointPrice) }}원
                    </p>
                    <div
                        class="flex
              items-center
              justify-between
              py-4
              text-gray-800
              font-light
              border-b">
                        <p class="text-sm">배송비</p>
                        <p class="text-sm">{{ util.numberFormat(cartSummary.total_delivery_price) }}원</p>
                    </div>
                    <div
                        class="flex
              items-center
              justify-between
              text-gray-800
              font-light
              pt-4">
                        <p class="text-sm">총 결제예정금액</p>
                        <p class="text-sm font-semibold">{{ util.numberFormat(paymentTotalPrice) }}원</p>
                    </div>
                    <div class="flex items-center justify-end mt-2" v-if="wishPoint>0">
                        <p class="text-11
                mb-2
                mr-2
                text-white
                bg-black
                rounded-2xl
                px-1
                font-semibold" style="background-color: #eea423">
                            적립
                        </p>
                        <p class="text-11 mb-2">구매 시 총 {{ util.numberFormat(wishPoint) }}원 적립</p>
                    </div>
                </div>
            </div>
            <div class="bg-white py-2 px-3">

                <v-btn type="button" @click="registOrder()" depressed rounded color="#ffbb53"
                       style="color:#fff;height:55px;width:100%;">
                    <span id="finish_purchase">{{ util.numberFormat(paymentTotalPrice) }}원 결제하기</span>
                </v-btn>
            </div>
        </div>
        <div id="paymentPgForm" style="display:none"></div>
    </div>
</template>
<script>

import JQ from "jquery"
import {mapActions} from "vuex";
import AUTH from '../../api/auth'
import UTIL from '../../api/util'
import {
    API_URL_GET_ORDER_INFO,
    API_URL_INSERT_ORDER_ACTION,
    API_URL_PAYMENT_BANK_ACTION,
    API_URL_PAYMENT_FREE_ACTION,
    API_URL_PAYMENT_PG_ACTION,
    API_URL_UPDATE_ORDER_INFO
} from '../../api/urls';
import apiService from '../../api/apiService'
import {validationMixin} from "vuelidate";
import {required,numeric} from "vuelidate/lib/validators";

export default {
    mixins: [validationMixin],
    validations: {
        ordName: {required},
        ordPcs: {required,numeric},
        recName: {required},
        recPcs: {required,numeric},
        postNum: {required},
        addr2: {required},

    },
    computed: {
        ordNameErrors() {
            const errors = []
            if (!this.$v.ordName.$dirty) return errors
            !this.$v.ordName.required && errors.push('주문자 성함을 입력하세요')
            return errors
        },
        ordPcsErrors() {
            const errors = []
            if (!this.$v.ordPcs.$dirty) return errors
            !this.$v.ordPcs.required && errors.push('휴대폰 번호를 입력하세요')
            !this.$v.ordPcs.numeric && errors.push('휴대폰 번호는 숫자만 입력가능합니다')
            if(this.$v.ordPcs.$model.length!=11) {
                errors.push('휴대폰 번호를 확인하세요')
            } else {
                if(this.$v.ordPcs.$model.substring(0,3) != '010') {
                    errors.push('휴대폰 번호를 확인하세요')
                }
            }
            return errors
        },
        postNumErrors() {
            const errors = []
            if (!this.$v.postNum.$dirty) return errors
            !this.$v.postNum.required && errors.push('우편번호를 입력하세요')
            return errors
        },
        recNameErrors() {
            const errors = []
            if (!this.$v.recName.$dirty) return errors
            !this.$v.recName.required && errors.push('받는분을 입력하세요')
            return errors
        },
        recPcsErrors() {
            const errors = []
            if (!this.$v.recPcs.$dirty) return errors

            !this.$v.recPcs.required && errors.push('휴대폰 번호를 입력하세요')
            !this.$v.recPcs.numeric && errors.push('휴대폰 번호는 숫자만 입력가능합니다')
            if(this.$v.recPcs.$model.length!=11) {
                errors.push('휴대폰 번호를 확인하세요')
            } else {
                if(this.$v.recPcs.$model.substring(0,3) != '010') {
                    errors.push('휴대폰 번호를 확인하세요')
                }
            }

            return errors
        },
        addr2Errors() {
            const errors = []
            if (!this.$v.addr2.$dirty) return errors
            !this.$v.addr2.required && errors.push('상세주소를 입력하세요')
            return errors
        }
    },
    watch: {
        '$route'(to, from) {
            if (to.name == 'orderInput') {
                switch (from.name) {
                    case 'orderInfo':
                        this.setTitle('주문서 작성');
                        this.orderInputShow = true;
                        if (sessionStorage.getItem('orderInfo')) {
                            let member = JSON.parse(sessionStorage.getItem('orderInfo'));
                            if (member.name && member.pcs) {
                                this.orderUserEqualDisabled = false;
                                this.orderName = member.name;
                                this.orderInfoFlag = true;
                                this.memberInfo = {
                                    name: member.name,
                                    pcs: member.pcs,
                                    email: (member.email) ? member.email : '',
                                }
                            }
                        }
                        break;
                    case 'receiveInfoForm':
                    case 'receiveInfo':
                        this.setTitle('주문서 작성');
                        this.orderInputShow = true;
                        if (sessionStorage.getItem('shippingInfo')) {
                            this.oldReciInfo = {}
                            this.orderUserEqual = false;
                            this.shippingInfo = JSON.parse(sessionStorage.getItem('shippingInfo'));
                            this.changeOrderData()
                        }
                    case 'msgForm':
                        this.setTitle('주문서 작성');
                        this.orderInputShow = true;
                        if (sessionStorage.getItem('deliveryMsg')) {
                            this.deliveryMessage = JSON.parse(sessionStorage.getItem('deliveryMsg'));

                        }

                        break;
                }
            } else if (to.name == 'receiveInfoForm') {

            }
        },
        orderUserEqual(val) {
            if (val) {

                this.oldReciInfo = {
                    name: this.shippingInfo.recipient,
                    pcs: this.shippingInfo.mobile
                }
                this.shippingInfo.recipient = this.memberInfo.name;
                this.shippingInfo.mobile = this.memberInfo.pcs;
            } else {
                if (this.oldReciInfo.name) {
                    this.shippingInfo.recipient = this.oldReciInfo.name;
                    this.shippingInfo.mobile = this.oldReciInfo.pcs;
                    this.oldReciInfo = {}
                }
            }

        },
        usePoint(val) {
            if (val) {

                if (!this.useMileageBool) {
                    this.usePoint = 0;
                    return;
                }
                if (isNaN(val)) {
                    this.usePoint = 0;
                    return;
                }
                this.pointMsg = 'sdsd';

                let maxMileage = this.getMaxPoint();
                if (val > maxMileage) {
                    this.usePoint = maxMileage;
                }
                //let flag = false;
                //for (let item of this.couponList) {
                //  if (item.checked)item.checked = false;
                //}
                //this.couponData = {};
                //this.useCouponType = '';
                this.changeOrderData();

            } else {
                this.usePoint = 0;
                this.changeOrderData();
                this.pointMsg = '';
            }
        }
    },
    data() {
        return {
            util: UTIL,
            isLogin: false,
            memberInfo: {},
            orderName: '정보를 입력해주세요',
            orderInfoFlag: false,
            cartIdx: '',
            shippingInfo: {},
            orderInputShow: true,
            orderUserEqual: false,
            orderUserEqualDisabled: true,
            oldReciInfo: {},
            deliveryMessage: {
                msg: '배송시 요청사항을 입력해주세요',
                dtype: ''
            },
            userHavePoint: 0,
            usePoint: 0,
            goodsList: [],
            cartSummary: {},
            totalDiscountPrice: 0,
            couponPrice: 0,
            pointPrice: 0,
            couponName: '',
            paymentTotalPrice: 0,
            wishPoint: 0,
            goodsAmt: 0,
            paymentMethod: '',
            insertFlag: false,
            ordName: '',
            ordPcs: '',
            ordEmail: '',
            recName: '',
            recPcs: '',
            postNum: '',
            addr1: '',
            addr2: '',
            couponAmt: 0,
            pointMsg: '',
            maxUseMileage: 0,
            mileageTargetPrice: 0,
            mileageConditionUseLimitType: '',
            mileageConditionUseLimitValue: '',
            mileageConditionMinMileage: '',
            mileageConditionUseUnit: '',
            mileageConditionMinBuyAmt: '',
            mileageConditionUseDeliverypriceYn: '',
            useMileageBool: true,
            couponData: {},
            useCouponType: '',
            couponList: [],
            couponMode: '',
            productDcprice: 0,
            changOrderServerFlag: false,
            couponBg: require('../../assets/icons/coupon-card.svg'),
            pg: {
                card: '',
                vbank: '',
                iche: '',
                naver: '',
                sam: '',
                kakao: '',
                payco: '',
            }
        };
    },
    created() {
        sessionStorage.setItem('orderInfo', '');
        sessionStorage.setItem('shippingInfo', '');
        sessionStorage.setItem('deliveryMsg', '');
        sessionStorage.setItem('equalMemberInfo', '');

        this.setClass('sub')
        this.setTitle('주문서 작성');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        this.cartIdx = this.$route.params.cartIdx;
        if (memberInfo) {
            if (memberInfo.pcs) {
                this.orderName = memberInfo.name;
                this.orderInfoFlag = true;
                this.orderUserEqualDisabled = false;

                const emails = memberInfo.mail.split('@');
                let email = memberInfo.email;
                if (emails[1] == 'anonymous.com') {
                    email = '';
                }
                this.memberInfo = {
                    id:memberInfo.id,
                    name: memberInfo.name,
                    pcs: memberInfo.pcs,
                    email: email,
                }
            }
            this.isLogin = true;
        }
        this.getData()
    },

    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = {cartIx: this.cartIdx}
            apiService.get(API_URL_GET_ORDER_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.data.shipping_info) this.shippingInfo = res.data.data.shipping_info;
                    let totalAmt = 0;
                    let minusPoint = 0;
                    for (let cartItem of res.data.data.cart) {
                        for (let templateItem of cartItem.deliveryTemplateList) {
                            for (let item of templateItem.productList) {
                                totalAmt = totalAmt + parseInt(item.pcount)

                                if(item.use_point_yn == 'yes') {
                                    let itemPrice = parseInt(item.dcprice) * parseInt(item.pcount);
                                    let mpoint = itemPrice - (itemPrice * (item.use_point_rate/100));
                                    minusPoint+=parseInt(mpoint);
                                }
                                this.goodsList.push(item);
                            }
                        }
                    }
                    if (this.isLogin) {
                        this.userHavePoint = (res.data.data.userMileage) ? res.data.data.userMileage : 0;
                        this.mileageConditionUseLimitType = res.data.data.mileageConditionUseLimitType
                        this.mileageConditionUseLimitValue = res.data.data.mileageConditionUseLimitValue

                        this.mileageConditionMinMileage = res.data.data.mileageConditionMinMileage
                        this.mileageConditionUseUnit = res.data.data.mileageConditionUseUnit
                        this.mileageConditionMinBuyAmt = res.data.data.mileageConditionMinBuyAmt
                        this.maxUseMileage = parseInt(res.data.data.maxUseMileage) - minusPoint;
                        this.mileageTargetPrice = res.data.data.mileageTargetPrice
                        this.mileageConditionUseDeliverypriceYn = res.data.data.mileageConditionUseDeliverypriceYn
                        this.useMileageBool = res.data.data.useMileageBool

                        if (res.data.data.coupon_use_yn == 'Y' && parseInt(res.data.data.userCouponCnt) > 0) {
                            this.couponAmt = res.data.data.userCouponCnt;
                            for (let key in res.data.data.couponList) {

                                let item = res.data.data.couponList[key];
                                if (item.cupon_sale_type_percent) {
                                    item.price = item.cupon_sale_value + '%';
                                } else {
                                    item.price = UTIL.numberFormat(item.cupon_sale_value) + '원';
                                }
                                if (item.regist_start && item.regist_end) {
                                    let use_edate = item.regist_end;
                                    let use_sdate = item.regist_start;
                                    item.term = use_sdate + '~' + use_edate;
                                } else {
                                    item.term = '제한없음'
                                }
                                item.publish_condition_price = (parseInt(item.publish_condition_price) > 0) ? UTIL.numberFormat(item.publish_condition_price) : '';
                                item.checked = false;
                                item.couponType = 'G';
                                this.couponList.push(item);
                            }
                            for (let key in res.data.data.cartCouponList) {
                                if (!res.data.data.couponList[key]) {
                                    let item = res.data.data.cartCouponList[key]
                                    if (item.cupon_sale_type_percent) {
                                        item.price = item.cupon_sale_value + '%';
                                    } else {
                                        item.price = UTIL.numberFormat(item.cupon_sale_value) + '원';
                                    }
                                    if (item.regist_start && item.regist_end) {
                                        let use_edate = item.regist_end;
                                        let use_sdate = item.regist_start;
                                        item.term = use_sdate + '~' + use_edate;
                                    } else {
                                        item.term = '제한없음'
                                    }
                                    item.publish_condition_price = (parseInt(item.publish_condition_price) > 0) ? UTIL.numberFormat(item.publish_condition_price) : '';
                                    item.checked = false;
                                    item.couponType = 'C';
                                    this.couponList.push(item);
                                }
                            }

                            this.couponMode = res.data.data.couponMode;
                        }


                    }


                    this.cartSummary = res.data.data.cartSummary;
                    this.wishPoint = this.cartSummary.mileage;
                    this.goodsAmt = totalAmt;
                    this.productDcprice = parseInt(this.cartSummary.product_listprice) - parseInt(this.cartSummary.product_dcprice);
                    this.setTotalPrice();
                    this.setOrderGoogleTracker();
                }
            });
        },
        allUsePoint() {
            this.usePoint = this.userHavePoint;

        },
        setOrderGoogleTracker() {
            window.dataLayer = window.dataLayer || [];

            let uid = (this.memberInfo.id)?this.memberInfo.id:'';
            let name = (this.memberInfo.name)?this.memberInfo.name:'';

            let goods = [];
            let index = 0;
            for (let cartItem of this.goodsList) {
               let cateName = cartItem.categoryPathName.replace('/',' ').replace('/',' ');
               let itemData = {
                    item_id: cartItem.id,
                    item_name: cartItem.pname+' '+cartItem.options_text,
                    currency: "KRW",
                    discount:parseInt(cartItem.discount_amount),
                    item_brand: ((cartItem.brand_name)?cartItem.brand_name:'브랜드 없음'),
                    item_category: cateName,
                    price: parseInt(cartItem.total_dcprice),
                    quantity: parseInt(cartItem.pcount),
                    index: index,
                }
                index++;
                goods.push(itemData);
            }
            window.dataLayer.push({
                event: "view_confirmation_page",
                user_id: uid,
                user_name : name,
                ecommerce: {
                    currency: "KRW",
                    value: this.paymentTotalPrice,
                    shipping: parseInt(this.cartSummary.total_delivery_price),
                    coupon: "",
                    items: goods,
                }

            });
            window.dataLayer.push({ ecommerce:null})
           // console.log(window.dataLayer)

        },
        setPg(cmd) {
            for (let key in this.pg) {
                if (key == cmd) {
                    this.pg[key] = 'border-black'
                    this.paymentMethod = cmd;
                } else this.pg[key] = '';
            }
        },
        selectCoupon(ix) {
            for (let item of this.couponList) {
                if (item.regist_ix == ix) {
                    if (item.checked) {
                        item.checked = false;
                    } else item.checked = true;
                } else item.checked = false;
            }
            this.applyCoupon();
        },
        applyCoupon() {
            let selectedItem = {};
            let flag = false;
            let useData = {};
            let couponType = '';
            let couponCnt = 0;
            let cartCouponCnt = 0;
            let isAppCoupon = false;

            for (let item of this.couponList) {
                if (item.checked) {
                    selectedItem = item;
                    flag = true;
                    couponType = item.couponType
                    if (couponType == 'G') {
                        useData[item.cart_ix] = item.regist_ix;
                    } else {
                        useData['cart'] = item.regist_ix;
                    }

                    break;
                }
            }
            this.setUseCouponData(useData, couponType);
        },
        setUseCouponData(data, type) {
            this.couponData = data;
            this.useCouponType = type; // C : 장바구니쿠폰, G: 상품쿠폰, A: 앱첫구매쿠폰
            //마일리지 초기화
            //this.usePoint = 0;
            this.changeOrderData();
        },
        getMaxPoint() {
            let mileageTargetPrice = parseInt(this.mileageTargetPrice);
            if (parseInt(this.couponPrice) > 0) {
                mileageTargetPrice -= parseInt(this.couponPrice);

            }
            let allUseMileage = parseInt(this.maxUseMileage);
            if (mileageTargetPrice < allUseMileage) {
                return mileageTargetPrice;
            } else {
                return allUseMileage;
            }
        },
        changeOrderData() {
            if (this.changOrderServerFlag) return;
            this.changOrderServerFlag = true;
            let cartIdx = this.cartIdx.split(',');
            let virtualReceipient = [];
            if (this.isLogin) {
                virtualReceipient = [{
                    name: this.shippingInfo.recipient,
                    zipcode: this.shippingInfo.zipcode,
                    address1: this.shippingInfo.address1,
                    address2: this.shippingInfo.address2,
                    mobile: this.shippingInfo.mobile,
                    tel: '',
                    addAddressBookYn: 'N',
                    basicAddressBookYn: 'N',
                    cart_ix: cartIdx,
                }]
            } else {
                virtualReceipient = [{
                    name: this.recName,
                    zipcode: this.postNum,
                    address1: this.addr1,
                    address2: this.addr2,
                    mobile: this.recPcs,
                    tel: '',
                    addAddressBookYn: 'N',
                    basicAddressBookYn: 'N',
                    cart_ix: cartIdx,
                }]
            }
            let paymentData = {
                method: 0,
                mileage: this.usePoint,
            }
            const frm = new FormData()
            frm.append('recipientList', JSON.stringify(virtualReceipient));
            frm.append('payment', JSON.stringify(paymentData));
            frm.append('coupon', JSON.stringify(this.couponData));
            frm.append('couponType', this.useCouponType);
            console.log(this.couponData)
            console.log(this.useCouponType)

            apiService.post(API_URL_UPDATE_ORDER_INFO, frm, (res) => {
                this.changOrderServerFlag = false;
                if (res.data.result == 'succ') {
                    //this.pointPrice = this.usePoint;
                    this.cartSummary = res.data.summary;
                    this.setTotalPrice();
                }

            });
        },
        openDaumPostcode() {
            const elementWrap = this.$refs.wrap
            // 현재 scroll 위치를 저장해놓는다.
            const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    console.log(data);
                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    let addr = '' // 주소 변수

                    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress
                    }
                    this.postNum = data.zonecode;
                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    // document.getElementById('address').value = addr
                    this.addr1 = addr

                    // iframe을 넣은 element를 안보이게 한다.
                    // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                    elementWrap.style.display = 'none'
                    this.changeOrderData();

                    // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                    document.body.scrollTop = currentScroll
                },
                // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
                onresize: function (size) {
                    // elementWrap.style.height = size.height + 'px'
                },
                width: '100%',
                height: '100%'
            }).embed(elementWrap)
            elementWrap.style.display = 'block'
        },
        foldDaumPostcode() {
            const elementWrap = this.$refs.wrap
            elementWrap.style.display = 'none'
        },

        setTotalPrice() {
            this.couponPrice = 0;
            if (this.useCouponType == 'C' && this.cartSummary.cartCouponData) {
                if (this.cartSummary.cartCouponData.coupon_sale_type) {
                    let discountPrice = 0;
                    if (this.cartSummary.cartCouponData.coupon_sale_type == "1") {
                        discountPrice = parseInt(this.cartSummary.product_dcprice * (this.cartSummary.cartCouponData.couponDiscountPer / 100));
                    } else {
                        discountPrice = parseInt(this.cartSummary.cartCouponData.couponDiscountPrice);
                    }
                    if(this.cartSummary.cartCouponData.publish_max == 'Y') {
                        if(discountPrice > parseInt(this.cartSummary.cartCouponData.limit_price)) {
                            discountPrice =    parseInt(this.cartSummary.cartCouponData.limit_price)
                        }

                    }
                    this.cartSummary.product_discount_amount = parseInt(this.cartSummary.product_discount_amount) + discountPrice;
                    this.couponPrice = discountPrice;
                }
            } else {
                for (let item of this.cartSummary.productDiscountList) {
                    if (item.type == 'CP') this.couponPrice = item.discount_amount;
                }
            }


            if (parseInt(this.usePoint) > 0 && parseInt(this.couponPrice) > 0) {
                let lastGoodsPrice = parseInt(this.cartSummary.product_dcprice) - parseInt(this.couponPrice);
                if (this.mileageConditionMinBuyAmt > 0) {
                    if (this.mileageConditionUseLimitType != 'noLimit') {
                        if (this.mileageConditionUseLimitType == 'price') {
                            if (lastGoodsPrice < parseInt(this.mileageConditionMinBuyAmt)) {
                                this.usePoint = 0;
                            } else {
                                if (parseInt(this.usePoint) > parseInt(this.mileageConditionUseLimitValue)) this.usePoint = this.mileageConditionUseLimitValue;
                            }
                        } else {
                            if (lastGoodsPrice < parseInt(this.mileageConditionMinBuyAmt)) {
                                this.usePoint = 0;
                            } else {
                                let maxPoint = lastGoodsPrice * (parseInt(this.mileageConditionUseLimitValue) / 100);
                                let usePoint = parseInt(maxPoint);
                                if (parseInt(this.usePoint) > usePoint) this.usePoint = usePoint;
                            }
                        }
                    }
                } else {
                    if (this.mileageConditionUseLimitType != 'noLimit') {
                        if (this.mileageConditionUseLimitType == 'price') {
                            if (parseInt(this.usePoint) > parseInt(this.mileageConditionUseLimitValue)) this.usePoint = this.mileageConditionUseLimitValue;
                        } else {
                            let maxPoint = lastGoodsPrice * (parseInt(this.mileageConditionUseLimitValue) / 100);
                            let usePoint = parseInt(maxPoint);
                       //     console.log(usePoint, lastGoodsPrice)
                            if (parseInt(this.usePoint) > usePoint) this.usePoint = usePoint;
                        }
                    }
                }
            }


            this.pointPrice = this.usePoint;
            this.totalDiscountPrice = parseInt(this.cartSummary.product_discount_amount) + parseInt(this.pointPrice);
            this.paymentTotalPrice = parseInt(this.cartSummary.total_delivery_price) + parseInt(this.cartSummary.product_listprice) - this.totalDiscountPrice
        },
        orderUserEqualSync() {
            if (this.orderUserEqualDisabled) return;
            if (this.orderUserEqual) this.orderUserEqual = false;
            else this.orderUserEqual = true;
        },
        goPage(url) {
            this.$router.push(url);
        },
        goForm(url) {

            this.orderInputShow = false;
            this.setTitle('');
            if (url == 'receiveInfoForm' || url == 'receiveInfo') {
                sessionStorage.setItem('equalMemberInfo', JSON.stringify(this.memberInfo));
            }
            this.$router.push('/vorder/' + this.cartIdx + '/' + url);

        },
        registOrder() {
            let buyerData = {};
            let cartIdx = this.cartIdx.split(',');
            let virtualReceipient = [];
            let dmsg = (this.deliveryMessage.dtype) ? this.deliveryMessage.msg : '';

            if (this.isLogin) {
                if (!this.memberInfo.name || !this.memberInfo.pcs) {
                    let params = {
                        message: '주문자 정보를 입력하세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                if (!this.shippingInfo.ix) {
                    let params = {
                        message: '배송지 정보를 입력하세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                buyerData = {
                    name: this.memberInfo.name,
                    email: this.memberInfo.email,
                    mobile: this.memberInfo.pcs
                }
                virtualReceipient = [{
                    name: this.shippingInfo.recipient,
                    zipcode: this.shippingInfo.zipcode,
                    address1: this.shippingInfo.address1,
                    address2: this.shippingInfo.address2,
                    mobile: this.shippingInfo.mobile,
                    tel: '',
                    addAddressBookYn: 'N',
                    basicAddressBookYn: 'N',
                    cart_ix: cartIdx,
                    msg_type: 'D',
                    msg: dmsg
                }]
            } else {
                this.$v.$touch();
                if (this.$v.$anyError) {
                    return;
                }
                if(this.ordPcsErrors.length>0) {
                    return;
                }
                if(this.recPcsErrors.length>0) {
                    return;
                }


                buyerData = {
                    name: this.ordName,
                    email: this.ordEmail,
                    mobile: this.ordPcs
                }
                virtualReceipient = [{
                    name: this.recName,
                    zipcode: this.postNum,
                    address1: this.addr1,
                    address2: this.addr2,
                    mobile: this.recPcs,
                    tel: '',
                    addAddressBookYn: 'N',
                    basicAddressBookYn: 'N',
                    cart_ix: cartIdx,
                    msg_type: 'D',
                    msg: dmsg
                }]
            }

            if (!this.paymentMethod) {
                let params = {
                    message: '결제방법을 선택하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
                return;
            }

            if (this.insertFlag) return;
            this.insertFlag = true;

            let payMethod = this.checkPaymentMethod();

            //payMethod = 0;

            let tax = 'no';
            let taxType = '';
            let taxPcs = '';
            let paymentData = {
                method: payMethod,
                mileage: this.usePoint,
                tax: tax,
                taxType: taxType,
                taxPcs: taxPcs
            }
            const frm = new FormData()
            frm.append('buyer', JSON.stringify(buyerData))
            frm.append('recipientList', JSON.stringify(virtualReceipient));
            frm.append('payment', JSON.stringify(paymentData));
            frm.append('coupon', JSON.stringify(this.couponData));
            frm.append('couponType', this.useCouponType);
            frm.append('couponPrice', this.couponPrice);


            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_ORDER_ACTION, frm, (res) => {
                if (res.data && res.data.oid) {
                    if (this.paymentTotalPrice == res.data.payment.payment_price) {
                        if (res.data.payment.method == "0") { //무통장 입금
                            this.paymentBank(res.data.oid);
                        } else if (res.data.payment.method == "8") { //무료결제
                            this.paymentFree(res.data.oid);
                        } else {
                            this.paymentGateway(res.data);
                        }
                    } else {
                        this.$eventBus.$emit('overlay', 'hide');
                        this.insertFlag = false;
                        let params = {
                            message: '결제에 실패하였습니다'
                        }
                        this.$eventBus.$emit('modalOpen', params)
                    }
                } else if (res.data.msg) {
                    this.$eventBus.$emit('overlay', 'hide');
                    this.insertFlag = false;
                    let params = {
                        message: res.data.msg
                    }
                    this.$eventBus.$emit('modalOpen', params)

                }


            })
        },
        paymentFree(oid) {
            let frm = new FormData();
            if (location.hostname == 'localhost') {
                frm.append('oid', oid);
            }

            apiService.post(API_URL_PAYMENT_FREE_ACTION, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');

                if (res.data.result == 'succ') {
                    this.$router.push('/vorderComplete/' + res.data.oid);

                } else {
                    this.insertFlag = false;
                    let params = {
                        message: '결제에 실패하였습니다'
                    }
                    this.$eventBus.$emit('modalOpen', params)
                }
            });
        },
        paymentBank(oid) {
            let frm = new FormData();
            if (location.hostname == 'localhost') {
                frm.append('oid', oid);
            }

            apiService.post(API_URL_PAYMENT_BANK_ACTION, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');

                if (res.data == 'success') {
                    this.$router.push('/vorderComplete/' + oid);
                } else {
                    this.insertFlag = false;
                    let params = {
                        message: '결제에 실패하였습니다'
                    }
                    this.$eventBus.$emit('modalOpen', params)
                }
            });
        },
        checkPaymentMethod() {

            let payMethod = '';
            if (this.paymentTotalPrice < 1) {
                let payMethod = 8;
            } else {
                switch (this.paymentMethod) {
                    case 'vbank':
                        payMethod = 4;
                        break;
                    case 'card':
                        payMethod = 1;
                        break;
                    case 'iche':
                        payMethod = 5;
                        break;
                    case 'naver':
                        payMethod = 53;
                        break;
                    case 'sam':
                        payMethod = 42;
                        break;
                    case 'kakao':
                        payMethod = 41;
                        break;
                    case 'payco':
                        payMethod = 40;
                        break;
                }
            }
            return payMethod;
        },
        naverPayAction() {
            const oPay = window.vueNaver.Pay.create({
                "mode": "development" //"production"
                , "clientId": "np_qnwpw240510"
                , "payType": "normal"
                , "openType": "page"
                , "onAuthorize": function (oData) {
                    if (oData.resultCode === "Success") {
                        location.href = "/payment/naverpayPg/result?resultCode=Success&paymentId=" + oData.paymentId;
                    } else {
                        var resultMessage = oData.resultMessage;
                        if (resultMessage == "userCancel") {
                            resultMessage = "결제를 취소하셨습니다. 주문 내용 확인 후 다시 결제해주세요.";
                        } else if (resultMessage == "webhookFail") {
                            resultMessage = "webhookUrl 호출 응답 실패";
                        } else if (resultMessage == "paymentTimeExpire") {
                            resultMessage = "결제 가능한 시간이 지났습니다. 주문 내용 확인 후 다시 결제해주세요.";
                        } else if (resultMessage == "OwnerAuthFail") {
                            resultMessage = "타인 명의 카드는 결제가 불가능합니다. 회원 본인 명의의 카드로 결제해주세요.";
                        }
                        alert(resultMessage);
                    }
                }
            });
            oPay.open(JSON.parse(unescape(document.paymentGatewayForm.data.value)));

        },
        paymentGateway(data) {
            let frm = new FormData();
            frm.append('oid', data.oid);
            frm.append('agentType', 'W');
            frm.append('method', data.payment.method);
            apiService.post(API_URL_PAYMENT_PG_ACTION, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data.result == 'succ') {
                    JQ('#paymentPgForm').html(res.data.html);
                    let form = document.paymentGatewayForm;
                    let paymethod = form.paymethod.value;
                    JQ(form).attr("accept-charset", "EUC-KR");
                    form.action = "https://mobile.inicis.com/smart/" + paymethod + "/";
                    form.submit();


                    this.insertFlag = false;
                } else {
                    this.insertFlag = false;
                    let params = {
                        message: '결제에 실패하였습니다'
                    }
                    this.$eventBus.$emit('modalOpen', params)

                }

            });

        }
    }

}
</script>


<style lang="scss" scoped>
.use-point:focus {
    outline: none;
}

.paymethod-box {
    & > div {
        max-height: 68px;
        line-height: 68px;

        .text-sm {
            font-size: 13px;
            line-height: 28px;
        }
    }
}

#daumFrame {
    background: #fff;
    display: none;
    border: 2px solid #000;
    width: calc(100vw);
    height: calc(100vh - 95px);
    overflow: auto;
    padding: 0;
    position: fixed;
    top: 95px;
    z-index: 10;

}

.point-msg {
    color: darkred;
    font-size: 12px;
    padding: 3px 0 0 3px;
}

.paymethod-box {
    .border-black {
        .text-sm {
            color: #000;
        }
    }
}

@media only all and (min-width: 500px) {


}
</style>