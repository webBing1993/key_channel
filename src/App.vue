<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*background-color: #041740;*/
  }
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
  }
  a {
    text-decoration: none
  }
  * {
    padding: 0;
    margin: 0;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
</style>
