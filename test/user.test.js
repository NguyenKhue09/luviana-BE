import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { UserRouter } from "../routes/user.route.js"

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

app.use('/user', UserRouter)

describe('Good user results', function() {
    // test('respond to get user', async() => {
    //     const res = await request(app)
    //     .get('/user?userId=623442ba82b88524caae2232')

    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    //     expect(res.status).toBe(200)
    // })

    // test('respond to register user', async() => {
    //     const newUser = {
    //         "avatar": "avatar",
    //         "username": "unit testing",
    //         "password": "password",
    //         "email": "unitTesting@gmail.com"
    //     }

    //     const res = await request(app)
    //     .post('/user/register')
    //     .type('json')
    //     .send(newUser)

    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    //     expect(res.status).toBe(200)
    // })

    test('respond to login user', async() => {
        const auth = {
            "email": "19521789@gm.uit.edu.vn",
            "password": "password"
        }

        const res = await request(app)
        .post('/user/login')
        .send(auth)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});

describe('Fail user results', function() {
    test('Fail get user', async() => {
        const res = await request(app)
        .get('/user?userId=abcd')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })

    test('Fail register user', async() => {
        const newUser = {
            "avatar": "avatar",
            // "username": "unit testing",
            "password": "password",
            "email": "unitTesting@gmail.com"
        }

        const res = await request(app)
        .post('/user/register')
        .type('json')
        .send(newUser)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })

    test('Fail to login', async() => {
        const auth = {
            "email": "failed@gmail.com",
            "password": "dummyPassword"
        }

        const res = await request(app)
        .post('/user/login')
        .send(auth)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(401)
    })
})