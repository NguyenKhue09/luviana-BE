import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { ApartmentRouter } from '../routes/apartment.route.js'

beforeEach((done) => {
    connectDB();
    done();
});  

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})

const app = new express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/apartment', ApartmentRouter)
 
describe('Good apartment results', function() {
    test('respond to /all', async() => {
        const res = await request(app).get('/apartment/all')
        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('respond detail /624e6113322e96c3e532b6ce', async() => {
        const res = await request(app).get('/apartment/detail/624e6113322e96c3e532b6ce')
        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('post create new apartment', async() => {
        const newData = {
            "name": "Khách sạn Đông Á",
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
        .type('json')
        .send(newData)
        
        expect(res.statusCode).toBe(200)
    })
});