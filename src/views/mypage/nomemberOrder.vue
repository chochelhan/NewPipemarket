<template>
    <div class="page-contents">
        <div style="background-color: #f1f1f1; min-height: 100vh">
            <div>
                <div class="px-4 py-6" v-for="(order,index) in orderList">
                    <p class="text-15 mb-1 ml-1 font-extralight">
                        {{ order.rdate }}
                    </p>
                    <div class="bg-white rounded-xl">
                        <div class="flex p-4 border-b"
                             @click="goPage('/vmypage/orderDetail/'+order.oid+'/'+order.status)">
                            <div
                                :style="{'background':'#eee url('+order.pimg+') no-repeat','background-size':'cover','width':'50px','height':'50px'}"></div>
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
                                        class="text-9 px-2 leading-6 rounded-xl text-white mr-2"
                                        style="background-color: #eea423"
                                    >
                                        적립
                                    </div>
                                    <div class="text-13 font-light">250원 적립 예정</div>
                                    <div class="flex-1 text-right font-semibold">{{ order.price }}원</div>
                                </div>
                            </div>
                            <div class="border-t py-3 flex">
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>
                            </div>
                            <!--div class="border-t py-3 flex" v-if="order.status=='DC'">
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
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center"
                                     v-if="order.status=='DI'">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>
                            </div>
                            <div class="border-t py-3 flex" v-else>
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center">
                                    <div class="text-sm" @click="orderChange('CA',index)">주문 취소</div>
                                </div>
                                <div class="flex flex-1  font-extralight  border-r items-center justify-center"
                                     v-if="order.status=='DI'">
                                    <div class="text-sm" @click="orderChange('deliveryStatus',index)">배송조회</div>
                                </div>
                                <div class="flex flex-1  font-extralight  items-center justify-center">
                                    <div class="text-sm" @click="orderChange('deliveryChange',index)">배송지 변경</div>
                                </div>
                            </div -->
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
                            <div class="text-2xl font-semibold text-white">+120원</div>
                        </div>
                    </div>
                </div>
                <div class="text-xs mt-4" style="color: #2d2d2d">나의 포인트 : 3,520원</div>
                <v-btn
                    style="background-color: #fff;border:solid 1px #ffbb53;color:#ffbb53;width:100%;height:45px;margin-top:24px;"
                    rounded depressed @click="goDetail()">
                    리뷰쓰고 포인트 최대 800P받기
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
            <i style="color:#fff;font-size: 20pt;position:relative;top:-220px;left:calc(50vw - 10pt);" @click="exchangeShow=false" class="fas fa-times"></i>
        </div>

    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {
    API_URL_GET_MYORDER_LIST,
    API_URL_UPDATE_MYORDER_STATUS,

} from "../../api/urls";

export default {
    data() {
        return {
            orderList: [],
            targetOid: '',
            targetStatus: '',
            page: 1,
            max: 20,
            serverInit: false,
            modalShow: false,
            modal: {
                completeIntro: false,
                completeEnd: false,
            },
            updateIndex: '',
            exchangeShow: false,
            targetOdix:'',
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('비회원 주문조회');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.$router.push('/');
            return;
        }
        this.getData();


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('status', 'all');
            frm.append('page', this.page);
            frm.append('max', this.max);
            frm.append('oid', this.$route.params.oid);
            apiService.post(API_URL_GET_MYORDER_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    let statusList = res.data.statusList;
                    if (this.page == 1) this.orderList = [];
                    let total = 0;
                    for (let item of res.data.datas.list) {
                        //let statusName = statusList[item.orderDetail[0].status];
                        let pname = item.orderDetail[0].pname + ((item.orderDetail.length > 1) ? ' 외 ' + (item.orderDetail.length - 1) + '개' : '');
                        let optionName = '';
                        let amt = 0;
                        for (let opt of item.orderDetail) {
                            optionName += opt.option_text;
                            amt = amt + parseInt(opt.pcnt);
                        }

                        let order = {
                            rdate: item.order_date,
                            oid: item.oid,
                            pimg: item.orderDetail[0].pimg,
                            od_ix: item.orderDetail[0].od_ix,
                            price: item.payment_price,
                            optionName: optionName,
                            amt: amt,
                            statusName: item.orderDetail[0].status_text,
                            status: item.orderDetail[0].status,
                            pname: pname,
                        }
                        total++;
                        this.orderList.push(order);
                    }


                } else {
                    this.$router.push('/')
                }

            });

        },
        goPage(url) {
            this.$router.push(url)
        },
        goRefund(cmd) {
            this.$router.push('/vmypage/'+cmd+'/'+this.targetOid+'/'+this.targetOdix)
        },
        orderChange(cmd, index) {
            this.updateIndex = index;
            const item = this.orderList[index];
            this.targetOid = item.oid;
            this.targetOdix = item.od_ix;
            this.targetStatus = item.status;
            switch (cmd) {
                case 'BF':
                    this.modalShow = true;
                    this.modal.completeIntro = true;
                    break;
                case 'CA':
                    this.goPage('/vmypage/cancel/' + item.oid)
                    break;
                case 'deliveryChange':
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
</style>