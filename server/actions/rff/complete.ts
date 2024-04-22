"use server";

import {
  markAssetAsExpended,
  updateRFFBalance,
  markRequestPaidById,
  updateRequestCompleted,
} from "@/server/supabase/functions/update";
import { createTransaction } from "@/server/supabase/functions/create";
import {
  getRFFBalance,
  doesRequestHaveInvoice,
} from "@/server/supabase/functions/read";
import { GetFundsByRequestId } from "@/server/actions/request/actions";

import type {
  FundDetail,
  ExpendTypeHandlers,
  FundTypeTransactionHandlers,
} from "@/server/actions/rff/types";

// mark request completed
// update balance with expended invoice (money out of total and reserved, available remains the same)
// expend the asset (reserved => expended)
// create transaction to reflect the change in balance ( like createFundDisubrsementTransaction on actions/rff/paid.ts)
