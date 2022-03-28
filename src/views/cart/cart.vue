<template>
    <div class="page-container">
        <div  style="margin-bottom: 30px; background-color: #eeeeee">
            <div v-if="optionList.length>0">
                <div class="px-5 flex bg-white items-center mb-3" style="padding-top:45px;">
                    <v-checkbox color="#000" style="margin-top:3px;"
                                v-model="allChecked" @click="allCheckToggle()"
                    ></v-checkbox>
                    <p class="flex-1 text-sm ml-2">전체선택 ({{ totalGoodsAmt }}/{{ optionList.length }})</p>
                    <p class="text-xs text-gray-500" @click="allDelete()">선택삭제</p>
                </div>
                <div class="bg-white mb-3">
                    <div class="px-5 py-6 border-b" v-for="(item,index) in optionList">
                        <div class="flex items-center">
                            <v-checkbox color="#000" @click="itemCheckToggle()"
                                        v-model="item.checked"
                            ></v-checkbox>
                            <p class="flex-1 ml-3 text-15 goods-name">{{ item.pname }} </p>
                            <img src="../../assets/icons/close-gray.svg" @click="deleteCart(index)"/>
                        </div>
                        <div class="pl-7" style="margin-top:-10px;">
                            <div class="text-13 mb-3 option-name" style="color: #6c6c6c">
                                {{ item.options_text }}
                            </div>
                            <div class="flex items-center">
                                <div style="width:88px;height:88px;" @click="goGoodsView(item.id)">
                                    <div
                                        :style="{'background':'url('+item.image_src+') no-repeat','width':'100%','height':'100%','background-size':'cover'}"></div>
                                </div>
                                <div class="flex-1 ml-3">
                                    <div class="flex mb-1">
                                        <div class="font-semibold text-sm" style="color: #d80c0c"
                                             v-if="parseInt(item.discount_rate)>0">
                                            {{ item.discount_rate }}%
                                        </div>
                                        <div class="font-semibold text-sm mx-2">{{
                                                util.numberFormat(item.dcprice)
                                            }}원
                                        </div>
                                        <div class="text-sm text-gray-500 line-through font-light"
                                             v-if="parseInt(item.discount_rate)>0">
                                            {{ util.numberFormat(item.listprice) }}원
                                        </div>
                                    </div>
                                    <div class="text-10 mb-2">{{ item.mileage }}원 적립</div>
                                    <div class="flex justify-between">
                                        <div class="flex">
                                            <div @click="updateAmt(index,'minus')"
                                                 class="border flex items-center justify-center"
                                                 style="max-width: 22px; height: 22px;padding-top: 15px;">
                                                <p class="text-gray-500 text-xs">-</p>
                                            </div>
                                            <div
                                                class="border-b border-t text-xs"
                                                style="width:26px;text-align:center;line-height:20px;padding:0;height: 22px"
                                            >
                                                <p style="line-height: 22px">{{ item.pcount }}</p>
                                            </div>
                                            <div @click="updateAmt(index,'plus')"
                                                 class="border flex items-center justify-center"
                                                 style="max-width: 22px; height: 22px;padding-top: 15px;">
                                                <p class="text-gray-500 text-xs">+</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="bg-white px-5 py-6 mb-3" v-if="optionList.length>0">
                    <p class="font-semibold mb-2">결제 예정금액</p>
                    <div>
                        <div
                            class="
              flex
              items-center
              justify-between
              mb-2
              text-gray-800
              font-light
            "
                        >
                            <div class="text-sm">상품금액 ({{ totalAmt }}개)</div>
                            <div class="text-sm">+ {{ orgGoodsPrice }}원</div>
                        </div>
                        <div
                            class="
              flex
              items-center
              justify-between
              mb-1
              text-gray-800
              font-light
            "
                        >
                            <div class="text-sm">상품 할인금액</div>
                            <div class="text-sm">- {{ goodsDiscountPrice }}원</div>

                        </div>
                        <!--div class="text-11 text-right mb-2" style="color: #8097e6">
                            상품 할인 금액 -8,000원
                        </div-->
                        <div
                            class="
              flex
              items-center
              justify-between
              mb-1
              text-gray-800
              font-light
            "
                        >
                            <div class="text-sm">배송비</div>
                            <div class="text-sm">{{ deliveryPrice }}원</div>
                        </div>
                        <div class="text-11 text-right mb-2" style="color: #8097e6">
                            {{ deliveryText }}
                        </div>
                        <div
                            class="
              flex
              items-center
              justify-between
              text-gray-800
              font-light
              border-b
              pb-4
            "
                        >
                            <div class="text-sm">회원등급 할인</div>
                            <div class="text-sm">- {{ memberDiscountPrice }}원</div>
                        </div>

                        <div
                            class="
              flex
              items-center
              justify-between
              mb-2
              text-gray-800
              font-light
              pt-4
            "
                        >
                            <div class="text-sm">총 결제예정금액</div>
                            <div class="text-sm font-semibold text-black">{{ totalPrice }}원</div>
                        </div>
                        <div class="flex items-center justify-end">
                            <div
                                class="
                text-11
                mb-2
                mr-2
                text-white
                bg-black
                rounded-2xl
                px-1
                font-semibold
              "
                                style="background-color: #eea423"
                            >
                                적립
                            </div>
                            <div class="text-11 mb-2">구매 시 총 {{ point }}원 적립</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="dot-box-layout">
                <div class="dot-box">
                    장바구니에 담긴 제품이 없습니다.
                </div>
            </div>
            <div class="bg-white px-5 py-6">
                <p class="font-semibold mb-2">{{goodsTitle}}</p>
                <div class="flex overflow-x-scroll hide-scrollbar">
                    <div class="mr-3" v-for="goods in relationGoodsList" @click="goGoodsView(goods.id)">
                        <div
                            class="rounded-xl overflow-hidden"
                            style="width: 120px; height: 120px"
                        >
                            <img
                                :src="goods.image_src"
                                width="100%"
                                height="100%"
                                alt=""
                            />
                        </div>
                        <div class="text-xs mt-2 px-1 gtext-cut">{{ goods.pname }}</div>
                        <div class="flex align-center px-1">
                            <div class="font-semibold text-13 mr-2" style="color: #d80c0c"
                                 v-if="parseInt(goods.discount_rate)>0">
                                {{ goods.discount_rate }}%
                            </div>
                            <div class="font-semibold text-13">{{ util.numberFormat(goods.dcprice) }}원</div>
                        </div>
                        <div class="flex items-center mt-1 px-1">
                            <img src="../../assets/icons/starOn.svg" alt=""/>
                            <div class="text-11 ml-2">{{ goods.avg.goodsAvg }} ({{ goods.avgCount }})</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center items-center" style="padding-top:15px;" v-if="optionList.length>0">
                <p class="text-13 font-light">
                    선택상품 {{ totalAmt }}개 {{ goodsPrice }}원 + 배송비 {{ deliveryPrice }}원 =
                </p>
                <p class="text-13 font-semibold ml-1">{{ totalPrice }}원</p>
            </div>
            <div class="bg-white py-2 px-3" v-if="optionList.length>0">
                <v-btn @click="goOrder()" depressed rounded class="shop-button font-semibold text-white"
                       style="width:100%;color:#fff;font-weight: bold;font-size:15px;" :disabled="disabled"
                       color="#ffbb53">

                    <span id="process_purchase">구매하기</span>
                </v-btn>
            </div>
        </div>
    </div>
