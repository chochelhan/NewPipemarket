<template>
    <div class="page-contents">
        <div style="background-color: #f1f1f1; min-height: 100vh;margin-top:25px;">
            <div class="py-4 px-6 flex items-center bg-white border-b">
                <div
                    :style="{'background-image':'url('+pimg+')','background-repeat':'no-repeat','background-size':'cover','width':'50px','height':'50px'}"></div>
                <div class="ml-3 text-13 flex-1" style="color: #666;min-width:170px;">
                    No.{{ oid }}
                </div>
                <div class="flex items-center" style="justify-content: flex-end;min-width:70px;">
                    <img src="../../assets/icons/checkedBlue.svg" alt=""/>
                    <div class="text-13 ml-1" style="color: #8097e6">{{ statusName }}</div>
                </div>
            </div>
            <div class="py-4 px-6 bg-white mb-3">
                <p class="text-base font-semibold mb-4" v-if="goodsList.length>1">상품 정보({{ goodsList.length }}개)</p>
                <p class="text-base font-semibold mb-4" v-else>상품 정보</p>
                <div v-for="goods in goodsList">
                    <p class="text-15 mb-2">{{ goods.pname }}</p>
                    <div class="text-13 font-extralight" style="color: #6c6c6c">
                        {{ goods.option_text }},
                        수량 {{ goods.pcnt }}개
                    </div>
                    <v-btn v-if="goods.status=='BF' && !goods.is_comment"
                           @click="goReview(goods.od_ix)"
                           depressed
                           rounded
                           class="border py-3 rounded-lg mt-3 text-center"
                           style="color: #8097e6; border:solid 1px #8097e6;background:#fff;height:40px;width:100%;"
                    >
                        리뷰쓰고 최대 {{ reviewPoint }}P 받기
                    </v-btn>
                    <div class="flex justify-between items-center mt-4">
                        <div class="flex items-center" v-if="parseInt(goods.reserve)>0">
                            <p
                                class="text-10 text-white px-1 rounded-xl mr-2"
                                style="background-color: #eea423"
                            >
                                적립
                            </p>
                            <p class="text-13">{{ util.numberFormat(goods.reserve) }}원 적립</p>
                        </div>
                        <p class="text-15 font-semibold">{{ util.numberFormat(goods.dcprice) }}원</p>
                    </div>
                </div>

            </div>
            <div class="py-4 px-6 bg-white mb-3" style="color: #3b3b3b" v-if="viewDelivery">
                <p class="text-base font-semibold mb-3">배송지 정보</p>
                <div class="flex justify-between items-center mb-4">
                    <p>수령인</p>
                    <p>{{ deliveryInfo.rname }}</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>휴대폰 번호</p>
                    <p>{{ deliveryInfo.rmobile }}</p>
                </div>
                <div class="flex justify-between items-center">
                    <p>배송지</p>
                    <p>[{{ deliveryInfo.zip }}]</p>
                </div>
                <p class="text-right mb-4">
                    {{ deliveryInfo.addr1 }} <br/>{{ deliveryInfo.addr2 }}
                </p>
                <div class="flex justify-between items-center mb-4">
                    <p style="min-width:100px;">배송 요청사항</p>
                    <p>{{ deliveryMsg }}</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>주문자 정보</p>
                    <p>{{ orderInfo.bname }} / {{ orderInfo.bmobile }}</p>
                </div>
            </div>

            <div class="py-4 px-6 bg-white mb-3" style="color: #3b3b3b">
                <p class="text-base font-semibold mb-3">결제 정보</p>
                <div class="flex justify-between items-center mb-4">
                    <p>결제금액</p>
                    <p>{{ util.numberFormat(payment.payment_price) }}원</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>상품금액</p>
                    <p>{{ util.numberFormat(totalGoodsDcprice) }}원</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>총 할인금액</p>
                    <p>{{ util.numberFormat(paymentInfo.total_dc) }}원</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>최종 결제금액</p>
                    <p class="font-semibold">{{ util.numberFormat(payment.payment_price) }}원</p>
                </div>
            </div>

            <div class="py-4 px-6 bg-white mb-3" style="color: #3b3b3b">
                <p class="text-base font-semibold mb-3">결제 수단</p>
                <div class="flex justify-between items-center mb-4">
                    <p>결제방식</p>
                    <p>{{ payment.method_text }}</p>
                </div>
                <div v-if="payment.method=='4'">
                    <div class="flex justify-between items-center mb-4">
                        <p>금액</p>
                        <p>{{ util.numberFormat(payment.payment_price) }}원</p>
                    </div>
                    <div class="flex justify-between items-center mb-4">
                        <p>입금계좌</p>
                        <p>{{ payment.bank }} {{ payment.bank_account_num }}</p>
                    </div>
                    <div class="flex justify-between items-center mb-4">
                        <p>입금기한</p>
                        <p>{{ payment.bank_input_date }} 자정까지</p>
                    </div>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <p>포인트</p>
                    <p>{{ util.numberFormat(paymentInfo.use_reserve) }}원</p>
                </div>
                <div class="flex items-center justify-between" v-if="useCoupon">
                    <p style="min-width:100px;">쿠폰</p>
                    <p style="text-align:right;">{{ couponName }}</p>
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
    API_URL_GET_MYORDER_DETAIL
} from "../../api/urls";

