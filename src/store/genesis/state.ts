import { UserInfo, App } from './types'

interface UserState {
  LoginedUser: UserInfo
  GoogleToken: string
  AdminApps: Array<App>
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
