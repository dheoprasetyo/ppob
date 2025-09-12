<template>
  <layout>
    <b-container fluid class="p-4">
      <div class="d-flex flex-column" style="max-width: 400px; margin: auto;">
        <div class="position-relative mb-3" style ='text-align:center'>
            <b-img
                :src="profile.profile_image"
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
                @click="clickInputFile()"
            >
                <b-icon icon="pencil"></b-icon>
            </b-button>
            <input
                type="file"
                ref="inputFile"
                accept="image/*"
                style="display: none"
                @change="inputFile"
            />
        </div>

       
        <h5 class="mb-4 font-weight-bold" style = 'text-align:center'>{{profile.first_name + ' '+ profile.last_name}}</h5>

        <b-form>
        <b-form-group label="Email" label-for="email-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group  prepend="@">
            
            <b-form-input
                id="email-input"
                v-model="profile.email"
                type="email"
                placeholder="Enter email"
                readonly
            ></b-form-input>
            </b-input-group>
        </b-form-group>

        <b-form-group label="Nama Depan" label-for="first-name-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group>
            <b-input-group-prepend is-text>
                <b-icon icon="person"></b-icon>
            </b-input-group-prepend>
            <b-form-input
                id="first-name-input"
                v-model="profile.first_name"
                placeholder="Enter first name"
            ></b-form-input>
            </b-input-group>
        </b-form-group>

        <b-form-group label="Nama Belakang" label-for="last-name-input" label-cols-sm="4" label-align-sm="right" class="mb-3">
            <b-input-group>
            <b-input-group-prepend is-text>
                <b-icon icon="person"></b-icon>
            </b-input-group-prepend>
            <b-form-input
                id="last-name-input"
                v-model="profile.last_name"
                placeholder="Enter last name"
            ></b-form-input>
            </b-input-group>
        </b-form-group>

         <div class="row">
            <b-button variant="danger" class="mb-2" @click="updateProfile">
            Edit Profil
            </b-button>
         </div>
         <div class="row">
            <b-button block variant="outline-danger" @click="logOut">
                Logout
            </b-button>
         </div>
         <p v-if="message" :class="jenis" style="cursor: pointer;" @click="$router.push('/')">{{ message }}, klik disini untuk kembali ke branda</p>
        
        
        </b-form>
    </div>
    </b-container>
  </layout>
</template>

<script>
import axios from 'axios'
import Layout from '../layout/Layout.vue';
export default {
  name: 'Profile',
  components: {
    Layout,
  },
  data() {
    return {
      baseapi: localStorage.getItem("baseapi"),
      token: localStorage.getItem("token"),
      profile: JSON.parse(localStorage.getItem("profile")),
      loading: false,
      message: '',
      jenis: ''
    }
  },
  methods: {
    async updateProfile () {
      this.loading = true
      this.message = ''
      this.jenis = ''
      try {
        const res = await axios.put(this.baseapi+'/profile/update', {
          first_name: this.profile.first_name,
          last_name: this.profile.last_name,
        },
        {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        this.profile = res.data.data;
        localStorage.setItem('profile', JSON.stringify(this.profile))
        this.message = res.data.message;
        this.jenis = 'text-success mt-2'
      } catch (err) {
        this.message = err.response?.data?.message
        this.jenis = 'text-danger mt-2'
      } finally {
        this.loading = false
      }
    },
    clickInputFile() {
      this.$refs.inputFile.click();
    },
    async inputFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 100 * 1024; 
        if (file.size > maxSize) {
            alert('File melebihi 100 KB');
            event.target.value = '';
            return;
        }

        this.profile.profile_image = URL.createObjectURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.put(this.baseapi+'/profile/image', formData, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'multipart/form-data', // important for FormData
            },
            });

            const data = res.data.data;
            localStorage.setItem('profile', JSON.stringify(data))
            this.profile.profile_image = data.profile_image;
            this.message = res.data.message;
            this.jenis = 'text-success mt-2'

        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
            this.message = err.response?.data?.message
            this.jenis = 'text-danger mt-2'
            this.profile.profile_image = this.profile.profile_image;
            if (err.response?.data?.message == 'Token tidak tidak valid atau kadaluwarsa') {
                this.logOut()
            }

        }
    },

    logOut(){
      localStorage.removeItem('token')
      this.$router.replace('/login')
    }
  },
}
</script>
