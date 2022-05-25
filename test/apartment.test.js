import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { ApartmentRouter } from '../routes/apartment.route.js'
import supertest from 'supertest'

const app = new express()
let token = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/apartment', ApartmentRouter)

beforeAll((done) => {
    connectDB();
    const adminLogin = {
        "username": "admin",
        "password": "admin"
    }

    supertest(app)
    .post('/admin/login-admin-account')
    .send(adminLogin)
    .end((error, response) => {
        token = response.body.token
        done();
    })

    done();
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})
 
describe('Good apartment results', function() {
    test('respond to /all', async() => {
        const res = await request(app)
        .get('/apartment/all')
        .set('Authorization', `Bearer ${token}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('respond detail /624e6b6b54287c2c7ee048b2', async() => {
        const res = await request(app).get('/apartment/detail/624e6b6b54287c2c7ee048b2')
        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to post create new apartment', async() => {
        const newData = {
            "name": "Khách sạn Đông Á",
            "raing": 3,
            "type": "hotel",
            "description": "Đây là khách sạn test",
            "thumbnail": "https://pix10.agoda.net/hotelImages/2817185/-1/4406a970306a452300f94532410dab2c.jpg?ca=10&ce=1&s=1024x768",
            "apartmentNumber": "34",
            "street": "Mạc Đĩnh Chi",
            "district": "Quận 5",
            "province": "Hồ Chí Minh",
            "country": "Việt Nam",
            "description": "Testing is not fun :(("
        }
        
        const res = await request(app)
        .post('/apartment/add-new-apartment')
        .send(newData)
        
        expect(res.statusCode).toBe(200)
    })

    test('Respond to put update apartment', async() => {
        const updateData = {
            "apartmentId": "62778cf7e1b2e19ce11dedb8",
            "apartmentData": {
                "name": "Khách sạn Hoàng Thuỳ",
                "rating": 4,
                "type": "hotel"
            }
        }
        const res = await request(app)
        .put('/apartment/update')
        .send(updateData)

        expect(res.statusCode).toBe(200)
    })
});

describe('Fail apartment results', function() {
    test('respond fail to detail - wrong id', async() => {
        const res = await request(app).get('/apartment/detail/6600dd')
        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    })

    test('post fail to create new apartment', async() => {
        const newData = {
            // "name": "Khách sạn Đông Á",
            "raing": 3,
            "type": "hotel",
            "description": "Đây là khách sạn test",
            "thumbnail": "https://pix10.agoda.net/hotelImages/2817185/-1/4406a970306a452300f94532410dab2c.jpg?ca=10&ce=1&s=1024x768",
            "apartmentNumber": 34,
            "street": "Mạc Đĩnh Chi",
            "district": "Quận 5",
            "province": "Hồ Chí Minh",
            "country": "Việt Nam"
        }
        const res = await request(app)
        .post('/apartment/add-new-apartment')
        .send(newData)
        
        expect(res.statusCode).toBe(500)
    })

    test('put update apartment - missing apartment id', async() => {
        const updateData = {
            "apartmentData": {
                "name": "Khách sạn Hoàng Thuỳ 2",
                "rating": 3,
                "type": "hotels"
            }
        }
        const res = await request(app)
        .put('/apartment/update')
        .send(updateData)

        expect(res.statusCode).toBe(400)
    })

    test('put update apartment - wrong apartment id', async() => {
        const updateData = {
            "apartmentId": "abcd",
            "apartmentData": {
                "name": "Khách sạn Hoàng Thuỳ 2",
                "rating": 3,
                "type": "hotels"
            }
        }
        const res = await request(app)
        .put('/apartment/update')
        .send(updateData)

        expect(res.statusCode).toBe(400)
    })
});