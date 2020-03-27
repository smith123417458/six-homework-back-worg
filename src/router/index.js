import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [{
  path: '*',
  redirect: '/',
},
{
  path: '/',
  component: Home,
  children: [{
    path: '',
    component: () => import('@/views/LandingPage.vue'),
  },
  {
    path: 'product',
    component: () => import('@/components/Product.vue'),
  },
  {
    path: 'product/:productId',
    component: () => import('@/components/ProductItem.vue'),
  },
  {
    path: "signin",
    component: () => import('@/components/Login.vue'),
  },
 


,
  {
    path: 'cart',
    component: () => import('@/components/Cart.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/CartForm.vue'),
      },
      {
        path: 'checkout',
        component: () => import('@/components/Checkout.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('@/components/CheckoutOrder.vue'),
      },
      
    ],
  },

  {
    path: "/admin",
    component: () => import('@/components/Dashboard.vue'),
    children: [
      {
        path: "products",
        component: () => import('@/components/DashProducts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: "coupons",
        component: () => import('@/components/Coupon.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: "orders",
        component: () => import('@/components/DashOrders.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }


  
  
  ],
},


];

const router = new VueRouter({
  routes,
  
});

export default router;
