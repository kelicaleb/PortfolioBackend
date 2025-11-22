import express from 'express'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT

const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'kelicaleb7@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
})

app.get("/", async(req, res)=>
{
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.log("Missing Supabase environment variables")
        return res.status(500).json({message: "Server configuration error"})
    }
    try{
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
        const { data, error } = await supabase.from('emails').select('*')
        if (error) throw error
        return res.status(200).json(data)

    }
    catch(err){
        console.log("error fetching emails", err)
        return res.status(500).json({message: "error fetching emails"})
    }
})

app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body
    if (!to || !subject || !text) {
        return res.status(400).json({ message: "Missing required fields: to, subject, text" })
    }
    try {
        await transporter.sendMail({
            from: 'kelicaleb7@gmail.com',
            to,
            subject,
            text
        })
        res.status(200).json({ message: "Email sent successfully" })
    } catch (err) {
        console.log("Error sending email", err)
        res.status(500).json({ message: "Error sending email" })
    }
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log("server is running on port", port)
    })
}

export default app;