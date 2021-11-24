/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Test2Panel extends fgui.GComponent {

	public m_bg1:fgui.GLoader;
	public m_bg2:fgui.GLoader;
	public static URL:string = "ui://jltl6uwwf7t80";

	public static createInstance():UI_Test2Panel {
		return <UI_Test2Panel>(fgui.UIPackage.createObject("Test2", "Test2Panel"));
	}

	protected onConstruct():void {
		this.m_bg1 = <fgui.GLoader>(this.getChildAt(0));
		this.m_bg2 = <fgui.GLoader>(this.getChildAt(4));
	}
}