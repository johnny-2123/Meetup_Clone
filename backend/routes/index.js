
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const { setTokenCookie } = require('../utils/auth.js');
const { User } = require('../db/models');
const { restoreUser } = require('../utils/auth.js')

router.use('/api', apiRouter);
router.use(restoreUser);

// router.get(
//     '/api/restore-user',
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

// router.get('/api/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user });
// })

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

module.exports = router;
