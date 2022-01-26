<template>
  <div class='login-input'>
    <q-input
      v-model='username'
      :label='$t("MSG_USERNAME")'
    >
      <template #prepend>
        <q-icon name='account_circle' />
      </template>
    </q-input>
    <q-input
      v-model='password'
      :label='$t("MSG_PASSWORD")'
    >
      <template #prepend>
        <q-icon name='lock' />
      </template>
    </q-input>
    <div class='row'>
      <q-btn
        no-caps
        :label='$t("MSG_SIGNIN")'
        class='login-btn login-btn-left'
        @click='onLoginClick'
      />
      <q-btn
        no-caps
        :label='$t("MSG_CONTACT_ADMIN")'
        class='login-btn login-btn-right'
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'

import { useStore } from '../../store'
import { ActionTypes as UserActionTypes } from '../../store/genesis/action-types'
import { MutationTypes as UserMutationTypes } from '../../store/genesis/mutation-types'
import { LoginType } from '../../store/genesis/const'
import { FunctionVoid } from '../../types/types'
import { ModuleKey, Type as NotificationType } from 'src/store/notifications/const'
import { MutationTypes as NotificationMutationTypes } from 'src/store/notifications/mutation-types'
import { notificationPop, notify } from 'src/store/notifications/helper'
import { useI18n } from 'vue-i18n'
import { encryptPassword } from 'src/utils/utils'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const username = ref('')
const password = ref('')

const store = useStore()
const router = useRouter()
const recaptcha = useReCaptcha()

const googleToken = computed({
  get: () => store.getters.getGoogleToken,
  set: (val) => {
    store.commit(UserMutationTypes.SetGoogleToken, val)
  }
})

const unsubscribe = ref<FunctionVoid>()

const onLoginClick = () => {
  googleToken.value = ''
  store.dispatch(UserActionTypes.GetGoogleToken,
    {
      Recaptcha: recaptcha,
      Req: 'login',
      Message: {
        ModuleKey: ModuleKey.ModuleLogin,
        Error: {
          Title: t('MSG_GOOGLE_TOKEN_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }
  )
}

onMounted(() => {
  unsubscribe.value = store.subscribe((mutation) => {
    if (mutation.type === UserMutationTypes.SetLoginedUser) {
      void router.push('/')
    }

    if (mutation.type === UserMutationTypes.SetGoogleToken) {
      if (mutation.payload === '') {
        return
      }

      // TODO: validate input
      store.dispatch(UserActionTypes.Login, {
        Username: username.value,
        Password: encryptPassword(password.value),
        GoogleRecaptchaResponse: mutation.payload as string,
        LoginType: LoginType.USERNAME,
        Message: {
          ModuleKey: ModuleKey.ModuleLogin,
          Error: {
            Title: t('MSG_LOGIN_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      })
    }

    if (mutation.type === NotificationMutationTypes.Push) {
      const notification = store.getters.peekNotification(ModuleKey.ModuleLogin)
      if (notification) {
        notify(notification)
        store.commit(NotificationMutationTypes.Pop, notificationPop(notification))
      }
    }
  })
})

onUnmounted(() => {
  unsubscribe.value?.()
})

</script>

<style lang='sass' scoped>
.login-input
  width: 400px

.login-btn
  margin-top: 24px
  width: 195px
  background-color: $blue-6
  color: white
  border-radius: 12px

.login-btn-left
  margin-right: 5px

.login-btn-right
  margin-left: 5px
</style>
