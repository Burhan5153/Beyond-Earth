/**
 * MongoDB Query Examples for Beyond Earth
 * 
 * This file contains example queries you can use in MongoDB shell (mongosh)
 * or MongoDB Compass to interact with your database.
 * 
 * Usage:
 * 1. Connect to MongoDB: mongosh mongodb://localhost:27017/beyond-earth
 * 2. Copy and paste these queries
 */

// ============================================
// USER QUERIES
// ============================================

// Get all users
db.users.find().pretty()

// Get user by email
db.users.findOne({ email: "user@example.com" })

// Get users with active subscriptions
db.users.find({ "subscription.isActive": true }).pretty()

// Get users with premium subscription
db.users.find({ "subscription.plan": "premium" }).pretty()

// Count total users
db.users.countDocuments()

// Get users created in last 7 days
db.users.find({
  createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
}).pretty()

// ============================================
// BOOKING QUERIES
// ============================================

// Get all bookings
db.bookings.find().pretty()

// Get bookings with status 'confirmed'
db.bookings.find({ status: "confirmed" }).pretty()

// Get bookings with paid status
db.bookings.find({ paymentStatus: "paid" }).pretty()

// Get bookings for a specific user (replace USER_ID)
db.bookings.find({ user: ObjectId("USER_ID_HERE") }).pretty()

// Get bookings with additional activities
db.bookings.find({
  "additionalActivities.booked": true
}).pretty()

// Get bookings for a date range
db.bookings.find({
  flightDate: {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-12-31")
  }
}).pretty()

// Get total revenue (sum of all paid bookings)
db.bookings.aggregate([
  { $match: { paymentStatus: "paid" } },
  { $group: { _id: null, total: { $sum: "$totalPrice" } } }
])

// Count bookings by status
db.bookings.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// ============================================
// ACTIVITY QUERIES
// ============================================

// Get all activities
db.activities.find().pretty()

// Get available activities
db.activities.find({ available: true }).pretty()

// Get activities by type
db.activities.find({ type: "mars-walking" }).pretty()

// Get activities by planet
db.activities.find({ planet: "mars" }).pretty()

// Get activities sorted by price
db.activities.find().sort({ price: 1 }).pretty()

// Get most expensive activity
db.activities.find().sort({ price: -1 }).limit(1).pretty()

// ============================================
// LAND PURCHASE QUERIES
// ============================================

// Get all land purchases
db.landpurchases.find().pretty()

// Get land purchases by type
db.landpurchases.find({ landType: "residential" }).pretty()

// Get confirmed land purchases
db.landpurchases.find({ status: "confirmed" }).pretty()

// Get total land purchased (sum of sizes)
db.landpurchases.aggregate([
  { $group: { _id: null, totalSize: { $sum: "$size" } } }
])

// Get total revenue from land sales
db.landpurchases.aggregate([
  { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
])

// Get land purchases by user (replace USER_ID)
db.landpurchases.find({ user: ObjectId("USER_ID_HERE") }).pretty()

// ============================================
// AGGREGATION QUERIES (Advanced)
// ============================================

// Get user with their bookings (using aggregation)
db.users.aggregate([
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "user",
      as: "bookings"
    }
  }
]).pretty()

// Get booking with user details
db.bookings.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userDetails"
    }
  }
]).pretty()

// Get booking with land purchases
db.bookings.aggregate([
  {
    $lookup: {
      from: "landpurchases",
      localField: "_id",
      foreignField: "booking",
      as: "landPurchases"
    }
  }
]).pretty()

// Get statistics summary
db.bookings.aggregate([
  {
    $group: {
      _id: null,
      totalBookings: { $sum: 1 },
      totalRevenue: { $sum: "$totalPrice" },
      avgBookingPrice: { $avg: "$totalPrice" },
      confirmedBookings: {
        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
      }
    }
  }
])

// ============================================
// UPDATE QUERIES
// ============================================

// Update booking status
db.bookings.updateOne(
  { _id: ObjectId("BOOKING_ID_HERE") },
  { $set: { status: "confirmed", paymentStatus: "paid" } }
)

// Update user subscription
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "subscription.plan": "premium",
      "subscription.isActive": true,
      "subscription.startDate": new Date(),
      "subscription.endDate": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  }
)

// Update activity availability
db.activities.updateOne(
  { type: "mars-walking" },
  { $set: { available: false } }
)

// ============================================
// DELETE QUERIES (Use with Caution!)
// ============================================

// Delete a specific user
db.users.deleteOne({ email: "user@example.com" })

// Delete all test bookings
db.bookings.deleteMany({ status: "pending" })

// Delete all data (RESET DATABASE - Very Dangerous!)
// db.users.deleteMany({})
// db.bookings.deleteMany({})
// db.landpurchases.deleteMany({})
// db.activities.deleteMany({})

// ============================================
// INDEX CREATION (For Performance)
// ============================================

// Create index on user email (already done by Mongoose unique constraint)
db.users.createIndex({ email: 1 }, { unique: true })

// Create index on booking user
db.bookings.createIndex({ user: 1 })

// Create index on booking flightDate
db.bookings.createIndex({ flightDate: 1 })

// Create index on land purchase user
db.landpurchases.createIndex({ user: 1 })

// View all indexes
db.users.getIndexes()
db.bookings.getIndexes()

// ============================================
// EXPORT/IMPORT (Backup)
// ============================================

// Export users collection
// mongoexport --db=beyond-earth --collection=users --out=users.json

// Import users collection
// mongoimport --db=beyond-earth --collection=users --file=users.json

// ============================================
// HELPFUL UTILITIES
// ============================================

// Show database stats
db.stats()

// Show collection stats
db.users.stats()
db.bookings.stats()

// Get database size
db.stats().dataSize

// List all databases
/*show dbs

// Switch database
use beyond-earth

// Show collections
show collections*/

