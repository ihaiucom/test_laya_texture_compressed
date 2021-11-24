/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ButtonAYellow extends fgui.GButton {

	public m_ctrlGrayed:fgui.Controller;
	public m__iconBg:fgui.GLoader;
	public static URL:string = "ui://jchavkemf7t82";

	public static createInstance():UI_ButtonAYellow {
		return <UI_ButtonAYellow>(fgui.UIPackage.createObject("Test", "ButtonAYellow"));
	}

	protected onConstruct():void {
		this.m_ctrlGrayed = this.getControllerAt(1);
		this.m__iconBg = <fgui.GLoader>(this.getChildAt(0));
	}
}