/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ButtonBack extends fgui.GButton {

	public m__iconBack:fgui.GLoader;
	public static URL:string = "ui://jchavkemf7t83";

	public static createInstance():UI_ButtonBack {
		return <UI_ButtonBack>(fgui.UIPackage.createObject("Test", "ButtonBack"));
	}

	protected onConstruct():void {
		this.m__iconBack = <fgui.GLoader>(this.getChildAt(0));
	}
}