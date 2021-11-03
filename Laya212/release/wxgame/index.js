/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js");
loadLib("libs/laya.ui.js");
loadLib("libs/laya.d3.js")
//-----libs-end-------
loadLib("js/bundle.js");

console.warn(
  Laya.Browser.onMobile,
  Laya.Browser.onIOS,
  Laya.Browser.onAndroid,
  Laya.Browser.onPC,
  Laya.Browser.onMac);

console.warn("memory", window.performance);
console.warn("location", location);
