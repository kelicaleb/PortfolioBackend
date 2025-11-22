import express from 'express'
import dotenv from 'dotenv'
import { Sequelize, DataTypes} from 'sequelize'
import cors from 'cors'



const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT


const sequelize = new Sequelize("postgres", process.env.USERNAME, process.env.PASSWORD, { 
    host: process.env.HOST, 
    logging: console.log, 
    dialect: "postgres"
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

app.get("/", async (req, res) => {
  try {
    if (!emails) {
      return res.status(500).json({error: "Database not initialized"});
    }
    await sequelize.authenticate();
    await sequelize.sync();
    const findEmails = await emails.findAll();
    return res.status(200).json(findEmails);
  } catch (err) {
    console.error("error fetching emails", err);
    return res.status(500).json({error: "Failed to fetch emails"});
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

export default app;