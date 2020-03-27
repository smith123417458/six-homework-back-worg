import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
    types: ['car', 'motorbike'],
    brands: {
      car: [
        
        {name:'TOYOTA',url:'https://i.imgur.com/CHKtVCP.png'},
        {name:'LEXUS',url:'https://i.imgur.com/wiA92xg.jpg'},
        {name:'MITSUBISHI',url:'https://i.imgur.com/qL0KWE2.jpg'},
        {name:'Lamborghini',url:'https://i.imgur.com/bU7hZPZ.jpg'},
    ],




      motorbike: [
        
        {name:'YAMAHA',url:'https://i.imgur.com/5LG1LQL.jpg'},
        {name:'HONDA',url:'https://i.imgur.com/nMFOiDH.jpg'},
        {name:'BMW',url:'https://i.imgur.com/RmPEjhW.jpg'},
        {name:'SUZUKI',url:'https://i.imgur.com/SzDF7to.jpg'},





      ],
    },
    products: [],
    allProducts: [],
    selectedCategory: 'car',
    carts: {
      carts: [],
    },
    formTitle: '會員登入',
  },
  mutations: {
     LOADING(state, payload) {
      state.isLoading = payload;
    },
    ALLPRODUCTS(state, payload) {
      state.allProducts = payload;
    },
    
    CARTS(state, payload) {
      state.carts = payload;
    },
    CHANGECATEGORY(state, payload) {
      state.selectedCategory = payload;
    },
  },
  actions: {
    getAllProducts(context) {
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      context.commit('LOADING', true);
      axios.get(apiUrl).then((response) => {
        context.commit('ALLPRODUCTS', response.data.products);
        context.commit('LOADING', false);
      });
    },
    getCarts(context) {
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      context.commit('LOADING', true);
      axios.get(apiUrl).then((response) => {
        context.commit('CARTS', response.data.data);
        context.commit('LOADING', false);
      });
    },
    changeCategory(context, payload) {
      context.commit('CHANGECATEGORY', payload);
    },
  },
});
