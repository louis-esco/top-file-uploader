const getIndex = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.redirect("/log-in");
    res.redirect("/folder");
  } catch (error) {
    console.error("Error in getIndex controller", error);
    next(error);
  }
};

module.exports = {
  getIndex,
};
