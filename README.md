## Data Grid

This is a Data Grid built using

[Create React App](https://github.com/facebook/create-react-app)

[react-virtualized](https://github.com/bvaughn/react-virtualized)

[Redux](https://github.com/reduxjs/redux)
___

![alt text](https://i.imgur.com/dNl0JRL.gif "Data Grid")

### Features
___

Virtual Scroll

Infinite Scroll for lazy data fetching

Data grouping

### How grouping works with infinite scrolling
___

Basically 2 queries will need to be fired off to the database.

The first being group and its count

    select memberType, count(1) from members group by memberType;

| Member Type   | Count |
| ------------- |:-----:|
| MemberTypeA   | 10    |
| MemberTypeB   | 20    |
| MemberTypeC   | 100   |

This should form the basis of the group rows to be displayed.

The second query would be similar but instead of having group in the query, the group will be part of the order by clause. Plus the data index that needs to be loaded.

    select memberType, name from members order by memberType limit 10 offset 20;

The selector creates the row indices plus matching row to data index for the query.

### Note
___

This project is not meant to be used as dependency. This is just a demonstration of combining React Virtualized's Infinite Scroll with data grouping.

Please feel free to look at (or even copy) the source code. Unit tests have also been provided to help understand the flow.

### Limitations
___

There is a current problem with react-virtualized whereby visible range will not cause `loadMoreRow` to fire off even though `rowCount` is different. A weird fix is in placed to overcome this problem but doesn't seem to be perfect as I am still not too sure where is the correct placement of `resetCache`.
