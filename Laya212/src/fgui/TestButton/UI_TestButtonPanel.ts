/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_TestButtonPanel extends fgui.GComponent {

	public m_png_add:fgui.GButton;
	public m_png_remove:fgui.GButton;
	public m_astc_add:fgui.GButton;
	public m_astc_remove:fgui.GButton;
	public m_png_removeall:fgui.GButton;
	public m_astc_removeall:fgui.GButton;
	public m_png_addall:fgui.GButton;
	public m_astc_addall:fgui.GButton;
	public m_ktx_add:fgui.GButton;
	public m_ktx_remove:fgui.GButton;
	public m_ktx_removeall:fgui.GButton;
	public m_ktx_addall:fgui.GButton;
	public m_ktx1_add:fgui.GButton;
	public m_ktx1_remove:fgui.GButton;
	public m_ktx1_removeall:fgui.GButton;
	public m_ktx1_addall:fgui.GButton;
	public m_ktxr_add:fgui.GButton;
	public m_ktxr_remove:fgui.GButton;
	public m_ktxr_removeall:fgui.GButton;
	public m_ktxr_addall:fgui.GButton;
	public m_dds_add:fgui.GButton;
	public m_dds_remove:fgui.GButton;
	public m_dds_removeall:fgui.GButton;
	public m_dds_addall:fgui.GButton;
	public static URL:string = "ui://85ybivoejqfk1";

	public static createInstance():UI_TestButtonPanel {
		return <UI_TestButtonPanel>(fgui.UIPackage.createObject("TestButton", "TestButtonPanel"));
	}

	protected onConstruct():void {
		this.m_png_add = <fgui.GButton>(this.getChildAt(0));
		this.m_png_remove = <fgui.GButton>(this.getChildAt(1));
		this.m_astc_add = <fgui.GButton>(this.getChildAt(3));
		this.m_astc_remove = <fgui.GButton>(this.getChildAt(4));
		this.m_png_removeall = <fgui.GButton>(this.getChildAt(6));
		this.m_astc_removeall = <fgui.GButton>(this.getChildAt(7));
		this.m_png_addall = <fgui.GButton>(this.getChildAt(8));
		this.m_astc_addall = <fgui.GButton>(this.getChildAt(9));
		this.m_ktx_add = <fgui.GButton>(this.getChildAt(10));
		this.m_ktx_remove = <fgui.GButton>(this.getChildAt(11));
		this.m_ktx_removeall = <fgui.GButton>(this.getChildAt(13));
		this.m_ktx_addall = <fgui.GButton>(this.getChildAt(14));
		this.m_ktx1_add = <fgui.GButton>(this.getChildAt(15));
		this.m_ktx1_remove = <fgui.GButton>(this.getChildAt(16));
		this.m_ktx1_removeall = <fgui.GButton>(this.getChildAt(18));
		this.m_ktx1_addall = <fgui.GButton>(this.getChildAt(19));
		this.m_ktxr_add = <fgui.GButton>(this.getChildAt(20));
		this.m_ktxr_remove = <fgui.GButton>(this.getChildAt(21));
		this.m_ktxr_removeall = <fgui.GButton>(this.getChildAt(23));
		this.m_ktxr_addall = <fgui.GButton>(this.getChildAt(24));
		this.m_dds_add = <fgui.GButton>(this.getChildAt(25));
		this.m_dds_remove = <fgui.GButton>(this.getChildAt(26));
		this.m_dds_removeall = <fgui.GButton>(this.getChildAt(28));
		this.m_dds_addall = <fgui.GButton>(this.getChildAt(29));
	}
}