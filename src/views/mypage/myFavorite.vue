<template>
    <div class="page-contents" >
        <div class="header-button">
            <v-btn depressed rounded style="background #f1f1f1;color:#787878;min-width:50px;height:28px;"
                   @click="deleteItem()">{{ buttonName }}
            </v-btn>
        </div>
        <div class="p-6 mb-8" style="margin-top:24px;">
            <div class="order-section-post flex flex-row justify-between" style="color: #333333">
                <div>{{ favoriteList.length }}개의 상품</div>
                <div class="flex" style="justify-content: flex-end">
                    <div class="mr-3">인기순</div>
                    <img src="../../assets/icons/arrow-down.svg"/>
                </div>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-x-4 gap-y-9">
                <div class="" v-for="(item,index) in favoriteList">
                    <div class="relative">
                        <div v-if="deleteReady" @click="itemChecked(index)"
                             class="absolute border-black border rounded-sm flex items-center justify-center top-1 left-1 bg-white"
                             style="width: 20px; height: 20px; z-index: 2">
                            <img v-if="item.checked" src="../../assets/icons/check-black.svg"/>
                        </div>
                        <div @click="goDetail(item.id)"
                             :style="{'background':'url('+item.image_src+') no-repeat','background-position':'center center','background-size':'cover','width':'100%','height':'110px'}"></div>
                    </div>
                    <h4 @click="goDetail(item.id)" class="mt-4 text-sm line-cut">{{ item.pname }}</h4>
                    <div @click="goDetail(item.id)">
                        <span class="product-discount text-xs font-semibold text-red-500"
                              v-if="parseInt(item.discount_rate)>0">{{ item.discount_rate }}%</span>
                        <span class="product-price text-xs mx-1 font-semibold"
                              style="font-size:12px !important;font-weight:600 !important;">{{ item.dcprice }}원</span>
                        <!--span class="product-original-price text-xs line-through text-gray-500"  v-if="parseInt(item.discount_rate)>0">{{ item.listprice }}원</span-->
                    </div>
                    <div class="flex flex-row items-center">
                        <img src="../../assets/icons/starMark.svg"/>
                        <span class="product-rate ml-2 text-gray-500" style="font-size: 11px">4.7 (72)</span>
                    </div>
                </div>

            </div>
        </div>

        <v-btn @click="deleteAction()" :disabled="disabled"
               style="background-color: #ffebeb;color:#ff1919;border-radius: none;width:100%;height:64px;position:fixed;bottom:0;font-size:15px;"
               depressed>선택 삭제
        </v-btn>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import UTIL from "../../api/util";
import apiService from "../../api/apiService";
import {
    API_URL_GET_MYFAVORTE_LIST,
    API_URL_DELETE_MYFAVORITE
} from "../../api/urls";

export default {
    data() {
        return {
            util: UTIL,
            favoriteList: [],
            page: 1,
            max: 30,
            buttonName: '삭제',
            deleteReady: false,
            disabled: true,
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('찜 목록');
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
            frm.append('page', this.page)
            frm.append('max', this.max)
            if (this.page == 1) this.favoriteList = [];
            apiService.post(API_URL_GET_MYFAVORTE_LIST, frm, (res) => {
                if (res.data.result == 'success') {
                    for (let item of res.data.data.list) {
                        item.checked = false;
                        this.favoriteList.push(item);
                    }

                }

            });

        },
        goDetail(id) {
            if (this.deleteReady) return;
            this.$router.push('/vgoods/goodsView/' + id)
        },
        deleteItem() {
            if (!this.deleteReady) {
                this.deleteReady = true;
                this.buttonName = '취소'
            } else {
                this.deleteReady = false;
                this.buttonName = '삭제'
                for (let item of this.favoriteList) {
                    item.checked = false;
                }
                this.disabled = true;
            }
        },
        itemChecked(index) {
            if (this.favoriteList[index].checked) {
                this.favoriteList[index].checked = false;
            } else this.favoriteList[index].checked = true;
            let flag = false;
            for (let item of this.favoriteList) {
                if (item.checked) flag = true;
            }
            if (flag) this.disabled = false;
            else this.disabled = true;


        },
        deleteAction() {
            let params = {
                type: 'confirm',
                message: '선택된 대상을 찜목록에서 삭제하시겠습니까?',
                doAction: () => {
                    this.doAction();
                }
            }
            this.$eventBus.$emit('modalOpen', params);
        },
        doAction() {
            let pids = [];
            for (let item of this.favoriteList) {
                if (item.checked) {
                    pids.push(item.id)
                }
            }
            const frm = new FormData();
            frm.append('pids', pids.join(','));
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_DELETE_MYFAVORITE, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data.result == 'success') {
                    params.message = '선택된 대상을 삭제하였습니다';
                    params.doAction = () => {
                        this.deleteItem();
                        this.page = 1;
                        this.getData();
                    }

                } else {
                    params.message = '잘못된 접근 입니다';

                }
                this.$eventBus.$emit('modalOpen', params);

            });
        }

    }

}
</script>


<style lang="scss" scoped>
@import "../../assets/style/brand_page.css";

.line-cut {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 여러 줄 자르기 추가 스타일 */
    white-space: normal;
    line-height: 1.2;
    height: 2.4em;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

}

.header-button {
    position: fixed;
    top: 47px;
    right: 20px;
    z-index: 100;
}
</style>
