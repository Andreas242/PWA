<template>
  <div class="basic-setup">
  <div class="players">
    <transition-group name="list" tag="div" class="score" keep-alive>
    <div v-for="(player, index) in players" :key="player.id" class="image-card">
      <transition name="fade" class="player">
      <div v-if="player.score && player.score < 900" class="player__card">
        <div class="player__shape">
          <div v-if="player.image">
            <img v-bind:src="player.image" class="player-image"/>
          </div>
          <div v-else>
            <img src="static/img/images_man.png" class="player-image" />
          </div>
        </div>
        <div class="player__info">
        <h3>{{ player.name }}</h3>
        <div>
        <h3>Position:{{ index + 1 }} Score:{{ player.score }}</h3>
        </div>
      </div>
      </div>
    </transition>
      </div>
  </transition-group>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      myDev: localStorage.id,
      name: localStorage.name || '',
      showWelcome: true,
      players: []
    }
  },
  methods: {
    getPlayers () {
      console.log('getting players')
      if (navigator.onLine) {
        this.savePlayersToCache()
        this.players = this.$root.players
        // return this.$root.$firebaseRefs.players
      } else {
        this.players = JSON.parse(localStorage.getItem('players'))
      }
    },
    savePlayersToCache () {
      console.log('saving to cache')
      this.$root.$firebaseRefs.players.orderByChild('score').once('value', (snapchot) => {
        let cachedPlayers = []
        snapchot.forEach((catSnapchot) => {
          let cachedPlayer = catSnapchot.val()
          cachedPlayer['.key'] = catSnapchot.key
          cachedPlayers.push(cachedPlayer)
        })
        localStorage.setItem('players', JSON.stringify(cachedPlayers))
      })
    }
  },
  mounted () {
    this.$root.$first = '2'
    // this.savePlayersToCache()
    this.getPlayers()
  }
}
</script>
<style scoped>
  .list {
    width: 100%;
    padding: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 0.3s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(10px);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .image-card:first-child .player__card{
    color: #000;
    background-color: #fff;
    border: 2px solid black;
    margin: 3rem 0;
    box-shadow: 0px 3px 1px 0px #888888;
    border-radius: 3rem;
    padding: 1rem;
    width: 90%;
    float: left;
  }

  .player__card{
    color: #eee;
    border: 2px solid black;
    box-shadow: 0px 3px 1px 0px #888888;
    background-color: #002776;
    margin: 3rem 0;
    border-radius: 1rem;
    padding: 0.5rem;
    width: 12rem;
    margin-right: 1rem;
    float: left;
  }

  .player-image {
    transform: translateX(-25%);
    width: 135%;
  }

  .player__shape {
    height: 7rem;
    width: 7rem;
    background-color: orangered;
    float: left;
    shape-outside: circle(50% at 50% 50%);
    clip-path: circle(50% at 50% 50%);
  }

  .outer__shape {
    height: 8rem;
    width: 8rem;
    background-color: orangered;
    float: left;
    shape-outside: circle(50% at 50% 50%);
    clip-path: circle(50% at 50% 50%);
  }

  .player__img {
    height: 7rem;
  }
  .players {
    margin: auto;
    width: 80%
  }
  .white {
    color: #fff;
  }

.basic-setup {
  background-color: #000;
  text-align: center;
}

#name {
    color: white;
    transition: all 2s;
    margin-top: 50px;
    height: 100px;
    text-shadow: 1px 3px 10px rgba(0,0,0,0.5);
    text-transform: uppercase;
    font-size: 2.5rem;
    line-height: 2.5rem;
}
/*
 .score {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          grid-gap: 20px;
      }
      .image-card {
          background-color: rgba(255,255,255, 0.2);
          padding: 20px;
          box-shadow: 0 0 5px black;
          display: grid;
          grid-template-columns: 100px 1fr;
          grid-gap: 10px;
          border-radius: 10%;
      }
      */

</style>
