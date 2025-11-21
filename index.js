import express from 'express'; 
import dotenv from 'dotenv'; 
import { Sequelize, DataTypes} from 'sequelize'



const app = express()
dotenv.config()
const port = process.env.PORT || 10000;
app.use(express.json())


let sequelize;
try {
  sequelize = new Sequelize("postgres", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    logging: console.log,
    dialect: "postgres"
  });
} catch (err) {
  console.error("Failed to initialize Sequelize", err);
  sequelize = null;
}


let emails;
if (sequelize) {
  emails = sequelize.define('emails', {
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
 });
} else {
  emails = null;
}



app.get("/", async (req, res) => {
    try{
        // Ensure DB is connected
        if (!emails) {
            return res.status(500).json({error: "Database not initialized"});
        }
        await sequelize.authenticate();
        await sequelize.sync();
        const findEmails = await emails.findAll()
        return res.status(200).json(findEmails)
    }
    catch(err){
        console.error("error fetching emails", err)
        return res.status(500).json({error: "Failed to fetch emails"});
    }
})


export default app;





