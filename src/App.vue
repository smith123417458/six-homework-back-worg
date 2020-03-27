<template>
  <div id="app">
   
    <router-view />
  </div>
</template>

<script>
export default {
 
  created() {
  
    this.$bus.$on('sweet-alert', (params) => {
      this.$swal.fire({
        position: 'top-end',
        ...params,
        showConfirmButton: false,
        timer: 2000,
        allowOutsideClick: false,
      });
    });


    this.$bus.$on('sweet-alert-info', (params) => {
      this.$swal.fire({
        ...params,
        showCloseButton: false,
        confirmButtonText: '已複製',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-dark btn-lg',
        },
      });
    });

    
    this.$bus.$on('goTop', () => {
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $('html,body').offset().top,
          },
          1000,
        );
    });
  },
};
</script>
