import { GetterTree } from 'vuex'
import { RootState } from '../index'
import { UserState } from './state'
import { App, AppRole, AppRoleUser, UserInfo } from './types'

type UserGetters = {
  getAdminApps (state: UserState): Array<App>
  getGenesisRole (state: UserState): AppRole
  getGenesisUsers (state: UserState): Array<AppRoleUser>
  getLoginedUser (state: UserState): UserInfo
  getLogined (state: UserState): boolean
  getGoogleToken (state: UserState): string
}

const getters: GetterTree<UserState, RootState> & UserGetters = {
  getAdminApps: (state: UserState): Array<App> => state.AdminApps,
  getGenesisRole: (state: UserState): AppRole => state.GensisRole as AppRole,
  getGenesisUsers: (state: UserState): Array<AppRoleUser> => {
    const users = [] as Array<AppRoleUser>
    state.GenesisUsers?.forEach((appUsers: Array<AppRoleUser>) => {
      appUsers.forEach((user) => {
        users.push(user)
      })
    })
    return users
  },
  getLoginedUser: (state: UserState): UserInfo => state.LoginedUser,
  getLogined: (state: UserState): boolean => {
    return state.LoginedUser.UserID !== '' && state.LoginedUser.UserID !== undefined
  },
  getGoogleToken: (state: UserState): string => state.GoogleToken
}

export { UserGetters, getters }
