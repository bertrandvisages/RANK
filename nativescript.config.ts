import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.rankingnow.app',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    discardUncaughtJsExceptions: true,
    SPMPackages: []
  }
} as NativeScriptConfig;