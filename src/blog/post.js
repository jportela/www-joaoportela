import path from 'path'

export default class BlogPost {
  constructor(
    { location, slug },
    { loader, metadataProcessor, contentProcessor },
  ) {
    this.location = location
    this.slug = slug
    this.loader = loader
    this.metadataProcessor = metadataProcessor
    this.contentProcessor = (content) =>
      contentProcessor(content, this.getAssetLocation())

    this.reset()
  }

  async load() {
    const fileContent = await this.loader.loadFromBlogPath(this.location)

    this.reset()

    if (typeof this.metadataProcessor === 'function') {
      const processedFile = this.metadataProcessor(fileContent)
      this.metadata = processedFile.metadata
      this.notes = this.metadata.notes
        ? this.contentProcessor(this.metadata.notes)
        : null
      this.excerpt = this.contentProcessor(processedFile.excerpt)
      this.content = this.contentProcessor(processedFile.content)
    } else {
      this.content = this.contentProcessor(fileContent)
    }
  }

  reset() {
    this.content = null
    this.excerpt = null
    this.notes = null
    this.metadata = {}
  }

  getAssetLocation() {
    if (!this.location) {
      return null
    }

    const dirs = path.normalize(this.location).split(path.sep)

    return path.join('/assets/blog', ...dirs.slice(0, dirs.length - 1))
  }
}
