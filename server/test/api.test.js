import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Service from "../src/models/Service.js";
import Inquiry from "../src/models/Inquiry.js";
import Booking from "../src/models/Booking.js";
import ServiceRequest from "../src/models/ServiceRequest.js";

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`${key} must be configured to run API integration tests.`);
}

let clientToken;
let adminToken;
let clientId;
let serviceId;
let bookingId;
let inquiryId;
let serviceRequestId;

function futureIndiaDate(daysAhead = 1) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const next = new Date(`${today}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + daysAhead);
  return next.toISOString().slice(0, 10);
}

describe("PragnyX API integration", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Inquiry.deleteMany({}),
      Booking.deleteMany({}),
      ServiceRequest.deleteMany({}),
    ]);

    const admin = await User.create({
      name: "Integration Admin",
      email: "integration.admin@example.test",
      password: "StrongIntegrationPass123",
      role: "admin",
    });
    assert.ok(admin._id);

    const service = await Service.create({
      name: "Integration Accounting",
      slug: "integration-accounting",
      shortDescription: "Accounting support for integration tests.",
      description: "Full description for the integration test service.",
      icon: "calculator",
    });
    serviceId = service._id.toString();
  });

  after(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  it("exposes a health endpoint", async () => {
    const response = await request(app).get("/health").expect(200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.service, "PragnyX CA Firm Management API");
  });

  it("lists only active services publicly", async () => {
    const response = await request(app).get("/api/services").expect(200);
    assert.equal(response.body.success, true);
    assert.ok(response.body.services.some((service) => service.slug === "integration-accounting"));
  });

  it("registers a client and returns a JWT without a password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Integration Client",
      email: "integration.client@example.test",
      phone: "+91 98765 43210",
      password: "StrongClientPass123",
    }).expect(201);

    assert.ok(response.body.token);
    assert.equal(response.body.user.role, "client");
    assert.equal(response.body.user.email, "integration.client@example.test");
    assert.equal("password" in response.body.user, false);
    clientToken = response.body.token;
    clientId = response.body.user.id;

    const storedUser = await User.findById(clientId).select("+password");
    assert.ok(storedUser.password);
    assert.notEqual(storedUser.password, "StrongClientPass123");
  });

  it("rejects malformed registration and duplicate email addresses", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Bad User",
      email: "not-an-email",
      password: "password123",
    }).expect(400);

    await request(app).post("/api/auth/register").send({
      name: "Duplicate User",
      email: "integration.client@example.test",
      password: "StrongClientPass123",
    }).expect(409);
  });

  it("requires authentication for protected resources and rejects client admin access", async () => {
    await request(app).get("/api/auth/me").expect(401);
    await request(app).get("/api/admin/stats").set("Authorization", `Bearer ${clientToken}`).expect(403);
    await request(app).get("/api/bookings").set("Authorization", `Bearer ${clientToken}`).expect(403);
  });

  it("logs in the client and supports profile management", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "integration.client@example.test",
      password: "StrongClientPass123",
    }).expect(200);
    assert.ok(login.body.token);

    const me = await request(app).get("/api/auth/me")
      .set("Authorization", `Bearer ${clientToken}`).expect(200);
    assert.equal(me.body.user.id, clientId);

    const profile = await request(app).patch("/api/auth/profile")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ name: "Updated Integration Client", phone: "+91 99887 76655" })
      .expect(200);
    assert.equal(profile.body.user.name, "Updated Integration Client");
    assert.equal(profile.body.user.phone, "+91 99887 76655");
  });

  it("creates public inquiries and lets administrators view and update them", async () => {
    const created = await request(app).post("/api/inquiries")
      .set("Authorization", "Bearer " + clientToken)
      .send({
      name: "Public Visitor",
      email: "visitor@example.test",
      phone: "+91 98765 12345",
      subject: "Accounting consultation",
      message: "Please contact me about accounting support.",
    }).expect(201);
    inquiryId = created.body.inquiry._id;

    const mine = await request(app).get("/api/inquiries/mine")
      .set("Authorization", "Bearer " + clientToken).expect(200);
    assert.ok(mine.body.inquiries.some((item) => item._id === inquiryId));

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "integration.admin@example.test",
      password: "StrongIntegrationPass123",
    }).expect(200);
    adminToken = adminLogin.body.token;

    const list = await request(app).get("/api/inquiries")
      .set("Authorization", `Bearer ${adminToken}`).expect(200);
    assert.ok(list.body.inquiries.some((item) => item._id === inquiryId));

    const updated = await request(app).patch(`/api/inquiries/${inquiryId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "in-progress" }).expect(200);
    assert.equal(updated.body.inquiry.status, "in-progress");
  });

  it("validates consultation dates and creates client bookings", async () => {
    await request(app).post("/api/bookings")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        name: "Integration Client",
        email: "integration.client@example.test",
        phone: "+91 98765 43210",
        service: "Integration Accounting",
        preferredDate: "2026-02-30",
        preferredTime: "10:30",
      }).expect(400);

    const created = await request(app).post("/api/bookings")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        name: "Integration Client",
        email: "integration.client@example.test",
        phone: "+91 98765 43210",
        service: "Integration Accounting",
        preferredDate: futureIndiaDate(),
        preferredTime: "10:30",
        message: "Please discuss monthly accounting.",
      }).expect(201);
    bookingId = created.body.booking._id;

    const mine = await request(app).get("/api/bookings/mine")
      .set("Authorization", `Bearer ${clientToken}`).expect(200);
    assert.ok(mine.body.bookings.some((booking) => booking._id === bookingId));
  });

  it("creates client service requests and lets administrators update their status", async () => {
    const created = await request(app).post("/api/service-requests")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ service: "Integration Accounting", details: "Please review my monthly accounts." })
      .expect(201);
    serviceRequestId = created.body.request._id;

    const mine = await request(app).get("/api/service-requests/mine")
      .set("Authorization", `Bearer ${clientToken}`).expect(200);
    assert.ok(mine.body.requests.some((item) => item._id === serviceRequestId));

    const updated = await request(app).patch(`/api/service-requests/${serviceRequestId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "in-progress", adminNote: "Assigned for review." }).expect(200);
    assert.equal(updated.body.request.status, "in-progress");
  });

  it("lets administrators list and update booking status", async () => {
    const list = await request(app).get("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`).expect(200);
    assert.ok(list.body.bookings.some((booking) => booking._id === bookingId));

    const updated = await request(app).patch(`/api/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved", adminNote: "Consultation confirmed." }).expect(200);
    assert.equal(updated.body.booking.status, "approved");
  });

  it("supports admin service create, edit and archive", async () => {
    const created = await request(app).post("/api/services")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Integration Tax",
        slug: "integration-tax",
        shortDescription: "Tax assistance.",
        description: "Full tax assistance description.",
      }).expect(201);

    const updated = await request(app).patch(`/api/services/${created.body.service._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Integration Tax Updated" }).expect(200);
    assert.equal(updated.body.service.name, "Integration Tax Updated");

    await request(app).delete(`/api/services/${created.body.service._id}`)
      .set("Authorization", `Bearer ${adminToken}`).expect(200);
    await request(app).get("/api/services/integration-tax").expect(404);

    const stats = await request(app).get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`).expect(200);
    assert.equal(stats.body.stats.clients, 1);
    assert.equal(stats.body.stats.activeClients, 1);
    assert.equal(stats.body.stats.inquiries, 1);
    assert.equal(stats.body.stats.bookings, 1);
    assert.equal(stats.body.stats.serviceRequests, 1);
    assert.equal(stats.body.stats.services, 1);
  });

  it("lists registered clients for administrators", async () => {
    const response = await request(app).get("/api/admin/clients")
      .set("Authorization", `Bearer ${adminToken}`).expect(200);
    assert.ok(response.body.clients.some((client) => client._id === clientId));
  });
});
