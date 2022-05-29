import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { ApartmentRouter } from '../routes/apartment.route.js'
import { UserRouter } from "../routes/user.route.js"
import { AdminRouter } from "../routes/admin.route.js"
import supertest from 'supertest'

const app = new express()
let adminToken = ''
let userToken = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/apartment', ApartmentRouter)
app.use('/user', UserRouter)
app.use("/admin", AdminRouter);

beforeAll(async () => {
    connectDB();

    const adminLogin = {
        "username": "admin",
        "password": "admin"
    }

    const loginUser = {
        "email": "19521789@gmail.com",
        "password": "password123"
    }

    const adminResult = await supertest(app)
    .post('/admin/login-admin-account')
    .send(adminLogin)

    const userResult = await supertest(app)
    .post('/user/login')
    .send(loginUser)

    adminToken = adminResult.body.token;
    userToken = userResult.body.data.accessToken;
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
        .set('Authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('respond detail /624e6b6b54287c2c7ee048b2', async() => {
        const res = await request(app).get('/apartment/detail/624e6b6b54287c2c7ee048b2')
        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    // test('Respond to post create new apartment', async() => {
    //     const newData = {
    //         "apartmentNumber": 2,
    //         "street": "Hoàng Hoa Thám",
    //         "district": "Quận 10",
    //         "province": "HCM", 
    //         "country": "Việt Nam",
    //         "name": "Khách sạn Hoàng Thuỳ",
    //         "thumbnail": "http://www.hotel84.com/hotel84-images/product/photo/le-tan-hoang-thuy-hotel.jpg",
    //         "rating": 4,
    //         "type": "hotel",
    //         "owner": "6293281c2408913218c3786f",
    //         "description": "Testing is not fun :(("
    //     }
        
    //     const res = await request(app)
    //     .post('/apartment/add-new-apartment')
    //     .send(newData)
        
    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    //     expect(res.status).toBe(200)
    // })

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

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    // test('Respond to add review apartment', async() => {
    //     const newReview = {
    //         "apartmentId": "624e6b6b54287c2c7ee048b2",
    //         "content": "Good services",
    //         "rating": "4"
    //     }

    //     const res = await request(app)
    //     .post('/apartment/review')
    //     .send(newReview)
    //     .set('authorizationtoken', `Bearer ${userToken}`);

    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    //     expect(res.status).toBe(200)
    // });

    test('Respond to get review by apartment', async() => {
        const res = await request(app)
        .get('/apartment/review?id=624e6b6b54287c2c7ee048b2&page=1&limit=10')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get average rating of apartment', async() => {
        const res = await request(app)
        .get('/apartment/avg-rating/624e6b6b54287c2c7ee048b2')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });
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
    });

    test('Fail respond to add review apartment - missing data', async() => {
        const newReview = {
            "apartmentId": "624e6b6b54287c2c7ee048b2",
            "content": "Good services",
        }

        const res = await request(app)
        .post('/apartment/review')
        .send(newReview)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to add review apartment - wrong data', async() => {
        const newReview = {
            "apartmentId": "624e6b6b54287c2c7ee048aa",
            "content": "Good services",
            "rating": "4"
        }

        const res = await request(app)
        .post('/apartment/review')
        .send(newReview)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get review by apartment - wrong id', async() => {
        const res = await request(app)
        .get('/apartment/review?id=624e6b6b54287c2c7ee04aaa&page=1&limit=10')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get review by apartment - missing id', async() => {
        const res = await request(app)
        .get('/apartment/review?page=1&limit=10')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to get average rating of apartment - wrong id', async() => {
        const res = await request(app)
        .get('/apartment/avg-rating/624e6b6b54287c2c7ee04aaa')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });
});