<template>
    <div class="page-contents" style="max-width:500px;overflow-x:hidden;">
        <div class="main-header">
            <div class="top-header">
                <div class="flex flex-row justify-between items-center">
                    <img src="../../assets/icons/pirimarketLogo.svg"  @click="goHome()"/>
                    <div class="flex flex-row" style="justify-content: flex-end">
                        <img src="../../assets/icons/search.svg" @click="goPage('/vgoods/search')" class="searchIcon"/>
                        <div class="wrapCart" @click="goCart()" id="view_cart_topmenu">
                            <div class="wrapNumber">
                                <p class="number" style="padding-top:15px;">{{ cartCnt }}</p>
                            </div>
                            <img src="../../assets/icons/cartMenu.svg" class="cartIcon"/>
                        </div>
                        <img @click="menuOpen()"
                             src="../../assets/icons/hamburgerMenu.svg"
                             class="hamburgerIcon"
                        />
                    </div>
                </div>
            </div>
            <div class="sub-header">
                <div class="items-center border-b">
                    <swiper :options="swiperMenuOptions" ref="menuSwiper">
                        <swiper-slide style="width:auto;" :id="'category'+cate.cid" v-for="(cate,index) in menuCategorys">
                            <div :class="'menu-item '+cate.gclass" @click="goCategory(cate.cid,index)" style="cursor:pointer ">
                                <p >{{ cate.cname }}</p>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
        <div id="bgMenu" class="modal  hidden" @click="menuHide()"></div>
        <div id="drawerMenu" class="modal-menu flex flex-col justify-between">
            <div>
                <div class="flex flex-row justify-end button-close">
                    <img
                        src="../../assets/icons/close.svg"
                        @click="menuHide()"
                    />
                </div>
                <div v-if="isLogin">
                    <div class="mt-3.5 flex">
                        <div class="username-section mr-2">{{ memberInfo.name }}님,</div>
                    </div>
                    <div class="text-15 mt-3">
                        오늘도 즐거운 쇼핑 하세요
                    </div>
                </div>
                <div v-else>
                    <div class="mt-3.5 flex" @click="goPage('/vmember/login')">
                        <div class="username-section mr-2">로그인해주세요</div>
                        <img src="../../assets/icons/goto.svg" alt=""/>
                    </div>
                    <div class="text-15 mt-3">
                        회원가입 후 카카오톡 플러스 친구를 추가해주시면
                        <b>5,000원 쿠폰</b>을 드립니다!
                    </div>
                </div>
                <div class="mt-5 grid grid-cols-3 gap-30" style="justify-content: space-between" >
                    <div class="flex flex-col items-center py-3" id="myshopping_menu" @click="goMyShopiing()" style="cursor:pointer">
                        <img src="../../assets/icons/menuMyshopping.svg"/>
                        <div class="mt-1.5 menu-item">마이쇼핑</div>
                    </div>
                    <div class="flex flex-col items-center py-3 border-l border-r" id="mydelivery_menu" @click="goMyDelivery()" style="cursor:pointer">
                        <img src="../../assets/icons/menuDelivery.svg"/>
                        <div class="mt-1.5 menu-item">배송정보</div>
                    </div>
                    <div class="flex flex-col items-center py-3" id="myfavorite_menu" @click="goMyFavorite()" style="cursor:pointer ">
                        <img src="../../assets/icons/menuHeart.svg"/>
                        <div class="mt-1.5 menu-item">찜목록</div>
                    </div>
                </div>

                <div class="mt-6">
                    <ul class="mb-5" style="padding:0;">
                        <li class="category flex flex-row justify-between" @click="subMenuShow('menu-category')">
                            <div class="category-name">카테고리</div>
                            <img src="../../assets/icons/chevronDown.svg"/>
                        </li>
                        <li class="subcategory" id="menu-category">
                            <ul class="mt-2.5 list-subcategory grid grid-col gap-5">
                                <li class="flex flex-row justify-between" v-for="cate in categorys"
                                    @click="goCategoryMenu(cate.cid,cate.activeIndex)" style="cursor:pointer ">
                                    <div class="subcategory-name">{{ cate.cname }}</div>
                                    <img src="../../assets/icons/chevronRight.svg"/>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="mb-5" style="padding:0;">
                        <li class="category flex flex-row justify-between" @click="goSpecial()" style="cursor:pointer ">
                            <div class="category-name">기획전</div>
                            <!--img src="../../assets/icons/chevronUp.svg"/ -->
                        </li>
                    </ul>
                    <ul class="mb-5" style="padding:0;">
                        <li class="category flex flex-row justify-between" @click="subMenuShow('menu-customer')">
                            <div class="category-name">고객센터</div>
                            <img src="../../assets/icons/chevronDown.svg"/>
                        </li>
                        <li class="subcategory" id="menu-customer">
                            <ul class="mt-2.5 list-subcategory grid grid-col gap-5">
                                <li class="flex flex-row justify-between" @click="goCustomer('noticeList')" style="cursor:pointer ">
                                    <div class="subcategory-name">공지사항</div>
                                    <img src="../../assets/icons/chevronRight.svg"/>
                                </li>
                                <li class="flex flex-row justify-between" @click="goCustomer('faqList')" style="cursor:pointer ">
                                    <div class="subcategory-name">FAQ</div>
                                    <img src="../../assets/icons/chevronRight.svg"/>
                                </li>
                                <li class="flex flex-row justify-between" @click="goEvent()" style="cursor:pointer ">
                                    <div class="subcategory-name">이벤트</div>
                                    <img src="../../assets/icons/chevronRight.svg"/>
                                </li>
                                <li class="flex flex-row justify-between" @click="goCustomer('review')" style="cursor:pointer ">
                                    <div class="subcategory-name">리뷰</div>
                                    <img src="../../assets/icons/chevronRight.svg"/>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-row items-center justify-center connect-kakao" style="max-height:40px;cursor:pointer" @click="goKakao()">
                <img src="../../assets/icons/kakaotalk.svg"/>
                <span class="label-kakao">카카오톡으로 문의하기</span>
            </div>
        </div>
        <swiper :options="swiperContentOptions" ref="contentSwiper"
                @slideChangeTransitionStart="contentSwiperStart">
            <swiper-slide v-for="(cate,index) in menuCategorys">
                <Home class="page-width-limit" @goSpecial="goSpecial" @menuSlideEnable="menuSlideEnable" @menuSlideDisable="menuSlideDisable" v-if="cate.cid=='home'"></Home>
                <Best class="page-width-limit" :currentSlideIndex="index" :activeContentIndex="activeContentIndex"  :sortCode="bestSortCode" v-else-if="cate.cid=='best'"></Best>
                <Special class="page-width-limit"  :currentSlideIndex="index" :activeContentIndex="activeContentIndex"  @menuSlideEnable="menuSlideEnable" @menuSlideDisable="menuSlideDisable"  v-else-if="cate.cid=='special'"></Special>
                <Event class="page-width-limit"  :currentSlideIndex="index" :activeContentIndex="activeContentIndex"  v-else-if="cate.cid=='event'"></Event>
                <GoodsList class="page-width-limit" :currentSlideIndex="index" :activeContentIndex="activeContentIndex"  @menuSlideEnable="menuSlideEnable" @menuSlideDisable="menuSlideDisable" :sortCode="cate.sortCode" :cid="cate.cid" v-else></GoodsList>

            </swiper-slide>
        </swiper>
        <div class="scroll-up shadow-lg" style="z-index:20;bottom:30px;" @click="scrollUp()">
            <i class="fa fa-angle-up" aria-hidden="true"></i>
        </div>

        <div v-if="bannerShowList" class="fixed top-0 left-0 bg-black bg-opacity-60 w-full h-full"
             style="z-index:88;overflow-y:auto;">
            <div class="banner-list-box">
                <i style="color:#fff;font-size: 20pt;" @click="hideBanner()" class="fas fa-times"></i>
                <div class="banner-item" v-for="(banner,index) in bannerList" @click="goBannerLink(banner.link)"
                     :style="{'width':'100%','height':'420px','background':'url('+banner.img+') no-repeat','background-position':'center center','background-size':'cover'}">
                </div>
            </div>
        </div>


        <div
            style="z-index:30"
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
        bgbox500
        h-full">
            <div
                class="purchase-box bg-white relative rounded-t-2xl"
                style="transform: translateY(0)" id="selectFilter"
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

