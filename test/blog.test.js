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

    test('Respond to get blog by author', async()  => {
        const res = await request(app)
        .get('/blog/author/6284db11aecf83be28e02e48')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

    test('Respond to update a blog', async() => {
        const updateBlog = {
            "author": "6284db11aecf83be28e02e48",
                "blogId": "628599850c93b49b7d0ee2d6",
            "data": {
                    "content": "contenttttttttt"
                }
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to get comment', async() => {
        const res = await request(app)
        .get('/blog/comment?blogId=62852a59bd8e19a5aff1969f')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to add comment', async() => {
        const newComment = {
            "author": "6284db11aecf83be28e02e48",
            "blogId": "62852a59bd8e19a5aff1969f",
            "content": "This is a excellent movie"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to like blog', async() => {
        const newBlogLike = {
            "userId": "628513a4686cfbed34ad1be6",
            "blogId": "628599850c93b49b7d0ee2d6"
        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get blog like', async() => {
        const res = await request(app)
        .get('/blog/like/628599850c93b49b7d0ee2d6')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to unlike blog', async() => {
        const unlikeBlog = {
            "userId": "628513a4686cfbed34ad1be6",
            "blogId": "628599850c93b49b7d0ee2d6"
        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get liked blogs by user', async() => {
        const res = await request(app)
        .get('/blog/like?userId=628513a4686cfbed34ad1be6')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

});

describe('Fail test result for blog', function() {
    test('Fail respond to add new blog - missing data', async() => {
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

    test('Fail respond to add new blog - wrong data', async() => {
        const newBlog = {
            "author": "abcd",
            "content": "This is a testing blog",
            "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg",
            "date": "2022-05-30"
        };

        const res = await request(app)
        .post('/blog')
        .send(newBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get blog by id - wrong id', async() => {
        const res = await request(app)
        .get('/blog/detail/6284avcb638d4091909b7123')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to update a blog - missing content', async() => {
        const updateBlog = {
            "author": "123123",
            "data": {
                "content": "",
                "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg"
            }, 
            "blogId": "62845bfb638d4091909b7136"
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Faild response to get blog by author - wrong id', async()  => {
        const res = await request(app)
        .get('/blog/author/6284db11aecf83be28abce99')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body["data"]).toStrictEqual([]);
    });

    test('Fail respond to get comment - wrong blogId', async() => {
        const res = await request(app)
        .get('/blog/comment?blogId=abcd')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get comment - missing blogId', async() => {
        const res = await request(app)
        .get('/blog/comment')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to add comment - missing data', async() => {
        const newComment = {
            "author": "6284db11aecf83be28e02e48",
            // "blogId": "62852a59bd8e19a5aff1969f",
            "content": "This is a excellent movie"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to add comment - wrong data', async() => {
        const newComment = {
            "author": "6284db11aecf83be28e02abv",
            "blogId": "62852a59bd8e19a5aff1969f",
            "content": "This is a excellent movie"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to like blog - missing data', async() => {
        const newBlogLike = {
            // "userId": "628513a4686cfbed34ad1be6",
            "blogId": "628599850c93b49b7d0ee2d6"
        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to like blog - wrong data', async() => {
        const newBlogLike = {
            "userId": "abcd",
            "blogId": "628599850c93b49b7d0ee2d6"
        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to add comment - empty content', async() => {
        const newComment = {
            "author": "6284db11aecf83be28e02e48",
            "blogId": "62852a59bd8e19a5aff1969f",
            "content": ""
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail espond to get blog like - missing blog id', async() => {
        const res = await request(app)
        .get('/blog/like/')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail espond to get blog like - wrong blog id', async() => {
        const res = await request(app)
        .get('/blog/like/628599850c93b49b7d0eeaaa')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to unlike blog - missing data', async() => {
        const unlikeBlog = {
            // "userId": "628513a4686cfbed34ad1be6",
            "blogId": "628599850c93b49b7d0ee2d6"
        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to unlike blog - wrong data', async() => {
        const unlikeBlog = {
            "userId": "628513a4686cfbed34ad1be6",
            "blogId": "abcd"
        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get liked blogs by user - missing user id', async() => {
        const res = await request(app)
        .get('/blog/like?userId=')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to get liked blogs by user - wrong user id', async() => {
        const res = await request(app)
        .get('/blog/like?userId=abcd')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });
});