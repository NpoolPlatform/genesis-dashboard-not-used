import { LoginType } from './const'
import { IReCaptchaComposition } from 'vue-recaptcha-v3'
import { ReqMessage } from '../notifications/types'

interface App {
  ID: string
  CreatedBy: string
  Name: string
  Logo: string
  Description: string
  CreateAt: number
}

interface GetAdminAppsRequest {
  Message: ReqMessage
}

interface GetAdminAppsResponse {
  Infos: Array<App>
}

interface CreateAdminAppsRequest {
  Message: ReqMessage
}

interface CreateAdminAppsResponse {
  Infos: Array<App>
}

interface LoginRequest {
  Username: string
  Password: string
  LoginType: LoginType
  GoogleRecaptchaResponse: string
  Message: ReqMessage
}

interface UserInfo {
  UserID: string
  Username: string
  EmailAddress: string
  Avatar: string
  PhoneNO: string
  MyInfo: unknown
}

interface LoginResponse {
  Info: {
    UserBasicInfo: UserInfo
  }
}

interface GetGoogleTokenRequest {
  Recaptcha: IReCaptchaComposition | undefined
  Req: string
  Message: ReqMessage
}

export {
  LoginRequest,
  LoginResponse,
  UserInfo,
  GetGoogleTokenRequest,
  App,
  GetAdminAppsRequest,
  GetAdminAppsResponse,
  CreateAdminAppsRequest,
  CreateAdminAppsResponse
}