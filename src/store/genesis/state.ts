import { UserInfo, App, AppRole, AppRoleUser, AppUser } from './types'

interface UserState {
  LoginedUser: UserInfo
  GoogleToken: string
  AdminApps: Array<App>
  GensisRole?: AppRole
  GenesisUsers: Map<string, Array<AppRoleUser>>
  Users: Map<string, AppUser>
}

function state (): UserState {
  return {
    LoginedUser: {},
    GoogleToken: '',
    AdminApps: [] as Array<App>,
    GenesisUsers: new Map<string, Array<AppRoleUser>>(),
    Users: new Map<string, AppUser>()
  }
}

export { state, UserState }
