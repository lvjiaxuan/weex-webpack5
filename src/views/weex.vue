<template>
  <div class="weex-wrapper">
    <dof-minibar
      title="创明窗帘机"
      style="position: fixed; top: 0"
      background-color="rgba(0,0,0,0)"
    />

    <text class="test-color">123qwe</text>

    <weex-console />
  </div>
</template>

<script>
import { DofMinibar } from 'dolphin-weex-ui'

export default {
  components: {
    DofMinibar,
  },
  data() {
    return {
      foo: true
    }
  }
}
</script>

<style lang="scss">
.weex-wrapper {
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  .test-color {
    color: red;
  }
}
</style>
