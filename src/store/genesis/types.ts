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

interface AppRole {
  ID: string
  AppID: string
  CreatedBy: string
  Role: string
  Description: string
  Default: boolean
}

interface GetGenesisRoleRequest {
  Message: ReqMessage
}

interface GetGenesisRoleResponse {
  Info: AppRole
}

interface CreateGenesisRoleRequest {
  Message: ReqMessage
}

interface CreateGenesisRoleResponse {
  Info: AppRole
}

interface AppRoleUser {
  ID: string
  AppID: string
  RoleID: string
  UserID: string
}

interface GetGenesisAppRoleUsersByOtherAppRequest {
  TargetAppID: string,
  Message: ReqMessage
}

interface GetGenesisAppRoleUsersByOtherAppResponse {
  Infos: Array<AppRoleUser>
}

interface AppUser {
  ID?: string
  AppID: string
  EmailAddress?: string
  PhoneNO?: string
  ImportedFromApp?: string
  CreateAt?: number
}

interface AppUserSecret {
  ID?: string
  AppID: string
  UserID?: string
  PasswordHash: string
  Salt?: string
  GoogleSecret?: string
}

interface GetAppUserRequest {
  ID: string
  Message: ReqMessage
}

interface GetAppUserResponse {
  Info: AppUser
}

interface CreateGenesisUserRequest {
  User: AppUser
  Secret: AppUserSecret
  Message: ReqMessage
}

interface CreateGenesisUserResponse {
  User: AppUser
  RoleUser: AppRoleUser
}

interface LoginRequest {
  Account: string
  PasswordHash: string
  ManMachineSpec: string
  EnvironmentSpec?: string
  LoginType: LoginType
  Token?: string
  Message: ReqMessage
}

interface AppUserExtra {
  ID: string
  AppID: string
  UserID: string
  Username: string
  AddressFields: Array<string>
  Gender: string
  PostalCode: string
  Age: number
  Birthday: number
  Avatar: string
  Organization: string
}

interface AppUserControl {
  ID: string
  AppID: string
  UserID: string
}

interface BanAppUser {
  ID: string
  AppID: string
  UserID: string
  Message: string
}

interface UserInfo {
  User?: AppUser
  Extra?: AppUserExtra
  Ctrl?: AppUserControl
  Ban?: BanAppUser
  Roles?: Array<AppRole>
}

interface LoginResponse {
  Info: UserInfo
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
  CreateAdminAppsResponse,
  AppRole,
  GetGenesisRoleRequest,
  GetGenesisRoleResponse,
  CreateGenesisRoleRequest,
  CreateGenesisRoleResponse,
  AppRoleUser,
  GetGenesisAppRoleUsersByOtherAppRequest,
  GetGenesisAppRoleUsersByOtherAppResponse,
  AppUser,
  GetAppUserRequest,
  GetAppUserResponse,
  CreateGenesisUserRequest,
  CreateGenesisUserResponse,
  AppUserSecret
}
