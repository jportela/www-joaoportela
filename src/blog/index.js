import BlogPost from './post'

export default class Blog {
  constructor ({
    loader,
    metadataProcessor
  }) {
    this.loader = loader
    this.metadataProcessor = metadataProcessor
    this.posts = []
  }

  async loadManifest (manifestPath) {
    const content = await this.loader.loadFromBlogPath(manifestPath)
    const manifest = JSON.parse(content)

    this.posts = manifest.posts.map(post =>
      new BlogPost(post, {
        loader: this.loader,
        metadataProcessor: this.metadataProcessor
      })
    )
  }

  findPostBySlug (slug) {
    return this.posts.find(post => post.slug === slug) || null
  }
}
