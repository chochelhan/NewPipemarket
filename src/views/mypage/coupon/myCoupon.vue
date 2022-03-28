<template>
    <div class="page-contents" style="padding-top:26px;">
        <div v-if="serverInit && couponList.length<1"
             style="background-color: #f1f1f1;margin-top:-22px;"
             class="flex flex-col items-center justify-center py-14"
        >
            <img src="../../../assets/images/coupon.png" alt="" width="70%"/>
            <div class="font-semibold mt-5">보유하고 있는 쿠폰이 없어요.</div>
            <v-btn class="px-10 py-2 bg-black rounded-2xl mt-4" depressed rounded style="background: #000;color:#fff;"
                   @click="modalOpen()">
                쿠폰 등록
            </v-btn>
        </div>


        <div v-if="serverInit && couponList.length>0" style="background-color: #f1f1f1;margin-top:-22px;">
            <div class="top-banner"><img :src="bannerImg" @click="goLink()"></div>
            <div class="py-6 px-5 flex items-center bg-white">
                <img src="../../../assets/icons/couponIcon.svg" alt=""/>
                <div class="text-lg font-semibold flex-1 ml-2">쿠폰이 {{ couponList.length }}개 있어요.</div>
                <div class="text-13 border rounded-xl px-3 py-1 text-gray-500" @click="modalOpen()">
                    쿠폰 등록
                </div>
            </div>
            <div style="padding:22px 15px 1px 15px;">
                <div v-for="item in couponList"
                     class="flex bg-cover bg-no-repeat"
                     :style="{'background-image':'url('+couponBg+')','height':'140px','margin':'0 0 17px 0'}">
                    <div
                        class="flex justify-center items-center rounded-l-xl pb-2"
                        style="max-width: 90px"
                    >
                        <div class="font-semibold text-17" style="color: #c588d4">{{ item.dDay }}</div>
                    </div>
                    <div class="flex-1 py-6 pl-3">
                        <div class="font-semibold text-13">{{ item.publish_name }}</div>
                        <div class="font-semibold text-xl mb-2" style="color: #c588d4">
                            {{ item.price }}
                        </div>
                        <div class="text-xs text-gray-500">• 사용기한 : {{ item.term }}</div>
                        <div class="text-xs text-gray-500">
                            • <span>{{ item.conditionText }}</span>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-9 px-5">
            <p class="text-13 font-semibold mb-2">사용 시 유의사항</p>
            <ul class="list-disc" style="margin-left:-5px;">
                <li class="mb-2 text-11">
                    쿠폰은 당사 사정에 따라 사전고지 없이 조기 종료 또는 변경 될 수
                    있습니다.
                </li>
                <li class="mb-2 text-11">쿠폰끼리 중복사용할 수 없습니다.</li>
                <li class="mb-2 text-11">쿠폰은 다른 계정으로 양도할 수 없습니다.</li>
                <li class="mb-2 text-11">
                    주문 취소, 환불 시 사용 쿠폰 회수 후, 나머지 금액이 환불되며 단순
                    변심 또는 주문 변경으로 부분 취소 시 쿠폰 재발급이 불가합니다.
                </li>
            </ul>
        </div>

        <div v-if="modalShow"
             class="
        fixed
        flex
        items-center
        justify-center
        w-full
        h-full
        top-0
        left-0
        bg-opacity-70 bg-black
        z-50" style="z-index:77;">
            <div
                class="
          bg-white
          p-9
          rounded-2xl
          flex flex-col
          justify-center
          items-center" style="max-width:80%;">
                <div class="flex justify-end items-center w-full" style="margin:-10px -30px 10px 0 !important;">
                    <img src="../../../assets/icons/close.svg" alt="" @click="modalHide()"/>
                </div>
                <div class="font-semibold">쿠폰 번호를 입력해주세요.</div>
                <input
                    v-model="couponNum"
                    type="text"
                    @input="couponTouch()"
                    class="w-full my-4 border py-3 px-8 rounded-xl text-center"
                    style="letter-spacing: 10px;border:solid 1px #ddd"
                />
                <v-btn
                    class="py-3 px-11 rounded-3xl text-white text-15 mt-5"
                    :disabled="disabled"
                    style="background: #c588d4;color:#fff !important;height:45px;" depressed rounded
                    @click="couponRegist()"
                >
                    등록
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>

