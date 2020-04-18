import BlogPost from './post'

export default class Blog {
  constructor(loader, contentProcessor) {
    this.loader = loader
    this.contentProcessor = contentProcessor
    this.posts = []
  }

  async loadManifest(manifestPath) {
    const content = await this.loader.loadFromBlogPath(manifestPath)
    const manifest = JSON.parse(content)

    this.posts = manifest.posts.map(post =>
      new BlogPost(post, this.loader, this.contentProcessor)
    )
  }

  findPostBySlug(slug) {
    return this.posts.find(post => post.slug === slug) || null
  }

}
