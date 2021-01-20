const express = require('express')
const router = express.Router()
const ProductsService = require('../../services/product')

const productService = new ProductsService()

router.get('/', async (req, res, next) => {
    const { tags } = req.query
    console.log('req', req.query)
    try {
        const products = await productService.getProducts({ tags })

        res.status(200).json({
            data: products,
            message: 'products listed'
        })
    } catch (error) {
        next(error)
    }
})

router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params
    console.log("req", req.params)
    try {
        const product = await productService.getProduct({ productId })

        res.status(200).json({
            data: product,
            message: 'products retrieve'
        })
    } catch (error) {
        next(error)
    }
    
})

router.post('/', async (req, res, next) => {
    const { body: product } = req;

    try {
        const createProduct = await productService.createProduct({ product })

        res.status(201).json({
            data: createProduct,
            message: 'products created'
        })
    } catch (error) {
        next(error)
    }
   
})

router.put('/:productId', async (req, res, next) => {
    const { productId } = req.params
    const { body: product } = req

    try {
        const updateProduct = await productService.updateProduct({ productId, product })

        res.status(200).json({
            data: updateProduct,
            message: 'product updated'
        })
    } catch (error) {
        next(error)
    }
    
})

router.delete('/:productId', async (req, res, next) => {
    const { productId } = req.params

    try {
        const product = await productService.updateProduct({ productId })

        res.status(200).json({
            data: product,
            message: 'product deleted'
        })

    } catch (error) {
        next(error)
    }
    
})

module.exports = router