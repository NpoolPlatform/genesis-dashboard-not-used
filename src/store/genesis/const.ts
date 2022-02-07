enum API {
  GET_ADMIN_APPS = '/appuser-manager/v1/get/admin/apps',
  CREATE_ADMIN_APPS = '/appuser-manager/v1/create/admin/apps',
  GET_GENESIS_ROLE = '/appuser-manager/v1/get/genesis/role',
  CREATE_GENESIS_ROLE = '/appuser-manager/v1/create/genesis/role',
  CREATE_GENESIS_ROLE_USER = '/appuser-manager/v1/create/genesis/role/user',
  GET_GENESIS_APP_ROLE_USERS_BY_OTHER_APP = '/appuser-manager/v1/get/genesis/app/role/users/by/other/app',
  GET_APP_USER = '/appuser-manager/v1/get/app/user',
  LOGIN = '/login-gateway/v1/login',
  LOGOUT = '/login-gateway/v1/logout',
  CREATE_GENESIS_APP_USER_AUTH = '/authing-gateway/v1/create/genesis/app/user/auth',
  GET_AUTHS_BY_OTHER_APP = '/authing-gateway/v1/get/auths/by/other/app'
}

enum LoginType {
  PHONE_NO = 'mobile',
  EMAIL_ADDRESS = 'email'
}

export {
  API,
  LoginType
}
