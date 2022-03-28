<template>
    <div class="page-contents">
        <div class="w-full" style="min-height:calc(100vh - 50px)">
            <div class="banner-box">
                <div class="banner-img">
                    <img :src="mobimgPath" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import apiService from "../../api/apiService";
import {
    API_URL_GET_SPECIAL_INFO
} from "../../api/urls";

export default {
    data() {
        return {

            mobimgPath:'',
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('이벤트 상세');
        this.setBackUrl('');
        this.getData(this.$route.params.id);

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData(id) {
            const frm = {
                event_ix:id,
            }
            apiService.get(API_URL_GET_SPECIAL_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    this.mobimgPath = res.data.info.mobimgPath;
                }
            });
        },


    }

}
</script>

<style lang="scss" scoped>
@import "../../assets/style/event_img.css";
</style>