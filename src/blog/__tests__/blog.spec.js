/* eslint-env jest */

import Blog from '../index'
import MemoryLoader from '../../loaders/memory'

const mockManifest = JSON.stringify({
  posts: [
    {
      location: '2020/04/creating-my-personal-blog.mdx',
    },
  ],
})

const MANIFEST = 'manifest'

const loader = new MemoryLoader()
loader.set(MANIFEST, mockManifest)

const blog = new Blog({
  loader,
})

beforeEach(async () => {
  await blog.loadManifest(MANIFEST)
})

test('loads all posts from the blog manifest', () => {
  const posts = blog.posts

  expect(posts).toHaveLength(1)
  const post = posts[0]
  expect(post.location).toBe('2020/04/creating-my-personal-blog.mdx')
})

test('findPostBySlug returns null if not found', () => {
  expect(blog.findPostBySlug('blergh')).toBeNull()
})

test('findPostBySlug returns the found post', () => {
  blog.posts[0].slug = 'creating-my-personal-blog'
  blog.posts[0].metadata.title = 'Creating my personal blog using Next.js'
  const post = blog.findPostBySlug('creating-my-personal-blog')
  expect(post.metadata.title).toBe('Creating my personal blog using Next.js')
})
