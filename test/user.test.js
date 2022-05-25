import request from 'supertest'
import express, { response } from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { UserRouter } from "../routes/user.route.js"
import supertest from 'supertest'

const app = new express()
let token = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', UserRouter)

beforeAll(async () => {
    connectDB();

    const loginUser = {
        "email": "19521789@gm.uit.edu.vn",
        "password": "password"
    }

    const userResult = await supertest(app)
    .post('/user/login')
    .send(loginUser)

    token = userResult.body.data.accessToken;
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
});

describe('Good user results', function() {
    test('respond to get user', async() => {
        const res = await request(app)
        .get('/user?userId=623442ba82b88524caae2232')
        .set('authorizationtoken', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

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
        .set('Authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});

describe('Fail user results', function() {
    test('Fail get user', async() => {
        const res = await request(app)
        .get('/user?userId=abcd')
        .set('Authorization', `Bearer ${token}`);

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
        expect(res.status).toBe(400)
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