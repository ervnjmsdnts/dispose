import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  phones: defineTable({
    userId: v.string(), // Clerk user id
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    condition: v.string(), // Required: 'excellent', 'good', 'fair', 'poor'
    description: v.optional(v.string()),
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
