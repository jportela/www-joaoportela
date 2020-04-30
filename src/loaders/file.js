import { promises as fs } from 'fs'
import path from 'path'

export default class FileLoader {
  async load (filePath) {
    return fs.readFile(filePath, 'utf8')
  }

  async loadFromBasePath (filePath) {
    return this.load(path.join(process.cwd(), filePath))
  }

  async loadFromBlogPath (filePath) {
    return this.loadFromBasePath(path.join('blog', filePath))
  }
}
