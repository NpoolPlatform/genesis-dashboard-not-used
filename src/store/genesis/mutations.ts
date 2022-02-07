import { MutationTree } from 'vuex'
import { MutationTypes } from './mutation-types'
import { UserState, state as emptyState } from './state'
import { App, AppRole, AppRoleUser, AppUser, Auth, UserInfo } from './types'

type UserMutations<S = UserState> = {
  [MutationTypes.SetAdminApps] (state: S, payload: Array<App>): void
  [MutationTypes.SetGenesisRole] (state: S, payload: AppRole): void
  [MutationTypes.SetGenesisUsers] (state: S, payload: Array<AppRoleUser>): void
  [MutationTypes.SetGenesisAuths] (state: S, payload: Array<Auth>): void
  [MutationTypes.SetAppUsers] (state: S, payload: AppUser): void
  [MutationTypes.SetLoginedUser] (state: S, payload: UserInfo): void
  [MutationTypes.SetGoogleToken] (state: S, payload: string): void
  [MutationTypes.Reset] (state: S): void
}

const mutations: MutationTree<UserState> & UserMutations = {
  [MutationTypes.SetAdminApps] (state: UserState, payload: Array<App>) {
    state.AdminApps = payload
  },
  [MutationTypes.SetGenesisRole] (state: UserState, payload: AppRole) {
    state.GensisRole = payload
  },
  [MutationTypes.SetGenesisUsers] (state: UserState, payload: Array<AppRoleUser>) {
    let appID = ''
    payload.forEach((user) => {
      appID = user.AppID
    })
    state.GenesisUsers.set(appID, payload)
  },
  [MutationTypes.SetGenesisAuths] (state: UserState, payload: Array<Auth>) {
    const auths = state.GenesisAuths
    payload.forEach((auth) => {
      for (let i = 0; i < auths.length; i++) {
        if (auths[i].ID === auth.ID) {
          return
        }
        auths.push(auth)
      }
    })
    state.GenesisAuths = auths
  },
  [MutationTypes.SetAppUsers] (state: UserState, payload: AppUser) {
    state.Users.set(payload.ID as string, payload)
  },
  [MutationTypes.SetLoginedUser] (state: UserState, payload: UserInfo) {
    state.LoginedUser = payload
  },
  [MutationTypes.SetGoogleToken] (state: UserState, payload: string): void {
    state.GoogleToken = payload
  },
  [MutationTypes.Reset] (state: UserState) {
    Object.assign(state, { ...emptyState })
  }
}

export { UserMutations, mutations }
