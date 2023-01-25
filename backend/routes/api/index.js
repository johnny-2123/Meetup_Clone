
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const eventsRouter = require('./events.js');
const groupsRouter = require('./groups.js');
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/events', eventsRouter);

router.use('/groups', groupsRouter);

router.get('/test', (req, res) => {
    res.json('hello');
});
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
