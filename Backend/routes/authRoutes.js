const express = require('express')
const router = express.Router()
const axios = require('axios');

// Authorize function to get the access token from Miro
const getData = async (body) => {
      const options = {
        'method': 'POST',
        'url': `https://api.miro.com/v1/oauth/token?grant_type=authorization_code&client_id=3458764560345376881&client_secret=Ut9LixsPne5ukQbVSPRsqtbfOoUV6QA2&code=${body}&redirect_uri=https://whiteboarddj.onrender.com/dash/authorize`,
        'headers': {
          'accept': 'application/json'
        },
        data: {
          body
        }
      };
    
      try {
        const result = await axios(options);
        return result;
      } catch (e) {
        return e;
      }
}

// Route to get the access token from Miro
router.route('/').post(async function(req, res) {
      try {
        const response = await getData(req.body.code);
        if ( response.response){
          return res.status(401).json({ message: 'Please authorize again, due to invalid authorization code from Miro' })
        }
        res.json(response.data.access_token); 
      } catch (e) {
        console.log(e)
      }
})

module.exports = router