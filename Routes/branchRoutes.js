const express = require("express");
const { getBranchesByCompanyId  , getBranchDetailsByBranchId  , addBranch } = require("../Controller/branchController");
const jwt = require('jsonwebtoken');
const { authenticateAndCheckRole } = require('../Middleware/auth')

const router = express.Router();

/**
 * @swagger
 * /getAllBranchesByComapnyId:
 *   post:
 *     summary: Get all branches by company ID
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: companyId
 *         description: Company ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             companyId:
 *               type: string
 *               description: The ID of the company
 *               example: "1234"
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branchId:
 *                     type: string
 *                   branchName:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /getBranchDetailsByBranchId:
 *   post:
 *     summary: Get branch details by branch ID
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: branchId
 *         description: Branch ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             branchId:
 *               type: string
 *               description: The ID of the branch
 *               example: "5678"
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branchId:
 *                   type: string
 *                 branchName:
 *                   type: string
 *                 location:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /add-branch:
 *   post:
 *     summary: Add a new branch
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchName:
 *                 type: string
 *                 example: "New Branch"
 *               location:
 *                 type: string
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */



router.post("/getAllBranchesByComapnyId" ,authenticateAndCheckRole , getBranchesByCompanyId );
router.post("/getBranchDetailsByBranchId",  authenticateAndCheckRole ,getBranchDetailsByBranchId );
router.post("/add-branch", authenticateAndCheckRole,  addBranch );


module.exports = router;
