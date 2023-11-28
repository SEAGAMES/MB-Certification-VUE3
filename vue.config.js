const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 3300, // เปลี่ยนเป็นพอร์ตที่คุณต้องการ
    // host: '0.0.0.0', // หรือ 'localhost' หรือ '127.0.0.1'
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
