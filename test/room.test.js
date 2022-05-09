import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { RoomRouter } from "../routes/room.router.js"

beforeEach((done) => {
    connectDB();
    done();
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
});

const app = new express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/room", RoomRouter)

describe('Good room results', async() => {
    test('respond to /room?highToLow=true', async() => {
        const res = await request(app)
        .get('/room?highToLow=true')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });
});