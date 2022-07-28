const supertest = require("supertest");
const { app, server } = require("./index.js");

const api = supertest(app);
describe(
  "unit test end point  to  Search",
  () => {
    test("API 1 es JSON", async () => {
      const response = await api.get("/api/items?search=taladro").send();
      expect(response.statusCode).toBe(200);
      expect(response.charset).toBe("utf-8");
      expect(response.badRequest).toBe(false);
      expect(response.body.author.name).toEqual("Carlos");
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
    test("API 1 es JSON", async () => {
      const badResponse = await api.get("/api/items?search=").send();
      expect(badResponse.statusCode).toBe(200);
      expect(badResponse.badRequest).toBe(false);
      expect(badResponse.charset).toBe("utf-8");
      expect(badResponse.body.author.name).toEqual("Carlos");
      expect(badResponse.body.categories).toEqual(["No hubo coincidencias"]);
      expect(badResponse.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
  },
  describe(
    "unit test end point  with details",
    () => {
      test("API 1 es JSON", async () => {
        const response = await api.get("/api/items/MLA899933609").send();
        expect(response.statusCode).toBe(200);
        expect(response.badRequest).toBe(false);
        expect(response.charset).toBe("utf-8");
        expect(response.body.author.name).toEqual("Carlos");
        expect(response.header["content-type"]).toBe(
          "application/json; charset=utf-8"
        );
      });
      test("API 1 es JSON", async () => {
        const badResponse = await api.get("/api/items/").send();
        expect(badResponse.statusCode).toBe(200);
        expect(badResponse.badRequest).toBe(false);
        expect(badResponse.charset).toBe("utf-8");
        expect(badResponse.body.author.name).toEqual("Carlos");
        expect(badResponse.body.categories).toEqual(["No hubo coincidencias"]);
        console.log(badResponse.body);
        expect(badResponse.header["content-type"]).toBe(
          "application/json; charset=utf-8"
        );
      });
    },

    afterAll(() => {
      server.close();
    })
  )
);
