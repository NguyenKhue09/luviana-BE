import request from 'supertest'
import express from 'express'
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import connectDB from "../config/config.js"
import RoomRouter from "../routes/room.router.js"

beforeAll((done) => {
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
            "capacity": 3,
            "square":"24",
            "rating": 4,
            "thumbnail":"https://media.istockphoto.com/vectors/man-sleeping-on-bed-vector-id1142805287?k=20&m=1142805287&s=612x612&w=0&h=PnEs5WJXlhs6JdiDfu-0pVOTHDIL9h3q4NJHFzKiftk=",
            "isAvailable":true,
            "facilities":[],
            "isPending": true
        }

        const res = await request(app)
        .post('/room')
        .send(newRoom)
        .set('Content-Type', 'application/json')

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
            "checkinDate": "05/22/2022",
            "checkoutDate":"05/26/2022",
            "people": 7,
            "city": "Đà Nẵng"
        }

        const res = await request(app)
        .post('/room/searchV2')
        .send(searchData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('respond to search rooms by apartments id', async() => {
        const res = await request(app)
        .get('/room/apartment/62568eb25e56e6dbd7b7886d')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    });

    test('Respond to search room available of apartment', async() => {
        const searchData = {
            "checkinDate": "05/22/2022",
            "checkoutDate":"05/26/2022",
            "people": 7,
            "apartmentId": "62568ab0d6d1a4a941990909"
        }

        const res = await request(app)
        .post('/room/available-apartment')
        .send(searchData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200)
    })
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

    test('Fail response to post create room - wrong data', async() => {
        const newRoom = {
            "name":"Your room name",
            "apartmentId": "abcd",
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

    test('Fail response to delete room - wrong data', async() => {
        const res = await request(app)
        .put('/room')
        .send({
            "roomId": "abcd"
        })

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(400)
    });

    test('Fail respond to search rooms by apartments id', async() => {
        const res = await request(app)
        .get('/room/apartment/62568ae7d6d1a4a941990949')

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(404)
    });

    test('Fail respond to search room available of apartment - not found room', async() => {
        const searchData = {
            "checkinDate": "05/22/2022",
            "checkoutDate":"05/26/2022",
            "people": 7
        }

        const res = await request(app)
        .post('/room/available-apartment')
        .send(searchData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(404)
    });

    test('Fail respond to search room available of apartment - wrong apartment id', async() => {
        const searchData = {
            "checkinDate": "05/22/2022",
            "checkoutDate":"05/26/2022",
            "people": 7,
            "apartmentId": "abcd"
        }

        const res = await request(app)
        .post('/room/available-apartment')
        .send(searchData)

        expect(res.header['content-type']).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(500)
    });

})