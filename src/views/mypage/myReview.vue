<template>
    <div class="page-contents">
        <div style="margin-bottom: 100px; background-color: #eeeeee">
            <div class="flex bg-white">
                <div :class="'flex items-center justify-center py-4 flex-1 text-15 text-center '+reviewTab.will"
                     @click="setTab('will')">
                    작성 가능한 리뷰({{ goodsList.length }})
                </div>
                <div :class="'flex items-center justify-center py-4 flex-1 text-15 text-center '+reviewTab.do"
                     @click="setTab('do')">
                    작성한 리뷰
                </div>
            </div>
            <div v-if="tabCode=='will'">
                <div class="bg-white p-5" v-for="goods in goodsList">
                    <div class="flex items-center">
                        <div
                            :style="{'background-image':'url('+goods.pimg+')','background-repeat':'no-repeat','background-size':'cover','width':'62px','height':'62px'}"></div>
                        <div class="flex-1 ml-3 text-15">{{ goods.pname }}</div>
                        <div class="text-15 font-semibold">{{ util.numberFormat(goods.dcprice) }}원</div>
                    </div>
                    <p class="text-13 mt-3" style="color: #6c6c6c">
                        {{ goods.option_text }},
                        수량 {{ goods.pcnt }}개
                    </p>
                    <p class="text-sm my-3">작성만료 : D-20</p>
                    <v-btn
                        @click="goReview(goods.oid,goods.od_ix)"
                        depressed
                        style="border:solid 1px #8097e6;color: #8097e6;border-radius: 5px;width:100%;height:45px;background: #fff;font-size: 13px;">
                        리뷰쓰고 최대 {{ addPoint }}P 받기
                    </v-btn>
                </div>
                <div class="bg-white p-5" style="margin-top: 10px"></div>
            </div>
            <div v-else>
                <div class="bg-white p-5" v-for="item in reviewList">
                    <div class="flex items-center">
                        <div
                            :style="{'background-image':'url('+item.pimg+')','background-repeat':'no-repeat','background-size':'cover','width':'62px','height':'62px'}"></div>
                        <div class="flex-1 ml-3 text-15">{{ item.pname }}</div>
                        <div class="text-15 font-semibold">{{ util.numberFormat(item.dcprice) }}원</div>
                    </div>
                    <p class="text-13 mt-3" style="color: #6c6c6c">
                        {{ item.option_name }},
                        수량 {{ item.pcnt }}개
                    </p>
                    <p class="text-sm my-3">작성만료 : D-20</p>
                    <div class="flex overflow-x-scroll hide-scrollbar mb-3" v-if="item.anotherImgs">
                        <div class="bg-gray-200 mr-2" v-for="img in item.anotherImgs"
                             :style="{'background-image':'url('+img+')','background-repeat':'no-repeat','background-size':'cover','width':'130px','min-width':'130px','height':'130px'}"></div>

                    </div>
                    <p class="text-sm mb-3" v-html="item.bbs_contents">
                    </p>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex">
                            <img src="../../assets/icons/starOn.svg" v-if="item.valuation_goods >=1" alt=""/>
                            <img src="../../assets/icons/starOn.svg" v-if="item.valuation_goods >=2" alt=""/>
                            <img src="../../assets/icons/starOn.svg" v-if="item.valuation_goods >=3" alt=""/>
                            <img src="../../assets/icons/starOn.svg" v-if="item.valuation_goods >=4" alt=""/>
                            <img src="../../assets/icons/starOn.svg" v-if="item.valuation_goods >=5" alt=""/>
                        </div>
                        <div class="flex items-center" style="justify-content: flex-end">
                            <div class="text-xs" style="color: #777">댓글 {{ item.cmtTotal }}개</div>
                            <img src="../../assets/icons/like-blue.svg" alt="" class="mx-2"/>
                            <div class="text-12" style="color: #617bea">{{ item.likeTotal }}</div>
                        </div>
                    </div>
                    <v-btn
                        @click="goReview(item.oid,item.od_ix)"
                        depressed
                        style="border:solid 1px #aaa;color: #aaa;border-radius: 5px;width:100%;height:45px;background: #fff;font-size: 13px;">
                        리뷰 수정
                    </v-btn>
                </div>

                <div class="bg-white p-5 mt-3"></div>
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
    API_URL_GET_MYREVIEW_LIST
} from "../../api/urls";

export default {
    data() {
        return {
            util: UTIL,
            goodsList: [],
            reviewList: [],
            tabCode: 'will',
            addPoint:0,
            reviewTab: {
                will: 'border-b-2 font-semibold border-black',
                do: 'border-b font-light'
            }
        };
    },
    created() {
        if(sessionStorage.getItem('reviewTabCode')) {
            this.setTab(sessionStorage.getItem('reviewTabCode'));
        }
        this.setClass('goodsDetail')
        this.setTitle('리뷰');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.getData();


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            apiService.post(API_URL_GET_MYREVIEW_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    this.reviewList = res.data.reviewList.list;
                    this.goodsList = res.data.goodsList;
                    switch(res.data.config.add_mileage_type) {
                        case '1'://  일괄적립
                            this.addPoint = UTIL.numberFormat(res.data.config.mileage_amount);
                            break;
                        case '2'://  구분 적립
                            this.addPoint = UTIL.numberFormat(res.data.config.mileage_amount_p);
                            break;
                        case '3'://  회원 적립

                            break;

                    }
                }
            });

        },
        setTab(code) {
            if (code == this.tabCode) return;
            let bold = 'border-b-2 font-semibold border-black';
            let normal = 'border-b font-light';
            let willClass;
            let doClass;
            if (code == 'will') {
                willClass = bold;
                doClass = normal;
            } else {
                willClass = normal;
                doClass = bold;
            }
            this.tabCode = code;
            this.reviewTab = {
                will: willClass,
                do: doClass,
            }
        },
        goReview(oid, odIx) {
            sessionStorage.setItem('reviewTabCode', this.tabCode);
            this.$router.push('/vmypage/reviewRegist/' + oid + '/' + odIx);
        }
    }

}
</script>

<style lang="scss" scoped>
.active-menu {
    color: #8097e6;
}
</style>