/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_ButtonABlue from "./UI_ButtonABlue";
import UI_ButtonAYellow from "./UI_ButtonAYellow";
import UI_ButtonBack from "./UI_ButtonBack";
import UI_TestPanel from "./UI_TestPanel";

export default class TestBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_ButtonABlue.URL, UI_ButtonABlue);
		fgui.UIObjectFactory.setExtension(UI_ButtonAYellow.URL, UI_ButtonAYellow);
		fgui.UIObjectFactory.setExtension(UI_ButtonBack.URL, UI_ButtonBack);
		fgui.UIObjectFactory.setExtension(UI_TestPanel.URL, UI_TestPanel);
	}
}