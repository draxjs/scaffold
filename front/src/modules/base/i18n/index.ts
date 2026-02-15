import merge from "deepmerge";
import {homeI18n} from "./home-i18n"

const baseI18n = merge.all([
  homeI18n
])

export default baseI18n
export {
  baseI18n
}
