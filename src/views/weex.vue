<template>
  <div class="weex-wrapper">
    <!-- <dof-minibar
      title="创明窗帘机"
      style="position: fixed; top: 0"
      background-color="rgba(0,0,0,0)"
    /> -->

    <text class="test-colore">123333ddqwee</text>

    <!-- <weex-console /> -->
  </div>
</template>

<script>
// import { DofMinibar } from 'dolphin-weex-ui'

export default {
  components: {
    // DofMinibar,
  },
  data() {
    return {
      foo: true
    }
  },

  created() {
  }
}
</script>

<style lang="scss">
$test: blue;
.weex-wrapper {
  justify-content: center;
  align-items: center;
  background-color: $test;
}
.weex-wrapper .test-colore {
  color: red;
}
</style>
