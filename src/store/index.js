// index.js
import Vue from 'vue'
import Vuex from 'vuex'
import test from './pageState/test.js'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
  	modules:{
  		test,
  	}
  })
}
