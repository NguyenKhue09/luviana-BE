import request from 'supertest'
import express, { response } from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { AdminRouter } from "../routes/admin.route.js"
import supertest from 'supertest'

const app = new express()
let token = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/admin", AdminRouter);

beforeAll(async () => {
    connectDB();

    const adminLogin = {
        "username": "admin",
        "password": "admin"
    }

    const adminResult = await supertest(app)
    .post('/admin/login-admin-account')
    .send(adminLogin)

    token = adminResult.body.token
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
});

describe('Good admin result', function() {
    test('Good respond to log in admin', async () => {
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

