import { GetterTree } from 'vuex'
import { RootState } from '../index'
import { UserState } from './state'
import { App, UserInfo } from './types'

type UserGetters = {
  getAdminApps (state: UserState): Array<App>
  getLoginedUser (state: UserState): UserInfo
  getLogined (state: UserState): boolean
  getGoogleToken (state: UserState): string
}

const getters: GetterTree<UserState, RootState> & UserGetters = {
  getAdminApps: (state: UserState): Array<App> => state.AdminApps,
  getLoginedUser: (state: UserState): UserInfo => state.LoginedUser,
  getLogined: (state: UserState): boolean => {
    return state.LoginedUser.UserID !== '' && state.LoginedUser.UserID !== undefined
  },
  getGoogleToken: (state: UserState): string => state.GoogleToken
}

export { UserGetters, getters }
