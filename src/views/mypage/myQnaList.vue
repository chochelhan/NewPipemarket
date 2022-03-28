<template>
    <div class="page-contents">
        <div class="flex flex-col justify-center items-center py-10 dashline"  v-if="qnaList.length<1">
            <p class="mt-3 mb-5" style="font-size:12px;">
                상품문의가 없습니다.
            </p>
        </div>
        <div v-else style="background-color: #f1f1f1; margin-bottom: 50px;margin-top:20px;">
            <div v-for="(item,index) in qnaList">
                <div class="py-4 px-6 flex items-center bg-white" style="position: relative;border:none !important;"
                     @click="showComment(item.bbs_ix)">
                    <div style="display: flex;">
                        <div
                            :style="{'background':'url('+item.image_src+') no-repeat','background-size':'cover','width':'50px','height':'50px'}"></div>
                        <div class="ml-3 text-15 flex-1" style="padding-top:15px;">{{ item.pname }}</div>
                        <div class="border ml-2 rounded-xl px-2"
                             style="color: #68c1a6; border-color: #68c1a6;max-width:60px;height:21px;margin-top:16px;">
                            <div class="text-xs text-center" v-if="item.is_comment">완료</div>
                            <div class="text-xs text-center" v-else>대기중</div>
                        </div>
                    </div>
                    <div class="flex items-center" style="position:absolute;right:30px;top:38px;">
                        <img v-if="item.commentShow" src="../../assets/icons/arrow-up-gray.svg" alt=""/>
                        <img v-else src="../../assets/icons/arrow-down-gray.svg" alt=""/>
                    </div>

                </div>
                <div class="py-4 px-6 mb-3" v-if="item.commentShow">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="font-semibold text-sm mr-2">Q.</div>
                            <div class="text-sm flex-1">[{{ item.div_name }}]</div>
                            <div class="text-xs" style="color: #707070">{{ item.regdate }}</div>
                        </div>
                        <div class="ml-6">{{ item.bbs_subject }}</div>
                        <div style="color: #757575" class="mt-1 ml-6">
                            <div v-html="item.bbs_contents"></div>
                        </div>
                    </div>
                    <div class="mt-6" v-if="item.is_comment">
                        <div class="flex items-center mb-2">
                            <div class="font-semibold text-sm mr-2">A.</div>
                            <div class="text-sm flex-1">{{ item.cmtInfo.cmt_name }}</div>
                            <div class="text-xs" style="color: #707070">{{
                                    item.cmtInfo.regdate.substring(0, 16)
                                }}
                            </div>
                        </div>
                        <div style="color: #757575" class="ml-6">
                            <div v-html="item.cmtInfo.cmt_contents"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {
    API_URL_GET_QNA_LIST,
} from "../../api/urls";

export default {
    data() {
        return {
            qnaList: [],
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('상품문의');
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
            frm.append('qnaType', 'mine')
            frm.append('max', 300)
            frm.append('page', 1)
            this.qnaList = [];
            apiService.post(API_URL_GET_QNA_LIST, frm, (res) => {

                if (res.data.result == 'success') {
                    for (let item of res.data.data.list) {
                        if (item.comments.length > 0) {
                            item.is_comment = true;
                            item.cmtInfo = item.comments[0];
                        } else {
                            item.cmtInfo = {};
                            item.is_comment = false;
                        }
                        item.commentShow = false;
                        item.regdate = item.regdate.substring(0, 16);
                        this.qnaList.push(item);
                    }


                }

            });

        },
        showComment(bbs_ix) {

            for (let item of this.qnaList) {
                if (item.bbs_ix == bbs_ix) {
                    if (item.commentShow) item.commentShow = false;
                    else item.commentShow = true;
                } else {
                    item.commentShow = false;
                }
            }

        },
    }

}
</script>
<style lang="scss" scoped="true">
.dashline {
    margin:20px 15px;
}
</style>
