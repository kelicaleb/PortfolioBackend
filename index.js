import express from 'express'; 
import dotenv from 'dotenv'; 
import { Sequelize, DataTypes} from 'sequelize'



const app = express()
dotenv.config()
const port = process.env.PORT;
app.use(express.json())


const sequelize = new Sequelize("postgres", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host:process.env.DB_HOST, 
    logging: console.log, 
    dialect: "postgres"
 })


 const emails = sequelize.define('emails', { 
    emails_id:{ 
        type: DataTypes.INTEGER, 
        allowNull:true, 
        primaryKey:true
    }, 
    emails:{ 
        type: DataTypes.STRING, 
        allowNull:false
    }, 
    messages:{ 
        type: DataTypes.STRING, 
        allowNull: false
    }
 }, 
{
    tableName:"emails", 
    timestamps:false
})

emails.sync()
.then((res) => console.log("Connected to emails successfully", res))

app.get("/", async (req, res) => { 
    try{ 
        const findEmails = await emails.findAll()
        return res.status(200).json(findEmails)
    }
    catch(err){ 
        console.log("error fetching emails", err)
    }
})


app.listen(port, () => 
{
    console.log(`server is running on ${port}`)
})





