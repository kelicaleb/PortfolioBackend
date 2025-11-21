import express from 'express'; 
import dotenv from 'dotenv'; 
import { Sequelize, DataTypes} from 'sequelize'



const app = express()
dotenv.config()
const port = process.env.PORT || 10000;
app.use(express.json())


// Instead of separate variables, use DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: console.log, 
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Render
    }
  }
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





