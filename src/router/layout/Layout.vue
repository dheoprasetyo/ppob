<template>
  <div>
    
    <b-navbar variant="light" class="border-bottom">
        <b-navbar-brand>
            <div class="d-flex align-items-center">
            <div class="logo-circle bg-danger rounded-circle d-flex align-items-center justify-content-center">
               <img @click="$router.push('/')" style="cursor: pointer;" src="../../assets/logo.png" alt="Company Logo" class="logo">
            </div>
            <span class="ms-2 font-weight-bold">SIMS PPOB</span>
            </div>
        </b-navbar-brand>
        
        <b-navbar-nav class="ms-auto">
            <b-nav-item @click="$router.push('/topUp')">Top Up</b-nav-item>
            <b-nav-item @click="$router.push('/transaction')">Transaction</b-nav-item>
            <b-nav-item @click="$router.push('/profile')">Akun</b-nav-item>
        </b-navbar-nav>
    </b-navbar>

    <slot></slot>

  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<style scoped>
.logo-circle {
  width: 32px;
  height: 32px;
}
</style>