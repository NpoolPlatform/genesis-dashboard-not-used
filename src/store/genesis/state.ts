import { UserInfo, App, AppRole } from './types'

interface UserState {
  LoginedUser: UserInfo
  GoogleToken: string
  AdminApps: Array<App>
  GensisRole?: AppRole
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
