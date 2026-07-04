import { defineConfig } from '@tarojs/cli';

export default defineConfig({
  projectName: 'life-simulator-2014',
  date: '2026-7-4',
  // 与 web 端 px 数值对齐:按 375 设计稿宽度,1px = 2rpx
  designWidth: 375,
  deviceRatio: {
    375: 2,
    750: 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  plugins: ['@tarojs/plugin-platform-weapp', '@tarojs/plugin-framework-react'],
  mini: {
    // core/content 以 TS 源码形式被引用,需要纳入编译
    compile: {
      include: [
        modulePath =>
          /packages[\\/](core|content)[\\/]/.test(modulePath) || /@life-sim[\\/]/.test(modulePath),
      ],
    },
    postcss: {
      autoprefixer: { enable: true },
      cssModules: { enable: false },
    },
    webpackChain(chain) {
      chain.merge({
        performance: { hints: false },
      });
    },
  },
  h5: {},
});