import AUTH from "../../../api/auth";
import UTIL from "../../../api/util";
import apiService from "../../../api/apiService";
import {
    API_URL_GET_MYORDER_COUPON,
    API_URL_INSERT_MYORDER_COUPON
} from "../../../api/urls";

export default {
    data() {
        return {
            couponNum: '',
            modalShow: false,
            couponList: [],
            serverInit: false,
            disabled: true,
            bannerImg: '',
            bannerLink: '',
            couponBg: require('../../../assets/images/couponFrame.png'),
        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.getData();


    },
    methods: {
        getData() {
            const frm = new FormData();
            this.couponList = [];
            apiService.post(API_URL_GET_MYORDER_COUPON, frm, (res) => {

                if (res.data.result == 'success') {

                    for (let item of res.data.data.coupons) {

                        if (item.cupon_sale_type_percent) {
                            item.price = item.cupon_sale_value + '%';
                        } else {
                            item.price = UTIL.numberFormat(item.cupon_sale_value) + '원';
                        }
                        if (item.regist_start && item.regist_end) {
                            let use_sdate = item.regist_start;
                            let use_edate = item.regist_end;
                            item.term = use_sdate + '~' + use_edate;
                        } else {
                            item.term = '제한없음'
                            item.dDay = '';
                        }

                        item.publish_condition_price = (parseInt(item.publish_condition_price) > 0) ? UTIL.numberFormat(item.publish_condition_price) : '';
                        if (item.cupon_div == 'C') {
                            if (item.publish_condition_price) {
                                item.conditionText = item.publish_condition_price + '원 이상 주문 시에만 사용 가능';
                            } else {
                                item.conditionText = '주문금액에 상관없이 사용가능';
                            }
                        } else {
                            if (item.publish_condition_price) {
                                item.conditionText = item.publish_condition_price + '원 이상 상품에만 사용 가능';
                            } else {
                                item.conditionText = '상품금액에 상관없이 사용가능';
                            }
                        }

                        this.couponList.push(item);
                    }
                    this.bannerImg = res.data.data.banner[0].imgSrc;
                    this.bannerLink = res.data.data.banner[0].bd_link;
                    this.serverInit = true;

                } else {
                    this.$router.push('/')
                }

            });

        },
        goLink() {
            if (this.bannerLink) {
                this.$router.push(this.bannerLink);
            }
        },
        couponTouch() {
            if (this.couponNum) this.disabled = false;
            else this.disabled = true;
        },
        modalOpen() {
            this.modalShow = true;
        },
        modalHide() {
            this.couponNum = '';
            this.disabled = true;
            this.modalShow = false;
        },
        couponRegist() {
            const frm = new FormData();
            frm.append('coupon_num', this.couponNum);
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_MYORDER_COUPON, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data.result == 'success') {
                    if (res.data.data == 'fail') {
                        params.message = '잘못된 쿠폰번호 입니다';
                    } else {
                        params.message = '쿠폰을 등록하였습니다';
                        params.doAction = () => {
                            this.modalHide()
                            this.getData();
                        }
                    }

                } else {
                    params.message = '잘못된 접근 입니다';
                    params.doAction = () => {
                        this.modalHide()
                    }
                }
                this.$eventBus.$emit('modalOpen', params);

            });
        }

    }

}
</script>

<style lang="scss" scoped>
.top-banner {
    width:100%;
    img {
        width:100%;
    }
}
</style>