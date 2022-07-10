const express = require("express");
const { model } = require("mongoose");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const {isAuthUser,authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthUser,newOrder);
router.route("/order/:id").get(isAuthUser,authorizeRoles("admin"),getSingleOrder);
router.route("/orders/me").get(isAuthUser,myOrders);

router.route("/admin/orders").get(isAuthUser,authorizeRoles("admin"),getAllOrders);

router.route("/admin/order/:id").put(isAuthUser,authorizeRoles("admin"),updateOrder).delete(isAuthUser,authorizeRoles("admin"),deleteOrder);

module.exports = router