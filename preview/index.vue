<template>
  <main class="wrapper">
    <h1>请使用美居app对二维码进行扫一扫</h1>
    <a :href="url" target="_blank">{{ url }}</a>
    <div ref="qart"></div>

    <section>
      <button
        :class="['page', { 'page-active': currentPage === name }]"
        v-for="name in page"
        :key="name"
        @click="renderQrcode(name)"
      >
        {{ name }}
      </button>
    </section>
  </main>
</template>

<script>
import QArt from 'qartjs'

export default {
  name: 'preview',

  data() {
    return {
      currentPage: '',
      page: process.PAGE_NAMES,
      url: 'https://www.baidu.com',
    }
  },

  mounted() {
    this.renderQrcode('weex')
  },

  methods: {
    renderQrcode(name) {
      this.currentPage = name
      this.url = `http://${window.location.host}/${name}.weex.js`
      new QArt({
        value: `http://${window.location.host}/${name}.weex.js`,
        imagePath: '',
        size: 300,
      }).make(this.$refs.qart)
    },
  },
}
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page {
  border: none;
  margin: 0 10px;
  border-radius: 3px;
  padding: 5px 8px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #a7c4bc;
  font-size: 20px;
}
.page:active,
.page-active {
  background-color: #5e8b7e;
}
</style>