export default {
    data() {
        return {
            util: UTIL,
            oid: '',
            pimg: '',
            statusName: '',
            orderInfo: {},
            deliveryInfo: {},
            paymentInfo: {},
            payment: {},
            status: '',
            deliveryMsg: '',
            goodsList: [],
            reviewPoint: 0,
            viewDelivery: false,
            totalGoodsDcprice:0,
            useCoupon:false,
            couponName:'',
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('주문 상세 내역');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        this.oid = this.$route.params.oid;
        this.status = this.$route.params.status;
        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('oid', this.oid);
            frm.append('status', this.status);
            apiService.post(API_URL_GET_MYORDER_DETAIL, frm, (res) => {
                if (res.data.result == 'success') {
                    this.orderInfo = res.data.data.orderData.order;
                    if (res.data.data.orderData.deliveryInfo) {
                        this.viewDelivery = true;
                        this.deliveryInfo = res.data.data.orderData.deliveryInfo;
                        this.deliveryMsg = this.deliveryInfo.msg[0].msg;
                    }
                    this.paymentInfo = res.data.data.orderData.paymentInfo;
                    if (this.orderInfo.couponIx && this.orderInfo.couponPrice) {
                        this.paymentInfo.total_dc = parseInt(this.paymentInfo.total_dc) + parseInt(this.orderInfo.couponPrice);
                        this.useCoupon = true;
                        this.couponName = res.data.data.orderData.order.couponName;

                    }

                    this.payment = this.paymentInfo.payment[0];
                    let totalGoodsDcprice = 0;
                    for (let key in this.orderInfo.orderDetail) {
                        for (let item of this.orderInfo.orderDetail[key]) {
                            if (!this.pimg) this.pimg = item.pimg;
                            item.dcprice = item.dcprice * item.pcnt;
                            totalGoodsDcprice+=parseInt(item.dcprice);
                            this.goodsList.push(item);
                        }
                    }
                    this.totalGoodsDcprice = totalGoodsDcprice;
                    switch (res.data.pointConfig.add_mileage_type) {
                        case '1'://  일괄적립
                            this.reviewPoint = UTIL.numberFormat(res.data.pointConfig.mileage_amount);
                            break;
                        case '2'://  구분 적립
                            this.reviewPoint = UTIL.numberFormat(res.data.pointConfig.mileage_amount_p);
                            break;
                        case '3'://  회원 적립

                            break;

                    }
                    this.statusName = res.data.statusList[this.orderInfo.status];
                } else {
                    //this.$router.push('/')
                }

            });

        },
        setMenu(code) {
            if (this.menuCode == code) return;
            for (let menu of this.menuList) {
                if (menu.code == code) {
                    menu.gclass = 'active-menu'
                    this.menuCode = code;
                } else menu.gclass = ''
            }
            this.page = 1;
            this.getData()
        },
        goPage(url) {
            this.$router.push(url)
        },
        goReview(odIx) {
            this.$router.push('/vmypage/reviewRegist/' + this.oid + '/' + odIx);
        }
    }

}
</script>

<style lang="scss" scoped>
.active-menu {
    color: #8097e6;
}
</style>