/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Test3Panel extends fgui.GComponent {

	public m_title11:fgui.GTextField;
	public m_title2:fgui.GTextField;
	public m_title1:fgui.GTextField;
	public m_title2_2:fgui.GTextField;
	public static URL:string = "ui://j09v5djqf7t82";

	public static createInstance():UI_Test3Panel {
		return <UI_Test3Panel>(fgui.UIPackage.createObject("Test3", "Test3Panel"));
	}

	protected onConstruct():void {
		this.m_title11 = <fgui.GTextField>(this.getChildAt(0));
		this.m_title2 = <fgui.GTextField>(this.getChildAt(1));
		this.m_title1 = <fgui.GTextField>(this.getChildAt(2));
		this.m_title2_2 = <fgui.GTextField>(this.getChildAt(3));
	}
}