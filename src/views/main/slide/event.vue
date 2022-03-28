<template>
    <div class="page-contents" id="eventSlide">
        <div class="overlay-box" v-if="!serverInit">
            <v-progress-circular
                :size="40"
                color="indigo darken-1"
                indeterminate
            ></v-progress-circular>
        </div>
        <div v-else>

            <div class="wrap" style="">
                <div class="mb-5 event-box">
                    <span :class="eventTab.ing" @click="setTab('ing')">진행중</span>
                    <span :class="eventTab.done" @click="setTab('done')">종료</span>
                </div>
                <div class="event-item" v-for="(item,index) in specialList" @click="goDetail(item.event_ix)" :id="'event_banner'+(index+1)">

                    <div class="rounded-xl mb-2">
                        <img :src="item.pcimgPath" style="width:100%;" alt=""/>
                    </div>
                    <div class="title"> {{ item.event_text }}</div>
                    <div class="time">
                        {{ item.startDate }} - {{ item.endDate }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import apiService from "../../../api/apiService";
import {
    API_URL_GET_SPECIAL_LIST
} from "../../../api/urls";
import JQ from "jquery";

export default {
    props: ["currentSlideIndex", "activeContentIndex"],
    watch: {
        activeContentIndex(val) {
            if (this.currentSlideIndex == val) {
                if (!this.serverInit) {
                    this.getData();
                }

            }
        },

    },
    data() {
        return {
            specialList: [],
            tabCode: 'ing',
            eventTab: {
                ing: 'event-status-doing',
                done: 'event-status-done',
            },
            serverInit:false,

        };
    },
    created() {

    },
    activated() {
        if (sessionStorage.getItem('eventSlideTop')) {
            JQ('#eventSlide').scrollTop(sessionStorage.getItem('eventSlideTop'));
            sessionStorage.setItem('eventSlideTop', '');
        }

    },
    methods: {
        getData() {
            const frm = {
                code: 'event',
                tab: this.tabCode
            }
            apiService.get(API_URL_GET_SPECIAL_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.specialList) {
                        this.specialList = res.data.specialList.list;
                    }
                    this.serverInit = true;
                }
            });
        },
        goDetail(id) {
            sessionStorage.setItem('eventSlideTop', JQ('#eventSlide').scrollTop());
            this.$router.push('/vcustomer/eventView/' + id);
        },
        setTab(code) {
            this.tabCode = code;
            if (code == 'ing') {
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
@import "../../../assets/style/event_img.css";

.event-box {
    span {
        &:first-child {
            margin-right: 24px;
        }
    }
}
.overlay-box {
    width: 100%;
    text-align: center;
    padding-top: 200px;

}
</style>