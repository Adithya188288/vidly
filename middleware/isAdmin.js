module.exports = function isAdmin(req, res, next) {
  //auth middleware will give us req.user data. so from data we can determine is the user is admin or not

  if (!req.user.isAdmin)
    return res
      .status(403)
      .send("Access Denied.. You do not have the access to delete")

  next()
}
