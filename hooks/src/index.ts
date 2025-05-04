import express from "express";
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()
const app=express();


app.post("/hooks/catch/:userId/:zapId",(req,res)=>{
    const userId=req.params.userId;
    const zapId=req.params.zapId;
    const body=req.body;
    client.$transaction(async(tx:any)=>{
        const run= await tx.ZapRun.create({
            data:{
                zapId: zapId,
                metadata: body
            }
        })
        await tx.ZapRunOutbox.create({
            data:{
                zapRunId: run.id
            }
        })

    })
    res.json({ message: 'Webhook received' })

    
})
app.listen(3000 ,() => {
    console.log('Server running on port 3002')
});