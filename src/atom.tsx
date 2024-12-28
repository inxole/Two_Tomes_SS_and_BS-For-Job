import { atom } from "recoil"

export const Text_Switch_Freedom = atom({ key: 'TSF', default: false })
export const Text_Switch_Automatic = atom({ key: 'TSA', default: false })
export const Long_Text = atom({ key: 'LT', default: "page_1" })
export const BookMark = atom({ key: 'BM', default: 0 })
export const SliderSwitch = atom({ key: 'SS', default: false })
export const TextReSize = atom({ key: 'TRS', default: 22 })
export const EditingTextNumber = atom({ key: 'ETN', default: 0 })
export const PagesText = atom({ key: 'PT', default: Array.from({ length: 100 }, (_, i) => `page_${i + 1}`) })
export const InitCamera = atom({ key: 'IC', default: true })
export const Camera_BS = atom({ key: 'C_BS', default: false })
export const Camera_SS = atom({ key: 'C_SS', default: false })
export const ChangeSize = atom({ key: 'CS', default: { size: false, management: false } })
export const DeviceMobile = atom({ key: 'DM', default: false })