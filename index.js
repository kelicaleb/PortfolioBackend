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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Portfolio Backend API is running' })
})

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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: linear-gradient(135deg, #f3e8ff, #e9d5ff);">
                    <h2 style="color: #6b21a8; text-align: center;">New Message from Portfolio Contact Form</h2>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd;">
                        <p><strong style="color: #7c3aed;">From:</strong> ${email}</p>
                        <p><strong style="color: #7c3aed;">Message:</strong></p>
                        <p style="white-space: pre-wrap; color: #555;">${message}</p>
                    </div>
                    <p style="text-align: center; color: #7c3aed;">Please respond promptly to maintain good communication.</p>
                </div>
            `
        }
        // Send email to admin
        console.log('Sending email to admin...')
        const adminResult = await transporter.sendMail(mailOptions)
        console.log('Email sent to admin: ' + adminResult.response)

        // Send confirmation to user with purple theme
        const userMailOptions = {
            from: 'kelicaleb7@gmail.com',
            to: email,
            subject: 'Thank You for Contacting Me',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: linear-gradient(135deg, #f3e8ff, #e9d5ff);">
                    <h2 style="color: #6b21a8; text-align: center;">Thank You for Your Message</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #7c3aed;">Dear Visitor,</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #7c3aed;">Thank you for reaching out through my portfolio. I have received your message and will review it shortly.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #7c3aed;">I typically respond within 24-48 hours. If your inquiry is urgent, please feel free to follow up.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #7c3aed;">Best regards,<br>Caleb</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://kelicaleb.github.io/portfolio/" style="background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">Visit My Portfolio</a>
                    </div>
                </div>
            `
        }
        console.log('Sending confirmation email to user...')
        const userResult = await transporter.sendMail(userMailOptions)
        console.log('Confirmation email sent: ' + userResult.response)

        return res.status(201).json({ message: 'message sent successfully' })
    } catch (err) {
        console.error('Error processing request:', err)
        return res.status(500).json({ message: 'Error processing request', error: err.message })
    }
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => { 
        console.log(`Server is running on port ${port}`)
    })
}

export default app