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

/**
 * Typescript Math Toolkit Item allocation - computes optimal allocation of Items with specified capacity/payoff into an environment with a specified total capacity.
 * Item and environment capacity must be integral, so the problem is formulated as the classic 0-1 knapsack problem.  In textbook terms, think of Item capacity as
 * weight and Item payoff as value from including the item in the proverbial knapsack.
 *
 * Usage is to similar to TSMT$ItemAllocation; add TSMT$AllocatableItem instances via calls to addItem(), set the capacity, and then call allocate().  In a future
 * release of the Typescript Math Toolkit, a common base class will be created for both TSMT$Knapsack and TSMT$ItemAllocation to alleviate code overlap in the current 
 * alpha releases (which are largely for public evaluation and feedback on API).
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 import {TSMT$AllocatableItem} from './AllocatableItem';
 import {TSMT$MatrixFactory  } from './Matrix';

 export class TSMT$Knapsack
 {
   protected _items: Array<TSMT$AllocatableItem>;       // item collection from which a subset is placed into the optimal allocation

   protected _capacity: number = 0;                     // (nonzero) capacity that serves as a constraint for the allocation

   // post-solution
   protected _solutionCapacity: number = 0;             // total capacity consumed in the optimal allocation
   protected _solutionPayoff: number   = 0;             // total payoff from the optimal allocation

   constructor()
   {
     this.clear();
   }

  /**
   * Access the total number of items in the environment (not the optimal allocation)
   *
   * @return number Total number of allocatable items that have been added to the environment and are candidates to be included in the optimal item allocation
   */
   public get itemCount(): number
   {
     return this._items.length;
   }

  /**
   * Access the total capacity consumed in the optimal allocation
   *
   * @return number Total capacity consumed for all the items in the optimal allocation
   */
   public get solutionCapacity(): number
   {
     return this._solutionCapacity;
   }

  /**
   * Access the total payoff of the optimal allocation
   *
   * @return number Total payoff for all the items in the optimal allocation
   */
   public get payoff(): number
   {
     return this._solutionPayoff;
   }

  /**
   * Access the capacity
   *
   * @return number Total capacity of the 'environment'
   */
   public get capacity(): number
   {
     return this._capacity;
   }

  /**
   * Assign a capacity to this 'environment'
   *
   * @param value: number Non-negative capacity value in arbitrary units - must be nonegative and integral
   *
   * @return nothing If valid, environment capacity is set to the assigned value.  Capacity represents the allowable consumption of some environment which may be 
   * physical space, but could also be time, for example.  Capacity is always non-negative and is always internally converted to an integer.
   */
   public set capacity(value: number)
   {
     // yes, this needs to be made more DRY in context of this project
     this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;

     // capacity must be integral
     this._capacity = Math.floor(this._capacity);
   }

  /**
   * Add an allocatable item to the collection
   *
   * @param item: TSMT$AllocatableItem Reference to a TSMT$AllocatableItem to add to the collection
   *
   * @return nothing If valid, the item is added to the collection
   */
   public addItem(item: TSMT$AllocatableItem): void
   {
     if (this.__isValidItem(item))
       this._items.push(item);
   }

  /**
   * Remove an allocatable item to the collection
   *
   * @param item: TSMT$AllocatableItem Reference to a TSMT$AllocatableItem to add to the collection
   *
   * @return nothing If found in the item collection, the input item is removed
   */
   public removeItem(item: TSMT$AllocatableItem): void
   {
     const len: number = this._items.length;
     if (len == 0)
       return;

     let i: number;
     for (i=0; i<len; ++i)
     {
       if (item === this._items[i])
       {
         this._items.splice(i, 1);

         break;
       }
     }
   }

  /**
   * Allocate items to the environment from the collection, based on assigned item strategy and specified environment capacity
   *
   * @return Array<TSMT$AllocatableItem> Array of items that were included in the optimal allocation.  Use cost() and payoff() accessors to obtain the total cost and
   * payoff from this allocation.  Note that the allocation is not cached - if a subsequent call is made to allocate() without changing any inputs, the entire solution
   * will be recomputed.
   * 
   * Note: No check is made on item capacities, which must be non-negative and integral
   */
   public allocate(): Array<TSMT$AllocatableItem>
   {
     let allocation: Array<TSMT$AllocatableItem> = new Array<TSMT$AllocatableItem>();
     let itemCount: number                       = this._items.length;
     let item: TSMT$AllocatableItem;

     if (itemCount == 0)
       return allocation;

     if (this._capacity == 0)
       return allocation;

     // one item is treated as an edge case - just seems strange to build a value table for only one item :)
     if (itemCount == 1)
     {
       item = this._items[0];
       if (item.capacity <= this._capacity)
       {
         item.solutionCapacity = item.capacity;
         item.solutionValue    = item.payoff;

         allocation.push(item);
       }

       return allocation;
     }

     // 'value' matrix - rows represent items and column indices are integer capacity values (the first row/column represents a trivial or degenerate problem).
     let rows: number = itemCount+1;
     let cols: number = this._capacity+1;
     let value: Array<Array<number>> = TSMT$MatrixFactory.create(rows, cols, 0.0);

     let i: number;
     let capacity: number;

     // process by rows or by item capacity
     for (i=1; i<rows; ++i)
     {
       item = this._items[i-1];
       for (capacity=1; capacity<cols ; ++capacity)
       {
         if ( item.capacity <= capacity)
         {
           // new value is maximum of current item payoff and payoff of what can be achieved with remaining capacity vs. prior sub-problem
            value[i][capacity] = Math.max ( item.payoff + value[i-1][capacity - item.capacity], value[i-1][capacity] );
         }
         else 
         {
           // current item requires too much capacity, so current value is previous row value
           value[i][capacity] = value[i-1][capacity];
         }
       }
     }

     // payoff from this solution ends up on the lower, right-hand corner of the table
     this._solutionPayoff = value[rows-1][cols-1];

     // backtrack to determine which items are in the optimal allocation
     let curValue: number = this._solutionPayoff;
     capacity             = cols-1;
     i                    = rows-1;

     while (curValue > 0)
     {
       // in optimal allocation?  yes, if did not come from prior sub-problem
       if (value[i-1][capacity] != curValue)
       {
         item                  = this._items[i-1];
         item.solutionCapacity = item.capacity;
         item.solutionValue    = item.payoff;

         allocation.push(item);

         i--;
         capacity -= item.capacity;
       }
       else
         i--;
         
       curValue = value[i][capacity];  // as soon as this is zero, we quit
     }

     return allocation; // beam me up, Scotty
   }

  /**
   * Clear the environment and prepare for new inputs
   *
   * @return nothing
   */
   public clear(): void
   {
     this._items            = new Array<TSMT$AllocatableItem>();
     this._capacity         = 0;
     this._solutionCapacity = 0;
     this._solutionPayoff   = 0;
   }

   // type guard for allocatable item
   protected __isValidItem(value: any): value is TSMT$AllocatableItem
   {
     return value !== null && value instanceof TSMT$AllocatableItem;
   }

 }
