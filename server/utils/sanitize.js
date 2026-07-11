const sanitizeUser = (user) => {
  if (!user) {
    return user
  }

  const safeUser =
    typeof user.toObject === "function" ? user.toObject() : { ...user }

  delete safeUser.password
  delete safeUser.token
  delete safeUser.resetPasswordToken
  delete safeUser.resetPasswordExpires
  delete safeUser.__v

  return safeUser
}

module.exports = { sanitizeUser }
