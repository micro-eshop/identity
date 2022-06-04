import starup from "./api/starup";

(async () => {
  try {
      var app = await starup();
      app.listen(3000)
  } catch (e) {
      console.error(e)
  }
  // `text` is not available here
})();