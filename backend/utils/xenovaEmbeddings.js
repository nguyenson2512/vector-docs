class XenovaEmbeddings {
  constructor(options = {}) {
    this.model = options.model || 'Xenova/all-roberta-large-v1';
    this.extractor = null;
  }

  async init() {
    if (!this.extractor) {
      const { pipeline } = await import('@xenova/transformers');
      this.extractor = await pipeline('feature-extraction', this.model);
    }
    return this;
  }

  async embedDocuments(texts) {
    if (!this.extractor) {
      await this.init();
    }

    const embeddings = [];
    for (const text of texts) {
      const output = await this.extractor(text, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }

    return embeddings;
  }

  async embedQuery(text) {
    if (!this.extractor) {
      await this.init();
    }

    const output = await this.extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}

module.exports = { XenovaEmbeddings };