</template>
<script>

import {mapActions} from "vuex";
import AUTH from '../../api/auth'
import UTIL from '../../api/util'
import JQ from 'jquery'
import {
    API_URL_UPDATE_CART_AMT,
    API_URL_GET_MY_CART,
    API_URL_DELETE_CART,
    API_URL_GET_CART_SUMMARY,
} from '../../api/urls';
import apiService from '../../api/apiService'

export default {
    name: 'goodsView',
    watch: {
        totalAmt(val) {
            if (val < 1) this.disabled = true;
            else this.disabled = false;
        }
    },
    data() {
        return {
            util: UTIL,
            optionList: [],
            totalPrice: 0,
            totalAmt: 1,
            deliveryPrice: 0,
            goodsPrice: 0,
            allChecked: true,
            disabled: false,
            relationGoodsList: [],
            orgGoodsPrice: 0,
            point: 0,
            deliveryText: '',
            memberDiscountPrice: 0,
            goodsDiscountPrice: 0,
            totalGoodsAmt: 0,
            goodsTitle:'추천 상품'
        }
    },
    created() {
        this.setClass('sub')
        this.setTitle('장바구니');
        this.setBackUrl('');
        this.getData();


    },
    methods: {
        ...mapActions('config', ["setCartCnt"]),
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            apiService.post(API_URL_GET_MY_CART, frm, (res) => {
                if (res.data.result == 'success') {
                    let totalAmt = 0;
                    for (let item of res.data.data.cart) {
                        for (let subitem of item.deliveryTemplateList) {
                            if (subitem.delivery_text && !this.deliveryText) this.deliveryText = subitem.delivery_text

                            for (let option of subitem.productList) {
                                option.checked = true;
                                this.optionList.push(option);
                                totalAmt = totalAmt + parseInt(option.pcount)
                            }
                        }

                    }
                    this.totalGoodsAmt = this.optionList.length;
                    if (this.totalGoodsAmt < 1) this.allChecked = false;
                    this.totalAmt = totalAmt;
                    this.relationGoodsList = res.data.data.relationGoodsList;
                    this.setTotalPrice(res.data.data.cartSummary);


                }

            });
        },
        deleteCart(index) {
            let item = this.optionList[index];
            let params = {
                type: 'confirm',
                message: '선택된 상품을 장바구니에서 삭제하시겠습니까?',
                doAction: () => {
                    this.deleteAction(item.cart_ix, index);
                }
            }
            this.$eventBus.$emit('modalOpen', params);
        },
        deleteAction(ix, index, type) {


            const frm = new FormData();
            frm.append('cartIxs', ix);
            apiService.post(API_URL_DELETE_CART, frm, (res) => {
                if (res.data.result == 'success') {
                    if (type == 'list') {
                        this.optionList = [];
                        for (let item of res.data.data) {
                            for (let subitem of item.deliveryTemplateList) {
                                if (subitem.delivery_text && !this.deliveryText) this.deliveryText = subitem.delivery_text

                                for (let option of subitem.productList) {
                                    this.optionList.push(option);

                                }
                            }

                        }
                    } else {
                        this.optionList.splice(index, 1);
                    }
                    let totalAmt = 0;
                    let totalGoodsAmt = 0;
                    for (let item of this.optionList) {
                        if (item.checked) {
                            totalAmt = totalAmt + parseInt(item.pcount)
                            totalGoodsAmt++;
                        }
                    }
                    this.setCartCnt(this.optionList.length)
                    this.totalAmt = totalAmt;
                    this.totalGoodsAmt = totalGoodsAmt;

                    this.setTotalPrice(res.data.summary);
                } else {
                    let msg = '잘못된 접근입니다';
                    let params = {
                        message: msg
                    }
                    this.$eventBus.$emit('modalOpen', params);
                }

            });
        },
        goGoodsView(id) {
            this.$router.push('/vgoods/goodsView/' + id)
        },
        updateAmt(index, cmd) {
            let item = this.optionList[index];
            item.checked = true;
            let amt = parseInt(item.pcount);
            switch (cmd) {
                case 'minus':
                    if (amt <= 1) return;
                    amt--;
                    this.totalAmt--;
                    break;
                case 'plus':
                    amt++;
                    this.totalAmt++;
                    break;
            }


            const frm = new FormData();
            frm.append('cartIx', item.cart_ix);
            frm.append('count', amt);
            //frm.append('sumPidCnt');

            apiService.post(API_URL_UPDATE_CART_AMT, frm, (res) => {
                if (res.data.result == 'success') {
                    item.pcount = amt;
                    this.$set(this.optionList, index, item);
                    this.setTotalPrice(res.data.summary);
                } else {
                    let msg = '잘못된 접근입니다';
                    switch (res.data.result) {
                        case 'failBasicCount':
                            msg = '최소구매수량 보다 수량이 적습니다';
                            break;
                        case 'failStockLack':
                            msg = '선택된 상품중 재고수량보다 구매수량이 많은 상품이 있습니다';
                            break;
                        case 'failByOnePersonCount':
                            msg = '최대구매수량을 초과한 수량입니다';
                            break;
                        case 'noLogin':
                            msg = '먼저 로그인 하세요';
                            break;
                        case 'failNoSale':
                            msg = '판매중인 상품이 아닙니다';
                            break;

                    }
                    let params = {
                        message: msg
                    }
                    this.$eventBus.$emit('modalOpen', params);
                }

            });

            //this.setTotalPrice();
        },
        setTotalPrice(cartSummary) {
            this.totalPrice = this.util.numberFormat(cartSummary.payment_price)
            this.goodsPrice = this.util.numberFormat(cartSummary.product_dcprice)
            this.deliveryPrice = this.util.numberFormat(cartSummary.total_delivery_price)

            this.orgGoodsPrice = this.util.numberFormat(cartSummary.product_listprice)
            if (cartSummary.mileage) this.point = this.util.numberFormat(cartSummary.mileage)
            //console.log(this.optionList);

            for (let item of cartSummary.productDiscountList) {
                switch (item.type) {
                    case 'MG':
                        this.memberDiscountPrice = this.util.numberFormat(item.discount_amount);
                        break;
                    case 'IN':
                        this.goodsDiscountPrice = this.util.numberFormat(item.discount_amount);
                        break;

                }
            }

        },
        allCheckToggle() {
            for (let item of this.optionList) {
                if (this.allChecked) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            }
            this.updateChecked();
        },
        itemCheckToggle() {
            let flag = true;
            for (let item of this.optionList) {
                if (!item.checked) {
                    flag = false;
                }
            }
            if (flag) {
                this.allChecked = true;
            } else this.allChecked = false;
            this.updateChecked();
        },
        allDelete() {
            let cartIxs = [];
            let indexList = {};
            for (let item of this.optionList) {
                if (item.checked) {
                    cartIxs.push(item.cart_ix);
                    indexList[item.cart_ix + '_cart'] = item.cart_ix;
                }
            }
            let params = {};
            if (cartIxs.length < 1) {
                params = {
                    type: 'alert',
                    message: '상품을 하나이상 선택하세요',
                }
            } else {
                params = {
                    type: 'confirm',
                    message: '선택된 상품을 장바구니에서 삭제하시겠습니까?',
                    doAction: () => {
                        this.deleteAction(cartIxs.join(','), indexList, 'list');
                    }
                }
            }
            this.$eventBus.$emit('modalOpen', params);
        },
        updateChecked() {
            let totalAmt = 0;
            let cartIxs = [];
            let totalGoodsAmt = 0;
            for (let item of this.optionList) {
                if (item.checked) {
                    cartIxs.push(item.cart_ix);
                    totalAmt = totalAmt + parseInt(item.pcount)
                    totalGoodsAmt++;
                }
            }
            this.totalGoodsAmt = totalGoodsAmt;
            this.totalAmt = totalAmt;
            if (this.totalAmt < 1) {
                this.totalPrice = 0
                this.goodsPrice = 0
                this.deliveryPrice = 0
            } else {
                const frm = new FormData();
                frm.append('cartIxs', cartIxs.join(','));
                apiService.post(API_URL_GET_CART_SUMMARY, frm, (res) => {
                    if (res.data.result == 'success') {
                        this.setTotalPrice(res.data.summary);
                    }
                });
            }
        },
        goOrder() {
            let cartIxs = [];
            for (let item of this.optionList) {
                if (item.checked) {
                    cartIxs.push(item.cart_ix);
                }
            }
            this.$router.push('/vorder/' + cartIxs.join(','));

        }

    },


}
</script>


<style lang="scss" scoped>
.page-container {
    background: #fff;
    min-height:calc(100vh);
}
.goods-name {
    position: relative;
    top: 8px;
    left: -10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}

.option-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dot-box-layout {
    width: 100%;
    background: #fff;
    padding:50px 20px 20px 20px;
    .dot-box {
        border-radius: 5px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        color: #999;
        border: dashed 1px #dcdcdc;

    }
}
.gtext-cut {
    overflow: hidden;
    text-overflow: ellipsis;
    /* 여러 줄 자르기 추가 스타일 */
    white-space: normal;
    line-height: 1.2em;
    height: 2.6em;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

}
</style>