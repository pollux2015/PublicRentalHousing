import Vue from 'vue';
import Vuex from 'vuex';
import apis from './apis';
import lodash from '../methods';
import config from '../config/config';
import VueCookie from 'vue-cookie';
import TestApi from './testApi.js';
Vue.use(Vuex);

import Menutest from '../menus.js';

const debug = process.env.NODE_ENV !== 'production';

// states
const state = {
  orgId: 0,
  siteName: '房源管理系统',
  metaName: '房源管理系统',
  tabChange: '',
  activeTab: { 'title': '首页', 'name': 'home.index', 'random': 0 },
  mainTabs: [{ 'title': '首页', 'name': 'home.index', 'random': 0 }],
  breadcrumb: [],
  metaShow: true,
  basicUrl: config.basicUrl,
  docUrl: config.docUrl,
  userEmail: '', // 用户Email
  pageSize: 25, // 分页
  menus: [],
  error: null,
  dateRangeOptions: { // 日历范围控件options
    shortcuts: [{
        text: '最近一周',
        value() {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        }
      },
      {
        text: '最近一个月',
        value() {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end];
        }
      },
      {
        text: '最近三个月',
        value() {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end];
        }
      }
    ]
  }
};

// getters
const getters = {
  siteName: state => state.siteName,
  metaName: state => state.metaName,
  activeTab: state => state.activeTab,
  mainTabs: state => state.mainTabs,
  tabChange: state => state.tabChange,
  metaShow: state => state.metaShow,
  breadcrumb: state => state.breadcrumb,
  basicUrl: state => state.basicUrl,
  docUrl: state => state.docUrl,
  userEmail: state => state.userEmail,
  pageSize: state => state.pageSize,
  menus: state => state.menus,
  error: state => state.error,
  dateRangeOptions: state => state.dateRangeOptions,
};

// actions
const actions = {
  menus({ commit, state }) {
    commit('menus', Menutest);
    return;
    const menuIcons = {
      'portal': 'earth',
      'org': 'help-buoy',
      'course': 'film-marker',
      'analytics': 'ios-analytics',
      'audit': 'clipboard',
      'system': 'ios-gear'
    }
    return apis.menus({
      noErrorMsg: true
    }).then(res => {
      let result = res.data;
      lodash.forEach(result, (item) => {
        item['icon'] = menuIcons[item.url];

        // 隐藏联盟统计
        if (item.url == 'analytics') {
          item.children = null;
        }
      })
      commit('menus', res.data);
    });
  }
};

// mutations
const mutations = {
  metaName(state, name) {
    state.metaName = name;
  },
  metaShow(state, status) {
    state.metaShow = status;
  },
  tabChange(state, tab) {
    state.tabChange = tab;
  },
  activeTab(state, name) {
    const query = lodash.filter(state.mainTabs, (tab) => {
      return tab.name + tab.random == name;
    });
    if(query && query.length > 0){
      state.activeTab = query[0];
    }
  },
  updateActiveTab(state, params){
    state.activeTab = lodash.assign(state.activeTab, params);
  },
  activeTabByNoRandomName(state, name){
    const query = lodash.filter(state.mainTabs, (tab) => {
      return tab.name == name;
    });
    if(query && query.length > 0){
      state.activeTab = query[0];
    }
  },
  addMainTab(state, tabObj) {
    state.mainTabs.push(tabObj);
    const curTab = state.mainTabs[state.mainTabs.length - 1];
    state.activeTab = curTab;
  },
  removeTab(state, name) {
    const index = lodash.findIndex(state.mainTabs, (tab) => {
      return tab.name + tab.random == name;
    })
    state.mainTabs.splice(index, 1);
    const curTab = state.mainTabs[state.mainTabs.length - 1];
    state.activeTab = curTab;
  },
  removeActiveTab(state) {
    const index = lodash.findIndex(state.mainTabs, (tab) => {
      return tab.name + tab.random == state.activeTab.name + state.activeTab.random;
    });
    state.mainTabs.splice(index, 1);
    const curTab = state.mainTabs[index - 1];
    state.activeTab = curTab;
  },
  breadcrumb(state, breadcrumb) {
    state.breadcrumb = breadcrumb;
  },
  menus(state, menus) {
    state.menus = menus;
  },
  userEmail(state, email) {
    state.userEmail = email;
  },
  upPageSize(state, pagesize) {
    state.pageSize = pagesize;
  },
  upError(state, error) {
    state.error = error;
  },
  orgId(state, orgId) {
    state.orgId = orgId;
  }
};

export default new Vuex.Store({
  modules: { TestApi },
  state,
  getters,
  actions,
  mutations,
  strict: debug
});
