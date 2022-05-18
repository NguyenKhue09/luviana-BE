import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { BlogRouter } from "../routes/blog.route.js"

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

app.use("/blog", BlogRouter);

describe('Good blog result', function() {
    test('Respond to add new blog', async() => {
        const newBlog = {
            "author": "623442ba82b88524caae2232",
            "content": "This is a testing blog",
            "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg",
            "date": "2022-05-30"
        };

        const res = await request(app)
        .post('/blog')
        .send(newBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Good respond to get all blogs', async() => {
        const res = await request(app)
        .get('/blog/all')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Good respond to get blog by id', async() => {
        const res = await request(app)
        .get('/blog/detail/62845bfb638d4091909b7136')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to update a blog', async() => {
        const updateBlog = {
            "data": {
                "content": "This is a testing blog",
                "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg"
            }, 
            "blogId": "62845bfb638d4091909b7136"
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });
});

describe('Fail test result for blog', function() {
    test('Fail respond to add new blog', async() => {
        const newBlog = {
            // "author": "623442ba82b88524caae2232",
            "content": "This is a testing blog",
            "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg",
            "date": "2022-05-30"
        };

        const res = await request(app)
        .post('/blog')
        .send(newBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to get blog by id', async() => {
        const res = await request(app)
        .get('/blog/detail/6284avcb638d4091909b7123')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Respond to update a blog', async() => {
        const updateBlog = {
            "data": {
                "content": "This is a testing blog",
                "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg"
            }, 
            "blogId": "62845bfb638d4091909bmamv"
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });
});