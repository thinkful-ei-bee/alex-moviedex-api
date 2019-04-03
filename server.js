require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./store')


const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

app.get('/movie',(req,res)=>{
    const{genre,country,avg_vote}=req.query;

    let ans=movies;
    if(genre!==undefined){
        ans = ans.filter(i => i.genre.toUpperCase().includes(genre.toUpperCase())); 
    }
    if(country!==undefined){
        ans = ans.filter(i => i.country.toUpperCase().includes(country.toUpperCase()));   
    }
    if(avg_vote!==undefined){
        ans = ans.filter(i => Number(i.avg_vote)>=Number(avg_vote));   
    }
    res.json(ans)
});

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  //console.log(`Server listening at http://localhost:${PORT}`)
})