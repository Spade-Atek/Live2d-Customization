/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';

/**
 * ブラウザロード後の処理 主函数，启动程序
 */
window.onload = (): void => {
  // create the application instance 获得LAppDelegate这个类的实例并初始化
  if (LAppDelegate.getInstance().initialize() == false) {
    return;
  }

  LAppDelegate.getInstance().run();
};

/**
 * 終了時の処理 结束时的处理
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();
