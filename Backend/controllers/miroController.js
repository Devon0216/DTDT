const asyncHandler = require('express-async-handler')

// opens the url in the default browser 
const redirectToMiro = asyncHandler(async (req, res) => {
    res.redirect("https://miro.com/oauth/authorize?response_type=code&client_id=3458764560345376881&redirect_uri=https://whiteboarddj.onrender.com/dash/authorize");
})

module.exports = {
    redirectToMiro
}