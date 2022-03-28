<template>
    <div class="page-contents" id="myorder-layout">
        <div style="background-color: #f1f1f1; min-height: 100vh;margin-top:25px;">
            <div class="flex justify-center px-3 bg-white" style="height:90px;padding-top:0;">
                <div :class="'flex flex-col items-center cursor-pointer justify-center mx-3 '+menu.gclass"
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
                            <div class="border-t py-3 flex" v-if="order.status=='DC'">
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center">
                                    <div class="text-sm" @click="orderChange('EA',index)">교환・환불</div>
                                </div>
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>
                                <div class="flex flex-1  font-extralight  items-center justify-center">
                                    <div class="text-sm" @click="orderChange('BF',index)">구매확정</div>
                                </div>
                            </div>
                            <div class="border-t py-3 flex" v-else-if="order.status=='BF'">
                                <div class="flex flex-1  font-extralight  items-center justify-center">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>

                            </div>
                            <div class="border-t py-3 flex" v-else-if="order.status=='DI'">
                                <!--div class="flex flex-1  font-extralight  border-r items-center justify-center">
                                    <div class="text-sm" @click="orderChange('EA',index)">교환・환불</div>
                                </div-->
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center"
                                     v-if="order.status=='DI'">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>
                            </div>
                            <div class="border-t py-3 flex" v-else-if="order.status!='DR'">
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center"   v-if="order.status=='IC' || order.status=='IR'">
                                    <div class="text-sm" @click="orderChange('CA',index)">주문 취소</div>
                                </div>
                                <div class="flex flex-1  font-extralight  items-center justify-center">
                                    <div class="text-sm" @click="orderChange('deliveryChange',index)">배송지 변경</div>
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
                            <div style="width:120px;height:120px;overflow:hidden;">
                            <img
                                :src="goods.image_src"
                                width="120px"
                                alt=""
                            />
                            </div>
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

        <div v-if="modalShow"
             class="
        fixed
        top-0
        left-0
        bg-black bg-opacity-60
        w-full
        h-full
        flex
        justify-center
        items-center
        px-8
      " style="z-index:40;">
            <div class="w-full bg-white p-7 rounded-2xl" v-if="modal.completeIntro">
                <div class="flex justify-end items-center">
                    <img src="../../assets/icons/close.svg" alt="" @click="modalHide()"/>
                </div>
                <div class="mt-4 font-semibold text-xl text-center">
                    상품은 잘 받으셨나요?
                </div>
                <v-btn style="background-color: #ffbb53;color:#fff;width:100%;height:45px;margin-top:24px;" rounded
                       depressed @click="orderComplete()">
                    포인트 받기
                </v-btn>
                <div class="mt-6 text-xs text-center mb-1" style="color: #4f4f4f">
                    구매확정 시 교환・환불이 불가합니다.
                </div>
            </div>

            <div class="w-full bg-white p-7 rounded-2xl flex flex-col items-center" v-if="modal.completeEnd">
                <div class="flex justify-end items-center w-full">
                    <img src="../../assets/icons/close.svg" alt="" @click="modalHide()"/>
                </div>
                <div class="mt-4 font-semibold text-xl text-center mb-4">
                    구매 확정 완료
                </div>
                <div
                    style="
            width: 60%;
            height: calc(60vw - 78px);
            background-color: #fff5df;"
                    class="bg-black rounded-full p-3"
                >
                    <div
                        class="w-full h-full rounded-full p-2"
                        style="background-color: #ffbb53"
                    >
                        <div
                            class="
                w-full
                h-full
                rounded-full
                p-2
                border-white border border-dashed
                flex
                justify-center
                items-center
              "
                        >
                            <div class="text-2xl font-semibold text-white">+{{
                                    util.numberFormat(completePoint)
                                }}원
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-xs mt-4" style="color: #2d2d2d">나의 포인트 : {{ util.numberFormat(havePoint) }}원</div>
                <v-btn
                    style="background-color: #fff;border:solid 1px #ffbb53;color:#ffbb53;width:100%;height:45px;margin-top:24px;"
                    rounded depressed @click="goDetail()">
                    리뷰쓰고 포인트 최대 {{ reivewPoint }}P 받기
                </v-btn>
            </div>
        </div>
        <div v-if="exchangeShow"
             class="
        fixed
        top-0
        left-0
        bg-black bg-opacity-60
        w-full
        h-full

      " style="z-index:88">
            <div class="flex
        justify-center w-full
        h-full
        items-center">
                <div
                    class="
          bg-white
          rounded-2xl
          flex flex-col
          items-center
          justify-center
          mr-2
          ml-6" style="width: 50%; height: calc(50vw - 32px)" @click="goRefund('exchange')">
                    <div
                        style="width: 42px; height: 42px;position:relative;top:-25px;"
                        class="flex items-end justify-center"
                    >
                        <img src="../../assets/icons/exchange.svg" alt=""/>
                    </div>
                    <p class="mt-2 text-17" style="position:relative;top:-18px;">교환하기</p>
                </div>
                <div
                    class="
          bg-white
          rounded-2xl
          flex flex-col
          items-center
          justify-center
          ml-2
          mr-6" style="width: 50%; height: calc(50vw - 32px)" @click="goRefund('return')">
                    <div
                        style="width: 42px; height: 42px;position:relative;top:-21px;"
                        class="flex items-end justify-center"
                    >
                        <img src="../../assets/icons/refund.svg" alt=""/>
                    </div>
                    <p class="mt-2 text-17" style="position:relative;top:-18px;">환불하기</p>
                </div>
            </div>
            <i style="color:#fff;font-size: 20pt;position:relative;top:-220px;left:calc(50vw - 10pt);"
               @click="exchangeShow=false" class="fas fa-times"></i>
        </div>

    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import UTIL from "../../api/util";
