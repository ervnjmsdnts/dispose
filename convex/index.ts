import { query, mutation, action } from './_generated/server';
import { v } from 'convex/values';

// Create a new phone entry
export const createPhone = mutation({
  args: {
    ownerIdentifier: v.string(),
    partStatuses: v.record(v.string(), v.string()),
    conditionAnswers: v.record(v.string(), v.boolean()),
  },
  returns: v.id('phones'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    return await ctx.db.insert('phones', {
      userId: identity.subject,
      ownerIdentifier: args.ownerIdentifier,
      partStatuses: args.partStatuses,
      conditionAnswers: args.conditionAnswers,
      images: [],
    });
  },
});

// Add an image to a phone
export const addImageToPhone = mutation({
  args: {
    phoneId: v.id('phones'),
    imageId: v.id('_storage'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const phone = await ctx.db.get(args.phoneId);
    if (!phone || phone.userId !== identity.subject) {
      throw new Error('Phone not found or not owned by user');
    }

    await ctx.db.patch(args.phoneId, {
      images: [...phone.images, args.imageId],
    });

    return null;
  },
});

// Create a phone with images in one transaction
export const createPhoneWithImages = mutation({
  args: {
    ownerIdentifier: v.string(),
    partStatuses: v.record(v.string(), v.string()),
    conditionAnswers: v.record(v.string(), v.boolean()),
    imageIds: v.array(v.id('_storage')),
  },
  returns: v.id('phones'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    return await ctx.db.insert('phones', {
      userId: identity.subject,
      ownerIdentifier: args.ownerIdentifier,
      partStatuses: args.partStatuses,
      conditionAnswers: args.conditionAnswers,
      images: args.imageIds,
    });
  },
});

// Upload an image file
export const uploadImage = action({
  args: {
    file: v.bytes(),
    contentType: v.string(),
  },
  returns: v.id('_storage'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const blob = new Blob([args.file], { type: args.contentType });
    const storageId = await ctx.storage.store(blob);

    return storageId;
  },
});

// Get image URL
export const getImageUrl = query({
  args: {
    imageId: v.id('_storage'),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});

// List user's phones
export const listUserPhones = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('phones'),
      _creationTime: v.number(),
      ownerIdentifier: v.string(),
      partStatuses: v.record(v.string(), v.string()),
      conditionAnswers: v.record(v.string(), v.boolean()),
      images: v.array(v.id('_storage')),
      imageUrls: v.array(v.union(v.string(), v.null())),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log('User identity:', identity);
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const phones = await ctx.db
      .query('phones')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();

    // Get image URLs for all phones
    const phonesWithUrls = await Promise.all(
      phones.map(async (phone) => {
        const imageUrls = await Promise.all(
          phone.images.map((imageId) => ctx.storage.getUrl(imageId)),
        );
        return {
          ...phone,
          imageUrls,
        };
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return phonesWithUrls.map(({ userId, ...phone }) => phone);
  },
});

// Create disposal request
export const createDisposalRequest = mutation({
  args: {
    phones: v.array(v.id('phones')),
    method: v.union(v.literal('pickup'), v.literal('dropoff')),
    fullName: v.string(),
    contactInfo: v.string(),
    address: v.optional(v.string()),
    dropOffSite: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.id('disposalRequests'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify all phones belong to user
    for (const phoneId of args.phones) {
      const phone = await ctx.db.get(phoneId);
      if (!phone || phone.userId !== identity.subject) {
        throw new Error('Phone not found or not owned by user');
      }
    }

    return await ctx.db.insert('disposalRequests', {
      userId: identity.subject,
      phones: args.phones,
      method: args.method,
      status: 'pending',
      fullName: args.fullName,
      contactInfo: args.contactInfo,
      address: args.address,
      dropOffSite: args.dropOffSite,
      preferredDate: args.preferredDate,
      notes: args.notes,
    });
  },
});

// List user's disposal requests
export const listUserRequests = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('disposalRequests'),
      _creationTime: v.number(),
      phones: v.array(v.id('phones')),
      method: v.string(),
      status: v.string(),
      fullName: v.string(),
      contactInfo: v.string(),
      address: v.optional(v.string()),
      dropOffSite: v.optional(v.string()),
      preferredDate: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const requests = await ctx.db
      .query('disposalRequests')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return requests.map(({ userId, ...request }) => request);
  },
});
