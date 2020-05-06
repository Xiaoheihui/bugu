<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import store from './store'
export default {
  name: 'App',
  mounted(){
    if(store.state.user.user_id!=undefined && !store.state.socket_instance){
      store.commit('setConnect')
      console.log(1)
    }
    
  }
}
</script>

<style>
  html,body, #app{
    width:100%;
    height:100%;
    margin:0;
    padding:0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
