<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header base-background" id="app">
    <header class="mdl-layout__header header-color">
      <div class="mdl-layout__header-row">
        <span class="nav__name">SB1 {{ name }}</span>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" to="/" @click.native="hideMenu">Highsscores</router-link>
        <router-link v-if="!name" class="mdl-navigation__link" to="/post" @click.native="hideMenu">Register</router-link>
        <router-link v-if="name" class="mdl-navigation__link" to="/play" @click.native="hideMenu">Play!</router-link>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
  require('material-design-lite')
  export default {
    name: 'app',
    data () {
      return {
        get name () {
          return localStorage.getItem('name') || ''
        }
      }
    },
    watch: {
      // whenever question changes, this function will run
      'localStorage.getItem("name")': function () {
        console.log(localStorage.name)
      }
    },
    computed: {
      localStorageName: function () {
        return this.$root.$name || ''
      }
    },
    methods: {
      hideMenu: function () {
        document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
        document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
      },
      displayConfirmNotification: function () {
        if ('serviceWorker' in navigator) {
          var options = {
            body: 'The revolution will not be native...',
            icon: 'static/img/icons/rubiks-196x196.png',
            vibrate: [100, 50, 200],
            badge: 'static/img/icons/rubiks-196x196.png',
            tag: 'confirm'
          }
          navigator.serviceWorker.ready.then(function (swreg) {
            swreg.showNotification('PWA Rocks!', options)
          })
        }
      },
      askForNotificationPermission: function () {
        let that = this
        Notification.requestPermission(function (result) {
          console.log('User Choice', result)
          if (result !== 'granted') {
            console.log('No notification permission granted!')
          } else {
            that.displayConfirmNotification()
          }
        })
      }
    },
    created () {
      if ('Notification' in window) {
        this.askForNotificationPermission()
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');
body {
  margin: 0;
  font-size: 10px;
  background-color: #ddd;
}

.header-color {
  background-color: #002776;
}

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 10px;
}

.mycolor {
  background-color: #000;
}
.title {
  text-transform: uppercase;
}

.nav__name {
  text-transform: uppercase;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #002776;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 2rem;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

</style>
