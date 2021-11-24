/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Btn extends fgui.GComponent {

	public m_icon:fgui.GImage;
	public m_t0:fgui.Transition;
	public static URL:string = "ui://jor1ejw3f7t81";

	public static createInstance():UI_Btn {
		return <UI_Btn>(fgui.UIPackage.createObject("Test5", "Btn"));
	}

	protected onConstruct():void {
		this.m_icon = <fgui.GImage>(this.getChildAt(0));
		this.m_t0 = this.getTransitionAt(0);
	}
}