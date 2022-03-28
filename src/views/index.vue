<template>
    <div style="background:#fafafa;width:100%;">
        <div style="overflow-x:hidden;max-width:500px;margin:auto;background: #fff;">
            <header class="sub-header" v-if="topClass=='sub'">
                <div class="shadow">
                    <div class="flex flex-row header items-center">
                        <div class="flex flex-row items-center">
                            <img @click="goBack()" src="../assets/icons/back.svg"/>
                            <span class="ml-2 text-lg">{{ title }}</span>
                        </div>
                    </div>
                </div>
            </header>
            <header v-else-if="topClass=='goodsDetail'">
                <div class="shadow">
                    <div class="flex flex-row header justify-between items-center">
                        <div class="flex flex-row items-center">
                            <img src="../assets/icons/back.svg" @click="goBack()"/>
                            <span class="ml-2 text-lg" v-if="title">{{ title }}</span>
                        </div>
                        <div class="flex flex-row right-flex">
                            <img @click="goPage('/vgoods/search')" src="../assets/icons/search.svg" class="searchIcon"/>
                            <div class="wrapCart" @click="goCart()" id="view_cart_topmenu">
                                <div class="wrapNumber">
                                    <p class="number" style="padding-top:15px;">{{ cartCnt }}</p>
                                </div>
                                <img src="../assets/icons/cartMenu.svg" class="cartIcon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <keep-alive include="siteMain,mypageOrder,mypageRetrunList,goodsSearch">
                <router-view/>
            </keep-alive>
        </div>
    </div>
</template>
<script>

import AUTH from '../api/auth';
import {mapActions, mapGetters} from "vuex";
import apiService from '../api/apiService'
import {
    API_URL_GET_CART_INFO,
    API_URL_UPDATE_MEMBER_APIINFO,
    API_URL_GET_MEMBER_APIINFO
} from '../api/urls'

//const {Kakao} = window;

