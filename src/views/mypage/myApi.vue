<template>
    <div class="page-contents">

    </div>
</template>

<script>

import crypto from "crypto";
import axios from "axios";

export default {
    data() {
        return {
            password:'lbwyBzfgzUIvXZFShJuikaWvLJhIVq36',
            AES_METHOD:'aes-256-cbc',
            IV_LENGTH:16,
        };
    },
    created() {
        //this.getWebToken()
    },
    methods: {
        getWebToken() {
            const frm = new FormData();
            let CONFIG_HEADER_POST = {
                'Authorization': 'vfALRU3wKCJOAjMxr2H1kjLt89wB5k0e0UUnG2iXGLTXvgUrPX3NZGq7UrV8/SsOV4L1mhtb9Lp03GvXCalnBg',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            };
            let uid = this.encrypt('rriverr@naver.com');
            let url = 'https://ncloud.meta-commerce.co.kr/'; //추후에 url은 수정할 예정임
            axios.post('/api/zzieut/getWebToken', frm, {headers: CONFIG_HEADER_POST}).then(res => {
                if(res.data.token) {
                    let form = document.createElement('form');
                    form.setAttribute('method','post')
                    form.setAttribute('action',url)
                    let params = {
                        uid:uid,
                        webToken:res.data.token
                    }
                    for(let key in params) {
                        let hiddenField = document.createElement('input')
                        hiddenField.setAttribute('type','hidden')
                        hiddenField.setAttribute('name',key)
                        hiddenField.setAttribute('value',params[key])
                        form.appendChild(hiddenField)
                    }
                    document.body.appendChild(form)
                    form.submit();
                }


            }).catch((error) => {
                console.log(error);

            });
        },
        logOut() {
            let uid = this.encrypt('rriverr@naver.com');
            const frm = new FormData();
            frm.append('uid',uid)
            let CONFIG_HEADER_POST = {
                'Authorization': 'vfALRU3wKCJOAjMxr2H1kjLt89wB5k0e0UUnG2iXGLTXvgUrPX3NZGq7UrV8/SsOV4L1mhtb9Lp03GvXCalnBg',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            };

            axios.post('/api/zzieut/setLogout', frm, {headers: CONFIG_HEADER_POST}).then(res => {
                console.log(res.data)

            }).catch((error) => {
                console.log(error);

            });
        },
        encrypt(text) {
            const password = this.password
           // if (process.versions.openssl <= '1.0.1f') {
             //   console.log('OpenSSL Version too old, vulnerability to Heartbleed')
            //}

            let iv = crypto.randomBytes(this.IV_LENGTH);
            let cipher = crypto.createCipheriv(this.AES_METHOD, new Buffer(password), iv);
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return iv.toString('hex') + ':' + encrypted.toString('hex');
        },
        decrypt(text) {
            const password = this.password
            let textParts = text.split(':');
            let iv = new Buffer(textParts.shift(), 'hex');
            let encryptedText = new Buffer(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer($password), iv);
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString();
        }

    }

}
</script>

<style lang="scss" scoped>
</style>