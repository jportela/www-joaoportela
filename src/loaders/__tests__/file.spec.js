import path from 'path'
import FileLoader from '../file'

test('fileLoader parses a file', async () => {
  const fileLoader = new FileLoader()
  const result = await fileLoader.load(path.resolve(__dirname, 'simple.txt'))
  expect(result).toBe("this works!")
})
