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
      <template #top-right>
        <q-btn v-if='!genesisUserCreated || !churchUserCreated' @click='onCreateGenesisUser'>
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
const genesisRole = computed(() => store.getters.getGenesisRole)
const genesisUsers = computed(() => store.getters.getGenesisUsers)

const roles = computed(() => genesisRole.value ? [genesisRole.value] : [])

const genesisAppCreated = ref(false)
const churchAppCreated = ref(false)
const genesisUserCreated = ref(false)
const churchUserCreated = ref(false)

watch(adminApps, () => {
  adminApps.value.forEach((app) => {
    if (app.Name === 'Church Dashboard') {
      churchAppCreated.value = true
    }
    if (app.Name === 'Genesis Dashboard') {
      genesisAppCreated.value = true
    }
  })
})

watch(genesisUsers, () => {
  genesisUsers.value.forEach((user) => {
    adminApps.value.forEach((app) => {
      if (app.Name === 'Church Dashboard') {
        if (user.AppID === app.ID && user.RoleID === genesisRole.value.ID) {
          churchUserCreated.value = true
        }
      }
      if (app.Name === 'Genesis Dashboard') {
        if (user.AppID === app.ID && user.RoleID === genesisRole.value.ID) {
          genesisUserCreated.value = true
        }
      }
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
