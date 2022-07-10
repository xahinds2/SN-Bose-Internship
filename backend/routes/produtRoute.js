const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const {isAuthUser,authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthUser, authorizeRoles("admin"), getAdminProducts)

router.route("/admin/product/new").post(isAuthUser,authorizeRoles("admin"),createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthUser, authorizeRoles("admin"), deleteProduct);


router.route("/review").put(isAuthUser,createProductReview);

router.route("/product/:id").get(getProductDetails);

router.route("/reviews").get(getProductReviews).delete(isAuthUser,deleteReview);
 

module.exports = router;