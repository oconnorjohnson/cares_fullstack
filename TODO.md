# TODO

### Overview

Add items, add selected checkbox once completed and move into 'DONE'.

## To Do

- [ ] add age range to new client table (0-17, 18-44, 45-64, 65+)
- [ ] deal with unpaid things like ubers and invoices whose totals change after approval
- [ ] better filtering on requests table
- [ ] export data from DB into CSV for comparisons
- [ ] add a chart to compare race and sex of clients
- [ ] double check the circled requests on Tracie's papers and compare with paper requests from Emily -- couple discrepancies that we need to confirm are correct discrepancies
- [ ] add specific frontend error handling in all client forms first, then move on to admin forms. New client, new request, etc. For new request, if we can show errors on previous tabs until clicking submit render all errors to last tab and say what the error is and which tab it is on. Handle errors related to overly long "additional information" and other fields in pre and post screen. Look into better form handling...right now when you click submit and then click the form again the old data is still there, at least for some of the forms maybe not all of them.
- [ ] log in to amplifund and start recording new requests after we bring old requests up to date
- [ ] table to view paid funds with following information:
  - Fund Type
  - Amount
  - Data
  - if fund type id is 3 then display (amount \* 2.5)

[] import { getAllRequests } from "@/server/actions/request/action" into "@/components/admin/tables/requests/page.tsx"

## Done

[X] Organize /server folder.
