/* eslint-env jest */

import BlogPost from '../post'
import MemoryLoader from '../../loaders/memory'

const mockPost = '## Hello World!'
const POST = '/test/2020/04/creating-my-personal-blog'

const loader = new MemoryLoader()
loader.set(POST, mockPost)

test('load loads the content of a post', async () => {
  const post = new BlogPost({ location: POST }, { loader })
  await post.load()
  expect(post.content).toBe('## Hello World!')
})
