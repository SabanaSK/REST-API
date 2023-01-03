import express from 'express';
import es6Renderer from 'express-es6-template-engine';

const app = express();
const port = 8080;

app.engine('html', es6Renderer);
app.set('views', 'frontend');
app.set('view engine', 'html');

app.use(express.static('public'));

app.use(express.json());

app.todoRepository = [
  { id: 1, text: "Don't forget to shopping" },
  { id: 2, text: "Clean bedroom" },
  { id: 3, text: "Go to GYM" }
];

let idCounter = app.todoRepository.length + 1;
const router = '/todos';

app.get(router, (request, response) => {
  response.send(app.todoRepository);
  console.log(`GET is called`);
});

app.post(router, (request, response) => {
  if (request.body.text) {
    let { text } = request.body;
    let id = getInclementedId();
    console.log(`POST TODOS is called`);
    app.todoRepository.push({ id, text });
    response.status(201).send({ id: id, text: text, size: app.todoRepository.length });
  } else {
    console.log(`POST is called with ERROR`);
    response.status(400).send("Bad Request");
  }
});


app.put(router + '/:id', (request, response) => {
  let id = Number(request.params.id);
  let text = request.body.text;
  let idElement = app.todoRepository.find(element => element.id === id);
  console.log(`PUT is called`);
  console.log(`Calling id ${id}`);
  if (idElement) {
    if (request.body.text) {
      idElement.text = text;
      console.log(`PUT step 1 is called`);
      response.status(200).send({ id: id, text: text, message: 'Your request is success' });
    } else {
      response.status(400).send('Bad Request')
    }
  } else {
    console.log(`PUT step 2 is called`);
    response.status(404).send('Not Found');
  }


});

app.delete(router + '/:id', (request, response) => {
  let id = Number(request.params.id);
  let findCallingId = app.todoRepository.find(element => element.id === id);

  console.log('Delete Method is Called');
  console.log(`DELETED: Calling id is ${id}`);

  if (findCallingId) {
    console.log(`Delete step 1 is called`);
    app.todoRepository = app.todoRepository.filter(todo => todo.id !== id);
    response.status(200).send({ id: id, message: 'DELETE Request Accepted' });
  } else {
    console.log(`Delete step 2 is called`);
    response.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on localhost: ${port}`);
});

app.get('/', (request, response) => {
  response.render('index', { locals: { todoRepository: app.todoRepository, title: "TODO" } });
});

function getInclementedId() {
  return idCounter++;
}

export default app;