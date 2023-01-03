import request from "supertest";
import todoApp from './todoApp.js';

const router = '/todos';

describe('Test todoApp', () => {
    beforeEach(() => {
        todoApp.todoRepository = [
            { id: 1, text: "Don't forget to shopping" },
            { id: 2, text: "Clean bedroom" },
            { id: 3, text: "Go to GYM" }
        ];
    });

    test('Succeed GET/router', async () => {
        const response = await request(todoApp).get(router);
        const expectedTodoRepository = todoApp.todoRepository;
        const expectedSize = 3;

        expect(response.body).toEqual(expectedTodoRepository);
        expect(response.body.length).toEqual(expectedSize);
        expect(response.status).toEqual(200);
    });



    test('Succeed POST/router', async () => {
        const expectedText = { text: "new item" };
        const expectedSize = 4;
        const response = await request(todoApp)
            .post(router)
            .send(expectedText);

        expect(response.body.text).toEqual(expectedText.text);
        expect(response.body.size).toEqual(expectedSize);
        expect(response.status).toEqual(201);
    });


    test('Fail POST/router', async () => {
        const response = await request(todoApp)
            .post(router);

        expect(response.status).toEqual(400);
        expect(response.text).toEqual('Bad Request');
    });

    test('Succeed PUT/router', async () => {
        const expectedText = { "text": "edited" };
        const expectedId = 1;

        const response = await request(todoApp)
            .put(router + "/" + expectedId)
            .send(expectedText);

        expect(response.body.text).toEqual(expectedText.text);
        expect(response.body.id).toEqual(expectedId);
        expect(response.status).toEqual(200);
    });

    test('Not Found PUT/router', async () => {
        const expectedId = 999;

        const response = await request(todoApp)
            .put(router + "/" + expectedId);

        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Not Found');
    })

    test('Fail PUT/router', async () => {
        const expectedId = 1;

        const response = await request(todoApp)
            .put(router + "/" + expectedId);

        expect(response.text).toEqual('Bad Request');
        expect(response.status).toEqual(400);
    })

    test('Succeed DELETE/router', async () => {
        const expectedId = 1;
        const response = await request(todoApp)
            .delete(router + "/" + expectedId);

        expect(response.body.id).toEqual(expectedId);
        expect(response.status).toEqual(200);
    })

    test('Not Found DELETE/router', async () => {
        const expectedId = 999;
        const response = await request(todoApp)
            .delete(router + "/" + expectedId);

        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Not Found');
    })

});