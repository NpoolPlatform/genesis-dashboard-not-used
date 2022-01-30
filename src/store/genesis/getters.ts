import { GetterTree } from 'vuex'
import { RootState } from '../index'
import { UserState } from './state'
import { App, AppRole, AppRoleUser, AppUser, UserInfo } from './types'

type UserGetters = {
  getAdminApps (state: UserState): Array<App>
  getGenesisRole (state: UserState): AppRole
  getGenesisUsers (state: UserState): Array<AppRoleUser>
  getAppUserByUserID (state: UserState): (userID: string) => AppUser
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
  getAppUserByUserID: (state: UserState): (userID: string) => AppUser => {
    return (userID: string) => {
      return state.Users.get(userID) as AppUser
    }
  },
  getLoginedUser: (state: UserState): UserInfo => state.LoginedUser,
  getLogined: (state: UserState): boolean => state.LoginedUser.User !== undefined,
  getGoogleToken: (state: UserState): string => state.GoogleToken
}

export { UserGetters, getters }
