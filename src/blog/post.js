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
      this.content = this.contentProcessor(processedFile.content)
    } else {
      this.content = this.contentProcessor(fileContent)
    }
  }

  reset() {
    this.content = null
    this.notes = null
    this.metadata = {}
  }

  getAssetLocation() {
    if (!this.location) {
      return null
    }

    return path.join('/assets/blog', path.dirname(this.location), path.sep)
  }
}