import {
    API_URL_GET_MYORDER_LIST,
    API_URL_UPDATE_MYORDER_STATUS,

} from "../../api/urls";
import JQ from "jquery";

export default {
    name: 'mypageOrder',
    data() {
        return {
            util: UTIL,
            menuList: [
                {code: 'all', name: '전체', gclass: '', count: 0},
                {code: 'IC', name: '입금/결제', gclass: '', count: 0},
                {code: 'DI', name: '배송중', gclass: '', count: 0},
                {code: 'DC', name: '배송완료', gclass: '', count: 0},
                {code: 'BF', name: '구매확정', gclass: '', count: 0},
            ],
            menuCode: 'all',
            orderList: [],
            targetOid: '',
            targetStatus: '',
            page: 1,
            max: 400,
            serverInit: false,
            modalShow: false,
            modal: {
                completeIntro: false,
                completeEnd: false,
            },
            updateIndex: '',
            exchangeShow: false,
            targetOdix: '',
            relationGoodsList: [],
            havePoint: 0,
            completePoint: 0,
            reivewPoint: 0,
        };
    },
    created() {

        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        sessionStorage.setItem('equalMemberInfo','');
        sessionStorage.setItem('myOrderScrollTop', '');
        this.$eventBus.$on('myorderPageReload', this.reload);
        this.setClass('goodsDetail')
        this.setTitle('주문・배송조회');
        this.setBackUrl('');
        this.menuCode = this.$route.params.status;
        this.getData();
        if(this.checkSession()) {
            return;
        }

    },
    activated() {
        if(this.checkSession()) {
            return;
        }
        this.setClass('goodsDetail')
        this.setTitle('주문・배송조회');
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
        reload(from) {
            if(from == 'mypageShop') {
                this.menuCode = 'all';
                this.menuList = [
                    {code: 'all', name: '전체', gclass: '', count: 0},
                    {code: 'IC', name: '입금/결제', gclass: '', count: 0},
                    {code: 'DI', name: '배송중', gclass: '', count: 0},
                    {code: 'DC', name: '배송완료', gclass: '', count: 0},
                    {code: 'BF', name: '구매확정', gclass: '', count: 0},
                ];
                this.orderList = [];
                this.targetOid = '';
                this.targetStatus = '';
                this.page = 1;
                this.max = 400;
                this.serverInit = false;
                this.modalShow = false;
                this.modal = {
                    completeIntro: false,
                    completeEnd: false,
                };
                this.updateIndex = '';
                this.exchangeShow = false;
                this.targetOdix = '';
                this.relationGoodsList = [];
                this.havePoint = 0;
                this.completePoint = 0;
                this.reivewPoint = 0;
                this.menuCode = this.$route.params.status;

            } else {
                this.targetStatus = '';
                this.modalShow = false;
                this.modal = {
                    completeIntro: false,
                    completeEnd: false,
                };
                this.updateIndex = '';
                this.exchangeShow = false;
                this.targetOdix = '';
            }
            this.getData();


        },
        checkSession() {
            if(sessionStorage.getItem('orderDetailStep2') && localStorage.getItem('lastOid')) {
                let status = sessionStorage.getItem('orderDetailStep2');
                sessionStorage.setItem('orderDetailStep2','');
                this.$router.push('/vmypage/orderDetail/' + localStorage.getItem('lastOid') + '/' + status)
                return true;
            } else return false;
        },
        getData() {
            const frm = new FormData();
            frm.append('status', this.menuCode);
            frm.append('page', this.page);
            frm.append('max', this.max);
            apiService.post(API_URL_GET_MYORDER_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    let statusList = res.data.statusList;
                    if (this.page == 1) this.orderList = [];
                    for (let item of res.data.datas.list) {
                        //let statusName = statusList[item.orderDetail[0].status];
                        let pname = item.orderDetail[0].pname + ((item.orderDetail.length > 1) ? ' 외 ' + (item.orderDetail.length - 1) + '개' : '');
                        let optionName = '';
                        let amt = 0;
                        let reserve = 0;
                        for (let opt of item.orderDetail) {
                            optionName += opt.option_text;
                            amt = amt + parseInt(opt.pcnt);
                            reserve = reserve + parseInt(opt.reserve)
                        }

                        let order = {
                            rdate: item.order_date,
                            oid: item.oid,
                            pimg: item.orderDetail[0].pimg,
                            od_ix: item.orderDetail[0].od_ix,
                            price: item.payment_price,
                            optionName: optionName,
                            reserve: reserve,
                            amt: amt,
                            bname:item.bname,
                            bpcs:item.bmobile,
                            statusName: item.orderDetail[0].status_text,
                            status: item.orderDetail[0].status,
                            pname: pname,
                        }
                        this.orderList.push(order);
                    }

                    let havePoint = (res.data.pointInfo.myMileAmount) ? res.data.pointInfo.myMileAmount.replace(',', '') : 0;
                    this.havePoint = parseInt(havePoint);
                    switch (res.data.pointConfig.add_mileage_type) {
                        case '1'://  일괄적립
                            this.reivewPoint = UTIL.numberFormat(res.data.pointConfig.mileage_amount);
                            break;
                        case '2'://  구분 적립
                            this.reivewPoint = UTIL.numberFormat(res.data.pointConfig.mileage_amount_p);
                            break;
                        case '3'://  회원 적립

                            break;

                    }
                    this.relationGoodsList = res.data.relationGoodsList;
                    //if (!this.serverInit) {
                    //this.serverInit = true;
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
        goRefund(cmd) {
            this.goPage('/vmypage/' + cmd + '/' + this.targetOid + '/' + this.targetOdix)
        },
        orderChange(cmd, index) {
            this.updateIndex = index;
            const item = this.orderList[index];
            this.targetOid = item.oid;
            this.targetOdix = item.od_ix;
            this.targetStatus = item.status;
            switch (cmd) {
                case 'BF':
                    this.targetStatus = 'BF';
                    this.modalShow = true;
                    this.modal.completeIntro = true;
                    break;
                case 'CA':
                    this.goPage('/vmypage/cancel/' + item.oid)
                    break;
                case 'deliveryChange':
                    const memberInfo = {
                        name:item.bname,
                        pcs:item.bpcs
                    }
                    sessionStorage.setItem('equalMemberInfo',JSON.stringify(memberInfo));
                    this.goPage('/vmypage/deliveryInfo/' + item.oid)
                    break;
                case 'deliveryStatus':
                    this.goPage('/vmypage/deliveryStatus/' + item.oid)
                    break;
                case 'EA':
                    this.exchangeShow = true;
                    break;
            }
        },
        orderComplete() {
            const item = this.orderList[this.updateIndex];
            const frm = new FormData();
            frm.append('oid', item.oid);
            frm.append('status', 'DC');
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_UPDATE_MYORDER_STATUS, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data.result == 'success') {
                    this.page = 1;
                    this.completePoint = parseInt(res.data.point);
                    this.havePoint = this.havePoint + this.completePoint;

                    this.getData();
                    this.modal.completeIntro = false;
                    this.modal.completeEnd = true;

                } else {
                    alert('잘못된 접근입니다')
                }
            });
        },
        goDetail() {
            this.goPage('/vmypage/orderDetail/' + this.targetOid + '/' + this.targetStatus)
        },
        modalHide() {
            this.modalShow = false;
            this.modal.completeIntro = false;
            this.modal.completeEnd = false;

        }
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