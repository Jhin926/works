<template>
  <div class="interface">

    <loading v-if="isLoading"></loading>
  </div>
</template>

<script>
  export default {
    name: 'interface',
    created () {
      const par = this.$route.params
      if (par.par1 !== undefined) {

      }
    },
    data () {
      return {
        isLoading: true
      }
    }
  }
</script>

<style scoped>

</style>
