import passthroughProcessor from '../processors/passthrough'

export default class BlogPost {
  constructor(
    { location, slug },
    {
      loader,
      metadataProcessor,
      contentProcessor = passthroughProcessor,
    }
  ) {
    this.location = location
    this.slug = slug
    this.loader = loader
    this.metadataProcessor = metadataProcessor
    this.contentProcessor = contentProcessor

    this.reset()
  }

  async load() {
    const fileContent = await this.loader.loadFromBlogPath(this.location)
    let rawContent = fileContent

    this.reset()

    if (typeof this.metadataProcessor === 'function') {
      const processedFile = this.metadataProcessor(fileContent)
      this.metadata = processedFile.data
      this.notes = this.metadata.notes ? this.contentProcessor(this.metadata.notes) : null
      this.excerpt = this.contentProcessor(processedFile.excerpt)
      rawContent = processedFile.content
    }

    this.content = this.contentProcessor(rawContent)

  }

  reset() {
    this.content = null
    this.excerpt = null
    this.notes = null
    this.metadata = {}
  }
}
