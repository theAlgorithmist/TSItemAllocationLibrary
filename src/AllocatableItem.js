/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
/**
 * Typescript Math Toolkit Item class - a container for generic items with capacity, risk, and payoff attributes.  Such items are to be fractionally allocated inside
 * some generic environment which could be physical (have actual area, volume, etc) or artifical (such as a schedule of activites).
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var TSMT$AllocatableItem = (function () {
    function TSMT$AllocatableItem() {
        // capacity and payoff must all be greater than or equal to zero
        this._capacity = 0; // total capacity (could be time or some spatial capacity) consumed by this item
        this._payoff = 0; // expected payoff per unit capacity
        this._value = 0; // value of having this Item in any solution (always assigned by a solver)
        this._solutionCapacity = 0; // how much capacity is in an optimal solution
        // risk factors recognize that capacity/payoff values are typically stochastic; they are estimated or computed from other data and at best represent point-estimates
        // these factors can be used by an outside strategy to transform the input capacity/payoff values during the analysis
        this._capacityRisk = 0;
        this._payoffRisk = 0;
        this.name = "";
        this.id = 0;
    }
    Object.defineProperty(TSMT$AllocatableItem.prototype, "capacity", {
        /**
         * Access the capacity of this Item
         *
         * @return number Item capacity
         */
        get: function () {
            return this._capacity;
        },
        /**
         * Assign the capacity of this item
         *
         * @param value: number Capacity of this item in arbitrary units; should be greater than or equal to zero
         *
         * @return nothing
         */
        set: function (value) {
            this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$AllocatableItem.prototype, "payoff", {
        /**
         * Access the payoff for this Item
         *
         * @return number Item payoff
         */
        get: function () {
            return this._payoff;
        },
        /**
         * Assign the payoff of this item
         *
         * @param value: number Payoff per unit capacity of this item in arbitrary units; should be greater than or equal to zero
         *
         * @return nothing
         */
        set: function (value) {
            this._payoff = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._payoff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$AllocatableItem.prototype, "solutionValue", {
        /**
         * Access the solution value for this Item
         *
         * @return number Value of having this Item in the solution
         */
        get: function () {
            return this._value;
        },
        /**
         * Assign the value of this item in the optimal solution
         *
         * @param v: number Assigned value that should be greater than or equal to zero
         *
         * @return nothing
         */
        set: function (v) {
            this._value = v !== null && !isNaN(v) && isFinite(v) && v >= 0 ? v : this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$AllocatableItem.prototype, "solutionCapacity", {
        /**
         * Access the solution capacity for this Item
         *
         * @return number Fraction of this Item in the optimal solution, converted into amount of this Item's total capacity consumed
         */
        get: function () {
            return this._solutionCapacity;
        },
        /**
         * Assign the solution capacity this item
         *
         * @param value: number Solution capacity in arbitrary units
         *
         * @return nothing
         */
        set: function (value) {
            this._solutionCapacity = value !== null && !isNaN(value) && isFinite(value) ? value : this._solutionCapacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$AllocatableItem.prototype, "capacityRisk", {
        /**
         * Access the capacity risk for this Item
         *
         * @return number Capacity risk factor in arbitrary units - this can also be used as a parameter in a more general model for payoff vs. capacity consumed
         */
        get: function () {
            return this._capacityRisk;
        },
        /**
         * Assign the capacity risk of this item
         *
         * @param value: number Cost risk of this item in arbitrary units
         *
         * @return nothing
         */
        set: function (value) {
            this._capacityRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._capacityRisk;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$AllocatableItem.prototype, "payoffRisk", {
        /**
         * Access the payoff risk for this Item
         *
         * @return number Payoff risk factor in arbitrary units - this can also be used as a parameter in a more general model for payoff vs. capacity consumed
         */
        get: function () {
            return this._payoffRisk;
        },
        /**
         * Assign the payoff risk of this item
         *
         * @param value: number Payoff risk of this item in arbitrary units
         *
         * @return nothing
         */
        set: function (value) {
            this._payoffRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._payoffRisk;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clone this Allocatable Item
     *
     * @return TSMT$AllocatableItem Reference to new Allocatable Item with same properties as current item
     */
    TSMT$AllocatableItem.prototype.clone = function () {
        var item = new TSMT$AllocatableItem();
        item.capacity = this._capacity;
        item.payoff = this._payoff;
        item.capacityRisk = this._capacityRisk;
        item.payoffRisk = this._payoffRisk;
        return item;
    };
    return TSMT$AllocatableItem;
}());
exports.TSMT$AllocatableItem = TSMT$AllocatableItem;
