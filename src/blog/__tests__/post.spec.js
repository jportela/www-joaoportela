/* eslint-env jest */

import BlogPost from '../post'
import MemoryLoader from '../../loaders/memory'

const mockPost = '## Hello World!'
const POST = '2020/04/creating-my-personal-blog.md'

const loader = new MemoryLoader()
loader.set(POST, mockPost)

test('load loads the content of a post', async () => {
  const post = new BlogPost({ location: POST }, { loader })
  await post.load()
  expect(post.content).toBe('## Hello World!')
})

test('substitutes the location for the asset', () => {
  const post = new BlogPost({ location: POST }, { loader })
  const assetPath = post.getAssetLocation()
  expect (assetPath).toBe('/blog-assets/2020/04/creating-my-personal-blog/')
})
