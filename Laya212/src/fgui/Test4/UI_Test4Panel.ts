/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Test4Panel extends fgui.GComponent {

	public m_mv:fgui.GMovieClip;
	public static URL:string = "ui://jwm9ghs9f7t8d";

	public static createInstance():UI_Test4Panel {
		return <UI_Test4Panel>(fgui.UIPackage.createObject("Test4", "Test4Panel"));
	}

	protected onConstruct():void {
		this.m_mv = <fgui.GMovieClip>(this.getChildAt(0));
	}
}