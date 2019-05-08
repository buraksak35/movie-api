const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();

const server = require("../app");

chai.use(chaiHttp);

let token, movie_id;

describe("/api/movies TESTS", () => {
  before(done => {
    chai
      .request(server)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test3301"
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("/GET movies TEST", () => {
    it("This method should GET all movies", done => {
      chai
        .request(server)
        .get("/api/movies")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.a("array");
          done();
        });
    });
  });

  describe("/POST movie TEST", () => {
    it("This method should POST a movie", done => {
      const movie = {
        title: "Test Movie",
        director_id: "5cd0018177eb051d29eee7bd",
        category: "TEST",
        country: "Turkey",
        year: 1950,
        imdb_score: 8
      };

      chai
        .request(server)
        .post("/api/movies")
        .set("x-access-token", token)
        .send(movie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");

          movie_id = res.body._id;

          done();
        });
    });
  });

  describe("/GET/:director_id TEST", () => {
    it("This method should GET one movie by the given director_id", done => {
      chai
        .request(server)
        .get("/api/movies/" + movie_id)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          res.body.should.have.property("_id").eql(movie_id);
          done();
        });
    });
  });

  describe("/PUT:/movie_id movie TEST", () => {
    it("This method should UPDATE a movie given by id", done => {
      const movie = {
        title: "UPDATE TEST",
        director_id: "5cd0018177eb051d29eee7b1",
        category: "TEST UPDATE",
        country: "TEST COUNTRY",
        year: 1980,
        imdb_score: 9
      };

      chai
        .request(server)
        .put("/api/movies/" + movie_id)
        .set("x-access-token", token)
        .send(movie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.a("object");
          res.body.should.have.property("title").eql(movie.title);
          res.body.should.have.property("director_id").eql(movie.director_id);
          res.body.should.have.property("category").eql(movie.category);
          res.body.should.have.property("country").eql(movie.country);
          res.body.should.have.property("year").eql(movie.year);
          res.body.should.have.property("imdb_score").eql(movie.imdb_score);

          done();
        });
    });
  });

  describe("/DELETE:/movie_id movie TEST", () => {
    it("This method should DELETE a movie given by id", done => {
      chai
        .request(server)
        .delete("/api/movies/" + movie_id)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.a("object");
          res.body.should.have.property("status").eql(1) ;

          done();
        });
    });
  });
});
