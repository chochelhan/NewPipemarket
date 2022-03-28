<template>
    <div class="notice-page-contents">
        <div class="w-full wrap" style="min-height:calc(100vh - 80px);padding-top:30px;">
            <div class="faq-item" v-for="(item,index) in noticeList">
                <div class="flex justify-between items-center" @click="noticeView(index)">
                    <div>
                        <div class="b-title">{{ item.bbs_q }}</div>
                        <div class="time">{{ item.reg_date }}</div>
                    </div>
                    <i v-if="item.view" class="fa fa-angle-up" aria-hidden="true"></i>
                    <i v-else class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <div v-if="item.view" class="mt-4">
                    <div class="text-sm" v-html="item.bbs_a">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {mapActions} from "vuex";
import apiService from "../../../api/apiService";
import JQ from "jquery"
import {
    IMGHOST,
    API_URL_GET_BOARD_LIST
} from "../../../api/urls";
export default {
    data() {
        return {
            page:1,
            noticeList:[],
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('FAQ');
        this.setBackUrl('');
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('page', this.page);
            frm.append('bType', 'faq');
            apiService.post(API_URL_GET_BOARD_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    for(let item of res.data.data.list) {
                        item.view = false;
                        this.noticeList.push(item)
                    }

                }
            });
        },
        noticeView(index) {

            let selectItem = this.noticeList[index];
            for(let item of this.noticeList) {
                if(selectItem.bbs_ix==item.bbs_ix) {
                    if(item.view)item.view = false;
                    else item.view = true;
                } else item.view = false;
            }
        }

    },
    mounted() {
        //JQ('.bbs-img img').css('max-width','100%');
    },
    updated() {
        JQ('.bbs-img img').each(function() {
            JQ(this).attr('src',IMGHOST+JQ(this).attr('src'));
            JQ(this).css({'max-width':'100%','height':'auto'});
        });
    }

}
</script>

<style lang="scss" scoped>

.notice-page-contents {
    .wrap {
        background-color: #f1f1f1;
        padding: 22px 15px;
    }

    .faq-item {
        background-color: white;
        padding: 17px;
        border-radius: 10px;
        margin-bottom: 11px;
    }

    .faq-item .title {
        font-size: 15px;
        margin-bottom: 7px;
        color: #232323;
    }

    .faq-item .time {
        font-size: 12px;
        color: #a5a5a5;
    }

    .faq-item i {
        font-size: 20px;
        color: #a5a5a5;
    }

    .faq-item img {
        margin: 20px 0;
        aspect-ratio: 2 / 1;
    }

    .b-title {
        font-size: 13pt;
        color: #232323;
        font-width: 500;
    }
}
</style>