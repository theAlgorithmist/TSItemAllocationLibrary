# Typescript Math Toolkit Item Allocation

There is a certain value in being able to simplify and mold problems into a form that can be solved with relatively well-known algorithms, even if a slight twist is required.  This reduces billing to the client and in many cases allows a solution to be implemented entirely on a device where a server-side solution might otherwise be indicated.  This repo resulted from such a simplification, essentially reducing what was thought to be a single stochasic optimization problem into two problem sets:

1 - Transform inputs so that a problem may be addressed in 0-1 knapsack form.

2 - Model as a continuous knapsack problem, but provide software hooks that allow what-if scenarios to be constructed and run.  Also allow item payoffs, for example, to be drawn from a probability distruction and run a simple Monte-Carlo style simulation.

It was important that the entire solution could be run on a standalone device to accommodate scenarios where decision-makers in the field might not have server access or such access would likely be sporadic.  In my mind, this requirement necessitated developing a heuristic solution and not relying on full-on optimization software running server-side.

Fortunately, problem 1 has a well-known Dynamic Programming solution and problem 2 may be quickly solved using Dantzig's greedy algorithm.  Time and space complexity of the former is O(NC) where N is the number of items and C is the system capcity.  The greedy algorithm requires a sort and a loop, so its time-complexity is O(Nlog(N) + N).  Most references ignore the loop since time is dominated by the initial sort.

For a reasonable number of items and capacity constraint, both problems can be solved efficiently on a wide variety of handheld devices.  The base solution software is now available in the Typesript Math Toolkit and is provided in this alpha release for public testing and API feedback.

To better understand the TSMT implementation of item allocation, it's time to introduce some jargon :)

_Environment_ - a generally physical system that could be anything from an enterprise to a file system, but could represent an artificial entity that has some measurable concept of capacity

_AllocatableItem_ - an Item that may be allocated to the environment.  Items have both capacity and payoff as minimal properties.

_Capacity_ - Space or other consumable quantity that is taken out of the environment when an item is placed into the environment. 

_Payoff_ - Value obtained by placing the item into the environment.  

In traditional terms, the knapsack is the environment, capacity is weight (the knapsack can only hold 15lb, for example) and payoff is value of the item in some currency unit, i.e. $250. 

The item allocation problem is to place items into the enviroment (order is not important) such that total payoff is maximized while ensuring that specified capacity of the enviroment is not exceeded.  The two types of allocation problem that may be solved are:

0-1 - This terminology comes from formulation as a classic operations resarch problem with binary decision variables.  An item is either completely in the optimal solution (one) or completely out (zero).  Items may not be 'broken apart'. 

Continuous - In this formulation, fractional allocation of items to the environment is allowable, i.e. it is possible to allocate 50% of a certain item.  Measured payoff is presumed to be a simple linear function of allocated capacity, i.e. 50% allocation means that 50% of that item's payoff is realized.  The TSMT implementation of the continuous problem uses a Strategy pattern to apply an algorithm that considers either slightly different forms of payoff vs. capacity or alters the original capacity/payoff.  The latter is done in a manner that preserves the original inputs and easily enables what-if simulations (without manual modification of item properties).

An initial release of the Typescript Math Toolkit matrix factory is provided with this distribution.


Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.0.3

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.  Note that in the current implementation, _TSMT$Allocation_ and _TSMT$Knapsack_ contain some obvious overlap.  Once the TSMT moves nearer to beta release, these classes will derive from a common base class.  I am waiting on that development to first finalize the API.


### Using the class library

Items are instances of the _TSMT$AllocatableItem_ class and have capacity and payoff as minimal properties.  It is possible to assign optional _risk_ factors to both payoff and capacity.  These could be combined with arbitrary data that may be passed into the environment to transform original capacity and/or payoff, thus enabling what-if sencarios or simulation of these properies in a stochastic environment.  Such analysis is currently only possible with the continuous item allocation problem.

**Continuous Problem**

An environment is defined as an instance of the _TSMT$Allocation_ class.  Items are added individually to the environment.  Items may also be removed.  The environment accepts a concrete implementation of  _TSMT$IAllocatableItemStrategy_ as a strategy for altering original item capacity and payoff during analysis.  

```
export interface TSMT$IAllocatableItemStrategy
{
  transform(item: TSMT$AllocatableItem, data?: Object): TSMT$IAllocatableItemProps;
}
```

The _transform_ method takes a _TSMT$AllocatableItem_ and optional data as input.  It may transform the original item's _capacity_ and _payoff_ properties.  The rate of change of payoff vs. capacity may be specified along with the value of placing a certain amount of this item in the optimal allocation. 

If the transformation is not desired, then it is not necessary to assign a strategy.  A default strategy is assigned that produces the same result as the classic algorithm:

```
public transform(item: TSMT$AllocatableItem, data?: Object): TSMT$IAllocatableItemProps
{
  if (item !== null && item instanceof TSMT$AllocatableItem)
    return {capacity: item.capacity, payoff: item.payoff, rate: item.payoff/item.capacity, value: (item.solutionCapacity/item.capacity)*item.payoff};
}
````

Aribitrary data may be passed into the environment using the _data_ mutator.  This data is passed along to each item transformation.

Set capacity for the environment and then call the _allocate()_ method to perform the optimal allocation.  This returns an _Array<TSMT$AllocatableItem>_ of items in the optimal allocation.  Access each item's solution capacity and solution value to determine the amount of that item in the optimal allocation and its contribution to total payoff.  The latter many be obtained from the _TSMT$Allocation_ _payoff_ accessor.


**0-1 Problem**

The environment is an instance of the _TSMT$Knapsack_ class.  If you have trouble formulating a problem, just remember the traditional description of this problem, then capacity = weight and value = payoff.  Add items and assign environment capacity as above.  Call the _allocate()_ method to produce the optimal allocation.  There is no transformation strategy for item capacity and payoff, so any type of what-if analysis must be performed by manually adjusting item properties and re-optimizing.

Refer to the test cases for detailed usage illustrations.

Note that calls to either class _allocate()_ method do not take into account whether or not any inputs have actually changed; the optimal allocation is always computed from scratch in the current implementation.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

