<template>
    <div class="page-contents" style="width:100%;" id="search-layout">
        <div class="px-5">
            <form novalidate @submit.prevent="validate">
                <div class="flex flex-row items-center mt-11">
                    <img src="../../assets/icons/back.svg" @click="$router.back()"/>
                    <div class="block ml-2 w-full relative">
                        <input
                            type="text"
                            v-model="keyword"
                            placeholder="아이템과 스토어를 검색해보세요"
                            class="py-2.5 w-full search-input"
                        />

                        <div>
                            <img @click="keyword=''" v-if="keyword" src="../../assets/icons/textRemove.svg"
                                 class="text-remove"/>
                        </div>
                    </div>
                    <input type="submit" style="display:none">
                </div>
            </form>

            <div v-if="!searchResult">
                <div class="flex flex-row items-center justify-between mt-8">
                    <h3 class="label-history">최근 검색어</h3>
                    <span class="clear-history" @click="delAllLastestKeyword()">검색 기록 삭제</span>
                </div>
                <div class="search-result text-xs" v-if="lastestKeywords.length<1">검색 결과가 없습니다.</div>
                <div class="block" v-if="lastestKeywords.length>0">
                    <div class="mt-5 flex flex-row items-center justify-between"
                         v-for="(keyw,index) in lastestKeywords">
                        <div class="flex flex-row items-center" @click="setKeyword(keyw.text)">
                            <img src="../../assets/icons/searchRecent.svg"/>
                            <span class="keyword-search">{{ keyw.text }}</span>
                        </div>
                        <div class="flex" style="justify-content: flex-end">
                            <span class="date-search">{{ keyw.date }}</span>
                            <img src="../../assets/icons/remove.svg" @click="delLastestKeyword(index)"/>
                        </div>
                    </div>
                </div>

                <div class="mt-16">
                    <h3 class="label-history">지금 가장 인기있는</h3>
                    <div class="mt-3 flex flex-wrap">
                        <div class="item-history text-13 text-cut" @click="setKeyword(keyw.keyword)"
                             v-for="(keyw,index) in popularKeywords" :id="'recommend'+(index+1)">
                            {{ keyw.keyword }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="flex flex-row items-center justify-between mt-8">
                    <h3 class="label">{{ total }}개의 상품</h3>
                    <div  v-if="goodsList.length>0" class="flex flex-row items-center" style="justify-content: flex-end" @click="sortOpen()">
                        <span class="label">{{ sortName }}</span>
                        <img src="../../assets/icons/chevronDown.svg"/>
                    </div>
                </div>
                <div v-if="goodsList.length<1">
                    <div class="dot-box">
                        검색 결과가 없습니다.
                    </div>
                    <div class="py-6 bg-white new-goods-box">
                        <p class="font-semibold" style="font-size:16px;">새로 들어온 제품들을 확인해보세요!</p>
                        <div class="flex overflow-x-scroll hide-scrollbar mt-4">
                            <div class="mr-5 flex-shrink-0" @click="goGoodsView(goods.id)" v-for="goods in newGoodsList" style="max-width:120px;">
                                <div style="width:120px;height:120px;overflow: hidden">
                                <img
                                    :src="goods.image_src"
                                    style="width:120px"
                                    alt=""
                                />
                                </div>
                                <div class="mt-3 text-xs gtext-cut">{{ goods.pname }}</div>
                                <div class="flex items-center">
                                    <div class="text-13 font-semibold" style="color: #d80c0c"
                                         v-if="parseInt(goods.discount_rate)>0">
                                        {{ goods.discount_rate }}%
                                    </div>
                                    <div class="text-13 font-semibold ml-1">{{ util.numberFormat(goods.dcprice) }}원</div>
                                </div>
                                <div class="flex items-center">
                                    <img
                                        src="../../assets/icons/starOn.svg"
                                        alt=""
                                        width="11px"
                                        height="11px"
                                    />
                                    <div class="text-11 text-gray-500 font-extralight ml-2">
                                        {{ goods.avg.goodsAvg }} ({{ goods.avgCount }})
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div v-else style="padding-bottom: 40px">
                    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-9">
                        <div class="mb-30" v-for="(goods,index) in goodsList">
                            <div class="relative">
                                <img @click="goGoodsView(goods.id)"
                                     :src="goods.image_src"
                                     width="100%"
                                     height="169px"
                                     alt="#"
                                />

                                <div class="absolute bottom-0 right-0 wish-box" @click="myWish(index)">
                                    <img v-if="!goods.alreadyWish" src="../../assets/icons/heartOff.svg" alt=""/>
                                    <img v-else src="../../assets/icons/heartOn.svg" alt=""/>
                                </div>
                            </div>
                            <h4 class="mt-4 gtext-cut">{{ goods.pname }}</h4>
                            <div @click="goGoodsView(goods.id)">
                                <span class="product-discount font-semibold" style="color:#d80c0c"
                                      v-if="parseInt(goods.discount_rate)>0">{{ goods.discount_rate }}%</span>
                                <span class="product-price font-semibold">{{ goods.dcprice }}원</span>
                                <span class="product-original-price"
                                      v-if="parseInt(goods.discount_rate)>0">{{ goods.listprice }}원</span>
                            </div>
                            <div class="flex flex-row items-center" @click="goGoodsView(goods.id)">
                                <img src="../../assets/icons/starMark.svg"/>
                                <span class="product-rate"> {{ goods.avg.goodsAvg }} ({{ goods.avgCount }})</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="sortView"
            class="
        flex flex-col
        justify-end
        fixed
        z-10
        bg-black bg-opacity-70
        top-0
        left-0
        w-full
        h-full">
            <div
                class="purchase-box bg-white relative rounded-t-2xl"
                style="transform: translateY(0)"
            >
                <div class="flex justify-between py-5 px-6 border-b items-center" @click="sortGoods(item.code)"
                     v-for="item in sortList">
                    <div :class="item.gclass">{{ item.name }}</div>
                    <img v-if="item.gclass=='font-semibold'" src="../../assets/icons/check-blue.svg"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import UTIL from "../../api/util";
import {
    API_URL_GET_SEARCH, API_URL_SET_GOODS_WISH,
    API_URL_SET_SEARCH_RESULT
} from "../../api/urls";
import JQ from "jquery";

export default {
    name:'goodsSearch',
    data() {
        return {
            util: UTIL,
            isLogin: false,
            keyword: '',
            lastestKeywords: [],
            popularKeywords: [],
            goodsList: [],
            total: 0,
            sort: 'sale',
            sortName: '인기순',
            sortView: false,
            sortList: [
                {code: 'sale', name: '인기순', gclass: 'font-semibold'},
                {code: 'low', name: '최저가순', gclass: ''},
                {code: 'high', name: '최고가순', gclass: ''},
                {code: 'regdate', name: '최신순', gclass: ''},
            ],
            searchResult: false,
            newGoodsList:[],
        };
    },
    activated() {
        this.setClass('none');
        if(sessionStorage.getItem('searchScrollTop')) {
            JQ('#search-layout').scrollTop(sessionStorage.getItem('searchScrollTop'));
            sessionStorage.setItem('searchScrollTop','');
        }

    },
    deactivated() {

    },
    created() {
        sessionStorage.setItem('searchScrollTop','');
        this.$eventBus.$on('searchPageReload',this.reload);
        this.setClass('none')
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        if (localStorage.getItem('lastestKeywords')) {
            let lastestKeywords = JSON.parse(localStorage.getItem('lastestKeywords'));
            let k = 1;
            let date = new Date();
            date.setDate(date.getDate() - 7);
            let m = parseInt(date.getMonth()) + 1;
            let month = (m < 10) ? '0' + m : m;
            let day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
            let checkDate = date.getFullYear().toString() + month.toString() + day.toString();
            for (let item of lastestKeywords) {
                let itemdate = item.date.replace('.', '').replace('.', '')
                if (parseInt(itemdate) >= parseInt(checkDate)) {
                    if (k <= 10) {
                        this.lastestKeywords.push(item)
                        k++;
                    }
                }


            }

        }
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass"]),
        reload() {
            this.isLogin = false;
            this.keyword = '';
            this.lastestKeywords = [];
            this.popularKeywords = [];
            this.goodsList =  [];
            this.total =  0;
            this.sort =  'sale';
            this.sortName =  '인기순';
            this.sortView = false;
            this.sortList = [
                {code: 'sale', name: '인기순', gclass: 'font-semibold'},
                {code: 'low', name: '최저가순', gclass: ''},
                {code: 'high', name: '최고가순', gclass: ''},
                {code: 'regdate', name: '최신순', gclass: ''},
            ];
            this.searchResult =  false;
            this.newGoodsList = [];
            this.setClass('none')
            let memberInfo = AUTH.getSession();
            if (memberInfo) {
                this.isLogin = true;
            }
            if (localStorage.getItem('lastestKeywords')) {
                let lastestKeywords = JSON.parse(localStorage.getItem('lastestKeywords'));
                let k = 1;
                let date = new Date();
                date.setDate(date.getDate() - 7);
                let m = parseInt(date.getMonth()) + 1;
                let month = (m < 10) ? '0' + m : m;
                let day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
                let checkDate = date.getFullYear().toString() + month.toString() + day.toString();
                for (let item of lastestKeywords) {
                    let itemdate = item.date.replace('.', '').replace('.', '')
                    if (parseInt(itemdate) >= parseInt(checkDate)) {
                        if (k <= 10) {
                            this.lastestKeywords.push(item)
                            k++;
                        }
                    }
                }

            }
            this.getData();
        },
        sortGoods(code) {
            for (let item of this.sortList) {
                if (code == item.code) {
                    item.gclass = 'font-semibold';
                    this.sortName = item.name;
                } else item.gclass = '';
            }
            this.sort = code;
            this.doSearch();
            this.sortView = false;
        },
        validate() {
            if (this.keyword) {
                let flag = true;
                let keyword = this.keyword.trim();
                for (let dt of this.lastestKeywords) {
                    if (keyword == dt.text) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    let date = new Date();
                    let m = parseInt(date.getMonth()) + 1;
                    let month = (m < 10) ? '0' + m : m;
                    let day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
                    let nowDate = date.getFullYear() + '.' + month + '.' + day;
                    this.lastestKeywords.unshift({text: this.keyword, date: nowDate})
                    localStorage.setItem('lastestKeywords', JSON.stringify(this.lastestKeywords));
                }

                this.doSearch();
            }
        },
        doSearch() {
            let keyword = this.keyword.trim();
            const frm = new FormData();
            frm.append('keyword', keyword)
            frm.append('sort', this.sort)
            apiService.post(API_URL_SET_SEARCH_RESULT, frm, (res) => {
                this.searchResult = true;
                this.goodsList = res.data.list;
                this.total = res.data.total;
            });
        },
        getData() {
            const frm = {}
            apiService.get(API_URL_GET_SEARCH, frm, (res) => {
                this.popularKeywords = res.data.popularKeyword;
                this.newGoodsList = res.data.newGoodsList;
            });
        },
        delLastestKeyword(index) {
            this.lastestKeywords.splice(index, 1)
            localStorage.setItem('lastestKeywords', JSON.stringify(this.lastestKeywords));

        },
        delAllLastestKeyword() {
            this.lastestKeywords = [];
            localStorage.setItem('lastestKeywords', '');

        },
        setKeyword(keyword) {
            this.keyword = keyword;
            this.validate();
        },
        goGoodsView(id) {
            sessionStorage.setItem('searchScrollTop',JQ('#search-layout').scrollTop());
            this.$router.push('/vgoods/goodsView/' + id);
        },
        myWish(index) {
            if (this.isLogin) {
                let item = this.goodsList[index];
                const frm = new FormData();
                frm.append('pid', item.id);
                apiService.post(API_URL_SET_GOODS_WISH, frm, (res) => {
                    if (res.data == 'delete') {
                        item.alreadyWish = false;
                    } else if (res.data == 'insert') {
                        item.alreadyWish = true;
                    } else {
                        let params = {
                            message: '잘못된 접근입니다'
                        }
                        this.$eventBus.$emit('modalOpen', params)
                        return;
                    }
                    this.$set(this.goodsList, index, item);

                });
            } else {
                let params = {
                    message: '먼저 로그인하세요'
                }
                this.$eventBus.$emit('modalOpen', params)
            }
        },
        sortOpen() {
            this.sortView = true;
        }
    }

}
</script>

<style lang="scss" scoped>
@import "../../assets/style/search_1.css";
#search-layout {
    width:calc(100vw);
    height:calc(100vh);
    overflow-y: auto;
}
.search-result {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 38px 0;
    border: 1px dashed #dcdcdc;
    border-radius: 5px;
    color: #8f8f8f;
}

.text-cut {
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 1;
}
.dot-box {
    border-radius: 5px;
    width:100%;
    height:94px;
    line-height:94px;
    text-align:center;
    color:#999;
    border:dashed 1px #dcdcdc;
    margin-top:14px;
}
.keyword-search {

    overflow: hidden;
    text-overflow: ellipsis;
    /* 여러 줄 자르기 추가 스타일 */
    white-space: normal;
    padding: 0 15px 0 0;
    line-height: 1.2em;
    height: 1.2em;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

}
.new-goods-box {
    margin-top:200px;
    position:relative;
}
.gtext-cut {
    overflow: hidden;
    text-overflow: ellipsis;
    /* 여러 줄 자르기 추가 스타일 */
    white-space: normal;
    line-height: 1.2em;
    height: 2.6em;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

}
.wish-box {
    width: 45px;
    bottom: 10px;

    img {
        width: 100%;
    }
}
</style>