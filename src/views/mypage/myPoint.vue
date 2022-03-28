<template>
    <div class="page-contents">
        <div
            class="flex flex-col"
            style="background-color: #f1f1f1;"
        >
            <div
                class="py-6 px-5 flex items-center bg-white"
                style="margin-bottom: 10px;"
            >
                <img src="../../assets/icons/pointIcon.svg" alt="" />
                <div class="text-17 flex-1 ml-2">현재 포인트</div>
                <div class="text-xl font-semibold">{{ myPoint }}원</div>
            </div>
            <div class="bg-white" style="flex: 1">
                <div class="p-5 border-b" v-for="point in pointList">
                    <div class="flex justify-between items-center" v-if="point.state=='1'">
                        <div class="font-semibold text-13">{{ point.message }}</div>
                        <div class="font-semibold text-13" style="color: #8097e6">{{ point.mileage_desc }}원</div>
                    </div>
                    <div class="flex justify-between items-center" v-else>
                        <div class="font-semibold text-13">포인트 사용</div>
                        <div class="font-semibold text-13" style="color: #e68089">{{ point.mileage_desc }}원</div>
                    </div>
                    <div
                        class="flex justify-between items-center mt-2"
                        style="color: #6c6c6c"
                    >
                        <div class="text-xs">
                            {{  point.gname }}
                        </div>
                        <div class="text-xs">{{ point.date }}</div>
                    </div>
                    <div class="text-xs" style="color: #6c6c6c" v-if="point.log_type=='add' && point.expire_date">유효기간 : {{point.expire_date}}</div>
                </div>
                <div class="py-10"></div>
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
    API_URL_GET_MYORDER_POINT

} from "../../api/urls";

export default {
    data() {
        return {
            pointList: [],
            page: 1,
            max: 100,
            myPoint:0,

        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('포인트');
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
            frm.append('page', this.page);
            frm.append('max', this.max);
            apiService.post(API_URL_GET_MYORDER_POINT, frm, (res) => {
                if (res.data.result == 'success') {
                    this.myPoint = res.data.data.myPointInfo.myMileAmount;
                    for(let item of res.data.data.myPointList.list) {
                        this.pointList.push(item)
                    }

                } else {
                    this.$router.push('/')
                }

            });

        },

    }

}
</script>

<style lang="scss" scoped>
</style>