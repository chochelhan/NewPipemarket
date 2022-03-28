<template>
    <div class="page-contents">
        <div class="order-complete">
            <div class="com-header">
                <div class="close-btn" @click="goHome()"></div>
            </div>
            <div class="content">
                <section class="box">
                    <div class="stitle">주문완료</div>
                    <img src="../../assets/images/deliveryCha.png">
                    <p class="description">{{ orderName }}님의 주문이<br/>정상적으로 완료되었습니다.</p>
                </section>
                <section class="delivery-info">
                    <dl>
                        <dd>
                            <div class="stitle">배송지</div>
                            <div class="value">{{ deliveryInfo.rname }} , {{ deliveryInfo.addr1 }} {{ deliveryInfo.addr2 }}</div>
                        </dd>
                        <dd>
                            <div class="stitle">주문번호</div>
                            <div class="value">{{ oid }}</div>
                        </dd>
                        <dd>
                            <div class="stitle">제품명</div>
                            <div class="value">{{ goodsName }}</div>
                        </dd>
                        <dd>
                            <div class="stitle">결제금액</div>
                            <div class="value">{{ paymentPrice }}원</div>
                        </dd>
                    </dl>
                </section>
            </div>

            <div class="bottom">
                <button @click="goOrderDetail()">주문 상세보기</button>
                <button @click="goHome()">홈으로 가기</button>
            </div>
        </div>
    </div>
</template>
<script>


import {mapActions} from "vuex";
import apiService from "@/api/apiService";
import {API_URL_GET_ORDER_COMPLETE} from "@/api/urls";
import AUTH from "@/api/auth";
import UTIL from "@/api/util";

