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
 * Typescript Math Toolkit Item allocation - computes optimal allocation of Items with specified capacity/payoff into an environment with a specified total capacity.
 * Item and environment capacity must be integral, so the solution is implemented as the classic 0-1 knapsack problem.  In textbook terms, think of Item capacity as
 * weight and Item payoff as profit from including the item in the proverbial knapsack.
 *
 * Usage is to similar to TSMT$ItemAllocation; add TSMT$AllocatableItem instances via calls to addItem(), set the capacity, and then call allocate().  In a future
 * release of the Typescript Math Toolkit, it is likely that a common base class will be created for both TSMT$Knapsack and TSMT$ItemAllocation to alleviate code
 * overlap in the current alpha releases (which are largely for public evaluation and feedback on API).
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var AllocatableItem_1 = require('./AllocatableItem');
var Matrix_1 = require('./Matrix');
var TSMT$Knapsack = (function () {
    function TSMT$Knapsack() {
        this._capacity = 0; // (nonzero) capacity that serves as a constraint for the allocation
        // post-solution
        this._solutionCapacity = 0; // total capacity consumed in the optimal allocation
        this._solutionPayoff = 0; // total payoff from the optimal allocation
        this.clear();
    }
    Object.defineProperty(TSMT$Knapsack.prototype, "itemCount", {
        /**
         * Access the total number of items in the environment (not the optimal allocation)
         *
         * @return number Total number of allocatable items that have been added to the environment and are candidates to be included in the optimal item allocation
         */
        get: function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Knapsack.prototype, "solutionCapacity", {
        /**
         * Access the total capacity consumed in the optimal allocation
         *
         * @return number Total capacity consumed for all the items in the optimal allocation
         */
        get: function () {
            return this._solutionCapacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Knapsack.prototype, "payoff", {
        /**
         * Access the total payoff of the optimal allocation
         *
         * @return number Total payoff for all the items in the optimal allocation
         */
        get: function () {
            return this._solutionPayoff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Knapsack.prototype, "capacity", {
        /**
         * Access the capacity
         *
         * @return number Total capacity of the 'environment'
         */
        get: function () {
            return this._capacity;
        },
        /**
         * Assign a capacity to this 'environment'
         *
         * @param value: number Non-negative capacity value in arbitrary units - must be nonegative and integral
         *
         * @return nothing If valid, environment capacity is set to the assigned value.  Capacity represents the allowable consumption of some environment which may be
         * physical space, but could also be time, for example.  Capacity is always non-negative and is always internally converted to an integer.
         */
        set: function (value) {
            // yes, this needs to be made more DRY in context of this project
            this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
            // capacity must be integral
            this._capacity = Math.floor(this._capacity);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add an allocatable item to the collection
     *
     * @param item: TSMT$AllocatableItem Reference to a TSMT$AllocatableItem to add to the collection
     *
     * @return nothing If valid, the item is added to the collection
     */
    TSMT$Knapsack.prototype.addItem = function (item) {
        if (this.__isValidItem(item))
            this._items.push(item);
    };
    /**
     * Remove an allocatable item to the collection
     *
     * @param item: TSMT$AllocatableItem Reference to a TSMT$AllocatableItem to add to the collection
     *
     * @return nothing If found in the item collection, the input item is removed
     */
    TSMT$Knapsack.prototype.removeItem = function (item) {
        var len = this._items.length;
        if (len == 0)
            return;
        var i;
        for (i = 0; i < len; ++i) {
            if (item === this._items[i]) {
                this._items.splice(i, 1);
                break;
            }
        }
    };
    /**
     * Allocate items to the environment from the collection, based on assigned item strategy and specified environment capacity
     *
     * @return Array<TSMT$AllocatableItem> Array of items that were included in the optimal allocation.  Use cost() and payoff() accessors to obtain the total cost and
     * payoff from this allocation.  Note that the allocation is not cached - if a subsequent call is made to allocate() without changing any inputs, the entire solution
     * will be recomputed.
     *
     * Note: No check is made on item capacities, which must be non-negative and integral
     */
    TSMT$Knapsack.prototype.allocate = function () {
        var allocation = new Array();
        var itemCount = this._items.length;
        var item;
        if (itemCount == 0)
            return allocation;
        if (this._capacity == 0)
            return allocation;
        // one item is treated as an edge case - just seems strange to build a value table for only one item :)
        if (itemCount == 1) {
            item = this._items[0];
            if (item.capacity <= this._capacity) {
                item.solutionCapacity = item.capacity;
                item.solutionValue = item.payoff;
                allocation.push(item);
            }
            return allocation;
        }
        // 'value' matrix reprsents the ongoing value of solving smaller knapsack problems - rows represent capacity and columns payoff (the first row/column represent a trivial
        // or degenerate problem)
        var rows = itemCount + 1;
        var cols = this._capacity + 1;
        var value = Matrix_1.TSMT$MatrixFactory.create(rows, cols, 0.0);
        var i; // for each row
        var capacity; // this serves as a running capacity measure across each column 
        // process by rows or by item capacity
        for (i = 1; i < rows; ++i) {
            item = this._items[i - 1];
            for (capacity = 1; capacity < cols; ++capacity) {
                if (item.capacity <= capacity) {
                    // new value is maximum of current item payoff and payoff of what can be achieved with remaining capacity vs. prior sub-problem
                    value[i][capacity] = Math.max(item.payoff + value[i - 1][capacity - item.capacity], value[i - 1][capacity]);
                }
                else {
                    // current item requires too much capacity, so current value is row value
                    value[i][capacity] = value[i - 1][capacity];
                }
            }
        }
        // payoff from this solution ends up on the lower, right-hand corner of the table
        this._solutionPayoff = value[rows - 1][cols - 1];
        // backtrack to determine which items are in the optimal allocation
        var curValue = this._solutionPayoff;
        capacity = cols - 1;
        i = rows - 1;
        while (curValue > 0) {
            if (value[i - 1][capacity] != curValue) {
                // in optimal allocation?  yes, if did not come from prior sub-problem
                item = this._items[i - 1];
                item.solutionCapacity = item.capacity;
                item.solutionValue = item.payoff;
                allocation.push(item);
                i--;
                capacity -= item.capacity;
            }
            else
                i--;
            curValue = value[i][capacity]; // as soon as this is zero, we quit
        }
        return allocation; // beam me up, Scotty
    };
    /**
     * Clear the environment and prepare for new inputs
     *
     * @return nothing
     */
    TSMT$Knapsack.prototype.clear = function () {
        this._items = new Array();
        this._capacity = 0;
        this._solutionCapacity = 0;
        this._solutionPayoff = 0;
    };
    // type guard for allocatable item
    TSMT$Knapsack.prototype.__isValidItem = function (value) {
        return value !== null && value instanceof AllocatableItem_1.TSMT$AllocatableItem;
    };
    return TSMT$Knapsack;
}());
exports.TSMT$Knapsack = TSMT$Knapsack;
