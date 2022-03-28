<template>
    <div class="page-container" id="specailSlide">
        <div class="overlay-box" v-if="!serverInit">
            <v-progress-circular
                :size="40"
                color="indigo darken-1"
                indeterminate
            ></v-progress-circular>
        </div>
        <div v-else>
            <div class="card-list">
                <div class="store-card" v-for="item in specialList">
                    <div class="card-img" style="height:auto;" @click="goDetail(item.event_ix)">
                        <img :src="item.pcimgPath" alt=""/>
                    </div>
                    <div class="card-content">
                        <div @click="goDetail(item.event_ix)">
                            <div class="card-sub-title">{{ item.manage_title }}</div>
                            <div class="card-title font-semibold">{{ item.event_title }}</div>
                            <div class="card-description" style="line-height:130%;" v-html="item.event_text">
                            </div>
                            <div class="card-time flex">
                                <img src="../../../assets/icons/date.svg"/>
                                <div style="padding-left:5px;"> {{ item.startDate }} - {{ item.endDate }}</div>
                            </div>
                        </div>
                        <div class="specail-goods-list" style="margin-top:15px;width:100%;overflow:hidden;" v-if="item.productInfo"
                             @touchstart="onMouse" @touchend="outMouse">
                            <swiper :options="swiperBestGoodsOptions" @slideChange="sliderEnd">
                                <swiper-slide v-for="goods in item.productInfo" class="goods-item" style="width:77px;">
                                    <div @click="goGoodsDetail(goods.id)"
                                         :style="{'width':'66px','height':'66px','background':'url('+goods.image_src+') no-repeat','background-position':'center center','background-size':'100% auto'}">
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>

import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import {
    API_URL_GET_SPECIAL_LIST
} from '../../../api/urls';
import apiService from '../../../api/apiService'
import UTIL from '../../../api/util'
import JQ from "jquery";

export default {
    name: 'slideSpecail',
    components: {
        Swiper,
        SwiperSlide,
    },
    props: ["currentSlideIndex", "activeContentIndex"],
    watch: {
        activeContentIndex(val) {
            if (this.currentSlideIndex == val) {
                if (!this.serverInit) {
                    this.getData();
                }

            }
        },

    },
    data() {
        return {
            swiperBestGoodsOptions: {
                slidesPerView: 'auto',
            },
            specialList: [],
            serverInit:false,
        }
    },
    created() {

    },
    activated() {
        if (sessionStorage.getItem('specailSlideTop')) {
            JQ('#specailSlide').scrollTop(sessionStorage.getItem('specailSlideTop'));
            sessionStorage.setItem('specailSlideTop', '');
        }

    },
    methods: {
        getData() {
            const frm = {}
            apiService.get(API_URL_GET_SPECIAL_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.specialList) {
                        for(let item of res.data.specialList.list) {
                            item.event_text = UTIL.nl2brContent(item.event_text)
                            this.specialList.push(item)
                        }

                    }
                    this.serverInit = true;
                }
            });
        },

        goGoodsDetail(id) {
            sessionStorage.setItem('specailSlideTop', JQ('#specailSlide').scrollTop());
            this.$router.push('/vgoods/goodsView/' + id);
        },
        goDetail(ix) {
            sessionStorage.setItem('specailSlideTop', JQ('#specailSlide').scrollTop());
            this.$router.push('/vevent/planView/' + ix);
        },
        onMouse(obj) {
            this.$emit('menuSlideDisable');
        },
        outMouse(obj) {
            this.$emit('menuSlideEnable');

        },
        sliderEnd(obj) {
            this.$emit('menuSlideEnable');
        },
    }

}
</script>


<style lang="scss" scoped>
/*
@import "../../../assets/style/best_menu.css";
*/
.page-container {
    .goodsItem {
        width: auto;
        margin-right: 20px;
    }
}
.overlay-box {
    width: 100%;
    text-align: center;
    padding-top: 200px;

}
</style>