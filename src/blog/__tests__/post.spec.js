/* eslint-env jest */

import BlogPost from '../post'
import MemoryLoader from '../../loaders/memory'

const mockPost = '## Hello World!'
const POST = '2020/04/creating-my-personal-blog.md'

const loader = new MemoryLoader()
const mockContentProcessor = (content) => content
loader.set(POST, mockPost)

test('load loads the content of a post', async () => {
  const post = new BlogPost(
    { location: POST },
    { loader, contentProcessor: mockContentProcessor },
  )
  await post.load()
  expect(post.content).toBe('## Hello World!')
})

test('substitutes the location for the asset', () => {
  const post = new BlogPost(
    { location: POST },
    { loader, contentProcessor: mockContentProcessor },
  )
  const assetPath = post.getAssetLocation()
  expect(assetPath).toBe('/assets/blog/2020/04/creating-my-personal-blog/')
})
