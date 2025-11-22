import express from 'express'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import cors from 'cors'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
})

app.get("/", async(req, res)=>
{
    if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
        console.log("Missing database environment variables")
        return res.status(500).json({message: "Server configuration error"})
    }
    try{
        const [results] = await sequelize.query('SELECT * FROM emails')
        return res.status(200).json(results)

    }
    catch(err){
        console.log("error fetching emails", err)
        return res.status(500).json({message: "error fetching emails"})
    }
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log("server is running on port", port)
    })
}

export default app;