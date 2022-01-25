import { ActionTree } from 'vuex'
import { AugmentedActionContext, RootState } from '../index'
import { ActionTypes } from './action-types'
import { MutationTypes } from './mutation-types'
import { UserMutations } from './mutations'
import { UserState } from './state'
import { LoginRequest, LoginResponse, GetGoogleTokenRequest, GetAdminAppsRequest, GetAdminAppsResponse, CreateAdminAppsRequest, CreateAdminAppsResponse } from './types'
import { API } from './const'
import { MutationTypes as NotificationMutationTypes } from '../notifications/mutation-types'
import { notificationPush, notificationPop } from '../notifications/helper'
import { Notification } from '../notifications/types'
import { doAction } from '../action'

interface UserActions {
  [ActionTypes.GetAdminApps]({
    commit
  }: AugmentedActionContext<
    UserState,
    RootState,
    UserMutations<UserState>>,
    req: GetAdminAppsRequest): void

  [ActionTypes.CreateAdminApps]({
    commit
  }: AugmentedActionContext<
    UserState,
    RootState,
    UserMutations<UserState>>,
    req: CreateAdminAppsRequest): void

  [ActionTypes.Login]({
    commit
  }: AugmentedActionContext<
    UserState,
    RootState,
    UserMutations<UserState>>,
    req: LoginRequest): void

  [ActionTypes.GetGoogleToken]({
    commit
  }: AugmentedActionContext<
    UserState,
    RootState,
    UserMutations<UserState>>,
    req: GetGoogleTokenRequest): void
}

const actions: ActionTree<UserState, RootState> = {
  [ActionTypes.GetAdminApps] ({ commit }, req: GetAdminAppsRequest) {
    doAction<GetAdminAppsRequest, GetAdminAppsResponse>(
      commit,
      API.GET_ADMIN_APPS,
      req,
      req.Message,
      (resp: GetAdminAppsResponse): void => {
        commit(MutationTypes.SetAdminApps, resp.Infos)
      })
  },

  [ActionTypes.CreateAdminApps] ({ commit }, req: CreateAdminAppsRequest) {
    doAction<CreateAdminAppsRequest, CreateAdminAppsResponse>(
      commit,
      API.CREATE_ADMIN_APPS,
      req,
      req.Message,
      (resp: CreateAdminAppsResponse): void => {
        commit(MutationTypes.SetAdminApps, resp.Infos)
      })
  },

  [ActionTypes.Login] ({ commit }, req: LoginRequest) {
    doAction<LoginRequest, LoginResponse>(
      commit,
      API.LOGIN,
      req,
      req.Message,
      (resp: LoginResponse): void => {
        commit(MutationTypes.SetLoginedUser, {
          UserID: resp.Info.UserBasicInfo.UserID,
          Username: resp.Info.UserBasicInfo.Username,
          EmailAddress: resp.Info.UserBasicInfo.EmailAddress,
          Avatar: resp.Info.UserBasicInfo.Avatar,
          PhoneNO: resp.Info.UserBasicInfo.PhoneNO,
          MyInfo: resp.Info
        })
      })
  },

  [ActionTypes.GetGoogleToken] ({ commit }, req: GetGoogleTokenRequest) {
    const recaptcha = req.Recaptcha
    if (recaptcha) {
      const { executeRecaptcha, recaptchaLoaded } = recaptcha
      let waitingNotification: Notification
      if (req.Message.Waiting) {
        waitingNotification = notificationPush(req.Message.ModuleKey, req.Message.Waiting)
        commit(NotificationMutationTypes.Push, waitingNotification)
      }
      recaptchaLoaded()
        .then((loaded: boolean) => {
          if (loaded) {
            void executeRecaptcha(req.Req)
              .then((token) => {
                commit(MutationTypes.SetGoogleToken, token)
                if (waitingNotification) {
                  commit(NotificationMutationTypes.Pop, notificationPop(waitingNotification))
                }
              })
              .catch((err: Error) => {
                const error = req.Message.Error
                if (error) {
                  error.Description = err.message
                  const errorNotification = notificationPush(req.Message.ModuleKey, error)
                  commit(NotificationMutationTypes.Push, errorNotification)
                }
              })
          }
        })
        .catch((err: Error) => {
          const error = req.Message.Error
          if (error) {
            error.Description = err.message as string | undefined
            const errorNotification = notificationPush(req.Message.ModuleKey, error)
            commit(NotificationMutationTypes.Push, errorNotification)
          }
        })
    }
  }
}

export { actions, UserActions }
