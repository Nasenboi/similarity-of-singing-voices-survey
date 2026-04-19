import {Mongo} from "meteor/mongo";

export async function publishPagination(context, paginationId, paginationData) {
  const sanitizedData = {
    ...paginationData,
    nextCursor: paginationData.nextCursor ?? null,
    prevCursor: paginationData.prevCursor ?? null,
  };

  const existing = await Pagination.findOneAsync(paginationId);
  if (existing) {
    context.changed("pagination", paginationId, sanitizedData);
  } else {
    context.added("pagination", paginationId, sanitizedData);
  }
}

export const Pagination = new Mongo.Collection("pagination");
