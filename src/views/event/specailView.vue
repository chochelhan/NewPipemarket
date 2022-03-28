<template>
    <div class="event-page-container">
        <div class="banner-box">
            <div class="banner-img">
                <img :src="info.mobimgPath" />
            </div>
            <!--div class="banner-date font-light">

                {{info.startDate}} ~ {{info.endDate}}
            </div-->
        </div>
        <div class="store-body">
            <div class="products">
                <div class="product-card flex" v-for="(item,index) in goodsList">
                    <div class="product-img" @click="goGoodsDetail(item.id)" style="width:95px;min-width:95px">
                        <img :src="item.image_src" />
                    </div>
                    <div class="product-info flex-1 flex flex-col justify-center" style="position: relative;">
                        <div class="product-name"  @click="goGoodsDetail(item.id)">{{ item.pname }}</div>
                        <div class="product-prices flex justify-between w-full">
                            <div class="flex items-center" @click="goGoodsDetail(item.id)">
                                <div class="product-sale font-semibold" v-if="parseInt(item.discount_rate)>0">{{ item.discount_rate }}%</div>
                                <div class="product-price font-semibold">{{ util.numberFormat(item.dcprice) }}원</div>
                                <div class="product-origin-price font-extralight" v-if="parseInt(item.discount_rate)>0">
                                    {{ util.numberFormat(item.listprice) }}원
                                </div>
                            </div>
                            <div class="product-heart" @click="myWish(index)">
                                <img v-if="!item.alreadyWish" src="../../assets/icons/heartOff2.svg" alt="" />
                                <img v-else src="../../assets/icons/heartOn2.svg" alt="" />
                            </div>
                        </div>
                        <div class="product-rate flex item-center" @click="goGoodsDetail(item.id)">
                            <img class="star" src="../../assets/icons/starMark.svg" alt="" />
                            <div class="ml-2" style="color: #6e6e6e">
                                {{item.avg.goodsAvg}} ({{ item.avgCount }})
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>


import {mapActions} from "vuex";
import UTIL from '../../api/util'
import {
    API_URL_GET_SPECIAL_INFO, API_URL_SET_GOODS_WISH,
} from '../../api/urls';
import apiService from '../../api/apiService'
import AUTH from "../../api/auth";

export default {
    name: 'eventPlanView',
    data() {
        return {
            util:UTIL,
            ix:'',
            isLogin:false,
            info:{},
            goodsList:[],
        }
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('기획전');
        this.setBackUrl('');
        this.ix = this.$route.params.ix;
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        if(AUTH.device == 'web') {
            this.getData()
        } else {
            if(!this.isLogin) {
                const checkMember = setInterval(()=> {
                    let memberInfo = AUTH.getSession();
                    if (memberInfo) {
                        this.isLogin = true;
                        this.getData()
                        clearInterval(checkMember);
                    }
                },200)
            } else {
                this.getData();
            }
        }
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = {
                event_ix:this.ix,
            }
            apiService.get(API_URL_GET_SPECIAL_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    this.info = res.data.info;
                    this.goodsList = res.data.goodsList;
                }
            });
        },
        goGoodsDetail(id) {
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
    },
    mounted() {
        if(AUTH.device == 'app') {
            if (window.history.length == 1) {
                this.setBackUrl('locationMain');
            }
        }

    }

}
</script>


<style lang="scss" scoped>

.event-page-container {
    min-height:calc(100vh - 92px);
    background-color: #f1f1f1;
    .store-body {
        padding: 20px;
        background-color: #f1f1f1;
    }

    .products {
        border-radius: 30px;
        padding: 20px;
        background-color: #fff;
    }

    .product-card {
        padding: 20px 0px;
        border-bottom: 1px #eee solid;
    }

    .product-card:first-child {
        padding-top: 0;
    }

    .product-card:last-child {
        padding-bottom: 0;
        border-bottom: 0;
    }

    .product-img {
        width: 106px;
        height: 106px;
        border-radius: 10px;
        background-color: #f1ecf2;
        overflow: hidden;
    }

    .product-img img {
        width: 100%;
        height: 100%;
    }

    .product-info {
        padding-left: 15px;
    }

    .product-name {
        font-size: 14px;
        color: #000;
        margin-bottom: 3px;
    }

    .product-sale {
        color: #d80c0c;
        font-size: 12px;
        font-weight: bold;
    }

    .product-price {
        color: #000;
        font-size: 12px;
        font-weight: bold;
        margin: 0 5px;
    }

    .product-origin-price {
        color: #999;
        font-size: 12px;
        text-decoration: line-through;
    }
    .product-rate {
        font-size: 11px;
        margin-top: 12px;
    }

    .banner-box {
        height:auto;
        padding:0;
        margin:0;
        min-height:auto;
        .banner-img {
            height:auto;
            margin:0;
            img {
                max-width: 100%;
            }
        }
        .banner-date {
            width: 100%;
            background: #e07155;
            text-align: center;
            font-size: 15px;
            color: #fff;
            height: 40px;
            line-height: 40px;
        }
    }

    .product-heart {
        position:absolute;
        right:5px;
        margin-top:-7px;
        img {
            position: relative;
            top: 9px;
        }
    }

    .star {
        position: relative;
        top: -7px;
        width: 18px;
    }

    .product-name {
        display: inline-block;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        height: 2.4em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;


    }
}
</style>