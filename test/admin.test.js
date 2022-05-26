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

    test('Respond to get admin info', async() => {
        const res = await request(app)
        .get('/admin')
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Good respond to update admin', async() => {
        const adminData = {

        }

        const res = await request(app)
        .put('/admin')
        .send(adminData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to block admin', async() => {
        const blockData = {
            "adminId": "628d920e2fb6ca51f28b4654"
        }

        const res = await request(app)
        .post('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to unblock admin', async() => {
        const blockData = {
            "adminId": "628d920e2fb6ca51f28b4654"
        }

        const res = await request(app)
        .delete('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
});

describe('Fail admin result', function() {
    test('Fail respond to log in admin', async () => {
        const adminLogin = {
            "username": "admin",
            "password": "abcd"
        }

        const res = await request(app)
        .post('/admin/login-admin-account')
        .send(adminLogin)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(401)
    });

    test('Fail respond to block admin - missing admin id', async() => {
        const blockData = {
            // "adminId": "628d920e2fb6ca51f28b4654"
        }

        const res = await request(app)
        .post('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    })

    test('Fail respond to block admin - wrong admin id', async() => {
        const blockData = {
            "adminId": "628d920e2fb6ca51f28b4999"
        }

        const res = await request(app)
        .post('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })

    test('Fail respond to unblock admin - missing admin id', async() => {
        const blockData = {
            // "adminId": "628d920e2fb6ca51f28b4654"
        }

        const res = await request(app)
        .delete('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    })
    
    test('Fail respond to unblock admin - wrong admin id', async() => {
        const blockData = {
            "adminId": "628d920e2fb6ca51f28b4999"
        }

        const res = await request(app)
        .delete('/admin/block')
        .send(blockData)
        .set('authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    })
});
