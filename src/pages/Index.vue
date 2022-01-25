<template>
  <div>
    <q-table
      dense
      :rows='adminApps'
    >
      <template #top-right>
        <q-btn v-if='adminApps.length !== 2' @click='onCreateAdminApps'>
          {{ $t('MSG_CREATE_ADMIN_APPS') }}
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'
import { ActionTypes as GenesisActionTypes } from 'src/store/genesis/action-types'
import { ModuleKey, Type as NotificationType } from 'src/store/notifications/const'
import { useI18n } from 'vue-i18n'
import { FunctionVoid } from '../types/types'
import { MutationTypes } from 'src/store/genesis/mutation-types'
import { App } from 'src/store/genesis/types'

const store = useStore()

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const unsubscribe = ref<FunctionVoid>()

const logined = computed(() => store.getters.getLogined)
const adminApps = computed(() => store.getters.getAdminApps)

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

onMounted(() => {
  unsubscribe.value = store.subscribe((mutation) => {
    if (mutation.type === MutationTypes.SetAdminApps) {
      const apps = mutation.payload as Array<App>
      if (apps.length === 2 && !logined.value) {
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
