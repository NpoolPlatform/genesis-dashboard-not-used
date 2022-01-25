import { ActionTree } from 'vuex'
import { AugmentedActionContext, RootState } from '../index'
import { ActionTypes } from './action-types'
import { MutationTypes } from './mutation-types'
import { UserMutations } from './mutations'
import { UserState } from './state'
import { api } from 'src/boot/axios'
import { LoginRequest, LoginResponse, GetGoogleTokenRequest, GetAdminAppsRequest, GetAdminAppsResponse, CreateAdminAppsRequest, CreateAdminAppsResponse } from './types'
import { API } from './const'
import { MutationTypes as NotificationMutationTypes } from '../notifications/mutation-types'
import { notificationPush, notificationPop } from '../notifications/helper'
import { Notification } from '../notifications/types'
import { AxiosResponse } from 'axios'

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
    let waitingNotification: Notification
    if (req.Message.Waiting) {
      waitingNotification = notificationPush(req.Message.ModuleKey, req.Message.Waiting)
      commit(NotificationMutationTypes.Push, waitingNotification)
    }
    api
      .post<GetAdminAppsRequest, AxiosResponse<GetAdminAppsResponse>>(API.GET_ADMIN_APPS, req)
      .then((response: AxiosResponse<GetAdminAppsResponse>) => {
        commit(MutationTypes.SetAdminApps, response.data.Infos)
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
  },

  [ActionTypes.CreateAdminApps] ({ commit }, req: CreateAdminAppsRequest) {
    let waitingNotification: Notification
    if (req.Message.Waiting) {
      waitingNotification = notificationPush(req.Message.ModuleKey, req.Message.Waiting)
      commit(NotificationMutationTypes.Push, waitingNotification)
    }
    api
      .post<CreateAdminAppsRequest, AxiosResponse<CreateAdminAppsResponse>>(API.CREATE_ADMIN_APPS, req)
      .then((response: AxiosResponse<CreateAdminAppsResponse>) => {
        commit(MutationTypes.SetAdminApps, response.data.Infos)
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
  },

  [ActionTypes.Login] ({ commit }, req: LoginRequest) {
    let waitingNotification: Notification
    if (req.Message.Waiting) {
      waitingNotification = notificationPush(req.Message.ModuleKey, req.Message.Waiting)
      commit(NotificationMutationTypes.Push, waitingNotification)
    }
    api
      .post<LoginRequest, AxiosResponse<LoginResponse>>(API.LOGIN, req)
      .then((response: AxiosResponse<LoginResponse>) => {
        commit(MutationTypes.SetLoginedUser, {
          UserID: response.data.Info.UserBasicInfo.UserID,
          Username: response.data.Info.UserBasicInfo.Username,
          EmailAddress: response.data.Info.UserBasicInfo.EmailAddress,
          Avatar: response.data.Info.UserBasicInfo.Avatar,
          PhoneNO: response.data.Info.UserBasicInfo.PhoneNO,
          MyInfo: response.data.Info
        })
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
