# Charts

- [x] % of Total Requests by Agency (bar)
- [x] Pre/Post Screen Analysis (bar)
- [ ] convert % of total reqs from bar to area chart
- [ ] % of Total Requests Containing Each Asset Type (pie)
- [ ] Dollars spent per asset category (pie)
- [ ] Requests submitted per week per agency (multi area chart)
- [ ] pre/post question category by change in avg (radar chart multiple)

## % of Total Requests Containing Each Asset Type Agency - pie chart

1. Database Query: Group requests by agencyId and count the number of requests for each agency.
2. Mapping: Calculate the percentage of total requests for each agency by dividing the count of requests for each agency by the total number of requests.

## Dollars spent per asset category - pie chart

1. Database Query: The groupBy query groups funds by fundTypeId and sums their values where paid is true.
2. Mapping: The result is then mapped to get the fund type names and their corresponding total values.

## Requests submitted per week per agency - multi area chart

1. Database Query: Group requests by agencyId and week (derived from the request date) and count the number of requests for each combination.
2. Mapping: Structure the data to show the number of requests per week for each agency, suitable for a multi-area chart.

## pre/post question category by change in avg - radar chart multiple

1. Database Query: Group responses by questionCategoryId and calculate the average score for pre and post responses separately.
2. Mapping: Calculate the change in average score for each question category by subtracting the pre average from the post average.
3. Structure: Format the data to be suitable for a radar chart, showing the change in average score for each question category.
