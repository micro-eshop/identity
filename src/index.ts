import starup from "./api/starup";

(async () => {
  try {
    var { app, sequelize } = await starup();
    app.on("close", () => {
      sequelize.close()
    })
    app.listen(3000)
  } catch (e) {
    console.error(e)
  }
  // `text` is not available here
})();