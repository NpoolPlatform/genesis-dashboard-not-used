import { MutationTree } from 'vuex'
import { MutationTypes } from './mutation-types'
import { UserState, state as emptyState } from './state'
import { App, UserInfo } from './types'

type UserMutations<S = UserState> = {
  [MutationTypes.SetAdminApps] (state: S, payload: Array<App>): void
  [MutationTypes.SetLoginedUser] (state: S, payload: UserInfo): void
  [MutationTypes.SetGoogleToken] (state: S, payload: string): void
  [MutationTypes.Reset] (state: S): void
}

const mutations: MutationTree<UserState> & UserMutations = {
  [MutationTypes.SetAdminApps] (state: UserState, payload: Array<App>) {
    state.AdminApps = payload
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
