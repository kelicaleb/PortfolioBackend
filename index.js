import express from 'express'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = 4000

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'kelicaleb7@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
})


app.get('/emails', async(req, res)=>{
    try{
        const { data, error } = await supabase.from('emails').select('*')
        if (error) throw error
        return res.status(200).json(data)
    }
    catch(err){
        console.error('Error fetching emails', err)
        return res.status(500).json({message: 'Error fetching emails'})
    }
})

app.post('/emails', async(req, res)=>{
    const { email, message } = req.body
    if (!email || !message) {
        return res.status(400).json({ message: "Missing required fields: email, message" })
    }
    try {
        const { data, error } = await supabase.from('emails').insert([{ emails: email, messages: message }])
        if (error) throw error

        // Send email
        const mailOptions = {
            from: 'kelicaleb7@gmail.com',
            replyTo: email,
            to: 'kelicaleb7@gmail.com',
            subject: 'New Contact Form Submission - Portfolio',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">New Message from Portfolio Contact Form</h2>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>From:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="text-align: center; color: #666;">Please respond promptly to maintain good communication.</p>
                </div>
            `
        }
        console.log('Sending email to admin...')
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email to admin', error)
            } else {
                console.log('Email sent to admin: ' + info.response)
            }
        })

        // Send confirmation to user
        const userMailOptions = {
            from: 'kelicaleb7@gmail.com',
            to: email,
            subject: 'Thank You for Contacting Me',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Thank You for Your Message</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">Dear Visitor,</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">Thank you for reaching out through my portfolio. I have received your message and will review it shortly.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">I typically respond within 24-48 hours. If your inquiry is urgent, please feel free to follow up.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">Best regards,<br>Caleb</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://yourportfolio.com" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit My Portfolio</a>
                    </div>
                </div>
            `
        }
        console.log('Sending confirmation email to user...')
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending confirmation email', error)
            } else {
                console.log('Confirmation email sent: ' + info.response)
            }
        })

        return res.status(201).json({ message: 'Message sent successfully' })
    } catch (err) {
        console.error('Error saving email', err)
        return res.status(500).json({ message: 'Error saving email' })
    }
})

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`)
})