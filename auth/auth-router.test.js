const request = require("supertest");

const server = require("../api/server.js");

const db = require("../database/dbConfig.js");

describe("auth router", () => {
  it("should run the tests", () => {
    expect(true).toBe(true); // simple assertion
    // initial test passes and fails as expected
  });

  describe("POST /register", () => {
    it.skip("should return 201 Created", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "Jest2", password: "Test2" })
        .then(res => {
          expect(res.status).toBe(201);
        })
        .then(res => {
          return db("users").truncate();
        });
    });

    it("Should return 500", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "Jest3" })
        .then(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe("POST /login", () => {
    it("should login user and get jokes", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "Jest2", password: "Test2" })
        .then(res => {
         const currentToken = res.body.token;
         return request(server)
         .get("/api/jokes")
         .set("Authorization", currentToken)
         .then(res => {

          expect(res.status).toBeTruthy();
         })
        });
    });
    it("should deny login", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "j4", password: "j4" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });
});