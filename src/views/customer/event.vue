<template>
    <div class="page-contents">
        <div class="w-full wrap" style="min-height:calc(100vh - 50px)">
            <div class="mb-5 event-box">
                <span :class="eventTab.ing" @click="setTab('ing')">진행중</span>
                <span :class="eventTab.done" @click="setTab('done')">종료</span>
            </div>
            <div class="event-item" v-for="item in specialList" @click="goDetail(item.event_ix)">
                <div class="overflow-hidden rounded-xl mb-2" style="height: 200px">
                    <img :src="item.pcimgPath" style="width:100%;" alt=""/>
                </div>
                <div class="title"> {{ item.event_text }}</div>
                <div class="time">
                    {{ item.startDate }} - {{ item.endDate }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import apiService from "../../api/apiService";
import {
    API_URL_GET_SPECIAL_LIST
} from "../../api/urls";

export default {
    data() {
        return {
            specialList: [],
            tabCode:'ing',
            eventTab: {
                ing:'event-status-doing',
                done:'event-status-done',
            }

        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('이벤트');
        this.setBackUrl('');
        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = {
                code:'event',
                tab:this.tabCode
            }
            apiService.get(API_URL_GET_SPECIAL_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.specialList) {
                        this.specialList = res.data.specialList.list;
                    }
                }
            });
        },
        goDetail(id) {
            this.$router.push('/vcustomer/eventView/'+id);
        },
        setTab(code) {
            this.tabCode = code;
            if(code=='ing') {
                this.eventTab = {
                    ing: 'event-status-doing',
                    done: 'event-status-done'
                }
            } else {
                this.eventTab = {
                    ing: 'event-status-done',
                    done: 'event-status-doing'
                }
            }
            this.getData();
        }

    }

}
</script>

<style lang="scss" scoped>
@import "../../assets/style/event_img.css";
.event-box {
    span {
        &:first-child {
            margin-right: 24px;
        }
    }
}
</style>