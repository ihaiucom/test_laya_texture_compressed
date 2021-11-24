/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_ButtonABlue from "./UI_ButtonABlue";
import UI_ButtonAYellow from "./UI_ButtonAYellow";
import UI_ButtonBack from "./UI_ButtonBack";

export default class UI_TestPanel extends fgui.GComponent {

	public m_bg:fgui.GImage;
	public m_btnBlue:UI_ButtonABlue;
	public m_btnYellow:UI_ButtonAYellow;
	public m_btnBack:UI_ButtonBack;
	public static URL:string = "ui://jchavkemu9i50";

	public static createInstance():UI_TestPanel {
		return <UI_TestPanel>(fgui.UIPackage.createObject("Test", "TestPanel"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChildAt(0));
		this.m_btnBlue = <UI_ButtonABlue>(this.getChildAt(1));
		this.m_btnYellow = <UI_ButtonAYellow>(this.getChildAt(2));
		this.m_btnBack = <UI_ButtonBack>(this.getChildAt(3));
	}
}