const getIndex = async (req, res, next) => {
  try {
    if (req.isAuthenticated())
      res.render("index", {
        isAuth: req.isAuthenticated(),
      });
    else res.redirect("/log-in");
  } catch (error) {
    console.error("Error in getMessages controller", error);
    next(error);
  }
};

module.exports = {
  getIndex,
};
