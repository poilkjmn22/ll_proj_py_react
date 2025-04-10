import { mergeConfig } from 'vite'
import baseConfig from './vite.config.base';

export default mergeConfig(baseConfig, {
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  }
})
