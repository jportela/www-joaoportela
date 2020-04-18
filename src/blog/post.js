export default class BlogPost {
  constructor({ location, slug }, loader, contentProcessor) {
    this.location = location
    this.slug = slug
    this.loader = loader
    this.contentProcessor = contentProcessor
    this.reset()
  }

  async load() {
    const fileContent = await this.loader.loadFromBlogPath(this.location)

    this.reset()

    if (typeof this.contentProcessor === 'function') {
      const processedFile = this.contentProcessor(fileContent)
      this.metadata = processedFile.data
      this.excerpt = processedFile.excerpt
      this.content = processedFile.content

    } else {
      this.content = fileContent
    }

  }

  reset() {
    this.content = null
    this.excerpt = null
    this.metadata = {}
  }
}
