import { UserInfo, App, AppRole, AppRoleUser } from './types'

interface UserState {
  LoginedUser: UserInfo
  GoogleToken: string
  AdminApps: Array<App>
  GensisRole?: AppRole
  GenesisUsers? :Map<string, Array<AppRoleUser>>
}

function state (): UserState {
  return {
    LoginedUser: {
      UserID: '',
      Username: '',
      EmailAddress: '',
      Avatar: '',
      PhoneNO: '',
      MyInfo: {}
    },
    GoogleToken: '',
    AdminApps: [] as Array<App>
  }
}

export { state, UserState }
