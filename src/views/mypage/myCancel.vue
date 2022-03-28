<template>
    <div class="page-contents">
        <div style="background-color: #f1f1f1;margin-top:25px;">
            <div class="px-5 py-6 bg-white mb-3">
                <!--div class="text-base font-semibold mb-5">상품을 선택해주세요.</div-->
                <div class="flex cursor-pointer" style="margin-top:20px;" v-for="(item,index) in orderList">
                     <!-- @click="itemCheck(index)">
                    <img v-if="item.checked"
                         src="../../assets/icons/check-box-on.svg"
                         alt=""

                    />
                    <img v-else
                         src="../../assets/icons/check-box-off.svg"
                         alt=""

                    /-->

                    <div
                        :style="{'background':'url('+item.pimg+') no-repeat','background-size':'cover','width':'62px','height':'62px','margin-right':'10px'}"
                    ></div>
                    <div class="flex flex-col justify-center">
                        <div class="text-15">{{ item.pname }}</div>
                        <div class="text-13" style="color: #6c6c6c">
                            {{ item.option_text }}, {{ item.pcnt }}개
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-5 bg-white mb-3">
                <v-select
                    v-model="cancelReason"
                    :items="cancelReasonList"
                    outlined
                ></v-select>

                <textarea
                    v-model="reasonText"
                    class="
            flex
            justify-between
            items-center
            p-4
            border
            rounded-lg
            mb-3
            w-full
            font-light
          "
                    style="height: 180px; color: #999;border:solid 1px #ddd;"
                    placeholder="상세 사유를 입력해주세요"
                >

        </textarea>
                <p class="mt-4 mb-3 text-11" style="color: #797979">
                    최대 5장 사진 첨부
                </p>
                <div class="flex mt-3" style="flex-wrap: wrap;">
                    <div
                        class="flex items-center justify-center bg-gray-200 mr-3"
                        style="width: 80px;max-width: 80px; height: 80px"
                        @click="uploadFile()">
                        <img src="../../assets/icons/plus.svg" alt=""/>
                        <input type="file" style="display: none;" ref="img" accept="image/*" @change="imgUpload"/>
                    </div>
                    <div style="width: 80px;height: 80px;margin-bottom:10px;" class="mr-3 relative"
                         v-for="(img,index) in imgList">
                        <div style="width: 80px;height: 80px;overflow:hidden;">
                            <img :src="img.url" alt=""/>
                        </div>
                        <img style="z-index:4"
                             src="../../assets/icons/close-circle.svg"
                             alt=""
                             class="absolute -top-2 -right-2"
                             @click="imgRemove(index)"
                        />
                    </div>
                </div>
            </div>

            <div class="px-5 py-6 bg-white mb-3">
                <div class="text-base font-semibold mb-5">환불 예상 금액</div>
                <div class="flex items-center justify-between">
                    <p>환불 금액</p>
                    <p>{{ paymentInfo.price }}원</p>
                </div>
                <div class="flex items-center justify-between">
                    <p>환불 요청 금액</p>
                    <p>{{ paymentInfo.price }}원</p>
                </div>

                <div class="flex items-center justify-between" v-if="returnPoint>0">
                    <p>복구 요청 포인트</p>
                    <p>{{ util.numberFormat(returnPoint) }}원</p>
                </div>
                <div class="p-4 mt-2" style="background-color: #f1f1f1">
                    <div class="flex items-center justify-between mb-2">
                        <p>상품금액</p>
                        <p>{{ paymentInfo.goodsPrice }}원</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <p>배송비</p>
                        <p>{{ deliveryPrice }}원</p>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-3">
                    <p>총 환불 금액</p>
                    <p class="font-semibold">{{ paymentInfo.price }}원</p>
                </div>
                <div class="flex items-center justify-between" v-if="returnPoint>0">
                    <p>총 복구 포인트</p>
                    <p class="font-semibold">{{ util.numberFormat(returnPoint) }}원</p>
                </div>
                <div class="flex items-center justify-between" v-if="useCoupon">
                    <p style="min-width:100px;">복구되는 쿠폰</p>
                    <p class="font-semibold" style="text-align:right;">{{ couponName }}</p>
                </div>

            </div>

            <!--div
                class="px-5 py-6 bg-white mb-3 flex justify-between items-center"
                style="color: #3b3b3b"
                @click="showGuide()"
            >
                <div class="text-base font-semibold">취소 안내사항</div>
                <img v-if="!guideShow" src="../../assets/icons/arrow-down-gray.svg" alt=""/>
                <img v-else src="../../assets/icons/arrow-up-gray.svg" alt=""/>
            </div>
            <div class="guide-box">
                <div class="guide-content">
                    <div class="gud-title">[교환 및 반품 주소]</div>
                    - [17158] 경기도 용인시 처인구 양지면 남평로 111-73 아레나스 지하2층, 품고

                    <div class="gud-title">[교환 및 반품이 가능한 경우]</div>
                    - 상품을 공급 받으신 날로부터 7일이내 단, 가전제품의<br>
                    경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.<br>
                    - 공급받으신 상품 및 용역의 내용이 표시.광고 내용과
                    다르거나 다르게 이행된 경우에는 공급받은 날로부터 3월이내,<br> 그사실을 알게 된 날로부터 30일이내

                    <div class="gud-title">[교환 및 반품이 불가능한 경우]</div>
                    - 고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우.<br>
                    단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외<br>
                    - 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우<br>
                    (예 : 가전제품, 식품, 음반 등, 단 액정화면이 부착된 노트북,<br> LCD모니터, 디지털 카메라 등의 불량화소에 따른 반품/교환은 제조사<br> 기준에 따릅니다.)<br>
                    - 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한<br> 경우. 단, 화장품등의 경우 시용제품을 제공한 경우에 한 합니다.<br>
                    - 시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가<br> 현저히 감소한 경우<br>
                    - 복제가 가능한 상품등의 포장을 훼손한 경우<br>
                    (자세한 내용은 고객만족센터 1:1 E-MAIL상담을 이용해 주시기<br> 바랍니다.)<br><br>

                    ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다. (색상 교환, 사이즈 교환 등 포함)
                </div>
            </div-->
            <div class="px-5 py-6 bg-white mb-3" style="color: #3b3b3b">
                <!--div class="flex justify-center items-center w-full" @click="agreeCheck()">
                    <img v-if="agree"
                         src="../../assets/icons/check-box-circle-on.svg"
                         alt=""
                    />
                    <img v-else
                         src="../../assets/icons/check-box-circle-off.svg"
                         alt=""
                    />
                    <div class="ml-2">취소 안내사항을 확인하였습니다.</div>
                </div-->
                <v-btn
                    depressed
                    rounded
                    :disabled="disabled"
                    style="background-color: #000;font-weight:bold;color:#fff !important;width:100%;height:55px;margin-top:30px;font-size: 16px;"
                    @click="cancelSubmit()"
                >
                    주문 취소 요청
                </v-btn>
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
    API_URL_GET_MYORDER_CANCELINFO,
    API_URL_GET_MYORDER_CLAIM_DELIVERY,
    API_URL_UPDATE_MYORDER_CLAIM
} from "../../api/urls";
import JQ from "jquery";

