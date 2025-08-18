export type SettingModalTabs = 'appearance' | 'system';

export interface SettingAppearance {
  titlePageColorDefault: number;
  titlePageColorCode: string | null;
  navbarColorDefault: number;
  navbarColorCode: string | null;
  navbarIconColorDefault: number;
  navbarIconColorCode: string | null;
  sideMenuColorDefaultNotSelectedItem: number;
  sideMenuColorCodeNotSelectedItem: string | null;
  sideMenuColorDefaultSelectedItem: number;
  sideMenuColorCodeSelectedItem: string | null;
  sideMenuColorDefaultNotSelectedIcon: number;
  sideMenuColorCodeNotSelectedIcon: string | null;
  sideMenuColorDefaultSelectedIcon: number;
  sideMenuColorCodeSelectedIcon: string | null;
}

export interface Appearance {
  title_page_color_default: number;
  title_page_color_code: string | null;
  navbar_color_default: number;
  navbar_color_code: string | null;
  navbar_icon_color_default: number;
  navbar_icon_color_code: string | null;
  side_menu_color_default_not_selected_item: number;
  side_menu_color_code_not_selected_item: string | null;
  side_menu_color_default_selected_item: number;
  side_menu_color_code_selected_item: string | null;
  side_menu_color_default_not_selected_icon: number;
  side_menu_color_code_not_selected_icon: string | null;
  side_menu_color_default_selected_icon: number;
  side_menu_color_code_selected_icon: string | null;
}
