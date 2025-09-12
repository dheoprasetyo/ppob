<template>
  <div class="mobile-banking-dashboard">
    <!-- Header -->
    <b-navbar variant="light" class="border-bottom">
        <b-navbar-brand>
            <div class="d-flex align-items-center">
            <div class="logo-circle bg-danger rounded-circle d-flex align-items-center justify-content-center">
                <span class="text-white font-weight-bold">S</span>
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


    <!-- Main Content -->
    <b-container fluid class="p-4">
      <!-- Profile and Balance Section -->
      <b-row class="mb-4">
        <b-col cols="6">
          <div class="d-flex align-items-center">
            <b-avatar :src="profile.profile_image" size="60px" class="mr-3"></b-avatar>
            <div>
              <p class="text-muted mb-1">Selamat datang,</p>
              <h4 class="font-weight-bold">{{ profile.first_name }} {{ profile.last_name }}</h4>
            </div>
          </div>
        </b-col>
        
        <b-col cols="6">
          <b-card class="bg-danger text-white balance-card">
            <p class="mb-1 opacity-75">Saldo anda</p>
            <div class="d-flex align-items-center">
              <h3 class="font-weight-bold mr-2">
                {{ showBalance ? formatCurrency(balance) : 'Rp • • • • • • •' }}
              </h3>
              
            </div>
            <small class="opacity-75">Lihat Saldo
                <b-button variant="link" class="text-white p-0" @click="toggleBalance">
                    <i :class="showBalance ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </b-button>
            </small>
          </b-card>
        </b-col>
      </b-row>

      <!-- Services Grid -->
      <b-row class="mb-4">
        <b-col 
          v-for="service in services" 
          :key="service.service_code" 
          cols="2" 
          class="text-center mb-3 mt-3"
        >
          <div class="service-item">
            <div :class="'service-icon ' + service.colorClass">
              <b-img :src="service.service_icon" rounded alt="Rounded image" @click="$router.push({ name: 'pembayaran', params: { id: service.service_code, name: service.service_name, tagihan: service.service_tariff } })"></b-img>
              <!-- <b-avatar :src="service.service_icon" size="60px" class="mr-3"></b-avatar> -->
            </div>
            <small class="d-block mt-2">{{ service.service_name }}</small>
          </div>
        </b-col>
      </b-row>

      <!-- Promo Section -->
      <div class="promo-section">
        <h5 class="mb-3">Temukan promo menarik</h5>
        <div class="d-flex promo-scroll">
          <b-card 
            v-for="promo in banner" 
            :key="promo.id"
            :class="'promo-card'"
            :img-src="promo.banner_image"
            img-alt="Image"
            overlay
          >
          </b-card>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MobileBankingDashboard',
  data() {
    return {
      baseapi: localStorage.getItem("baseapi"),
      token: localStorage.getItem("token"),
      profile: [],
      balance: 0,
      showBalance: false,
      services: [],
      banner: []
    }
  },
  methods: {
    toggleBalance() {
      this.showBalance = !this.showBalance;
    },
    formatCurrency(value) {
      const formatted = new Intl.NumberFormat('id-ID').format(value);
      return `Rp ${formatted}`;
    }
  },
  async created () {
    const token = localStorage.getItem('token')

    try {
      // run 3 GET requests in parallel
      const [profile, balance, services, banner] = await Promise.all([
        axios.get(this.baseapi+'/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(this.baseapi+'/balance', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(this.baseapi+'/services', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(this.baseapi+'/banner', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ])

      // assign data
      this.profile = profile.data.data
      this.balance = balance.data.data.balance
      this.services = services.data.data
      this.banner = banner.data.data
    //   console.log(this.balance.balance)
    //   this.transactions = transRes.data
    } catch (err) {
      console.error('Error loading dashboard data', err)
    }
  },
}
</script>

<style scoped>
.logo-circle {
  width: 32px;
  height: 32px;
}

.balance-card {
  min-width: 280px;
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
}

.promo-scroll {
  overflow-x: auto;
  /* padding-bottom: 10px; */
}

.promo-card {
  min-width: 280px;
  flex-shrink: 0;
  margin-right: 30px;
}
</style>