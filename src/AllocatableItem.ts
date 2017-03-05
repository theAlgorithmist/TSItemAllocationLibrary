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
 * Typescript Math Toolkit Item class - a container for generic items with capacity, risk, and payoff attributes.  Such items are to be fractionally allocated inside
 * some generic environment which could be physical (have actual area, volume, etc) or artifical (such as a schedule of activites).
 * 
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class TSMT$AllocatableItem 
 {
   // optional item properties that may be used to further identify an Item inside an application
   public name: string;
   public id: number;

   // capacity and payoff must all be greater than or equal to zero
   protected _capacity: number         = 0;   // total capacity (could be time or some spatial capacity) consumed by this item
   protected _payoff: number           = 0;   // expected payoff if total capacity is used
   protected _value: number            = 0;   // value of having this Item in any solution (should be assigned by a solver)
   protected _solutionCapacity: number = 0;   // how much capacity is in an optimal solution (should be assigned by a solver)

   // risk factors recognize that capacity/payoff values are typically stochastic; they are estimated or computed from other data and at best represent point-estimates
   // these factors can be used by an outside strategy to transform the input capacity/payoff values during the analysis
   protected _capacityRisk: number = 0;
   protected _payoffRisk: number   = 0;

   constructor()
   {
     this.name = "";
     this.id   = 0;
   }

  /**
   * Access the capacity of this Item
   *
   * @return number Item capacity
   */
   public get capacity(): number
   {
     return this._capacity;
   }

  /**
   * Access the payoff for this Item
   *
   * @return number Item payoff
   */
   public get payoff(): number
   {
     return this._payoff;
   }

  /**
   * Access the solution value for this Item
   *
   * @return number Value of having this Item in the solution
   */
   public get solutionValue(): number
   {
     return this._value;
   }

  /**
   * Access the solution capacity for this Item
   *
   * @return number Fraction of this Item in the optimal solution, converted into amount of this Item's total capacity consumed
   */
   public get solutionCapacity(): number
   {
     return this._solutionCapacity;
   }

  /**
   * Access the capacity risk for this Item
   *
   * @return number Capacity risk factor in arbitrary units - this can also be used as a parameter in a more general model for payoff vs. capacity consumed
   */
   public get capacityRisk(): number
   {
     return this._capacityRisk;
   }

  /**
   * Access the payoff risk for this Item
   *
   * @return number Payoff risk factor in arbitrary units - this can also be used as a parameter in a more general model for payoff vs. capacity consumed
   */
   public get payoffRisk(): number
   {
     return this._payoffRisk;
   }

  /**
   * Assign the capacity of this item
   * 
   * @param value: number Capacity of this item in arbitrary units; should be greater than or equal to zero
   *
   * @return nothing
   */
   public set capacity(value: number)
   {
     this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
   }

  /**
   * Assign the payoff of this item
   * 
   * @param value: number Payoff per unit capacity of this item in arbitrary units; should be greater than or equal to zero
   *
   * @return nothing
   */
   public set payoff(value: number)
   {
     this._payoff = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._payoff;
   }

  /**
   * Assign the capacity risk of this item
   * 
   * @param value: number Cost risk of this item in arbitrary units
   *
   * @return nothing
   */
   public set capacityRisk(value: number)
   {
     this._capacityRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._capacityRisk;
   }

  /**
   * Assign the payoff risk of this item
   * 
   * @param value: number Payoff risk of this item in arbitrary units
   *
   * @return nothing
   */
   public set payoffRisk(value: number)
   {
     this._payoffRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._payoffRisk;
   }

  /**
   * Assign the solution capacity this item
   * 
   * @param value: number Solution capacity in arbitrary units
   *
   * @return nothing
   */
   public set solutionCapacity(value: number)
   {
     this._solutionCapacity = value !== null && !isNaN(value) && isFinite(value) ? value : this._solutionCapacity;
   }

  /**
   * Assign the value of this item in the optimal solution
   *
   * @param v: number Assigned value that should be greater than or equal to zero
   *
   * @return nothing
   */
   public set solutionValue(v: number)
   {
     this._value = v !== null && !isNaN(v) && isFinite(v) && v >= 0 ? v : this._value;
   }

  /**
   * Clone this Allocatable Item
   *
   * @return TSMT$AllocatableItem Reference to new Allocatable Item with same properties as current item
   */
   public clone(): TSMT$AllocatableItem 
   {
     let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

     item.capacity     = this._capacity;
     item.payoff       = this._payoff;
     item.capacityRisk = this._capacityRisk;
     item.payoffRisk   = this._payoffRisk;

     return item;
   }
 }
