import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { RevenueRouter } from "../routes/revenue.route.js"
import { UserRouter } from "../routes/user.route.js"
import { AdminRouter } from "../routes/admin.route.js"
import supertest from 'supertest'

const app = new express()
let adminToken = ''
let userToken = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/revenue', RevenueRouter);
app.use('/user', UserRouter);
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

    adminToken = adminResult.body.token

    const loginUser = {
        "email": "19521789@gmail.com",
        "password": "password123"
    }

    const userResult = await supertest(app)
    .post('/user/login')
    .send(loginUser)
    
    userToken = userResult.body.data.accessToken;
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
});

describe('Good revenue result', function() {
    test('Respond to get month revenue', async() => {
        const res = await request(app)
        .get('/revenue/monthly?year=2022&month=5')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to get year revenue', async() => {
        const res = await request(app)
        .get('/revenue/yearly?year=2022')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to get year revenue', async() => {
        const res = await request(app)
        .get('/revenue/all-yearly')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});

describe('Fail revenue result', function() {
    test('Fail respond to get month revenue', async() => {
        const res = await request(app)
        .get('/revenue/monthly?year=2023&month=5')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })

    test('Fail respond to get year revenue', async() => {
        const res = await request(app)
        .get('/revenue/yearly?year=2024')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })
});