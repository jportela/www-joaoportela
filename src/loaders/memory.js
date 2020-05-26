export default class MemoryLoader {
  constructor() {
    this.data = new Map()
  }

  set(filePath, data) {
    this.data.set(filePath, data)
  }

  async load(filePath) {
    return this.data.get(filePath)
  }

  async loadFromBasePath(filePath) {
    return this.data.get(filePath)
  }

  async loadFromBlogPath(filePath) {
    return this.data.get(filePath)
  }
}
