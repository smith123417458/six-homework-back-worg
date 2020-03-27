<template>
  <nav
    class="navbar navbar-expand-xl p-0 fixed-top navDefault"
    :class="{ navActive }"
     @mouseenter="navMouseEnter"
     @mouseleave="navMouseLeave"
  >
 <a class="navbar-brand" href="#">
    <img src="https://i.imgur.com/YXX7oS3.png" width="30" height="30" 
    class="d-inline-block align-top ml-4" >
    好運租車
  </a>
     <div class="collapse navbar-collapse ml-xl-6 order-2 order-xl-1" >
      <ul class="navbar-nav"> 
        <li class="nav-item">
          <a class="nav-link p-3 px-4" href="#" @click.prevent="goNewArrival">
            <span class="hvr-underline-from-left">首頁</span>
          </a>
        </li> 
        <!-- 瀏覽器下車款選擇 -->
        <li class="nav-item d-none d-xl-block">
          <a
            id="brand"
            class="nav-link p-3 px-4"
            href="#"
            @mouseenter="brandMouseEnter"
            @mouseleave="brandMouseLeave"
            @click="changeCategory('car')"   
          >
            <span class="align-middle">車款選擇</span>
          </a>
        </li>

       
      </ul>
    </div>
    <!-- 會員登入 -->
    <ul class="navbar-nav mr-xl-6 order-1 order-xl-2">
      <li class="nav-item">
        <router-link class="d-none d-xl-block py-3 px-4" to="/signin">
        <img src="https://i.imgur.com/yH8yeaP.png" >
          <!-- <i class="fal fa-user-circle"></i> -->
        </router-link>
      </li>
      <!-- 購物車按鈕 -->
      <li class="nav-item">
        <router-link class="position-relative d-block py-3 px-4" to="/cart">
          <i class="fal fa-shopping-cart"></i>
          <p
            class="position-absolute text-center text-white bg-danger rounded-circle"
            style="top:10%; right:25%; font-size: 12px; min-width: 17px"
            v-if="this.$store.state.carts.carts.length"
          >
            {{ this.$store.state.carts.carts.length }}
          </p>
        </router-link>
      </li>
    </ul>
    <!-- 代理品牌清單 -->
    <div
      id="brand-list"
      class="position-absolute bg-white w-100"
      style="top: 58px; box-shadow: 0px 3px 3px 0px silver;"
      @mouseenter="brandMouseEnter"
      @mouseleave="brandMouseLeave"
    >
     
    </div>

    
  </nav>

</template>

<script>
import { gsap } from "gsap";
export default {
  data() {
    return {  
      navHeight: 0,
      navActive: false,
    };
  },
  computed:{
    getcar(){
      return this.$store.state.carts.carts.length
    }
  }
   ,
  watch: {
   
    $route() {
      const vm = this;
      const { path } = this.$route;
      
      if (path !== '/') {
         vm.$bus.$emit('goTop');
      }
 
       $('.navbar-collapse').collapse('hide');
      $('#brand-list').slideUp();

      
      if (path !== '/' && path !== '/product') {
        vm.navActive = true;
      } else {
        vm.navActive = false;
      }
    },

  getcar(){
    gsap.from(".fa-shopping-cart", 0.1, {
          scale: 8
        })
  }
  },
  methods: {
    
    windowScroll() {
      const vm = this;
      const navTopHeight = Math.floor($('nav').offset().top);
      vm.navHeight = navTopHeight;
      const { path } = this.$route;
     
      if (vm.navHeight > 0) {
        vm.navActive = true;
      
      } else if (vm.navHeight === 0 && (path === '/product' || path === '/')) {
        vm.navActive = false;
      
      }
    },
     navMouseEnter() {
      this.navActive = true;
    },
    navMouseLeave() {
      const navTopHeight = Math.floor($('nav').offset().top);
      const { path } = this.$route;
      if (navTopHeight === 0 && (path === '/product' || path === '/')) {
        this.navActive = false;
      }
    },

    
    brandMouseEnter() {
      $('#brand-list')
        .stop()
        .slideDown(500);
    },
    brandMouseLeave() {
      $('#brand-list')
        .stop()
        .slideUp(300);
    },
  
    goNewArrival() {
      const vm = this;
    
      return vm.$route.path === '/'
        ? vm.scrollToAnchor('#new-arrival')
        : vm.$router.push('/').then(() => {
          vm.scrollToAnchor('#new-arrival');
        });
    },
    scrollToAnchor(anchor) {
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $(anchor).offset().top,
          },
          1000,
        );
    },
   
    changeCategory(selectedCategory) {
      const vm = this;
      vm.$store.dispatch('changeCategory', selectedCategory).then(() => {
       
        if (vm.$route.path !== '/product') {
          vm.$router.push('/product');
        }

        $('.navbar-collapse').collapse('hide');
      
      });
    },
  },
  created() {
    window.addEventListener('scroll', this.windowScroll, false);
    this.$store.dispatch('getCarts');
  },  
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/customMixins.scss";


.navDefault {
  a,
  .navbar-nav a {
    color: white;
  }
  
  transition: all 0.5s;
}


.navActive {
  a,
  .nav-item a {
    color: black;
  }
  background: white;
  @include box-shadow;
}


#brand-list {
  display: none; // 預設隱藏
  
  @include BS-xl {
    display: none;
  }
}

#brand-list-rwd {
  display: none;
}
// Hover.css
.hvr-underline-from-left:before {
  background: gray;
}
li:hover {
  .hvr-underline-from-left:before {
    right: 0;
  }
}

#brand-list a:hover {
  .hvr-underline-reveal:before {
    transform: translateY(0);
  }
}
</style>
