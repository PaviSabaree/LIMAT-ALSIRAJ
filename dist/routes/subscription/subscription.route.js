"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const subscription_service_1 = require("../../service/subscription/subscription.service");
class SubscriptionRoute {
    constructor() {
        this.router = express.Router();
        this._createSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionResult = yield this.subscriptionService.createSubscription(req.body);
                if (!subscriptionResult && subscriptionResult === undefined) {
                    throw new Error('unable to save subscription');
                }
                const response = {
                    status: 200,
                    message: `Event created sucessfully and id = ${subscriptionResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("SubscriptionRoute: Error occured in _createSubscription", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._getSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionResult = yield this.subscriptionService.getSubscriptions();
                if (!subscriptionResult && subscriptionResult === undefined) {
                    throw new Error('unable to get the subscription list');
                }
                res.json({ data: subscriptionResult });
            }
            catch (error) {
                console.log("SubscriptionRoute: Error occured in _getSubscription", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._updateSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionUpdatedResult = yield this.subscriptionService.updateSubscription(req.body, req.params.id);
                if (!subscriptionUpdatedResult && subscriptionUpdatedResult === undefined) {
                    throw new Error('unable to update event');
                }
                const response = {
                    status: 200,
                    message: `Subscription updated sucessfully and id = ${subscriptionUpdatedResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("SubscriptionRoute: Error occured in _updateSubscription", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._deleteSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionResult = yield this.subscriptionService.deleteSubscription(req.params.id);
                if (!subscriptionResult && subscriptionResult === undefined) {
                    throw new Error('unable to delete subscription');
                }
                const response = {
                    status: 200,
                    message: `subscription deleted sucessfully and id = ${subscriptionResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("SubscriptionRoute: Error occured in _deleteSubscription", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this.router.post('/subscription/create', this._createSubscription);
        this.router.get('/subscription/get', this._getSubscription);
        this.router.put('/subscription/update/:id', this._updateSubscription);
        this.router.delete('/subscription/delete/:id', this._deleteSubscription);
        this.subscriptionService = new subscription_service_1.default();
    }
}
exports.default = SubscriptionRoute;
//# sourceMappingURL=subscription.route.js.map