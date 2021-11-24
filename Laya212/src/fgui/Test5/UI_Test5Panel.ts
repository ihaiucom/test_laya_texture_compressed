/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Test5Panel extends fgui.GComponent {

	public m_btn:fgui.GButton;
	public static URL:string = "ui://jor1ejw3f7t85";

	public static createInstance():UI_Test5Panel {
		return <UI_Test5Panel>(fgui.UIPackage.createObject("Test5", "Test5Panel"));
	}

	protected onConstruct():void {
		this.m_btn = <fgui.GButton>(this.getChildAt(0));
	}
}