import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import JQ from "jquery"
import Home from './slide/home';
import GoodsList from './slide/goodsList';
import Best from './slide/best';
import Special from './slide/special';
import Event from './slide/event';

import {mapActions, mapGetters} from "vuex";
import AUTH from '../../api/auth'
import {
    API_URL_GET_SITE_INFO
} from '../../api/urls';
import apiService from '../../api/apiService'

export default {
    name: 'siteMain',
    components: {
        Swiper,
        SwiperSlide,
        Home,
        GoodsList,
        Best,
        Special,
        Event
    },
    computed: {
        ...mapGetters('config', ["getNewCartCnt","getAppUserComplete"]),
        menuSwiper() {
            return this.$refs.menuSwiper.$swiper
        },
        contentSwiper() {
            return this.$refs.contentSwiper.$swiper
        }
    },
    watch: {
        getNewCartCnt(val) {
            this.cartCnt = val;
        },
        getAppUserComplete(val) {
            let memberInfo = AUTH.getSession();
            if (memberInfo) {
                this.memberInfo = memberInfo;
                this.isLogin = true;
            }
        }
    },
    data() {
        return {
            bannerShowList: false,
            bannerList: [],
            drawer: false,
            isLogin: false,
            memberInfo: {},
            contentActiveIndex: 0,
            menuCategorys: [],
            contentCid: 'home',
            categorys: [],
            bestSortCode: '3mon',
            cartCnt: 0,
            swiperMenuOptions: {
                slidesPerView: 'auto',
            },
            swiperContentOptions: {
                slidesPerView: 1,
            },
            sortList: [],
            sortView: false,
            sortTypeCode: '',
            goodsSortCid: '',
            specialIndex: '',
            eventIndex:'',
            pageInit: false,
            reloadInit:false,
            activeContentIndex:0,
            serverFlag:false,
        }
    },
    created() {

        this.$eventBus.$on('mainPageReload', this.reload);
        this.$eventBus.$on('forceLogOut', this.forceLogOut);
        this.$eventBus.$on('setBannerList', this.setBannerList);
        this.$eventBus.$on('setSort', this.setSortList);

        this.setClass('main')
        this.setTitle('');
        this.setBackUrl('');
        //if(AUTH.device == 'web') {
            let memberInfo = AUTH.getSession();
            if (memberInfo) {
                this.memberInfo = memberInfo;
                this.isLogin = true;
            }
        //}

    },
    activated() {

        this.$eventBus.$on('forceLogOut', this.forceLogOut);
        this.$eventBus.$on('setBannerList', this.setBannerList);
        this.$eventBus.$on('setSort', this.setSortList);

        this.setClass('main')
        this.setTitle('');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.memberInfo = memberInfo;
            this.isLogin = true;
        } else {
            this.memberInfo = {};
            this.isLogin = false;
        }
        if(!this.pageInit) {
            /*
            if(AUTH.device == 'web')this.getData()
            else {
                if(!sessionStorage.getItem('appMemeberReceive')) {
                    if(this.menuCategorys.length<1) {
                        if(this.isLogin)this.getData()
                    }
                }
            }

             */
            this.getData()

        } else {
            if(this.menuCategorys.length<1 && !this.reloadInit) {
                if(AUTH.device == 'web') {
                    this.getData()
                } else {
                    if(this.isLogin)this.getData()
                }

            }
        }

    },
    deactivated() {
        this.$eventBus.$off('forceLogOut');
        this.$eventBus.$off('setBannerList');
        this.$eventBus.$off('setSort');
        JQ('.page-width-limit').off('scroll');
        JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('config', ["setListScrollMore"]),
        initData() {
                this.bannerShowList = false;
                this.bannerList = [];
                this.drawer = false;
                this.contentActiveIndex = 0
                this.menuCategorys =  []
                this.contentCid = 'home';
                this.categorys = [];
                this.bestSortCode = '3mon';
                this.swiperMenuOptions = {
                    slidesPerView: 'auto',

                };
                this.swiperContentOptions = {
                    slidesPerView: 1,
                };
                this.sortList = []
                this.sortView = false;
                this.sortTypeCode = ''
                this.goodsSortCid = ''
                this.specialIndex = ''
                this.eventIndex = '';

        },
        goHome() {
          location.href = '/';
        },
        reload() {
            this.reloadInit = true;
            this.initData()
            this.getData()
        },
        menuSlideDisable() {
            this.menuSwiper.allowTouchMove= false;
            this.contentSwiper.allowTouchMove = false;

        },
        menuSlideEnable() {
            setTimeout(()=>{
                this.menuSwiper.allowTouchMove= true;
                this.contentSwiper.allowTouchMove = true;
            },500)

        },
        getData() {
            if(this.serverFlag)return;
            const frm = {}
            apiService.get(API_URL_GET_SITE_INFO, frm, (res) => {
                this.serverFlag = false;
                if (res.data.result == 'success') {

                    this.menuCategorys.push({cname: '홈', cid: 'home', gclass: 'menu-item-active'})
                    this.menuCategorys.push({cname: 'BEST', cid: 'best', gclass: ''})
                    let k = 2;
                    for (let item of res.data.info.categorys) {
                        item.activeIndex = k;
                        this.categorys.push(item);
                        item.glcass = '';
                        item.sortCode = 'sale'
                        this.menuCategorys.push(item);
                        k++;
                    }
                    this.specialIndex = k;
                    this.menuCategorys.push({cname: '기획전', cid: 'special', gclass: ''})
                    this.eventIndex = k +1;
                    this.menuCategorys.push({cname: '이벤트', cid: 'event', gclass: 'margin30'})
                    this.pageInit = true;
                }
            });
        },
        scrollUp() {
            JQ('.page-width-limit').animate({
                scrollTop:0
            },300,()=>{
                this.pageScrollTop();
            })

        },
        goSpecial() {
            this.contentSwiper.slideTo(this.specialIndex);
            this.menuHide();
        },
        goEvent() {
            this.contentSwiper.slideTo(this.eventIndex);
            this.menuHide();
        },
        goCart() {
            this.$router.push('/vcart');
        },
        goCategory(cid, activeIndex) {
            if (this.contentCid != cid) {
                this.contentCid = cid;
                this.contentSwiper.slideTo(activeIndex);
                JQ('.page-width-limit').scrollTop(0)
                this.pageScrollTop();
            }
        },
        goCategoryMenu(cid, activeIndex) {
            if (this.contentCid != cid) {
                this.contentCid = cid;
                this.contentSwiper.slideTo(activeIndex);
                JQ('.page-width-limit').scrollTop(0)
                this.pageScrollTop();

            }
            this.menuHide();
        },
        goPage(url) {
            this.$router.push(url);
        },
        goBannerLink(link) {
            if (link) {
                this.$router.push(link);
            }

        },
        setBannerList(params) {
            this.bannerList = params.list;
            this.bannerShowList = true;
            let clientHeight = JQ(window).height();
            JQ('body').css({'max-height': clientHeight + 'px', 'overflow': 'hidden'})
        },
        hideBanner() {
            this.bannerShowList = false;
            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})

        },
        contentSwiperStart(obj) {
            let activeContentIndex = obj.activeIndex;
            let cid = '';
            for (let index in this.menuCategorys) {
                let item = this.menuCategorys[index];
                let margin = '';
                if(item.gclass == 'margin30') {
                    margin = 'margin30 ';
                }
                if (activeContentIndex == index) {
                    item.gclass = margin+'menu-item-active';
                    cid = item.cid;
                } else {
                    item.gclass = margin;
                }
                this.$set(this.menuCategorys, index, item)

            }
            this.contentCid = cid;
            this.menuSwiper.slideTo(activeContentIndex);
            this.activeContentIndex = activeContentIndex;
            JQ('.page-width-limit').scrollTop(0)
            this.pageScrollTop();
        },
        goMyShopiing() {
            if (this.isLogin) {
                this.$router.push('/vmypage/myshop')
            } else {
                this.$router.push('/vmember/login');
            }
        },
        goMyDelivery() {
            if (this.isLogin) {
                this.$router.push('/vmypage/myorder/DI')
            } else {
                this.$router.push('/vmember/login');
            }
        },
        goMyFavorite() {
            if (this.isLogin) {
                this.$router.push('/vmypage/myfavorite')
            } else {
                this.$router.push('/vmember/login');
            }
        },
        menuHide() {
            if(JQ(window).width()>=500) {

                JQ('#drawerMenu').animate({
                    right: '-400',
                    opacity:0,
                }, 200);
            } else {

                JQ('#drawerMenu').animate({
                    right: '-87%',
                }, 200);
            }
            JQ('#bgMenu').hide();
            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
        },
        menuOpen() {
            let clientHeight = JQ(window).height();
            JQ('body').css({'max-height': clientHeight + 'px', 'overflow': 'hidden'})
            JQ('#bgMenu').show();
            JQ('#menu-category').show();
            if(JQ(window).width()>=500) {

                JQ('#drawerMenu').animate({
                    right: 0,
                    opacity:1,
                }, 300);
            } else {
                JQ('#drawerMenu').animate({
                    right: 0,
                }, 300)
            }
            //width: 87%;

        },
        subMenuShow(id) {
            switch (id) {
                case 'menu-category':
                    if (JQ('#menu-customer').css('display') != 'none') {
                        JQ('#menu-customer').slideUp();
                    }
                    if (JQ('#menu-category').css('display') != 'none') {
                        JQ('#menu-category').slideUp();
                    } else {
                        JQ('#menu-category').slideDown();
                    }
                    break;
                case 'menu-customer':
                    if (JQ('#menu-category').css('display') != 'none') {
                        JQ('#menu-category').slideUp();
                    }
                    if (JQ('#menu-customer').css('display') != 'none') {
                        JQ('#menu-customer').slideUp();
                    } else {
                        JQ('#menu-customer').slideDown();
                    }
                    break;
            }
        },
        goCustomer(cmd) {
            this.$router.push('/vcustomer/' + cmd)
        },
        forceLogOut() {
            this.memberInfo = {};
            this.isLogin = false;
        },
        setSortList(params) {
            let code = '';
            this.sortTypeCode = params.pageCode;
            switch (params.pageCode) {
                case 'best':
                    this.sortList = [
                        {code: '1day', name: '1일', gclass: ''},
                        {code: '1week', name: '1주일', gclass: ''},
                        {code: '1mon', name: '1개월', gclass: ''},
                        {code: '3mon', name: '3개월', gclass: ''},
                        {code: '6mon', name: '6개월', gclass: ''},
                        {code: 'all', name: '전체', gclass: ''},
                    ]
                    code = this.bestSortCode;
                    break;
                case 'goods':
                    this.sortList = [
                        {code: 'sale', name: '인기순', gclass: ''},
                        {code: 'low', name: '최저가순', gclass: ''},
                        {code: 'high', name: '최고가순', gclass: ''},
                        {code: 'regdate', name: '최신순', gclass: ''},
                    ]
                    for (let item of this.menuCategorys) {
                        if (item.cid == params.cid) {
                            code = item.sortCode;
                        }
                    }
                    this.goodsSortCid = params.cid;

                    break;
            }
            for (let item of this.sortList) {
                if (code == item.code) item.gclass = 'font-semibold';
            }
            this.sortView = true;
        },
        sortGoods(code) {
            if (this.sortTypeCode == 'best') this.bestSortCode = code;
            else {
                let index = 0;
                for (let item of this.menuCategorys) {
                    if (item.cid == this.goodsSortCid) {
                        item.sortCode = code;
                    }
                    this.$set(this.menuCategorys, index, item)
                    index++;
                }
            }
            this.sortView = false;
        },
        pageScrollTop() {
            let winHeight = JQ(window).height();
            JQ('.main-header').css('top', 0);
            let height = winHeight - 122;
            JQ('.top-header').show()
            JQ('.main-header .sub-header').css('padding-top', '25px');
            JQ('.page-width-limit').css({
                marginTop: '122px',
                minHeight: height,
                maxHeight: height,
            });
        },
        goKakao() {
            location.href = 'https://pf.kakao.com/_xexmCxmK/chat';
        }


    },
    destroyed() {
        this.$eventBus.$off('forceLogOut');
        this.$eventBus.$off('setBannerList');
        this.$eventBus.$off('setSort');
        JQ('.page-width-limit').off('scroll');
        JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
    },
    mounted() {


    },
    updated() {


        if(this.reloadInit) {
            JQ('.page-width-limit').scrollTop(0)
            JQ('#drawerMenu').css('right','-87%');
            JQ('#bgMenu').hide();
            JQ('body').css({'max-height': 'auto', 'overflow': 'visible'})
            this.reloadInit = false;
        }

        let winHeight = JQ(window).height();
        let obj = this;
        let lastTop = 0;
        JQ('.page-width-limit').on('scroll',function(e) {
            e.preventDefault();
            let top = e.target.scrollTop;

            let targetHeight = JQ(this).prop('scrollHeight') - JQ(this).height() -180;
            let checkMore = false;
            if(targetHeight < top) {
                checkMore = true;
                obj.setListScrollMore(top);
            }

            if (lastTop>0 && top > lastTop) {
                //JQ('.main-header').animate({
                  //  top: -70,
                //}, 100, function () {
                    JQ('.main-header').css('top','-15px');
                    let height = winHeight - 58;
                    JQ('.top-header').hide()
                    JQ('.main-header .sub-header').css('padding-top', '32px');
                    JQ('.page-width-limit').css({
                        marginTop: '58px',
                        minHeight: height,
                        maxHeight: height,
                    });

                //})
            } else {
                let bottomCheck = JQ(this).prop('scrollHeight')  - JQ(this).height();
                if(bottomCheck >=top && !checkMore) {
                    obj.pageScrollTop();
                }

            }
            lastTop = top;



        })
    }

}
</script>

