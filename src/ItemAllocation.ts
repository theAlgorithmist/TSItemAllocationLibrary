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
 * Items may be fractionally consumed, i.e. it is acceptable to complete 50% of a task in a time interval along with other tasks.  Payoff from a single Item is the
 * amount of utility gained if the entire capacity of that Item is consumed.  Payoff is presumed to be continuous and linear as a function of units of capacity.
 *
 * A Strategy pattern is used to assign an algorithm to transform Item costs and/or payoffs to enable 'what if' analyses as a comparison to baseline optimal
 * solution, which is just solving the continuous knapsack problem.  Other models of payoff vs. capacity consumed could be considered.  A default strategy that leaves 
 * item capacity and payoff unchanged and uses a linear model for payoff vs. capacity is provided with the code distribution.  If no strateg is defined, the default 
 * strategy is automatically assigned and used during the solution process.  This produces the same result as if no strategy had been applied at all.
 *
 * Usage is to add TSMT$AllocatableItem instances via calls to addItem(), set the capacity, and then call allocate().  Optionally, assign a TSMT$IAllocatableItemStrategy
 * for what-if scenarios.  
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 import {TSMT$AllocatableItem         } from './AllocatableItem';
 import {TSMT$IAllocatableItemProps   } from './IAllocatableItemProps';
 import {TSMT$IAllocatableItemStrategy} from './IAllocatableItemStrategy';
 import {TSMT$DefaultItemStrategy     } from './DefaultItemStrategy';

 export class TSMT$ItemAllocation
 {
   protected _strategy: TSMT$IAllocatableItemStrategy;  // strategy for computing payoff vs. capacity consumed and optionally modifying capacity/payoff for what-if scenarios

   protected _items: Array<TSMT$AllocatableItem>;       // item collection from which a subset is placed into the optimal allocation

   protected _capacity: number = 0;                     // (nonzero) capacity that serves as a constraint for the allocation

   protected _data: Object;                             // an optional data item that allows properties to be passed to strategies

   // post-solution
   protected _solutionCapacity: number   = 0;           // total capacity consumed in the optimal allocation
   protected _solutionPayoff: number = 0;               // total payoff from the optimal allocation

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
   * @param value: number Non-negative capacity value in arbitrary units
   *
   * @return nothing If valid, environment capacity is set to the assigned value.  Capacity represents the allowable consumption of some environment which may be 
   * physical space, but could also be time, for example.  Capacity is always non-negative. 
   */
   public set capacity(value: number)
   {
     // yes, this needs to be made more DRY in context of this project
     this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
   }

  /**
   * Assign strategy data to this allocation
   *
   * @param value: Object name-value pairs of arbitrary data that may be passed to an input strategy's transform method
   */
   public set data(value: Object)
   {
     if (value !== null && typeof value == "object")
       this._data = JSON.parse( JSON.stringify(value) ); 
   }

  /**
   * Add an item strategy to this environment
   *
   * @param strategy: TSMT$IAllocatableItemStrategy Reference to an item allocation strategy.  The algorithm inside the transform() method alters the cost and/or
   * payoff of each item in the environment to enable 'what-if' scenarios.  The original item settings always remain unchanged.
   *
   * @return nothing If valid, the internal strategy is assigned; this overwrites any previously assigned strategy
   */
   public addStrategy(strategy: TSMT$IAllocatableItemStrategy): void
   {
     if (this.__isValidStrategy(strategy))
       this._strategy = strategy;
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
   */
   public allocate(): Array<TSMT$AllocatableItem>
   {
     let allocation: Array<TSMT$AllocatableItem> = new Array<TSMT$AllocatableItem>();
     let itemCount: number                       = this._items.length;

     if (itemCount == 0)
       return allocation;

     if (this._capacity == 0)
       return allocation;

     // need to set default strategy?
     if (this._strategy == null || this._strategy == undefined)
       this._strategy = new TSMT$DefaultItemStrategy();

     // general reference to transformed item properties
     let p:TSMT$IAllocatableItemProps;

     // reference to an item in the collection
     let item: TSMT$AllocatableItem;

     // edge cases - there is only one at present
     if (itemCount == 1)
     {
       item = this._items[0];

       // implement specified item transform
       p = this._strategy.transform(item, this._data);

       // fraction of total environment capacity that can be consumed by the singleton item
       let f: number = (p.capacity <= this._capacity) ? 1.0 : this._capacity/p.capacity;

       this._solutionCapacity = f*p.capacity;
       this._solutionPayoff   = f*p.payoff;
       item.solutionValue     = this._solutionPayoff;
       item.solutionCapacity  = this._solutionCapacity;

       allocation.push(item);

       return allocation;
     }
       
     let solutionCapacity: number = 0;  // running capacity in the solution process
     let payoff: number           = 0;  // running payoff or utility measure in the solution process;
     let slack: number;                 // amount of slack or 'leftover' capacity                
     let i: number;

     // initial sort 
     this._items.sort( (item1: TSMT$AllocatableItem, item2: TSMT$AllocatableItem): number => {
       let c: number = 0; 
       let t1: TSMT$IAllocatableItemProps = this._strategy.transform(item1, this._data);
       let t2: TSMT$IAllocatableItemProps = this._strategy.transform(item2, this._data);
       let r1: number = t1.rate;
       let r2: number = t2.rate;

       if (r1 > r2)
         c = -1;
       else if (r1 < r2)
         c = 1;

       return c;
     });

     this._solutionCapacity = 0;  // begin with no environment capacity taken up by any item

     // Dantzig's greedy algorithm - really nothing new under the sun
     for (i=0; i<itemCount; ++i)
     {
       slack = this._capacity - this._solutionCapacity;
      
       if (slack <= 0.0)
         break;

       item = this._items[i];
       p    = this._strategy.transform(item, this._data);  // get the transform parameters
 
       // does this item's capacity exceed or equal remaining slack?
       if (p.capacity >= slack)
       {
         // take up the remaining capacity with this item and we're finished!
         item.solutionCapacity  = slack;
         this._solutionCapacity = this._capacity;

         // p.rate is the rate of change of of payoff vs. capacity (presumed linear for this release)
         item.solutionValue    = p.rate*slack;
         this._solutionPayoff += item.solutionValue;

         allocation.push(item);  // add this item to the allocation

         break;
       }
       else
       {
         // this item's entire capacity can be consumed by the remaining slack in the environment
         item.solutionCapacity   = p.capacity;
         item.solutionValue      = p.payoff;
         this._solutionCapacity += p.capacity;
         this._solutionPayoff   += p.payoff;

         allocation.push(item);  // add this item to the allocation
       }
     }

     // tbd - mark that the solution has been validated and only recompute if input mods invalidate solution?

     return allocation; // beam me up, Scotty
   }

  /**
   * Clear the environment and prepare for new inputs
   *
   * @return nothing
   */
   public clear(): void
   {
     this._strategy         = null;
     this._data             = null;
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

   // type guard for assigned strategy
   protected __isValidStrategy(value: any): value is TSMT$IAllocatableItemStrategy
   {
     return value !== null && value.hasOwnProperty('transform');
   }

 }
