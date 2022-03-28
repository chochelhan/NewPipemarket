<template>
    <v-app>
        <app-modal></app-modal>
        <app-overlay></app-overlay>
        <router-view/>
    </v-app>
</template>

<style>
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Thin.otf') format('truetype');
    font-weight: 100;
}
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Light.otf') format('truetype');
    font-weight: 200;
}
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Regular.otf') format('truetype');
    font-weight: 300;
}
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Medium.otf') format('truetype');
    font-weight: 400;
}
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Bold.otf') format('truetype');
    font-weight: 600;
}
@font-face {
    font-family: 'Noto Sans';
    src: url('./assets/fonts/NotoSansKR-Black.otf') format('truetype');
    font-weight: 700;
}
body {
    font-family: 'Noto Sans' !important;
    font-size: 14px !important;
    font-weight: 300;
}
div,p,td,th,span,input,select,li {
    font-family: 'Noto Sans' !important;
    font-weight: 300;
}
.page-contents {
    padding:0;
    margin:0;
}
</style>
<script>
import Modal from './common/Modal'
import Overlay from './common/Overlay'

export default {
    name: 'App',
    components: {
        'app-modal': Modal,
        'app-overlay': Overlay
    },
    data: () => ({

    }),
};
</script>