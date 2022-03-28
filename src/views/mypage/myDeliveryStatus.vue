<template>
    <div class="page-contents content" style="padding-top:24px;">
        <div class="delivery-process-wrap">
            <div :class="'delivery-process '+status.step1">
                <div class="circle">
                    <div></div>
                </div>
                <p>상품 발송</p>
            </div>

            <div :class="'delivery-process '+status.step2">
                <div class="circle">
                    <div></div>
                </div>
                <p>택배사 도착</p>
            </div>

            <div :class="'delivery-process '+status.step3">
                <div class="circle">
                    <div></div>
                </div>
                <p>배송중</p>
            </div>

            <div :class="'delivery-process '+status.step4">
                <div class="circle">
                    <div></div>
                </div>
                <p>배송완료</p>
            </div>

            <div class="line"></div>

        </div>

        <table class="delivery-detail" style="min-height:350px;">
            <thead>
            <tr>
                <th style="width:90px;">처리 일시</th>
                <th style="width:100px;">현재 위치</th>
                <th>상태</th>
            </tr>
            </thead>

            <tbody>
            <!--tr>
                <td>2021-6-19<br/>13:09:20</td>
                <td>서울 관악뉴중앙</td>
                <td class="state">배달완료</td>
            </tr-->
            <tr v-for="item in statList">
                <td><div v-html="item.time"></div></td>
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
            </tr>
            </tbody>
        </table>

        <div class="delivery-info">
            <p>배송정보</p>
            <table>
                <tbody>
                <tr>
                    <th>택배사</th>
                    <td>{{ compnayInfo.name }}</td>
                </tr>
                <tr>
                    <th>송장번호</th>
                    <td>{{ compnayInfo.invoice_no }}</td>
                </tr>
                <!--tr>
                    <th>배송기사</th>
                    <td>홍길동(01012345678)</td>
                </tr-->
                <tr>
                    <th>보내는분</th>
                    <td>피리마켓</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>

import {mapActions} from "vuex";
import apiService from "@/api/apiService";
import {API_URL_GET_DELIVERY_STATUS} from "@/api/urls";

export default {
    data() {
        return {
            oid: '',
            compnayInfo:{},
            statList:[],
            status: {
                step1:'',
                step2:'',
                step3:'',
                step4:'',
            }
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('배송 조회');
        this.setBackUrl('');
        this.oid = this.$route.params.oid;
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('oid', this.oid)
            apiService.post(API_URL_GET_DELIVERY_STATUS, frm, (res) => {

                if (res.data.result == 'success') {

                    if(res.data.data) {
                        for(let item of res.data.data.trackingDetails) {
                            let data = {};
                            data.time = item.timeString.replace(' ','<br>').replace('+',' ~ ');
                            data.name = item.where;
                            data.status = item.kind;
                            this.statList.push(data);
                        }
                        for(let key in this.status) {
                            switch(res.data.data.level) {
                                case 2:
                                    if(key=='step2')this.status[key] = 'active';
                                    break;
                                case 3:
                                case 4:
                                case 5:
                                    if(key=='step3')this.status[key] = 'active';
                                    break;
                                case 6:
                                    if(key=='step4')this.status[key] = 'active';
                                    break;
                                default:
                                    if(key=='step1')this.status[key] = 'active';
                                    break;

                            }
                        }

                        //at_pickup
                        //in_transit out_for_delivery delivered
                        this.compnayInfo = res.data.compnayInfo;

                    } else {
                        let params = {message:'배송 조회 정보가 존재하지 않습니다'}
                        this.$eventBus.$emit('modalOpen', params);
                    }

                } else {
                    this.$router.back();
                }

            });

        },
    }

}
</script>

<style lang="scss" scoped>
.content .delivery-process-wrap {
    display: flex;
    margin: 8.7179vw 0vw 7.4359vw;

    position: relative;
}

.content .delivery-process-wrap .delivery-process {
    flex: 1;

}


.content .delivery-process-wrap .delivery-process .circle {
    width: 8.2051vw;
    height: 8.2051vw;
    background: #f4f4f4;
    border-radius: 100%;
    margin: auto;
    position: relative;
}

.content .delivery-process-wrap .delivery-process .circle > div {
    background: #c8c8c8;
    position: absolute;
    width: 3.0769vw;
    height: 3.0769vw;
    border-radius: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;


}

.content .delivery-process-wrap .delivery-process p {
    margin-top: 3.3333vw;
    font-size: 3.3333vw;
    line-height: 4.8718vw;
    color: #8f8f8f;
    text-align: center;
}


.content .delivery-process-wrap .delivery-process.active .circle {
    background: #FFF1D2;
}

.content .delivery-process-wrap .delivery-process.active .circle > div {
    background: #ffc230;
}

.content .delivery-process-wrap .delivery-process.active > p {
    color: black;
}

.content .delivery-process-wrap .line {
    width: calc(100% - 22.0513vw);
    position: absolute;
    height: 3px;
    background: #f4f4f4;
    left: 0;
    right: 0;
    top: 4.1026vw;
    margin: auto;
    z-index: -1;

}

table.delivery-detail {
    border-collapse: collapse;
    width: calc(100% - 8.2051vw);
    margin: 0 4.1026vw;
}

table.delivery-detail th {
    background: #f1f1f1;
    font-size: 3.0769vw;
    padding: 2.3077vw 0;
    font-weight: normal;
}

table.delivery-detail td {
    font-size: 3.3333vw;
    text-align: center;
    border-bottom: 1px solid #eee;
    padding: 2.5641vw 0;
}

table.delivery-detail td.state {
    color: #f73535;
}

.delivery-info {
    margin: 5.8974vw 7.1795vw 20.0000vw;
}

.delivery-info p {
    font-size: 4.1026vw;
    font-weight: 600;
    color: #000;
    margin-bottom: 2.5641vw;
}

.delivery-info table th {
    font-size: 3.3333vw;
    font-weight: normal;
    text-align: left;
    width: 17.9487vw;
    color: #777;
    padding-bottom: 3.3333vw;
}

.delivery-info table td {
    font-size: 3.3333vw;
    padding-bottom: 3.3333vw;
}

</style>