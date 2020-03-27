<template>
  <div>
    <header>
      <Navbar />
    </header>

    <!-- 所有會變動的頁面都在 main 標籤 -->
    <main>
      <router-view  />
    </main>
   

  
   
  </div>
</template>


<script>
export default {
  components: {
 
    Navbar: () => import('@/components/Navbar'),
 
  





}}
</script>
