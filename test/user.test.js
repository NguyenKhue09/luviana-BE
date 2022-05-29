import request from 'supertest'
import express, { response } from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { UserRouter } from "../routes/user.route.js"
import supertest from 'supertest'

const app = new express()
let token = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', UserRouter)

beforeAll(async () => {
    connectDB();

    const loginUser = {
        "email": "19521789@gmail.com",
        "password": "password123"
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
        .get('/user')
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
            "email": "19521789@gmail.com",
            "password": "password123"
        }

        const res = await request(app)
        .post('/user/login')
        .send(auth)
        .set('Authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to update user', async() => {
        const updateUser = {

        }

        const res = await request(app)
        .put('/user')
        .send(updateUser)
        .set('authorizationtoken', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});

describe('Fail user results', function() {

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

    test('Fail respond to update user - ', async() => {
        const updateUser = {

        }

        const res = await request(app)
        .put('/user')
        .send(updateUser)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(401)
    })
})