export default {
    watch: {
        cancelReason(val) {

            if(val) {
                this.deliveryPriceCheck();
            }

            this.validateCheck();
        },
        reasonText(val) {
            this.validateCheck();
        },
        agree(val) {
            this.validateCheck();
        }
    },
    data() {
        return {
            util:UTIL,
            oid: '',
            orderList: [],
            cancelReasonList: [],
            cancelReason: '',
            reasonText: '',
            imgList: [],
            paymentInfo: {},
            allPaymentInfo:{},
            agree: true,
            disabled:true,
            itemDisabled:false,
            deliveryPrice:0,
            status:'',
            guideShow: false,
            returnPoint:0,
            useCoupon:false,
            couponName:'',
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('주문취소');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.oid = this.$route.params.oid;
        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('oid', this.oid)
            apiService.post(API_URL_GET_MYORDER_CANCELINFO, frm, (res) => {
                if (res.data.result == 'success') {
                    for (let key in res.data.data.orderData.order.orderDetail) {
                        for (let item of res.data.data.orderData.order.orderDetail[key]) {
                            item.checked = true;
                            this.orderList.push(item);
                        }
                    }
                    this.status = res.data.data.orderData.order.status;

                    this.cancelReasonList.push({value: '', text: '취소 사유를 선택하세요'});
                    for (let key in res.data.data.orderData.cancelReason) {
                        let item = {
                            value: key,
                            text: res.data.data.orderData.cancelReason[key].title,
                            type: res.data.data.orderData.cancelReason[key].type
                        }
                        this.cancelReasonList.push(item);
                    }
                    let payment_price = parseInt(res.data.data.orderData.paymentInfo.payment[0].payment_price);
                    if(res.data.data.orderData.order.couponIx && res.data.data.orderData.order.couponPrice) {
                        this.itemDisabled = true;
                        res.data.data.orderData.paymentInfo.pt_dcprice = parseInt(res.data.data.orderData.paymentInfo.pt_dcprice) - parseInt(res.data.data.orderData.order.couponPrice);
                        this.useCoupon = true;
                        this.couponName = res.data.data.orderData.order.couponName;
                    }
                    let total_price = parseInt(res.data.data.orderData.paymentInfo.pt_dcprice) + parseInt(res.data.data.orderData.order.delivery_price);

                     if(payment_price > total_price) {
                        payment_price = res.data.data.orderData.paymentInfo.pt_dcprice;
                    }

                    if(res.data.data.orderData.order.status == 'IR') {
                        payment_price = 0;

                    }

                    this.paymentInfo = {
                        price: UTIL.numberFormat(payment_price),
                        goodsPrice: UTIL.numberFormat(res.data.data.orderData.paymentInfo.pt_dcprice),
                    }
                    this.allPaymentInfo = {
                        price: UTIL.numberFormat(payment_price),
                        goodsPrice: UTIL.numberFormat(res.data.data.orderData.paymentInfo.pt_dcprice),
                    }

                    if(res.data.data.orderData.paymentInfo.use_reserve) {
                        this.returnPoint = parseInt(res.data.data.orderData.paymentInfo.use_reserve);
                    }


                } else {
                    this.$router.push('/')
                }

            });

        },

        goPage(url) {
            this.$router.push(url)
        },
        showGuide() {
            if (this.guideShow) {
                this.guideShow = false;
                JQ('.guide-box').slideUp();
            } else {
                this.guideShow = true;
                JQ('.guide-box').slideDown();
            }

        },
        itemCheck(index) {
            if(this.itemDisabled)return;
            let cnt=0;
            for (let item of this.orderList) {
                if (item.checked) cnt++;
            }

            console.log(cnt)
            let item = this.orderList[index];
            if(cnt==1 && item.checked)return;
           if (item.checked) {
                item.checked = false;
            } else item.checked = true;
            this.validateCheck()
            this.updateCancelInfo();
        },
        deliveryPriceCheck() {
            let odIxs = [];
            for (let item of this.orderList) {
                if (item.checked) odIxs.push(item.od_ix)
            }
            if(odIxs.length<1)return;
            const frm = new FormData();
            frm.append('oid', this.oid)
            frm.append('status', this.status)
            frm.append('claimStatus', 'CA');
            frm.append('odIxs', odIxs.join(','))
            frm.append('ccReason', this.cancelReason);

            apiService.post(API_URL_GET_MYORDER_CLAIM_DELIVERY, frm, (res) => {
                if(res.data.result == 'success') {

                }

            });
        },
        updateCancelInfo() {
            let dcprice = 0;
            let cnt = 0;
            for(let item of this.orderList) {
                if(item.checked) {
                    dcprice = dcprice + parseInt(item.dcprice)
                    cnt++;
                }
            }
            if(cnt==this.orderList.length) {
                this.paymentInfo = {
                    price: this.allPaymentInfo.price,
                    goodsPrice: this.allPaymentInfo.goodsPrice,
                }
            } else {
                this.paymentInfo = {
                    price: UTIL.numberFormat(dcprice),
                    goodsPrice: UTIL.numberFormat(dcprice),
                }
            }

        },
        uploadFile() {
            this.$refs.img.click();
        },
        imgUpload() {
            if (this.imgList.length >= 5) {
                let params = {
                    message: '이미지는 최대 5개까지 가능합니다',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            const imgObj = this.$refs.img.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            let imgData = {file: img, url: URL.createObjectURL(img)}
            this.imgList.push(imgData);
        },
        imgRemove(index) {
            this.imgList.splice(index, 1)
        },
        agreeCheck() {
            if(this.agree)this.agree = false;
            else this.agree = true;
        },
        validateCheck() {
            let flag = true;
            if(!this.cancelReason)flag = false;
            if(!this.reasonText)flag = false;
            if(!this.agree)flag = false;
            let itemFlag = false;
            for(let item of this.orderList) {
                if(item.checked)itemFlag= true;
            }
            if(flag && itemFlag) {
                this.disabled = false;
            } else this.disabled = true;

        },
        cancelSubmit() {
            let odIxs = [];
            for (let item of this.orderList) {
                if (item.checked) odIxs.push(item.od_ix)
            }
            if(odIxs.length<1)return;
            const frm = new FormData();
            frm.append('oid', this.oid)
            frm.append('status', this.status)
            frm.append('claimStatus', 'CA');
            frm.append('odIxs', odIxs.join(','))
            frm.append('ccReason', this.cancelReason);
            frm.append('ccReasonMsg', this.reasonText);

            if(this.imgList.length>0) {
                let k=0;
                for(let img of this.imgList) {
                    k++;
                    frm.append('img'+k, img.file);
                }
                frm.append('imgTotal',k);

            }
            this.$eventBus.$emit('overlay', 'open');

            apiService.post(API_URL_UPDATE_MYORDER_CLAIM, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data.result == 'success') {
                    params.message = '주문 취소가 완료되었습니다';
                    params.doAction = ()=> {
                        this.$router.go(-2);
                    }
                } else if (res.data.result == 'alreadyChange') {
                    params.message = '이미 주문 취소된 정보입니다';
                } else {
                    params.message = '잘못된 접근입니다';
                    params.doAction = ()=> {
                        this.$router.back();
                    }
                }
                this.$eventBus.$emit('modalOpen', params);
            });
        }

    }

}
</script>

<style lang="scss" scoped>
.active-menu {
    color: #8097e6;
}
.guide-box {
    display: none;
    .guide-content {
        padding: 0 20px 30px 20px;
        color: #777;
        font-size: 12px;

        .gud-title {
            font-size: 13px;
            color: #000;
            font-weight: 600;
            margin-top: 30px;
        }
    }
}
</style>