export default {
    data() {
        return {
            oid:'',
            isLogin:false,
            orderName:'',
            paymentPrice:'',
            goodsName:'',
            deliveryInfo:{},
            status:'',
            memberInfo:'',
        };
    },
    created() {
        this.setClass('none')
        this.oid = this.$route.params.oid;
        if(!this.oid) {
            location.href= '/';
            return;
        }
        if(localStorage.getItem('lastOid') == this.oid) {
            location.href= '/';
            return;
        }
        localStorage.setItem('lastOid',this.oid);
        let memberInfo = AUTH.getSession();
        if (memberInfo && memberInfo.id) {
            this.memberInfo = memberInfo;
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
        goOrderDetail() {
            if(this.isLogin) {
                //sessionStorage.setItem('orderDetailStep1',this.status);
                //this.$router.push('/vmypage/myshop')
                this.$router.push('/vmypage/orderDetail/'+this.oid+'/'+this.status);
            } else {
                this.$router.push('/vmypage/orderDetail/'+this.oid+'/'+this.status);
            }

        },
        goHome() {
            this.$router.push('/')
        },
        getData() {
            const frm = {oid: this.oid}
            apiService.get(API_URL_GET_ORDER_COMPLETE, frm, (res) => {
                if (res.data.result == 'succ') {
                    if(res.data.data && res.data.data.deliveryInfo) {
                        this.deliveryInfo = res.data.data.deliveryInfo;
                        this.orderName = res.data.data.order.bname;
                        this.status = res.data.data.order.status;
                        this.paymentPrice = UTIL.numberFormat(res.data.data.paymentInfo.payment[0].payment_price);
                        let gname = '';
                        let cnt = 0;
                        for(let key in res.data.data.order.orderDetail) {
                            let items = res.data.data.order.orderDetail[key];
                            for(let item of items) {
                                if(!gname)gname = item.pname;
                                cnt++;
                            }
                        }
                        this.goodsName = gname+((cnt>1)?'외'+(cnt-1)+'개':'');
                        this.setOrderCompleteGoogleTracker(res.data.data);
                    }
                }
            });
        },
        setOrderCompleteGoogleTracker(datas) {

            const paymentInfo = datas.paymentInfo.payment[0];
            const orderDetails = datas.order.orderDetail;
            const delivery_price  = parseInt(datas.order.delivery_price);

            window.dataLayer = window.dataLayer || [];
            let uid = (this.memberInfo.id)?this.memberInfo.id:'';
            let goods = [];
            let index = 0;
            for(let key in orderDetails) {
                let items = orderDetails[key];
                for(let item of items) {
                    let discount = parseInt(item.listprice) - parseInt(item.dcprice);
                    let itemData = {
                        item_id: item.pid,
                        item_name: item.pname+' '+item.option_text,
                        currency: "KRW",
                        discount: discount,
                        item_brand: ((item.brand_name)?item.brand_name:'브랜드 없음'),
                        item_category: item.cname,
                        price: parseInt(item.dcprice),
                        quantity: parseInt(item.pcnt),
                        index: index,
                    }
                    index++;
                    goods.push(itemData);
                }
            }
            let couponName = (datas.order.couponIx)?datas.order.couponName:'';
            window.dataLayer.push({
                event: "purchase",
                user_id: uid,
                user_name: this.orderName,
                ecommerce: {
                    transaction_id: this.oid,
                    currency: "KRW",
                    value: parseInt(paymentInfo.payment_price), // price +shipping - shipping
                    shipping: delivery_price,
                    coupon: couponName,
                    items: goods,
                }
            });
            window.dataLayer.push({ ecommerce:null})
       }


    }

}
</script>

<style lang="scss" scoped>

.order-complete{
    height: 100vh;
    overflow: auto;
    background: #FFF7E9;
    width: 100vw;
}

.order-complete .com-header{

    height: 19.2308vw;
    margin: 0 6.6667vw;
    overflow: hidden;
    position: relative;
}

.order-complete .com-header .close-btn{
    background: url('../../assets/images/close.svg') no-repeat center;
    background-size: 100%;
    width: 3.8462vw;
    height: 3.8462vw;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
}

.order-complete .content{
    margin-top: 12.0513vw;
}

.order-complete .content .box{
    width: fit-content;
    margin:  5.1282vw auto 8.7179vw;
}

.order-complete .content .box .stitle{
    color: rgb(118, 83, 37);
    line-height: 8.7179vw;
    font-size: 5.8974vw;
    font-weight: bold;
    text-align: center;

}
.order-complete .content .box img{
    margin-top: 5.1282vw;
    width: 53.8462vw;
    margin-bottom: 5.8974vw;
}

.order-complete .content .box .description{
    text-align: center;
    color: rgb(118, 83, 37);
    font-size: 3.8462vw;
}
.order-complete .content .delivery-info{
    padding: 0 5.1282vw;
}
.order-complete .content .delivery-info dl{
    width: 100%;
    background: #F1E8DB;
    border-radius: 1.2821vw;
    padding: 5.6410vw 4.1026vw;
    box-sizing: border-box;
}

.order-complete .content .delivery-info dl dd{
    overflow: hidden;
    margin-bottom: 2.5641vw;
    margin-inline-start: unset;
}

.order-complete .content .delivery-info dl dd:last-child{
    margin: 0;
}

.order-complete .content .delivery-info dl dd .stitle{
    color: rgb(118, 83, 37);
    font-size: 3.0769vw;
    font-weight: 500;
    float: left;
    /*margin-right: 6.6667vw;*/
    text-align: left;
    width: 18.2051vw;
}
.order-complete .content .delivery-info dl dd .value{
    color: rgb(118, 83, 37);
    float: left;
    font-size: 3.0769vw;
    width: calc(100% - 18.2051vw);
}

.order-complete .bottom{
    margin-top: 9.2308vw;
    overflow: hidden;
    display: flex;
    padding: 0 5.6410vw 33.3333vw;

}

.order-complete .bottom button{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex: 1;
    width: 100%;
    height: 11.5385vw;
    border: 1px solid rgb(118, 83, 37);
    background: unset;
    border-radius: 1.2821vw;
    font-size: 3.5897vw;
    color: rgb(118, 83, 37);
}

.order-complete .bottom button:first-child{
    margin-right: 4.3590vw;
}
</style>