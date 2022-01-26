<template>
  <div>
    <q-table
      dense
      :rows='adminApps'
    >
      <template #top-right>
        <q-btn v-if='!genesisAppCreated || !churchAppCreated' @click='onCreateAdminApps'>
          {{ $t('MSG_CREATE_ADMIN_APPS') }}
        </q-btn>
      </template>
    </q-table>
    <q-table
      dense
      :rows='roles'
    >
      <template #top-right>
        <q-btn v-if='genesisRole === undefined' @click='onCreateGenesisRole'>
          {{ $t('MSG_CREATE_GENESIS_ROLE') }}
        </q-btn>
      </template>
    </q-table>
    <q-table
      dense
      :rows='genesisUsers'
    >
      <template v-if='!genesisUserCreated || !churchUserCreated' #top-right>
        <div class='row'>
          <q-select v-model='selectedAppID' dense :options='appIDs' :label='$t("MSG_APP_ID")' />
          <q-input v-model='username' dense :label='$t("MSG_USERNAME")' />
          <q-input v-model='password' dense :label='$t("MSG_PASSWORD")' disable />
          <q-btn flat dense icon='published_with_changes' @click='onRefreshPassword' />
        </div>
        <q-btn @click='onCreateGenesisUser'>
          {{ $t('MSG_CREATE_GENESIS_USER') }}
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'
import { ActionTypes as GenesisActionTypes } from 'src/store/genesis/action-types'
import { ModuleKey, Type as NotificationType } from 'src/store/notifications/const'
import { MutationTypes as NotificationMutationTypes } from 'src/store/notifications/mutation-types'
import { notify, notificationPop, notificationPush } from 'src/store/notifications/helper'
import { useI18n } from 'vue-i18n'
import { FunctionVoid } from '../types/types'
import { MutationTypes } from 'src/store/genesis/mutation-types'

const store = useStore()

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const unsubscribe = ref<FunctionVoid>()

const logined = computed(() => store.getters.getLogined)
const adminApps = computed(() => store.getters.getAdminApps)
const adminAppIDs = computed(() => {
  const ids = [] as Array<string>
  adminApps.value.forEach((app) => {
    ids.push(app.ID)
  })
  return ids
})

const appIDs = ref(adminAppIDs.value)

const genesisRole = computed(() => store.getters.getGenesisRole)
const genesisUsers = computed(() => store.getters.getGenesisUsers)

const roles = computed(() => genesisRole.value ? [genesisRole.value] : [])

const genesisAppCreated = ref(false)
const churchAppCreated = ref(false)
const genesisUserCreated = ref(false)
const churchUserCreated = ref(false)
const selectedAppID = ref('')
const username = ref('')
const password = ref('')

const updatePassword = (): string => {
  let password = ''
  const chars = 'a-z,A-Z,0-9,#'
  const charactersArray = chars.split(',')
  let CharacterSet = ''
  if (charactersArray.indexOf('a-z') >= 0) {
    CharacterSet += 'abcdefghijklmnopqrstuvwxyz'
  }
  if (charactersArray.indexOf('A-Z') >= 0) {
    CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  if (charactersArray.indexOf('0-9') >= 0) {
    CharacterSet += '0123456789'
  }
  if (charactersArray.indexOf('#') >= 0) {
    CharacterSet += '![]{}()%&$#@'
  }
  for (let i = 0; i < 16; i++) {
    password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length))
  }
  return password
}

const onRefreshPassword = () => {
  password.value = updatePassword()
}

watch(adminApps, () => {
  adminApps.value.forEach((app) => {
    if (app.Name === 'Church Dashboard') {
      churchAppCreated.value = true
    }
    if (app.Name === 'Genesis Dashboard') {
      genesisAppCreated.value = true
    }
  })
  appIDs.value = adminAppIDs.value
  selectedAppID.value = appIDs.value.length > 0 ? appIDs.value[0] : ''
})

watch(genesisUsers, () => {
  genesisUsers.value.forEach((user) => {
    adminApps.value.forEach((app) => {
      if (app.Name === 'Church Dashboard') {
        if (user.AppID === app.ID && user.RoleID === genesisRole.value.ID) {
          churchUserCreated.value = true
          appIDs.value = adminAppIDs.value.filter((id) => {
            return id !== app.ID
          })
        }
      }
      if (app.Name === 'Genesis Dashboard') {
        if (user.AppID === app.ID && user.RoleID === genesisRole.value.ID) {
          genesisUserCreated.value = true
          appIDs.value = adminAppIDs.value.filter((id) => {
            return id !== app.ID
          })
        }
      }

      selectedAppID.value = appIDs.value.length > 0 ? appIDs.value[0] : ''
    })
  })
})

const onCreateAdminApps = () => {
  store.dispatch(GenesisActionTypes.CreateAdminApps, {
    Message: {
      ModuleKey: ModuleKey.ModuleIndex,
      Error: {
        Title: t('MSG_CREATE_ADMIN_APPS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

const onCreateGenesisRole = () => {
  store.dispatch(GenesisActionTypes.CreateGenesisRole, {
    Message: {
      ModuleKey: ModuleKey.ModuleIndex,
      Error: {
        Title: t('MSG_CREATE_GENESIS_ROLE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

const onCreateGenesisUser = () => {
  if (username.value.length < 8) {
    store.commit(NotificationMutationTypes.Push, notificationPush(ModuleKey.ModuleIndex, {
      Title: t('MSG_USERNAME_LENGTH_WARNING'),
      Popup: true,
      Type: NotificationType.Error
    }))
    return
  }
  if (password.value.length < 8) {
    store.commit(NotificationMutationTypes.Push, notificationPush(ModuleKey.ModuleIndex, {
      Title: t('MSG_PASSWORD_LENGTH_WARNING'),
      Popup: true,
      Type: NotificationType.Warning
    }))
    return
  }
  console.log('TODO: create app user then create app role user')
}

onMounted(() => {
  unsubscribe.value = store.subscribe((mutation) => {
    if (mutation.type === MutationTypes.SetAdminApps) {
      store.dispatch(GenesisActionTypes.GetGenesisRole, {
        Message: {
          ModuleKey: ModuleKey.ModuleIndex,
          Error: {
            Title: t('MSG_GET_GENESIS_ROLE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      })
    }

    if (mutation.type === MutationTypes.SetGenesisRole) {
      adminApps.value.forEach((app) => {
        store.dispatch(GenesisActionTypes.GetAppRoleUsersByAppRole, {
          AppID: app.ID,
          RoleID: genesisRole.value.ID,
          Message: {
            ModuleKey: ModuleKey.ModuleIndex,
            Error: {
              Title: t('MSG_GET_GENESIS_ROLE_FAIL'),
              Popup: true,
              Type: NotificationType.Error
            }
          }
        })
      })
    }

    if (mutation.type === MutationTypes.SetGenesisUsers) {
      if (!logined.value) {
        void router.push('/login')
      }
    }

    if (mutation.type === NotificationMutationTypes.Push) {
      const notification = store.getters.peekNotification(ModuleKey.ModuleIndex)
      if (notification) {
        notify(notification)
        store.commit(NotificationMutationTypes.Pop, notificationPop(notification))
      }
    }
  })

  store.dispatch(GenesisActionTypes.GetAdminApps, {
    Message: {
      ModuleKey: ModuleKey.ModuleIndex,
      Error: {
        Title: t('MSG_GET_ADMIN_APPS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

onUnmounted(() => {
  unsubscribe.value?.()
})

</script>
