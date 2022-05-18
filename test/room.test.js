import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import RoomRouter from "../routes/room.router.js"

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

app.use("/room", RoomRouter)

describe('Good room results', function() {
    test('respond to /room?highToLow=true', async() => {
        const res = await request(app)
        .get('/room?highToLow=true')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to post create room', async() => {
        const newRoom = {
            "name":"Your room name",
            "apartmentId": "624b0a0aec0a608727256e9c",
            "price": 1519384,
            "bedName":"2 đơn",
            "capacity":"3 người",
            "square":"24",
            "rating": 4,
            "thumbnail":"https://media.istockphoto.com/vectors/man-sleeping-on-bed-vector-id1142805287?k=20&m=1142805287&s=612x612&w=0&h=PnEs5WJXlhs6JdiDfu-0pVOTHDIL9h3q4NJHFzKiftk=",
            "isAvailable":true,
            "facilities":[]
        }
        const res = await request(app)
        .post('/room')
        .send(newRoom)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to post update room', async() => {
        const newData = {
            "roomId": "625e72ad8f2277d7a34b7cbc",
            "name":"Your new room name",
            "apartmentId": "624b0a0aec0a608727256e9c",
            "price": 1519385,
            "bedName":"3 đơn"
        }
        const res = await request(app)
        .put('/room')
        .send(newData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to delete room', async() => {
        const res = await request(app)
        .put('/room')
        .send({
            "roomId": "6278df3a1a8cd23c81861a8b"
        })

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to search rooms', async() => {
        const searchData = {
            "checkinDate": "04/19/2022",
            "checkoutDate":"04/21/2022",
            "people": "4 người",
            "city": "Đà Nẵng"
        }

        const res = await request(app)
        .get('/room/search')
        .send(searchData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });
});

describe('Fail room results', function() {
    test('Fail response to post create room - empty data', async() => {
        const res = await request(app)
        .put('/room')
        .send({})

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    })

    test('Fail response to post create room - missing data', async() => {
        const newRoom = {
            // "name":"Your room name",
            "apartmentId": "624b0a0aec0a608727256e9c",
            "price": 1519384,
            "bedName":"2 đơn",
            "capacity":"3 người",
            "square":"24",
            "rating": 4,
            "thumbnail":"https://media.istockphoto.com/vectors/man-sleeping-on-bed-vector-id1142805287?k=20&m=1142805287&s=612x612&w=0&h=PnEs5WJXlhs6JdiDfu-0pVOTHDIL9h3q4NJHFzKiftk=",
            "isAvailable":true,
            "facilities":[]
        }
        const res = await request(app)
        .post('/room')
        .send(newRoom)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail to update room - missing room id', async() => {
        const newData = {
            // "roomId": "625e72ad8f2277d7a34b7cbc",
            "name":"Your new room name",
            "apartmentId": "624b0a0aec0a608727256e9c",
            "price": 1519385,
            "bedName":"3 đơn"
        }
        const res = await request(app)
        .put('/room')
        .send(newData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail to update room - wrong room id', async() => {
        const newData = {
            "roomId": "625e72ad8f2277d7a34b7acd",
            "name":"Your new room name",
            "apartmentId": "624b0a0aec0a608727256e9c",
            "price": 1519385,
            "bedName":"3 đơn"
        }
        const res = await request(app)
        .put('/room')
        .send(newData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail response to delete room - missing data', async() => {
        const res = await request(app)
        .put('/room')
        .send({
            "roomId": "abcd"
        })

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail response to search rooms', async() => {
        const searchData = {
            "checkinDate": "04/19/2022",
            "checkoutDate":"04/21/2022",
            "people": "4 người",
            "city": "Đà Nẵng"
        }

        const res = await request(app)
        .get('/room/search')
        .send({})

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });
})