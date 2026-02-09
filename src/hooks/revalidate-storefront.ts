import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

function invalidateTags(tags: string[], req: PayloadRequest) {
  for (const tag of tags) {
    req.payload.logger.info(`Revalidating cache tag: ${tag}`)
    revalidateTag(tag)
  }
}

/**
 * Creates afterChange + afterDelete hooks that invalidate the given cache tags.
 * Attach to any collection whose data is cached on the storefront.
 */
export function revalidateStorefrontCache(tags: string[]) {
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    invalidateTags(tags, req)
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    invalidateTags(tags, req)
    return doc
  }

  return { afterChange, afterDelete }
}