export default {
    computed: {
        ...mapGetters('mobile', ["getClass", "getTitle", "getBackUrl"]),
        ...mapGetters('config', ["getListScroll", "getNewCartCnt"]),
    },
    watch: {
        '$route'(to, from) {
            //console.log(to,from)
            this.setConfig();
            switch (to.name) {
                case 'mypageReview':
                    if (from.name != 'mypageReviewRegist') {
                        sessionStorage.setItem('reviewTabCode', '');
                    }
                    break;
                case 'mypageOrder':
                    switch (from.name) {
                        case 'mypageShop':
                        case 'mypageCancel':
                        case 'mypageReturn':
                        case 'mypageExchange':
                            this.$eventBus.$emit('myorderPageReload', from.name);
                            break;
                    }
                    break;
                case 'mypageRetrunList':
                    switch (from.name) {
                        case 'mypageShop':
                            this.$eventBus.$emit('myreturnPageReload');
                            break;
                    }
                    break;
                case 'siteMain':
                    switch (from.name) {
                        case 'goodsView':
                        case 'eventPlanView':
                        case 'customerAgree':
                        case 'customerDirectNoticeList':
                        case 'customerEventView':
                            break;
                        default:
                            this.$eventBus.$emit('mainPageReload');
                            break;
                    }
                    break;
                case 'goodsSearch':
                    if (from.name != 'goodsView') {
                        this.$eventBus.$emit('searchPageReload');
                    }
                    break;
            }
        },
        getClass(val) {
            this.topClass = val;
        },
        getTitle(val) {
            this.title = val;
            if (this.topClass != this.getClass) this.topClass = this.getClass;
        },
        getBackUrl(val) {
            this.backUrl = val;
        },
        getNewCartCnt(val) {
            this.cartCnt = val;
        },
        getListScroll(val) {
            this.scrollHandling = val;
        }
    },
    data() {
        return {
            drawer: false,
            isLogin: false,
            topClass: 'main',
            title: '',
            backUrl: '',
            scrollHandling: false,
            memberInfo: {},
            cartCnt: 0,


        };
    },
    created() {

        apiService.setApp(this);
        this.$eventBus.$on('getAppLoginUserInfo', this.getAppLoginUserInfo);
        let path = this.$route.path.split('/');
        this.$eventBus.$on('updateApiMemberInfo', this.updateApiMemberInfo);

        if (window.ReactNativeWebView) {
            sessionStorage.setItem('appMemeberReceive', false);
            window.ReactNativeWebView.postMessage('getLoggedInUserId');
            AUTH.setDevice('app');
            AUTH.dataEmpty()

        } else {
            AUTH.setDevice('web');
            this.setConfig();
        }

    },
    methods: {
        ...mapActions('config', ["setNewCartCnt", "setAppUserComplete"]),
        goBack() {

            if (this.backUrl) {
                if (this.backUrl == 'locationMain') {
                    location.href = '/';
                } else {
                    this.$router.push(this.backUrl);
                }

            } else {
                this.$router.back();
            }
        },
        setConfig() {
            const frm = {}
            apiService.get(API_URL_GET_CART_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.info) {
                        this.setNewCartCnt(res.data.info.length);
                        this.cartCnt = res.data.info.length;
                    }

                    // this.categorys = res.data.info.categorys;
                }
            });
        },

        snsShare(snsParams) {
            let sns_share_url = snsParams.currentUrl;
            let protocol = document.location.protocol;
            let hostName = document.location.hostname;

            let url = encodeURIComponent('https://gillo.co.kr/' + sns_share_url);
            let title = encodeURIComponent(snsParams.title);
            let img = (snsParams.img) ? snsParams.img : '';
            switch (snsParams.stype) {
                case 'fb':
                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url);
                    break;
                case 'ko':
                    this.shareKakaoLink(snsParams, url);
                    break;
                case 'nb':
                    window.open('https://band.us/plugin/share?body=' + title + encodeURIComponent("\n") + url + '&route=' + url, 'bandsharedialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
                    break;
                case 'ln':
                    window.open('https://social-plugins.line.me/lineit/share?url=' + url);
                    break;
            }
        },
        shareKakaoLink(params, sharedUrl) {
            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: params.title,
                    description: params.title,
                    imageUrl: (params.img) ? params.img : '',
                    link: {
                        webUrl: sharedUrl,
                        mobileWebUrl: sharedUrl,
                    },
                },
                buttons: [
                    {
                        title: '자세히 보기',
                        link: {
                            webUrl: sharedUrl,
                            mobileWebUrl: sharedUrl,
                        },
                    },
                ],
            });
        },
        goPage(url) {
            this.$router.push(url);
        },
        goCart() {
            this.$router.push('/vcart');

        },
        getAppLoginUserInfo(params) {
            let checkConfig = false;
            if (AUTH.checkAppMemberInfo(params.userId.toString())) {
                this.setConfig();
                checkConfig = true;
            }
            const frm = new FormData()
            frm.append('userId', params.userId.toString())
            apiService.post(API_URL_GET_MEMBER_APIINFO, frm, (res) => {
                if (res.data.result == 'success') {
                    AUTH.setSession(res.data.info);
                    if (!checkConfig) {
                        this.setConfig();
                    }
                    this.setAppUserComplete(true);
                }

            });
        },
        updateApiMemberInfo(params) {
            const frm = new FormData()
            frm.append('nickname', params.name)
            frm.append('marketing', params.market)
            apiService.post(API_URL_UPDATE_MEMBER_APIINFO, frm, (res) => {

            });
        }

    }

}
</script>

<style lang="css">
@import "../assets/style/header.css";
@import "../assets/style/common.css";
@import "../assets/style/bottom_menu.css";
@import "../assets/style/store_hamburger_bar.css";

.shop-button {
    height: 50px !important;
    font-size: 15px !important;
}

.text-cut-1 {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}

.dashline {
    border: 1px dashed #dcdcdc;
    border-radius: 5px;
    color: #8f8f8f;
    font-size: 12px;
}

</style>

<style lang="scss" scoped="true">


.menu-box {
    border-radius: 20px 0 0 20px;
    background: #fff;
    max-height: calc(100vh);
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
}

header {


}

.sub-header {
    padding: 32px 20px 0 20px;
}

.right-flex {
    justify-content: flex-end;
}

</style>