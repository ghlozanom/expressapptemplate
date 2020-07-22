const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const SERVER_URL = process.env.APP_URL || "http://localhost:3001";

chai.use(chaiHttp);

const TEST_USER = {
    email: "john@doe.com",
    firstname: "John"
  };

  const TEST_USER2 = {
    username: "abc",
    password: "abc"
  };  
  
describe("Main Page", () => {
    it("should redirect to login", done => {
      var agent = chai.request.agent(SERVER_URL)
        .get("/")
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("page");
          done();
        });
    });

    it("should redirect to login", done => {
      var agent = chai.request.agent(SERVER_URL)
      agent
        .post("/login")
        .send(TEST_USER)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("messages");
          res.text.should.contain("Missing credentials");
          done();
        });
    }); 

    it("should log a new user", done => {
      var agent = chai.request.agent(SERVER_URL)
      agent
        .post("/login")
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(TEST_USER2)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.text.should.equal("Hello World!");
          done();
        });
    });     

  });