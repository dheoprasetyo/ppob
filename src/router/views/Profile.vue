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
      <div class="d-flex flex-column" style="max-width: 400px; margin: auto;">
        <!-- Profile Picture with Edit Icon -->
        <div class="position-relative mb-3" style = 'text-align:center'>
        <b-img
            src="https://www.w3schools.com/howto/img_avatar.png"
            rounded="circle"
            width="120"
            height="120"
            alt="Profile Picture"
        ></b-img>
        <b-button
            size="sm"
            variant="light"
            class="position-absolute"
            style="bottom: 5px; right: 5px; border-radius: 50%;"
        >
            <b-icon icon="pencil"></b-icon>
        </b-button>
        </div>

        <!-- Name -->
        <h5 class="mb-4 font-weight-bold" style = 'text-align:center'>Kristanto Wibowo</h5>

        <!-- Form Fields -->
        <b-form>
        <!-- Email -->
        <b-form-group label="Email" label-for="email-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group  prepend="@">
            
            <b-form-input
                id="email-input"
                v-model="email"
                type="email"
                placeholder="Enter email"
            ></b-form-input>
            </b-input-group>
        </b-form-group>

        <!-- Nama Depan -->
        <b-form-group label="Nama Depan" label-for="first-name-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group>
            <b-input-group-prepend is-text>
                <b-icon icon="person"></b-icon>
            </b-input-group-prepend>
            <b-form-input
                id="first-name-input"
                v-model="firstName"
                placeholder="Enter first name"
            ></b-form-input>
            </b-input-group>
        </b-form-group>

        <!-- Nama Belakang -->
        <b-form-group label="Nama Belakang" label-for="last-name-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group>
            <b-input-group-prepend is-text>
                <b-icon icon="person"></b-icon>
            </b-input-group-prepend>
            <b-form-input
                id="last-name-input"
                v-model="lastName"
                placeholder="Enter last name"
            ></b-form-input>
            </b-input-group>
        </b-form-group>

        <!-- Buttons -->
        <b-button block variant="danger" class="mb-2" @click="editProfile">
            Edit Profil
        </b-button>
        <b-button block variant="outline-danger" @click="logout">
            Logout
        </b-button>
        </b-form>
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
      loading: false,
      message: ''
      
    }
  },
  methods: {
  },
}
</script>

<style scoped>
.logo-circle {
  width: 32px;
  height: 32px;
}


</style>