// Use this method id express-async-errors does not works for your project.

module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
}
