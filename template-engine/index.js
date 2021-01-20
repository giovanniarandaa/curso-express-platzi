const express = require('express')
const app = express();
const expressJsx = require('./express-jsx')

app.engine('.jsx', expressJsx)
app.set('views', './views')
app.set('view engine', 'jsx')

app.get('/', function(req, res) {
    res.render('index', { hello: 'Hola', world: 'Mundo genial'})
})

const server = app.listen(8000, function() {
    console.log(`http://localhost:${server.address().port}`)
})