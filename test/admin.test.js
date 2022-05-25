import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import AdminRouter from "../routes/admin.router.js"

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

app.use("/admin", AdminRouter);

describe('Good admin result', function() {
    test('Good respond to admin', async () => {
        const adminLogin = {
            "username": "admin",
            "password": "admin"
        }

        const res = await request(app)
        .post('/admin/login-admin-account')
        .send(adminLogin)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});