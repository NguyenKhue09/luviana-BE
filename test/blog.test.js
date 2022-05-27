import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import { BlogRouter } from "../routes/blog.route.js"
import { UserRouter } from "../routes/user.route.js"
import { AdminRouter } from "../routes/admin.route.js"
import supertest from 'supertest'

const app = new express()
let adminToken = ''
let userToken = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/blog", BlogRouter);
app.use('/user', UserRouter)
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
        "email": "19521789@gm.uit.edu.vn",
        "password": "password"
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

describe('Good blog result', function() {
    // test('Respond to add new blog', async() => {
    //     const newBlog = {
    //         "content": "This is a testing blog by Khoile",
    //         "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg",
    //         "date": "2022-05-30"
    //     };

    //     const res = await request(app)
    //     .post('/blog')
    //     .send(newBlog)
    //     .set('authorizationtoken', `Bearer ${userToken}`);

    //     expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    //     expect(res.status).toBe(200)
    // });

    test('Good respond to get all blogs', async() => {
        const res = await request(app)
        .get('/blog/all')
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Good respond to get blog by id', async() => {
        const res = await request(app)
        .get('/blog/detail/6290add143148c83c33a1610')

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
            "blogId": "6290add143148c83c33a1610",
            "data": {
                "content": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
            }
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to get comment', async() => {
        const res = await request(app)
        .get('/blog/comment?blogId=6290add143148c83c33a1610')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to add comment', async() => {
        const newComment = {
            "author": "6284db11aecf83be28e02e48",
            "blogId": "6290add143148c83c33a1610",
            "content": "This is a excellent room"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to like blog', async() => {
        const newBlogLike = {
            "blogId": "6290add143148c83c33a1610"
        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get blog like', async() => {
        const res = await request(app)
        .get('/blog/like/6290add143148c83c33a1610')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to unlike blog', async() => {
        const unlikeBlog = {
            "blogId": "6290add143148c83c33a1610"
        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get liked blogs by user', async() => {
        const res = await request(app)
        .get('/blog/like?userId=628513a4686cfbed34ad1be6')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to get confirmed blog list', async() => {
        const res = await request(app)
        .get('/blog/confirm?page=1&limit=2')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Repsond to confirm blog', async() => {
        const newBlogConfirm = {
            "blogId": "6290add143148c83c33a1610"
        };

        const res = await request(app)
        .put('/blog/confirm')
        .send(newBlogConfirm)
        .set('authorization', `Bearer ${adminToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })

});

describe('Fail test result for blog', function() {
    test('Fail respond to get blog by id - wrong id', async() => {
        const res = await request(app)
        .get('/blog/detail/6284avcb638d4091909b7123')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to update a blog - missing content', async() => {
        const updateBlog = {
            // "data": {
            //     "content": "",
            //     "pictures": "https://assets.grab.com/wp-content/uploads/sites/11/2020/09/30172754/Hotels_Booking_1920x675.jpg"
            // }, 
            "blogId": "6290add143148c83c33a1610"
        };

        const res = await request(app)
        .put('/blog/update')
        .send(updateBlog)
        .set('authorizationtoken', `Bearer ${userToken}`);

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
        .get('/blog/comment?blogId=6290add143148c83c33a1999')

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
            // "blogId": "62852a59bd8e19a5aff1969f",
            "content": "This is a excellent movie"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to add comment - wrong data', async() => {
        const newComment = {
            "blogId": "62852a59bd8e19a5aff1999f",
            "content": "This is a excellent movie"
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to like blog - missing data', async() => {
        const newBlogLike = {

        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to like blog - wrong data', async() => {
        const newBlogLike = {
            "blogId": "628599850c93b49b9d0ea2d9"
        };

        const res = await request(app)
        .post('/blog/like')
        .send(newBlogLike)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to add comment - empty content', async() => {
        const newComment = {
            "blogId": "62852a59bd8e19a5aff1969f",
            "content": ""
        };

        const res = await request(app)
        .post('/blog/comment')
        .send(newComment)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to get blog like - missing blog id', async() => {
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

        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to unlike blog - wrong data', async() => {
        const unlikeBlog = {
            "blogId": "abcd"
        };

        const res = await request(app)
        .delete('/blog/like')
        .send(unlikeBlog)
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

    test('Fail respond to get liked blogs by user - missing user id', async() => {
        const res = await request(app)
        .get('/blog/like?userId=')
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to get liked blogs by user - wrong user id', async() => {
        const res = await request(app)
        .get('/blog/like?userId=abcd')
        .set('authorizationtoken', `Bearer ${userToken}`);

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });
});