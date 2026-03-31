import express from "express";
import prisma from "./lib/prisma.js";
const app = express() ; 

app.get("/health",(req : any,res : any)=>{
    res.send("OK")
})

app.get("/db", async (req : any, res : any) => {
    try {
        // Create a test user
        const user = await prisma.user.create({
            data: {
                email: `test${Date.now()}@example.com`,
                name: "Test User"
            }
        });
        
        // Fetch all users
        const allUsers = await prisma.user.findMany();
        
        res.json({
            success: true,
            message: "Prisma integration working",
            createdUser: user,
            allUsers: allUsers
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})
app.listen(3000,()=>{
    console.log("Server started on port 3000")
}) ; 