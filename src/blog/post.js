import path from 'path'

export default class BlogPost {
  constructor (
    { location, slug },
    {
      loader,
      metadataProcessor
    }
  ) {
    this.location = location
    this.slug = slug
    this.loader = loader
    this.metadataProcessor = metadataProcessor

    this.reset()
  }

  async load () {
    const fileContent = await this.loader.loadFromBlogPath(this.location)

    this.reset()

    if (typeof this.metadataProcessor === 'function') {
      const processedFile = this.metadataProcessor(fileContent)
      this.metadata = processedFile.data
      this.notes = this.metadata.notes || null
      this.excerpt = processedFile.excerpt
      this.content = processedFile.content
    } else {
      this.content = fileContent
    }
  }

  reset () {
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

    return path.join('/assets/blog', ...dirs.slice(0, dirs.length))
  }
}
