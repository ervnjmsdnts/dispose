import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  phones: defineTable({
    userId: v.string(), // Clerk user id
    ownerIdentifier: v.string(), // User's name or identifier
    // Part statuses: maps part name to status (Recyclable, Disposable (Hazardous), Disposable (Contaminated), Disposable (Non-functional))
    partStatuses: v.record(v.string(), v.string()),
    // Condition answers: maps question index to yes/no answer
    conditionAnswers: v.record(v.string(), v.boolean()),
    images: v.array(v.id('_storage')),
  }).index('by_user', ['userId']),

  disposalRequests: defineTable({
    userId: v.string(),
    phones: v.array(v.id('phones')),
    method: v.union(v.literal('pickup'), v.literal('dropoff')),
    status: v.union(v.literal('pending'), v.literal('completed')),
    // Contact information
    fullName: v.string(),
    contactInfo: v.string(), // phone or email
    // Location details
    address: v.optional(v.string()), // for pickup
    dropOffSite: v.optional(v.string()), // for dropoff - site name
    // Additional details
    preferredDate: v.optional(v.string()), // ISO date string
    notes: v.optional(v.string()),
  }).index('by_user', ['userId']),
});
