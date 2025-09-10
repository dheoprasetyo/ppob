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
            <b-nav-item>Top Up</b-nav-item>
            <b-nav-item>Transaction</b-nav-item>
            <b-nav-item>Akun</b-nav-item>
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
          :key="service.id" 
          cols="2" 
          class="text-center mb-3"
        >
          <div class="service-item">
            <div :class="'service-icon ' + service.colorClass">
              <i :class="service.icon"></i>
            </div>
            <small class="d-block mt-2">{{ service.name }}</small>
          </div>
        </b-col>
      </b-row>

      <!-- Promo Section -->
      <div class="promo-section">
        <h5 class="mb-3">Temukan promo menarik</h5>
        <div class="d-flex promo-scroll">
          <b-card 
            v-for="promo in promoCards" 
            :key="promo.id"
            :class="'promo-card mr-3 ' + promo.bgClass"
            :text-variant="promo.textVariant"
          >
            <h6 class="font-weight-bold">{{ promo.title }}</h6>
            <p class="mb-1">{{ promo.subtitle }}</p>
            <small>{{ promo.description }}</small>
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
      userName: 'Kristanto Wibowo',
      balance: 0,
      showBalance: false,
      services: [
        { id: 1, name: 'PBB', icon: 'fa fa-home', colorClass: 'bg-success' },
        { id: 2, name: 'Listrik', icon: 'fa fa-lightbulb', colorClass: 'bg-warning' },
        { id: 3, name: 'Pulsa', icon: 'fa fa-mobile', colorClass: 'bg-secondary' },
        { id: 4, name: 'PDAM', icon: 'fa fa-tint', colorClass: 'bg-info' },
        { id: 5, name: 'PGN', icon: 'fa fa-fire', colorClass: 'bg-danger' },
        { id: 6, name: 'TV Langganan', icon: 'fa fa-tv', colorClass: 'bg-purple' },
        { id: 7, name: 'Musik', icon: 'fa fa-music', colorClass: 'bg-pink' },
        { id: 8, name: 'Voucher Game', icon: 'fa fa-gamepad', colorClass: 'bg-success' },
        { id: 9, name: 'Voucher Makanan', icon: 'fa fa-utensils', colorClass: 'bg-info' },
        { id: 10, name: 'Kurban', icon: 'fa fa-heart', colorClass: 'bg-secondary' },
        { id: 11, name: 'Zakat', icon: 'fa fa-hand-holding-heart', colorClass: 'bg-success' },
        { id: 12, name: 'Paket Data', icon: 'fa fa-wifi', colorClass: 'bg-primary' }
      ],
      promoCards: [
        {
          id: 1,
          title: 'Saldo Gratis!',
          subtitle: 'Dapatkan saldo gratis',
          description: 'Syarat dan ketentuan berlaku',
          bgClass: 'bg-danger',
          textVariant: 'white'
        },
        {
          id: 2,
          title: 'Cashback Belanja!',
          subtitle: 'Belanja hemat dengan cashback',
          description: 'hingga 25%',
          bgClass: 'bg-pink',
          textVariant: 'white'
        }
        // ... more promo cards
      ]
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
      const [profile, balance] = await Promise.all([
        axios.get(this.baseapi+'/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(this.baseapi+'/balance', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        // axios.get('http://localhost:3000/api/transactions', {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
      ])

      // assign data
      this.profile = profile.data.data
      this.balance = balance.data.data.balance
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
}

.promo-scroll {
  overflow-x: auto;
  padding-bottom: 10px;
}

.promo-card {
  min-width: 280px;
  flex-shrink: 0;
}
</style>