const createCrudController = (Model, options = {}) => ({
  list: async (req, res, next) => {
    try {
      const query = options.publicFilter ? options.publicFilter(req) : {};
      const docs = await Model.find(query).sort(options.sort || { createdAt: -1 });
      res.json(docs);
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const lookup = options.lookupBy === 'slug' ? { slug: req.params.slug } : { _id: req.params.id };
      const doc = await Model.findOne(lookup);
      if (!doc) return res.status(404).json({ message: `${Model.modelName} not found` });
      res.json(doc);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ message: `${Model.modelName} not found` });
      res.json(doc);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: `${Model.modelName} not found` });
      res.json({ message: `${Model.modelName} deleted` });
    } catch (error) {
      next(error);
    }
  },
});

module.exports = createCrudController;
