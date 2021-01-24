const express = require("express");
const passport = require("passport");
const ProductsService = require("../../services/product");
const validation = require("../../utils/middlewares/validationHandler");
const {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema,
} = require("../../utils/schemas/products");

// Jwt strategy
require('../../utils/auth/strategies/jwt')

const cacheResponse = require('../../utils/cacheResponse')
const { SIXTY_MINUTES_IN_SECONDS, FIVE_MINUTES_IN_SECONDS } = require('../../utils/time')

function productsApi(app) {
  const router = express.Router();
  app.use("/api/products", router)

  const productService = new ProductsService();
  router.get("/", async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query;
    try {
      const products = await productService.getProducts({ tags });

      res.status(200).json({
        data: products,
        message: "products listed",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:productId", async (req, res, next) => {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
    const { productId } = req.params;
    try {
      const product = await productService.getProduct({ productId });

      res.status(200).json({
        data: product,
        message: "products retrieve",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", validation(createProductSchema), async (req, res, next) => {
    const { body: product } = req;

    try {
      const createProduct = await productService.createProduct({ product });

      res.status(201).json({
        data: createProduct,
        message: "products created",
      });
    } catch (error) {
      next(error);
    }
  });

  router.put(
    "/:productId",
    passport.authenticate("jwt", { session: false }),
    validation({ productId: productIdSchema }, "params"),
    validation(updateProductSchema),
    async (req, res, next) => {
      const { productId } = req.params;
      const { body: product } = req;

      try {
        const updateProduct = await productService.updateProduct({
          productId,
          product,
        });

        res.status(200).json({
          data: updateProduct,
          message: "product updated",
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete("/:productId",
    passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const { productId } = req.params;

    try {
      const product = await productService.deleteProduct({ productId });

      res.status(200).json({
        data: product,
        message: "product deleted",
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = productsApi;
