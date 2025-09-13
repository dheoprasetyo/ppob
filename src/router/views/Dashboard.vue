<template>
  <layout>
    <b-container fluid class="p-4">
      <b-row class="mb-4">
        <b-col cols="6">
          <div class="d-flex align-items-center">
            <b-avatar :src="photoProfile" size="60px" class="mr-3"></b-avatar>
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
            </div>
            <small class="d-block mt-2">{{ service.service_name }}</small>
          </div>
        </b-col>
      </b-row>

      <div class="promo-section">
        <h5 class="mb-3">Temukan promo menarik</h5>
        <div class="d-flex promo-scroll">
          <div 
            v-for="promo in banner" 
            :key="promo.id"
            class="promo-card"
          >
            <div class="promo-image-container">
              <img 
                :src="promo.banner_image" 
                :alt="`Promo ${promo.id}`"
                class="promo-image"
              />
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </layout>
</template>

<script>
import axios from 'axios'
import Layout from '../layout/Layout.vue';
export default {
  name: 'Dashboard',
  components: {
    Layout,
  },
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
    },
    logOut(){
      localStorage.removeItem('token')
      this.$router.replace('/login')
    },
  },
  computed: {
    photoProfile() {
      const img = this.profile.profile_image;
      const invalidUrl = "https://minio.nutech-integrasi.com/take-home-test/null";
      if (img !== invalidUrl) {
        return img;
      }
      return require('@/assets/profile.png');
    }
  },
  async created () {
    const token = localStorage.getItem('token')

    try {
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

      this.profile = profile.data.data
      localStorage.setItem('profile', JSON.stringify(this.profile))
      this.balance = balance.data.data.balance
      this.services = services.data.data
      this.banner = banner.data.data
      
    } catch (err) {
      if (err.response?.data?.message == 'Token tidak tidak valid atau kadaluwarsa') {
        this.logOut()
      }
    }
  },
}
</script>

<style scoped>
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
  gap: 15px;
}

.promo-card {
  min-width: 280px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.promo-image-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.promo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.promo-image:hover {
  transform: scale(1.05);
}

.promo-card-bg {
  min-width: 280px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>