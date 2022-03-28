<template>
    <div class="page-contents" id="myorder-layout">
        <div style="background-color: #f1f1f1; min-height: 100vh;margin-top:25px;">
            <div class="flex justify-center px-3 bg-white" style="height:90px;padding-top:0;">
                <div :class="'flex flex-col items-center cursor-pointer justify-center mx-2 '+menu.gclass"
                     v-for="menu in menuList" @click="setMenu(menu.code)">
                    <p class="font-medium text-22" style="margin-bottom:0;">{{ menu.count }}</p>
                    <p class="text-13">{{ menu.name }}</p>
                </div>
            </div>
            <div>
                <div class="px-4 py-6" v-for="(order,index) in orderList">
                    <p class="text-15 mb-1 ml-1 font-extralight">
                        {{ order.rdate }}
                    </p>
                    <div class="bg-white rounded-xl">
                        <div class="flex p-4 border-b"
                             @click="goPage('/vmypage/orderDetail/'+order.oid+'/'+order.status)">
                            <div style="width:50px;height:50px;overflow:hidden">
                                <img :src="order.pimg" style="width:100%;">
                            </div>
                            <div class="flex flex-1 ml-3">
                                <div class="flex-1 flex flex-col justify-center">
                                    <div class="text-13" style="color: #666">No.{{ order.oid }}</div>
                                    <div class="text-13" style="color: #8097e6">{{ order.statusName }}</div>
                                </div>
                                <img src="../../assets/icons/arrow-right.svg" width="7px" alt=""/>
                            </div>
                        </div>
                        <div>
                            <div class="p-4">
                                <p class="text-15">{{ order.pname }}</p>
                                <p
                                    class="text-13 mt-1 mb-3 font-extralight"
                                    style="color: #6c6c6c"
                                >
                                    {{ order.optionName }}, 수량 {{ order.amt }}개
                                </p>
                                <div class="flex items-center">
                                    <div
                                        v-if="order.reserve>0"
                                        class="text-9 px-2 leading-6 rounded-xl text-white mr-2"
                                        style="background-color: #eea423"
                                    >
                                        적립
                                    </div>
                                    <div class="text-13 font-light" v-if="order.reserve>0">
                                        {{ util.numberFormat(order.reserve) }}원 적립
                                    </div>
                                    <div class="flex-1 text-right font-semibold">{{ order.price }}원</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="orderList.length<1">
                <div class="flex flex-col justify-center items-center py-10">
                    <img src="../../assets/icons/warning.svg" alt=""/>
                    <p class="text-15 mt-3 mb-7" style="color: #a6a6a6">
                        주문 내역이 없습니다.
                    </p>
                    <p class="text-15 py-2 px-12 border border-black rounded-xl w-max" @click="$router.push('/')">
                        계속 쇼핑하기
                    </p>
                </div>
                <div class="px-5 py-6 bg-white">
                    <p class="font-semibold text-basic">이런 상품 어떠세요?</p>
                    <div class="flex overflow-x-scroll hide-scrollbar mt-4">
                        <div class="mr-5 flex-shrink-0" style="max-width:120px;" @click="goGoodsView(goods.id)"
                             v-for="goods in relationGoodsList">
                            <img
                                :src="goods.image_src"
                                width="120px"
                                height="120px"
                                alt=""
                            />
                            <div class="mt-3 text-xs gtext-cut">{{ goods.pname }}</div>
                            <div class="flex items-center">
                                <div class="text-13 font-semibold" style="color: #d80c0c"
                                     v-if="parseInt(goods.discount_rate)>0">
                                    {{ goods.discount_rate }}%
                                </div>
                                <div class="text-13 font-semibold ml-1">{{ util.numberFormat(goods.dcprice) }}원</div>
                            </div>
                            <div class="flex items-center">
                                <img
                                    src="../../assets/icons/starOn.svg"
                                    alt=""
                                    width="11px"
                                    height="11px"
                                />
                                <div class="text-11 text-gray-500 font-extralight ml-2">
                                    {{ goods.avg.goodsAvg }} ({{ goods.avgCount }})
                                </div>
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
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import UTIL from "../../api/util";
import {
    API_URL_GET_MYRETURN_LIST,
} from "../../api/urls";
import JQ from "jquery";