<style lang="scss" scoped>

@import "../../assets/style/store_main.css";

#drawerMenu {
    right: -87%;
    z-index: 1000;
}

.menu-box {
    border-radius: 20px 0 0 20px;
    background: #fff;
    max-height: calc(100vh);
}

header {
    width:100%;
    padding-top: 66px;
}

.header {
    width:100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
}

.page-width-limit {
    margin-top: 122px;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden;
    min-height: calc(100vh - 122px);
    max-height: calc(100vh - 122px);
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
    }
}

.banner-list-box {
    margin-top: 100px;
    text-align: center;

    i {
        margin-bottom: 20px;
    }

    .banner-item {
        margin-bottom: 20px;
    }
}

.main-header {
    position: fixed;
    z-index:10;
/*    height: 156px;
    max-height:110px;*/
    height:auto;
    max-width:500px;
    width:100%;
    border-bottom:none;
    .top-header {
        padding:20px;
        width: 100%;
        background: #fff;
        /*
        height: 78px;
         */
        height: 62px;
        box-shadow: 0 8px 10px 0px rgba(0, 0, 0, 0.05);
        position:relative;
        z-index:10;
    }

    .sub-header {
        background: #fff;
        border-bottom:none;
        max-width:500px;
        width:100%;
        padding-top: 25px;
        overflow-x:hidden;
        .menu-item {
            width: auto;
            margin-right:5px;
            &.margin30 {
                margin-right:30px;
            }
            &.menu-item-active {
                border-bottom: solid 2px #000;

                p {
                    color: #000;
                    font-weight: bold;
                }
            }

            &:first-child {
                margin-left: 25px;
            }
        }
    }

}
@media only all and (min-width: 500px) {
    #bgMenu {
        max-width:500px;
        margin-left:calc((100vw /2) - 260px);
        width:500px;

    }
    #drawerMenu {
        max-width:400px;
        right:-400px;
        opacity: 0;
        overflow:hidden;
        margin-right:calc((100vw/2) - 267px);
    }
    .bgbox500 {
        max-width:500px;
        margin-left:calc((100vw /2) - 260px);
        width:500px;
    }

}
</style>