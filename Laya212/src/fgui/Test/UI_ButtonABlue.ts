/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ButtonABlue extends fgui.GButton {

	public m_ctrlGrayed:fgui.Controller;
	public m__iconBg:fgui.GLoader;
	public static URL:string = "ui://jchavkemf7t81";

	public static createInstance():UI_ButtonABlue {
		return <UI_ButtonABlue>(fgui.UIPackage.createObject("Test", "ButtonABlue"));
	}

	protected onConstruct():void {
		this.m_ctrlGrayed = this.getControllerAt(1);
		this.m__iconBg = <fgui.GLoader>(this.getChildAt(0));
	}
}