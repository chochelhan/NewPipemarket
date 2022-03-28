<template>
    <div class="goodslist-page-container" :id="pageId">
        <div class="overlay-box" v-if="!serverInit">
            <v-progress-circular
                :size="40"
                color="indigo darken-1"
                indeterminate
            ></v-progress-circular>
        </div>
        <div v-else>
            <div class="w-full categoryList" @touchstart="onMouse" @touchend="outMouse">
                <swiper :options="swiperOptions" ref="middleMenuSwiper" @slideChange="onSlideChange">
                    <swiper-slide v-for="(cate,index) in subCategorys" :key="'subcate'+index"
                                  :class="'category-item '+cate.gclass">
                        <div v-if="cate.gclass!='gblank'" @click="getSubCategoryData(index)">
                            <div>{{ cate.cname }}</div>
                        </div>
                        <div v-else class="gblank-box"></div>

                    </swiper-slide>
                </swiper>
            </div>
            <div class="p-4 mb-28">
                <div class="order-section-post flex flex-row justify-between">
                    <div>{{ total }}개의 상품</div>
                    <div @click="sortOpen()">{{ sortName }} <i class="fa fa-angle-down" aria-hidden="true"></i></div>
                </div>
                <div class="subsub-category" v-if="subSubCategorys.length>0">
                <span v-for="(subcate,subIndex) in subSubCategorys" @click="getSubSubCategoryData(subIndex)"
                      :class="'subsub-item '+subcate.gclass">{{ subcate.cname }}</span>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-9">
                    <div class="" v-for="(goods,index) in goodsList">
                        <div class="relative">
                            <div @click="goGoodsView(goods.id)" class="img-box"
                                 :style="{'background':'url('+goods.image_src+') no-repeat','background-position':'center center','background-size':'cover'}"></div>
                            <div class="absolute bottom-0 right-0" @click="favoriteToggle(index)">
                                <img v-if="goods.alreadyWish" src="../../../assets/icons/heartOn.svg"/>
                                <img v-else src="../../../assets/icons/heartOff.svg"/>
                            </div>
                        </div>
                        <h4 class="mt-4" @click="goGoodsView(goods.id)">{{ goods.pname }}</h4>
                        <div @click="goGoodsView(goods.id)">
                        <span class="product-discount font-semibold"
                              v-if="parseInt(goods.discount_rate)>0">{{ goods.discount_rate }}%</span>
                            <span class="product-price font-semibold">{{ goods.dcprice }}원</span>
                            <span class="product-original-price font-extralight"
                                  v-if="parseInt(goods.discount_rate)>0">{{ goods.listprice }}원</span>
                        </div>
                        <div class="flex flex-row items-center">
                            <img src="../../../assets/icons/starMark.svg"/>
                            <span class="product-rate">
                            {{ goods.avg.goodsAvg }} ({{ goods.avgCount }})
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

import AUTH from '../../../api/auth'
import {
    API_URL_GET_GOODS_LIST, API_URL_SET_GOODS_WISH
} from '../../../api/urls';
import apiService from '../../../api/apiService'
import JQ from 'jquery'
import {mapGetters} from "vuex";