export default {
    name: 'mypageRetrunList',
    data() {
        return {
            util: UTIL,
            menuList: [
                {code: 'all', name: '전체', gclass: '', count: 0},
                {code: 'EA', name: '교환요청', gclass: '', count: 0},
                {code: 'EC', name: '교환완료', gclass: '', count: 0},
                {code: 'RA', name: '환불요청', gclass: '', count: 0},
                {code: 'RC', name: '환불완료', gclass: '', count: 0},
            ],
            menuCode: 'all',
            orderList: [],
            targetOid: '',
            targetStatus: '',
            page: 1,
            max: 400,
            updateIndex: '',
            targetOdix: '',
            relationGoodsList: [],

        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        sessionStorage.setItem('myOrderScrollTop', '');
        this.$eventBus.$on('myreturnPageReload', this.reload);
        this.setClass('goodsDetail')
        this.setTitle('취소・교환・환불');
        this.setBackUrl('');
        this.menuCode = this.$route.params.status;
        this.getData();


    },
    activated() {
        this.setClass('goodsDetail')
        this.setTitle('취소・교환・환불');
        this.setBackUrl('');
        if (sessionStorage.getItem('myOrderScrollTop')) {
            JQ('#myorder-layout').scrollTop(sessionStorage.getItem('myOrderScrollTop'));
            sessionStorage.setItem('myOrderScrollTop', '');
        }


    },
    deactivated() {

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        reload() {
            this.menuCode = 'all';
            this.menuList = [
                {code: 'all', name: '전체', gclass: '', count: 0},
                {code: 'EA', name: '교환요청', gclass: '', count: 0},
                {code: 'EC', name: '교환완료', gclass: '', count: 0},
                {code: 'RA', name: '환불요청', gclass: '', count: 0},
                {code: 'RC', name: '환불완료', gclass: '', count: 0},
            ];
            this.orderList = [];
            this.targetOid = '';
            this.targetStatus = '';
            this.page = 1;
            this.max = 400;
            this.updateIndex = '';
            this.targetOdix = '';
            this.relationGoodsList = [];

            this.menuCode = this.$route.params.status;
            this.getData();
        },
        getData() {
            const frm = new FormData();
            frm.append('status', this.menuCode);
            frm.append('page', this.page);
            frm.append('max', this.max);
            apiService.post(API_URL_GET_MYRETURN_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    let statusList = res.data.statusList;
                    if (this.page == 1) this.orderList = [];
                    for (let item of res.data.datas.list) {
                        let pname = '';
                        let optionName = '';
                        let amt = 0;
                        let cnt = 0;
                        let reserve = 0;
                        let goodsStatusList = {};
                        for (let opt of item.orderDetail) {
                            if(!goodsStatusList[opt.status]) {
                                pname = opt.pname;
                                optionName = opt.option_text;
                                amt = parseInt(opt.pcnt);
                                reserve = parseInt(opt.reserve);
                                goodsStatusList[opt.status] = {
                                    pimg:opt.pimg,
                                    statusName: statusList[opt.status],
                                    status: opt.status,
                                    rdate: item.order_date,
                                    oid: item.oid,
                                    price: item.payment_price,
                                    optionName: optionName,
                                    reserve: reserve,
                                    amt: amt,
                                    cnt:0,
                                    pname: pname,
                                }
                            } else {
                                cnt = goodsStatusList[opt.status].cnt +1;
                                optionName += opt.option_text;
                                amt = amt + parseInt(opt.pcnt);
                                reserve = reserve + parseInt(opt.reserve)
                                goodsStatusList[opt.status].optionName = optionName;
                                goodsStatusList[opt.status].reserve = reserve;
                                goodsStatusList[opt.status].amt = amt;
                                goodsStatusList[opt.status].pname = goodsStatusList[opt.status].pname+' 외 '+cnt+'개';
                                goodsStatusList[opt.status].cnt = cnt;
                            }

                        }
                        for(let statKey in goodsStatusList) {
                            this.orderList.push(goodsStatusList[statKey]);
                        }

                    }

                    this.relationGoodsList = res.data.relationGoodsList;
                    let totalCount = 0;
                    for(let key in res.data.totalList) {
                        totalCount+=parseInt(res.data.totalList[key]);
                    }

                    for (let menu of this.menuList) {
                        let count;
                        if(menu.code == this.menuCode) {
                            menu.gclass = 'active-menu';
                        } else menu.gclass = '';

                        if (menu.code != 'all') {
                            count = (res.data.totalList[menu.code]) ? res.data.totalList[menu.code] : '0';
                            menu.count = count;
                        }

                    }
                    this.menuList[0].count = totalCount;
                } else {
                    this.$router.push('/')
                }

            });

        },
        goGoodsView(id) {
            this.goPage('/vgoods/goodsView/' + id);
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
            sessionStorage.setItem('myOrderScrollTop', JQ('#myorder-layout').scrollTop());
            this.$router.push(url)
        },
        goDetail() {
            this.goPage('/vmypage/orderDetail/' + this.targetOid + '/' + this.targetStatus)
        },

    }

}
</script>

<style lang="scss" scoped>
.active-menu {
    color: #8097e6;
}

#myorder-layout {
    height: calc(100vh - 60px);
    max-height: calc(100vh - 60px);
    overflow-y: auto;


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