<template>
    <div class="page-contents">
        <div style="margin-bottom: 100px;background-color: #eeeeee;">
            <div class="px-5 py-6 bg-white" style="margin-bottom: 10px;margin-top:-15px;padding-top:35px !important;">
                <div class="flex items-start justify-between">
                    <div style="height: 60px; width: 60px;background:#eaeaea;border-radius: 50%;overflow:hidden;text-align:center;line-height:60px;">
                        <img v-if="memberInfo.profile_img" :src="memberInfo.profile_img" style="width:60px;min-height:60px;" alt=""/>
                        <img v-else src="../../assets/images/defaultProfile.png"></img>
                    </div>
                    <div class="flex-1 ml-3">
                        <div class="flex items-center justify-between">
                            <div class="text-17 font-semibold" style="padding-top:5px;">{{ memberInfo.name }}님</div>
                            <div class="text-11 font-light text-gray-500 px-3 py-1 rounded-xl"
                                style="background-color: #eee; color: #7c7c7c" id="check_benefit" @click="showMemberBenefit()">
                                회원 혜택
                            </div>
                        </div>
                        <p class="text-xs mt-1 mb-5" v-html="levelMsg">
                        </p>

                        <div class="w-full border rounded-md py-1 flex items-center justify-center" id="change_info_button"  @click="goMyPage('mymodify')">
                            <div class="text-11" style="color: #999;padding:2px 0 4px 0;">회원정보 변경</div>
                        </div>
                    </div>
                </div>
                <div class="flex mt-4 justify-between">
                    <div
                        class="rounded-xl p-4"
                        style="width: calc(30vw - 7px);height:120px; background-color: #eaf0fd"
                        id="myshoppingreview"
                        @click="goMyPage('review')"
                    >
                        <img src="../../assets/icons/reviewIcon.svg" alt=""/>
                        <div class="mt-2 text-13">리뷰 작성</div>
                        <div class="font-semibold text-lg">{{ reviewCnt }}건</div>
                    </div>
                    <div
                        @click="goMyPage('point')"
                        class="rounded-xl p-4"
                        style="width: calc(30vw - 7px);height:120px;  background-color: #fff5df"
                        id="myshoppingpoint"
                    >
                        <img src="../../assets/icons/pointIcon.svg" alt=""/>
                        <div class="mt-2 text-13">포인트</div>
                        <div class="font-semibold text-lg">{{ pointCnt }}P</div>
                    </div>
                    <div  @click="goMyPage('coupon')"
                        class="rounded-xl p-4"
                        style="width: calc(30vw - 7px);height:120px;  background-color: #f2e2f6"
                        id="myshoppincoupon"
                    >
                        <img src="../../assets/icons/couponIcon.svg" alt=""/>
                        <div class="mt-2 text-13">쿠폰</div>
                        <div class="font-semibold text-lg">{{ couponCnt }}장</div>
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-6" style="margin-bottom: 10px" id="shipping_info_mypage">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-base">주문・배송조회</p>
                    <div class="py-1 px-2 flex items-center" style="justify-content: flex-end" @click="goMyPage('myorder/all')">
                        <p style="color: #aaa" class="text-13 mr-2">전체</p>
                        <img src="../../assets/icons/arrow-right.svg" style="position: relative;top:-6px;" alt=""/>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-5">
                    <div class="flex flex-col items-center" @click="goMyPage('myorder/all')">
                        <div  class="text-lg font-semibold">{{ orderInfoAll }}</div >
                        <div class="text-13 font-light mt-2" style="color: #333">전체</div>
                    </div>

                    <div class="flex flex-col items-center" @click="goMyPage('myorder/IC')">
                        <div  class="text-lg font-semibold">{{ orderInfo.IC.value }}</div >
                        <div class="text-13 font-light mt-2" style="color: #333">입금/결제</div>
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myorder/DI')">
                        <div  class="text-lg font-semibold">{{ orderInfo.DI.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">배송중</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myorder/DC')">
                        <div  class="text-lg font-semibold">{{ orderInfo.DC.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">배송완료</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myorder/BF')">
                        <div  class="text-lg font-semibold">{{ orderInfo.BF.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">구매확정</div >
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-6" style="margin-bottom: 10px" id="refund_mypage">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-base">취소・교환・환불</p>
                    <div class="py-1 px-2 flex items-center" style="justify-content: flex-end"  @click="goMyPage('myreturn/all')">
                        <p style="color: #aaa" class="text-13 mr-2">전체</p>
                        <img  style="position: relative;top:-6px;" src="../../assets/icons/arrow-right.svg" alt=""/>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-5">
                    <div class="flex flex-col items-center" @click="goMyPage('myreturn/all')">
                        <div  class="text-lg font-semibold">{{ returnInfoAll }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">전체</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myreturn/EA')">
                        <div  class="text-lg font-semibold">{{ returnInfo.EA.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">교환</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myreturn/EC')">
                        <div  class="text-lg font-semibold">{{ returnInfo.EC.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">교환완료</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myreturn/RA')">
                        <div  class="text-lg font-semibold">{{ returnInfo.RA.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">환불</div >
                    </div>
                    <div class="flex flex-col items-center" @click="goMyPage('myreturn/RC')">
                        <div  class="text-lg font-semibold">{{ returnInfo.RC.value }}</div >
                        <div  class="text-13 font-light mt-2" style="color: #333">환불완료</div >
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-6">
                <div class="flex items-center justify-between mb-6" @click="goMyPage('qnaList')">
                    <p class="text-sm font-light">상품문의</p>
                    <img  style="position: relative;top:-6px;" src="../../assets/icons/arrow-right.svg" alt=""/>
                </div>
                <div class="flex items-center justify-between mb-6" @click="showMemberBenefit()">
                    <p class="text-sm font-light">회원 혜택</p>
                    <img  style="position: relative;top:-6px;" src="../../assets/icons/arrow-right.svg" alt=""/>
                </div>
                <div class="flex items-center justify-between mb-6"  @click="goMyPage('mymodify')">
                    <p class="text-sm font-light">회원정보 수정</p>
                    <img src="../../assets/icons/arrow-right.svg"  style="position: relative;top:-6px;" alt=""/>
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
import {API_URL_GET_MYPAGE_MAIN} from "../../api/urls";

export default {
    data() {
        return {
            memberInfo:{},
            pointCnt:0,
            reviewCnt:0,
            couponCnt:0,
            levelMsg:'',
            orderInfo: {
                IC:{code:'ic',value:0}, //입금확인
                DI:{code:'di',value:0}, // 배송중
                DC:{code:'dc',value:0}, //배송완료
                BF:{code:'bf',value:0}, //구매확정

            },
            orderInfoAll:0,
            returnInfo: {
                EA:{code:'ea',value:0}, // 교환
                RA:{code:'ra',value:0}, // 환불
                EC:{code:'ec',value:0}, // 교환완료
                RC:{code:'rc',value:0}, // 환불완료

            },
            returnInfoAll:0,
        };
    },
    created() {
        if(sessionStorage.getItem('orderDetailStep1')) {
            sessionStorage.setItem('orderDetailStep2',sessionStorage.getItem('orderDetailStep1'));
            sessionStorage.setItem('orderDetailStep1','');
            this.$router.push('/vmypage/myorder/all');
            return;
        }
        this.setClass('goodsDetail')
        this.setTitle('마이쇼핑');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if(!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.memberInfo = memberInfo
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            apiService.post(API_URL_GET_MYPAGE_MAIN, frm, (res) => {
                if (res.data.result == 'success') {
                    this.pointCnt = res.data.data.myPointInfo.myMileAmount;
                    if(res.data.data.levelData.upGroup && res.data.data.levelData.upGroup.msg!='empty') {

                        this.levelMsg = UTIL.numberFormat(res.data.data.levelData.upGroup.remainPrice)+'원만 더 구입하면 '+res.data.data.levelData.upGroup.name+'으로 승급됩니다';

                    }
                    this.reviewCnt= UTIL.numberFormat(res.data.data.myReviewCnt);
                    this.couponCnt= UTIL.numberFormat(res.data.data.myCouponCnt);
                    let orderInfoAll = 0;
                    for(let key in res.data.data.orderInfo.totalList) {
                        if(this.orderInfo[key] && this.orderInfo[key].code) {
                            this.orderInfo[key].value =  res.data.data.orderInfo.totalList[key];

                        }
                        orderInfoAll += parseInt(res.data.data.orderInfo.totalList[key]);
                    }
                    this.orderInfoAll = orderInfoAll;
                    let returnInfoAll = 0;
                    for(let key in res.data.data.returnInfo.totalList) {
                        if(this.returnInfo[key] && this.returnInfo[key].code) {
                            this.returnInfo[key].value =  res.data.data.returnInfo.totalList[key];

                        }
                        returnInfoAll+=parseInt(res.data.data.returnInfo.totalList[key]);
                    }
                    this.returnInfoAll = returnInfoAll;

                } else {
                    //this.$router.push('/');
                }
            });
        },
        goMyPage(url) {
            this.$router.push('/vmypage/'+url);
        },
        showMemberBenefit() {
            this.$router.push('/vmypage/benefit');
        }
     }

}
</script>

<style lang="scss" scoped>
.text-cut {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1em;
    height: 1em;
    display:inline-block;
    max-width:70px;
}
.benefit-box {
    position:fixed;
    top:0;
    left:0;
    z-index:100;
    img {
        max-width:100%;
    }
}
</style>