import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: () => import("../views/index"),
        redirect: `/main`,
        children: [
            {
                path: "main",
                name: "siteMain",
                component: () => import("../views/main/main"),
            },
            {
                path: "vmember/login",
                name: "memberLogin",
                component: () => import("../views/member/login"),
            },
            {
                path: "vmember/findpw",
                name: "memberFindpw",
                component: () => import("../views/member/findPw"),
            },
            {
                path: "vmember/join",
                component: () => import("../views/member/join"),
                redirect: `vmember/join/agree`,
                children: [
                    {
                        path: "agree",
                        name: "memberAgree",
                        component: () => import("../views/member/join/agree"),
                    },
                    {
                        path: "step1",
                        name: "memberStep1",
                        component: () => import("../views/member/join/step1"),
                    },
                    {
                        path: "step2",
                        name: "memberStep2",
                        component: () => import("../views/member/join/step5"),
                    },
                    {
                        path: "snsStep",
                        name: "memberSnsStep",
                        component: () => import("../views/member/join/step3"),
                    },
                   /*
                    {
                        path: "step4",
                        name: "memberStep4",
                        component: () => import("../views/member/join/step4"),
                    },
                    {
                        path: "step5",
                        name: "memberStep5",
                        component: () => import("../views/member/join/step5"),
                    },

                    */


                ]
            },
            {
                path: "vgoods/goodsView/:id",
                name: "goodsView",
                component: () => import("../views/goods/goodsView"),
            },
            {
                path: "vgoods/tempGoodsView/:id",
                name: "tempGoodsView",
                component: () => import("../views/goods/tempGoodsView"),
            },
            {
                path: "vgoods/registQna/:pid",
                name: "registQna",
                component: () => import("../views/goods/qnaRegist"),
            },
            {
                path: "vgoods/listQna/:pid",
                name: "listQna",
                component: () => import("../views/goods/qnaList"),
            },

            {
                path: "vgoods/listReview/:pid",
                name: "listReview",
                component: () => import("../views/goods/reviewList"),
            },
            {
                path: "vgoods/reviewView/:ix",
                name: "reviewView",
                component: () => import("../views/goods/reviewView"),
            },
            {
                path: "vgoods/reviewImg/:index",
                name: "reviewView",
                component: () => import("../views/goods/reviewImg"),
            },
            {
                path: "vgoods/search",
                name: "goodsSearch",
                component: () => import("../views/goods/search"),
            },
            {
                path: "vcart",
                name: "cart",
                component: () => import("../views/cart/cart"),
            },
            {
                path: "vorder/:cartIdx",
                name: "orderInput",
                component: () => import("../views/order/orderInput"),
                children: [
                    {
                        path: "orderInfo",
                        name: "orderInfo",
                        component: () => import("../views/order/orderInfo"),
                    },
                    {
                        path: "receiveInfo",
                        name: "receiveInfo",
                        component: () => import("../views/order/receiveInfo"),

                    },
                    {
                        path: "receiveInfoForm",
                        name: "receiveInfoForm",
                        component: () => import("../views/order/receiveInfoForm"),
                    },
                    {
                        path: "msgForm",
                        name: "msgForm",
                        component: () => import("../views/order/msgForm"),
                    },
                ]
            },
            {
                path: "vorderComplete/:oid",
                name: "orderComplete",
                component: () => import("../views/order/orderComplete"),
            },
            {
                path: "vmypage/myshop",
                name: "mypageShop",
                component: () => import("../views/mypage/myShop"),
            },
            {
                path: "vmypage/myorder/:status",
                name: "mypageOrder",
                component: () => import("../views/mypage/myOrder"),
            },
            {
                path: "vmypage/myreturn/:status",
                name: "mypageRetrunList",
                component: () => import("../views/mypage/myReturnList"),
            },
            {
                path: "vmypage/orderDetail/:oid/:status",
                name: "mypageOrderDetail",
                component: () => import("../views/mypage/myOrderDetail"),
            },
            {
                path: "vmypage/review",
                name: "mypageReview",
                component: () => import("../views/mypage/myReview"),
            },
            {
                path: "vmypage/reviewRegist/:oid/:odIx",
                name: "mypageReviewRegist",
                component: () => import("../views/mypage/myReviewRegist"),
            },
            {
                path: "vmypage/cancel/:oid",
                name: "mypageCancel",
                component: () => import("../views/mypage/myCancel"),
            },
            {
                path: "vmypage/deliveryInfo/:oid",
                name: "mypageDeliveryInfo",
                component: () => import("../views/mypage/myDelivery"),
            },
            {
                path: "vmypage/receiveInfoForm",
                name: "mypageDeliveryInfoForm",
                component: () => import("../views/mypage/myDeliveryForm"),
            },
            {
                path: "vmypage/deliveryStatus/:oid",
                name: "mypageDeliveryStatus",
                component: () => import("../views/mypage/myDeliveryStatus"),
            },
            {
                path: "vmypage/point",
                name: "mypagePoint",
                component: () => import("../views/mypage/myPoint"),
            },
            {
                path: "vmypage/coupon",
                name: "mypageCoupon",
                component: () => import("../views/mypage/myCoupon"),
            },
            {
                path: "vmypage/appCoupon",
                name: "mypageAppCoupon",
                component: () => import("../views/mypage/myAppCoupon"),
            },
            {
                path: "vmypage/qnaList",
                name: "mypageQnaList",
                component: () => import("../views/mypage/myQnaList"),
            },
            {
                path: "vmypage/benefit",
                name: "mypageBenefit",
                component: () => import("../views/mypage/myBenefit"),
            },
            {
                path: "vmypage/mymodify",
                name: "mypageModify",
                component: () => import("../views/mypage/myModify"),
            },
            {
                path: "vmypage/myfavorite",
                name: "mypageFavorite",
                component: () => import("../views/mypage/myFavorite"),
            },
            {
                path: "vmypage/return/:oid/:odIx",
                name: "mypageReturn",
                component: () => import("../views/mypage/myReturn"),
            },
            {
                path: "vmypage/exchange/:oid/:odIx",
                name: "mypageExchange",
                component: () => import("../views/mypage/myExchange"),
            },
            {
                path: "vmypage/nomemberOrder/:oid",
                name: "mypageNomemberOrder",
                component: () => import("../views/mypage/nomemberOrder"),
            },
            {
                path: "vcustomer",
                name: "customer",
                component: () => import("../views/customer/index"),
                redirect: `/vcustomer/noticeList`,
                children: [
                    {
                        path: "noticeList",
                        name: "customerNoticeList",
                        component: () => import("../views/customer/board/noticeList"),
                    },
                    {
                        path: "faqList",
                        name: "customerFaqList",
                        component: () => import("../views/customer/board/faqList"),
                    },
                    {
                        path: "review",
                        name: "customerReviewList",
                        component: () => import("../views/customer/reviewList"),
                    },
                    {
                        path: "event",
                        name: "customerEvent",
                        component: () => import("../views/customer/event"),
                    },
                    {
                        path: "eventView/:id",
                        name: "customerEventView",
                        component: () => import("../views/customer/eventView"),
                    },
                    {
                        path: "agree/:type",
                        name: "customerAgree",
                        component: () => import("../views/customer/agree"),
                    },
                    {
                        path: "directNoticeList",
                        name: "customerDirectNoticeList",
                        component: () => import("../views/customer/board/noticeList"),
                    },
                ]
            },
            {
                path: "vevent/planView/:ix",
                name: "eventPlanView",
                component: () => import("../views/event/specailView"),
            },


        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        //if (savedPosition) {
            //console.log(JSON.stringify(savedPosition));
          //  return savedPosition;
        //} else {
            return {x: 0, y: 0}
        //}

    },
    routes
})

export default router
