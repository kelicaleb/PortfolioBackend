import express from 'express'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import cors from 'cors'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

app.get("/", async(req, res)=>
{
    try{
        const { data, error } = await supabase.from('emails').select('*')
        if (error) throw error
        return res.status(200).json(data)

    }
    catch(err){
        console.log("error fetching emails", err)
        return res.status(500).json({message: "error fetching emails"})
    }
})

if (process.env.NODE_ENV !== 'production') {
{
    try{ 
        const findEmails = await emails.findAll()
        return res.status(200).json(findEmails)

    }
    catch(err){ 
        console.log("error fetching emails", err)
        return res.status(500).json({message: "error fecthing emails"})
    }
})




if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log("server is running on port", port)
    })
}

export default app;