import express from 'express'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import cors from 'cors'

const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT

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

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log("server is running on port", port)
    })
}

export default app;