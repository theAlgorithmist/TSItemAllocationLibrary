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
 * Typescript Math Toolkit Item allocation - implementation of a Strategy pattern that allows a variety of payoff vs. capacity scenarios to be considered during
 * the solution process; this specific implementation represents the default, linear relationship.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 import {TSMT$AllocatableItem         } from './AllocatableItem';
 import {TSMT$IAllocatableItemProps   } from './IAllocatableItemProps';
 import {TSMT$IAllocatableItemStrategy} from './IAllocatableItemStrategy';

 export class TSMT$DefaultItemStrategy implements TSMT$IAllocatableItemStrategy
 {
   constructor()
   {
     // empty
   }

  /**
   * Transform cost and/or payoff values of a TSMT$AllocatableItem to enable what-if scenarios
   *
   * @param item: TSMT$AllocatableItem Reference to an allocatable item whose properties will be transformed
   *
   * @param data?: Object Optional property bag that may be used in rate and value computations - note that this may be passed as null, so always check before using
   *
   * @return TSMT$IAllocatableItemProps Object containing possibly transformed capacity and payoff values as well as the rate to use in initial sorting and actual 
   * value to be used in measuring payoff or profit contribution to objective.
   */
   public transform(item: TSMT$AllocatableItem, data?: Object): TSMT$IAllocatableItemProps
   {
     // tbd - check on rate computation if capacity is zero or near-zero?  Right now, you break it, you buy it.
     if (item !== null && item instanceof TSMT$AllocatableItem)
       return {capacity: item.capacity, payoff: item.payoff, rate: item.payoff/item.capacity, value: (item.solutionCapacity/item.capacity)*item.payoff};
   }

 }
