const getIndex = async (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    console.error("Error in getMessages controller", error);
    next(error);
  }
};

module.exports = {
  getIndex,
};
