export const validateUser = (userData: { username: string; password: string }) => {
  const { username, password } = userData

  if (!username) {
    return { valid: false, message: '用户名不能为空' }
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: '用户名长度应在 3-20 个字符之间' }
  }

  if (!password) {
    return { valid: false, message: '密码不能为空' }
  }
  if (password.length < 6 || password.length > 20) {
    return { valid: false, message: '密码长度应在 6-20 个字符之间' }
  }

  // 可选：增强密码复杂度
  // const strongPwd = /^(?=.*[a-zA-Z])(?=.*\d).+$/
  // if (!strongPwd.test(password)) {
  //   return { valid: false, message: '密码必须包含字母和数字' }
  // }

  return { valid: true, message: '验证通过' }
}
