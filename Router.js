var express = require('express');
var router = express.Router();
const authenticateToken = require('./utils/authenticateToken');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.use('/users', authenticateToken, require('./routes/users'));
router.use('/auth', require('./routes/auth'));
router.use('/categories', authenticateToken, require('./routes/category'));
router.use('/subcategories', authenticateToken, require('./routes/subcategory'));
router.use('/comments', authenticateToken, require('./routes/comment'));
router.use('/reviews', authenticateToken, require('./routes/review'));
router.use('/comparisons', authenticateToken, require('./routes/comparison'));
router.use('/articles', authenticateToken, require('./routes/article'));
router.use('/contacts', authenticateToken, require('./routes/contact'));
router.use('/subscriber', authenticateToken, require('./routes/subscriber'));

module.exports = router;
