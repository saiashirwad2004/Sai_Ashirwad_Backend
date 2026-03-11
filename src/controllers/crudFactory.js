const cloudinary = require('../config/cloudinary');

/**
 * Generic CRUD controller factory
 * Creates standard getAll, getById, create, update, delete handlers for any Mongoose model
 */
const createCrudController = (Model, options = {}) => {
  const {
    defaultSort = '-createdAt',
    searchFields = [],       // Fields to search against with ?search=
    populateFields = '',     // Mongoose populate string
    imageFields = [],        // Fields that contain { url, publicId } objects
  } = options;

  return {
    // GET all with pagination, search, filter, sort
    getAll: async (req, res) => {
      try {
        const {
          page = 1,
          limit = 50,
          sort = defaultSort,
          search,
          ...filters
        } = req.query;

        const query = {};

        // Text search across configured fields
        if (search && searchFields.length > 0) {
          query.$or = searchFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
          }));
        }

        // Apply direct filters (e.g., ?published=true&category=web)
        for (const [key, value] of Object.entries(filters)) {
          if (Model.schema.paths[key]) {
            if (value === 'true') query[key] = true;
            else if (value === 'false') query[key] = false;
            else query[key] = value;
          }
        }

        const total = await Model.countDocuments(query);
        const docs = await Model.find(query)
          .sort(sort)
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .populate(populateFields);

        res.json({
          success: true,
          data: docs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },

    // GET single by ID
    getById: async (req, res) => {
      try {
        const doc = await Model.findById(req.params.id).populate(populateFields);
        if (!doc) {
          return res.status(404).json({ success: false, message: 'Not found' });
        }
        res.json({ success: true, data: doc });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },

    // POST create
    create: async (req, res) => {
      try {
        const doc = await Model.create(req.body);
        res.status(201).json({ success: true, data: doc });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    },

    // PUT update
    update: async (req, res) => {
      try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!doc) {
          return res.status(404).json({ success: false, message: 'Not found' });
        }
        res.json({ success: true, data: doc });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    },

    // DELETE
    delete: async (req, res) => {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
          return res.status(404).json({ success: false, message: 'Not found' });
        }

        // Clean up Cloudinary images
        for (const field of imageFields) {
          const imgData = doc[field];
          if (imgData && imgData.publicId) {
            try {
              await cloudinary.uploader.destroy(imgData.publicId);
            } catch (e) { /* ignore */ }
          }
        }

        await Model.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },

    // PUT toggle a boolean field
    toggleField: (field) => async (req, res) => {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
          return res.status(404).json({ success: false, message: 'Not found' });
        }
        doc[field] = !doc[field];
        await doc.save();
        res.json({ success: true, data: doc });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },

    // PUT batch reorder
    reorder: async (req, res) => {
      try {
        const { items } = req.body; // [{ id, order }]
        if (!Array.isArray(items)) {
          return res.status(400).json({ success: false, message: 'Items array is required' });
        }
        const ops = items.map(({ id, order }) => ({
          updateOne: {
            filter: { _id: id },
            update: { order },
          },
        }));
        await Model.bulkWrite(ops);
        res.json({ success: true, message: 'Reordered successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },

    // DELETE bulk delete
    bulkDelete: async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ success: false, message: 'IDs array is required' });
        }

        // Clean up Cloudinary images for each doc
        if (imageFields.length > 0) {
          const docs = await Model.find({ _id: { $in: ids } });
          for (const doc of docs) {
            for (const field of imageFields) {
              if (doc[field] && doc[field].publicId) {
                try {
                  await cloudinary.uploader.destroy(doc[field].publicId);
                } catch (e) { /* ignore */ }
              }
            }
          }
        }

        const result = await Model.deleteMany({ _id: { $in: ids } });
        res.json({
          success: true,
          message: `Deleted ${result.deletedCount} items`,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
  };
};

module.exports = createCrudController;
