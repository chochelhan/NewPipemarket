<template>
    <div class="page-contents" style="background-color: #000;min-height:calc(100vh);padding:0;">
        <div class="img-header">
            <div class="text">
                <div>{{ swiperIndex }} / {{ imgs.length }}</div>
            </div>
            <i class="fas fa-times" @click="$router.back()"></i>
        </div>
        <div class="img-layout">
            <swiper :options="swiperOptions" ref="contentSwiper" @slideChangeTransitionStart="updateSwiperIndex">
                <swiper-slide v-for="(img,index) in imgs" :key="index">
                    <div class="img-box" style="text-align:center;">
                        <img class="img" :src="img">
                    </div>
                </swiper-slide>
            </swiper>
        </div>

    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    computed: {
        contentSwiper() {
            return this.$refs.contentSwiper.$swiper;
        }
    },
    data() {
        return {
            imgs: [],
            swiperIndex: 1,
            swiperOptions: {
                slidesPerView: 1,
                autoHeight:true,
            },
        };
    },
    created() {
        this.setClass('none')
        this.setTitle('');
        this.setBackUrl('');
        const index = this.$route.params.index;
        this.getData(index)
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData(index) {
            if (sessionStorage.getItem('reviewImgs')) {
                this.imgs = JSON.parse(sessionStorage.getItem('reviewImgs'));
                if(index>0) {
                    this.swiperOptions.initialSlide = index;
                    this.swiperIndex = parseInt(index) + 1;
                   // setTimeout(()=>{
                     //   this.contentSwiper.slideTo(index);
                    //},400)
                }

            } else {
                this.$router.back();
            }

        },
        updateSwiperIndex(obj) {
            this.swiperIndex = obj.activeIndex + 1;
        }
    }

}
</script>
<style lang="scss" scoped>
.img-layout {
    padding-top:140px;
    .img-box {
        height: calc(100vh - 140px);
        overflow: hidden;
        .img {
            max-width: 100%;
            margin: auto;

        }
    }
}

.img-header {
    color: #fff;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50px;
    width: calc(100vw - 50px);
    margin-left:25px;
    border:solid 1px #000;
    i {
        font-size:17px;
    }

}

</style>