export default {
    name: 'slideGoodsList',
    components: {
        Swiper,
        SwiperSlide,
    },
    computed: {
        ...mapGetters('config', ["getListScrollMore"]),
        middleMenuSwiper() {
            return this.$refs.middleMenuSwiper.$swiper;
        }
    },
    props: ["cid", "sortCode", "currentSlideIndex", "activeContentIndex"],
    watch: {
        sortCode(val) {
            this.goodsList = [];
            this.getData(1)
            switch (val) {
                case 'sale':
                    this.sortName = '인기순';
                    break;
                case 'low':
                    this.sortName = '최저가순';
                    break;
                case 'high':
                    this.sortName = '최고가순';
                    break;
                case 'regdate':
                    this.sortName = '최신순';
                    break;
            }

        },
        activeContentIndex(val) {
            if (this.currentSlideIndex == val) {
                if (!this.serverInit) {
                    this.getData(1)
                }

            }
        },
        getListScrollMore(val) {
            if (this.currentSlideIndex == this.activeContentIndex) {
                this.scrollHandler(val)
            }

        },

    },
    data() {
        return {
            serverInit: false,
            goodsList: [],
            limit: 10,
            page: 1,
            subCid: '',
            pageId: '',
            isLogin: false,
            subCategorys: [
                {cid: '', gclass: 'category-item-active', cname: '전체'}
            ],
            subSubCategorys: [],
            swiperOptions: {
                slidesPerView: 'auto',
            },
            total: 0,
            nextPage: 1,
            curPage: 1,
            lastPage: 1,
            serverProc: false,
            sortName: '인기순',
            depth: 0,

        }
    },
    created() {
        if (!this.cid) return;
        this.pageId = this.cid + 'goodsList'
        this.subCategorys[0].cid = this.cid;
        this.subCid = this.cid
        const memberInfo = AUTH.getSession();
        if (memberInfo) this.isLogin = true;


    },
    activated() {
        if (sessionStorage.getItem(this.pageId)) {
            JQ('#' + this.pageId).scrollTop(sessionStorage.getItem(this.pageId));
            sessionStorage.setItem(this.pageId, '');
        }

    },
    methods: {
        getData(page) {
            this.page = page;
            this.getListData()
        },
        getListData() {
            //console.log(this.sortCode);
            this.serverProc = true;
            const frm = new FormData();
            frm.append('cid', this.subCid);
            frm.append('page', this.page);
            frm.append('sort', this.sortCode);
            frm.append('max', this.limit);
            apiService.post(API_URL_GET_GOODS_LIST, frm, (res) => {
                this.serverProc = false;
                if (!this.serverInit) {
                    if (res.data.subCategorys && res.data.subCategorys.length > 0) {
                        for (let cate of res.data.subCategorys) {
                            cate.gclass = '';
                            this.subCategorys.push(cate);
                        }
                    }
                    let cate = {gclass: 'gblank'}
                    this.subCategorys.push(cate);
                    this.serverInit = true;
                } else {
                    if (this.depth == 1) {
                        this.subSubCategorys = [];
                        if (res.data.subCategorys && res.data.subCategorys.length > 0) {
                            for (let cate of res.data.subCategorys) {
                                if (cate.depth == 2) {
                                    cate.gclass = '';
                                    this.subSubCategorys.push(cate);
                                }
                            }
                        }
                    }
                }
                this.nextPage = res.data.datas.paging.next_page;
                this.lastPage = res.data.datas.paging.last_page;
                this.curPage = res.data.datas.paging.cur_page;

                this.total = parseInt(res.data.datas.total);
                if (this.total > 0) {
                    for (let item of res.data.datas.list) {
                        this.goodsList.push(item);
                    }
                }


            })
        },
        scrollHandler(top) {
            if (this.serverProc) return;
            if (this.total > 0) {
                if (this.nextPage != this.curPage) {

                    this.page = this.nextPage;
                    this.getListData();
                }
            }


        },
        sortOpen() {
            let params = {
                pageCode: 'goods',
                cid: this.cid,
            }
            this.$eventBus.$emit('setSort', params);
        },
        getSubCategoryData(index) {
            if (this.subCategorys[index].cid == this.subCid) return;
            for (let cateIndex in this.subCategorys) {
                let cate = this.subCategorys[cateIndex];
                if (index == cateIndex) {
                    cate.gclass = 'category-item-active'

                } else cate.gclass = ''
                this.$set(this.subCategorys, cateIndex, cate);
            }
            this.depth = 1;
            this.subCid = this.subCategorys[index].cid;
            this.goodsList = [];
            this.getData(1);
        },
        getSubSubCategoryData(index) {
            if (this.subSubCategorys[index].cid == this.subCid) return;
            for (let cateIndex in this.subSubCategorys) {
                let cate = this.subSubCategorys[cateIndex];
                if (index == cateIndex) {
                    cate.gclass = 'active'

                } else cate.gclass = ''
                this.$set(this.subSubCategorys, cateIndex, cate);
            }
            this.depth = 2;
            this.subCid = this.subSubCategorys[index].cid;
            this.goodsList = [];
            this.getData(1);
        },
        goGoodsView(id) {
            sessionStorage.setItem(this.pageId, JQ('#' + this.pageId).scrollTop());
            this.$router.push('/vgoods/goodsView/' + id)
        },
        favoriteToggle(index) {
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
        onMouse(obj) {
            this.$emit('menuSlideDisable');
        },
        outMouse(obj) {
            this.$emit('menuSlideEnable');

        },
        onSlideChange(obj) {
            this.$emit('menuSlideEnable');

        }

    },

}
</script>


<style lang="scss" scoped>
.overlay-box {
    width: 100%;
    text-align: center;
    padding-top: 200px;

}

.goodslist-page-container {
    .subsub-category {
        margin: 15px 0 5px 0;
        display: flex;
        flex-wrap: wrap;

        .subsub-item {
            border: solid 1px #ccc;
            padding: 3px 10px;
            font-size: 12px;
            border-radius: 5px;
            margin-right: 8px;

            &.active {
                border: solid 1px #dd731a;
                color: #dd731a;
            }
        }
    }

    .product-price {
        font-size: 12px;
        color: #000;
        font-weight: bold;
        margin: 0 10px 0 0;
    }

    .product-discount {
        margin-right: 5px;
    }


    .categoryList {
        padding: 17px;
        width: calc(100vw);
        background: #f3f3f3;

        .category-item {
            width: auto;
            max-height: 32px;
            padding: 0 15px;
            line-height: 32px;
            text-align: center;
            margin-bottom: 0;

            &.gblank {
                border: none;
                background: #f3f3f3;
            }
        }
    }

    .img-box {
        width: 100%;
        height: 169px;
    }

    .category-list {
        background-color: #f3f3f3;
        padding: 17px;
        overflow-x: scroll;
        display: grid;
        grid-auto-columns: max-content;
        grid-auto-flow: column;
        column-gap: 12px;
        height: 67px;
    }

    .gblank-box {
        width: 100px;
        height: 30px;
    }

    .category-item {
        background-color: white;
        border-radius: 18px;
        padding: 5px 15px;
        color: #555;
        font-weight: 200;

    }

    .category-item-active {
        background-color: black;
        color: white;
        font-weight: 200;
    }

    .suggest-section {
        padding: 18px;
    }

    .suggest-section-list {
        overflow-x: scroll;
        grid-auto-columns: max-content;
        /* margin: 17px 0; */
        padding: 17px 0;
    }

    .suggest-section-list::-webkit-scrollbar {
        display: none;
    }

    .suggest-section-list img {
        border-radius: 50%;
        margin-bottom: 11px;
    }

    .suggest-section-item {
        width: calc(33.33% - 17.5px);
        flex-shrink: 0;
        margin-right: 25px;
    }

    .suggest-section-item img {
        width: 100%;
        height: 100%;
    }

    .wrap-btn {
        color: #8097e6;
        font-size: 10px;
        border: 1px solid #8097e6;
        height: 17px;
        margin-top: 5px;
        padding: 0 5px;
        border-radius: 2.5px;
    }

    .wrap-btn-ad {
        border: 1px solid #b6b6b6;
        color: #b6b6b6;
    }

    .wrap-image-ad {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 11px;
        background-position: center;
        background-size: cover;
    }

    .wrap-image-ad i {
        color: white;
        font-size: 22px;
        z-index: 10;
    }

    .order-section-post p {
        color: #333;
        font-size: 13px;
    }
}
</style>