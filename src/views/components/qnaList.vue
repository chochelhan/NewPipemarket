<template>
    <div class="qa" style="padding:45px 15px 20px 15px;">
        <div class="qa-heading flex items-center justify-between mb-6" v-if="type=='goodsDetail'">
            <div class="qa-title text-xl font-semibold">Q&A</div>
            <div class="qa-contact-btn px-5" @click="registQna()">문의하기</div>
        </div>
        <div class="flex flex-col justify-center items-center py-10 dashline"  v-if="qnaList.length<1">
            <p class="mt-1 mb-1" style="font-size:12px;">
                등록된 Q&A가 없습니다.
            </p>
        </div>
        <div class="qa-list" style="margin-bottom:140px;" v-else>
            <div class="qa-item mb-4" v-for="(item,index) in qnaList">
                <div class="qa-heading flex justify-between items-center">
                    <div v-if="!item.is_comment" class="qa-btn-green text-xs">미답변</div>
                    <div v-else class="qa-btn-red text-xs">답변완료</div>
                    <div class="flex text-xs" style="justify-content: flex-end">
                        <div class="border-r-2 text-gray-500 pr-2">{{ item.bbs_name }}</div>
                        <div class="text-gray-500 ml-2">{{ item.regdate }}</div>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-2" @click="showComment(index)">
                    <div class="flex items-center">
                        <img v-if="item.isHidden" src="../../assets/icons/qa.svg" alt="" class="mr-2"/>
                        <div :class="'text-sm text-gray-500 '+item.boldClass">
                            [{{ item.div_name }}] {{ item.bbs_subject }}
                        </div>
                    </div>
                    <img v-if="item.auth && !item.contentShow" src="../../assets/icons/arrow-down.svg" alt="" />
                    <img v-else-if="item.auth &&item.contentShow" src="../../assets/icons/arrow-up.svg" alt="" />
                </div>
                <div class="text-sm" style="color:#757575" v-if="item.contentShow">
                    <div v-html="item.bbs_contents" style="padding-top:10px;">
                    </div>

                </div>
                <div  v-if="item.commentShow" style="border-top:solid 1px #eee;margin-top:20px;padding-top: 20px;">

                    <div class="flex justify-between items-center mb-4">
                        <div class="text-sm text-bold">답변 : {{item.cmtInfo.cmt_name}}</div>
                        <div class="text-xs text-gray-500">{{item.cmtInfo.regdate.substring(0,10)}}</div>
                    </div>
                    <div class="text-sm" style="color: #757575">
                         <div v-html="item.cmtInfo.cmt_contents">

                        </div>

                    </div>
                </div>
            </div>
        </div>
        <v-btn depressed  style="border-radius:10px;border:solid 1px #ddd;margin:10px 0 5px 0;background:none;color:#949494;width:100%;height:40px;" @click="goQnaList()"  v-if="type=='goodsDetail' && qnaList.length>0">
            Q&A 전체보기
        </v-btn>
        <div class="afixed-bottom-button" v-else-if="type=='goodsAllList'">
        <v-btn depressed  rounded style="background:#000;color:#fff;width:100%;height:55px;" @click="registQna()"  >
           문의하기
        </v-btn>
        </div>
    </div>
</template>

<script>

import AUTH from "../../api/auth";
import UTIL from "../../api/util";
import apiService from "../../api/apiService";
import {
    API_URL_GET_QNA_LIST,
} from "../../api/urls";

export default {
    props:["pid","type"],
    data() {
        return {
            isLogin:false,
            qnaList:[],
            qnaType:'',
            max:300,
            ucode:'',
        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        console.log(memberInfo)
        if (memberInfo) {
            this.ucode = memberInfo.code;
            this.isLogin = true;
        }
        switch(this.type) {
            case 'goodsDetail':
                this.max = 4;
                break;
            case 'mine':
                this.qnaType = 'mine';
                break;
        }
        this.getData();


    },
    methods: {
        getData() {
            const frm = new FormData();
            if(this.type!='mine') {
                frm.append('id',this.pid)
            }
            frm.append('qnaType',this.qnaType)
            frm.append('max',this.max)
            frm.append('page',1)
            this.qnaList = [];
            apiService.post(API_URL_GET_QNA_LIST, frm, (res) => {

                if (res.data.result == 'success') {
                    for(let item of res.data.data.list) {
                        if(item.comments.length>0) {
                            item.is_comment = true;
                            item.cmtInfo = item.comments[0];
                        } else {
                            item.cmtInfo = {};
                            item.is_comment = false;
                        }
                        item.commentShow = false;
                        item.contentShow = false;
                        item.regdate = item.regdate.substring(0,10);
                        item.bbs_name = item.bbs_name.substring(0,1)+'**';
                        item.auth  = false;
                        if(item.isHidden) {
                            if(item.ucode==this.ucode) {
                                item.auth  = true;
                            }
                        } else {
                            item.auth  = true;
                        }
                        if(item.auth)item.boldClass='text-bold'
                        else item.boldClass=''

                        this.qnaList.push(item);
                    }


                }

            });

        },
        showComment(index) {
            let item = this.qnaList[index];
            if(!item.auth)return;
            if(item.contentShow)item.contentShow = false;
            else item.contentShow = true;

            if(!item.is_comment)return;
            if(item.commentShow)item.commentShow = false;
            else item.commentShow = true;
        },
        registQna() {
            if(this.isLogin) {
                this.$router.push('/vgoods/registQna/'+this.pid)
            } else {
                this.$router.push('/vmember/login');
            }

        },
        goQnaList() {
            this.$router.push('/vgoods/listQna/'+this.pid)
        }

    }

}
</script>
<style lang="scss" scoped>
@import "../../assets/style/product_detail.css";
.text-bold {
    font-weight:600;
    color:#000;
}
.afixed-bottom-button {
    position:fixed;
    width:calc(100vw);
    bottom:0;
    left:0;
    padding:15px;

}
</style>