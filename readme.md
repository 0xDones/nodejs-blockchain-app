# Node.js Blockchain Application
This is an Application I developed following [this course](https://www.udemy.com/course/build-blockchain/learn/) on [udemy.](https://www.udemy.com) I dockerized the application to make it easy to play with.

### Getting Started

Install the dependencies
```sh
npm install
```
### Running all test cases

```sh
npm run test
```

### Running the application

```sh
# Starting first peer
npm run dev

# Starting second peer
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

# Starting third peer
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
```

### Running the app using docker-compose

```sh
docker-compose -f docker-compose.yml up -d
```
