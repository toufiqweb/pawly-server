const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
