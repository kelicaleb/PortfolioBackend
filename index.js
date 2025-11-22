import express from 'express'
import dotenv from 'dotenv'
import { Sequelize, DataTypes} from 'sequelize'
import cors from 'cors'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT

const databaseUrl = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;
const sequelize = new Sequelize(databaseUrl, {
    logging: console.log,
    dialect: "postgres",
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});

let emails;
if (sequelize) {
  emails = sequelize.define("emails", {
    emails_id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull: true,
        autoIncrement:true
    },
    emails: {
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
});
} else {
  emails = null;
}

app.get("/", async(req, res)=>
{
    try{
        await sequelize.authenticate();
        const findEmails = await emails.findAll()
        return res.status(200).json(findEmails)

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