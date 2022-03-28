import member from './modules/member'
import config from './modules/config'
import mobile from './modules/mobile'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		member,
		config,
		mobile
	}
})
