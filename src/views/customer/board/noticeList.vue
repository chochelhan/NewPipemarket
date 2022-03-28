<template>
    <div class="notice-page-contents">
        <div class="w-full wrap" style="min-height:calc(100vh - 80px);padding-top:30px;">
            <div class="faq-item" v-for="(item,index) in noticeList">
                <div class="flex justify-between items-center" @click="noticeView(index)">
                    <div>
                        <div class="b-title">{{ item.bbs_subject }}</div>
                        <div class="time">{{ item.reg_date }}</div>
                    </div>
                    <i v-if="item.view" class="fa fa-angle-up" aria-hidden="true"></i>
                    <i v-else class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <div v-if="item.view">
                    <div class="w-full overflow-hidden mb-5" v-if="item.imgList.length>0">
                        <div v-for="img in item.imgList" class="bbs-img">
                        <img :src="img">
                        </div>
                    </div>
                    <div class="text-sm" v-html="item.bbs_contents">
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
        this.setTitle('공지사항');
        this.setBackUrl('');
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('page', this.page);
            frm.append('bType', 'notice');
            apiService.post(API_URL_GET_BOARD_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    for(let item of res.data.data.list) {
                        let imgList = [];
                        if(item.bbs_file_1_url) {
                            imgList.push(IMGHOST+item.bbs_file_1_url)
                        }
                        if(item.bbs_file_2_url) {
                            imgList.push(IMGHOST+item.bbs_file_2_url)
                        }
                        if(item.bbs_file_3_url) {
                            imgList.push(IMGHOST+item.bbs_file_3_url)
                        }
                        item.imgList = imgList;
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

    }

}
</script>

<style lang="scss" scoped>
.notice-page-contents {
    .wrap {
        background-color: #f1f1f1;
        padding: 22px 15px;
    }

    .wrap .faq-item {
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

    .bbs-img {
        max-width: 100%;
    }
}
</style>