enum API {
  GET_ADMIN_APPS = '/appuser-manager/v1/get/admin/apps',
  CREATE_ADMIN_APPS = '/appuser-manager/v1/create/admin/apps',
  GET_GENESIS_ROLE = '/appuser-manager/v1/get/genesis/role',
  CREATE_GENESIS_ROLE = '/appuser-manager/v1/create/genesis/role',
  CREATE_GENESIS_ROLE_USER = '/appuser-manager/v1/create/genesis/role/user',
  GET_APP_ROLE_USER_BY_APP_ROLE = '/appuser-manager/v1/get/app/role/user/by/app/role',
  LOGIN = '/login-door/v1/login',
  LOGOUT = '/login-door/v1/logout'
}

enum LoginType {
  PHONE_NO = 'phone_no',
  EMAIL_ADDRESS = 'email_address',
  USERNAME = 'username'
}

export {
  API,
  LoginType
}
